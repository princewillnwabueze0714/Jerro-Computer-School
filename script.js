document.addEventListener("DOMContentLoaded", () => {
    // 1. Set Current Year in Footer
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Hamburger Menu Toggle (Transforms to X and back)
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("is-active");
        navMenu.classList.toggle("open");
    });

    // 3. Multi-Page Navigation Switcher
    const pageLinks = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll(".nav-link");

    function switchPage(pageId) {
        pages.forEach(page => page.classList.remove("active"));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add("active");
        }

        navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.page === pageId);
        });

        // Close mobile menu when a link is clicked
        hamburger.classList.remove("is-active");
        navMenu.classList.remove("open");

        window.scrollTo({ top: 0, behavior: "smooth" });
        triggerScrollReveal();
    }

    pageLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("data-page");
            switchPage(target);
        });
    });

    // 4. Hero Slideshow
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    const dotsContainer = document.getElementById("slideDots");
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        slides.forEach((_, idx) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (idx === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".dot");

        function goToSlide(index) {
            slides[currentSlide].classList.remove("active");
            dots[currentSlide].classList.remove("active");
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add("active");
            dots[currentSlide].classList.add("active");
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        nextBtn.addEventListener("click", () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener("click", () => { prevSlide(); resetInterval(); });

        function startInterval() {
            slideInterval = setInterval(nextSlide, 5500);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // 5. Course Category Filter
    const filterBtns = document.querySelectorAll(".filter-btn");
    const courseCards = document.querySelectorAll(".course-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const category = btn.dataset.filter;

            courseCards.forEach(card => {
                if (category === "all" || card.dataset.category === category) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // 6. Gallery Lightbox
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const imgSrc = item.querySelector("img").getAttribute("src");
            const caption = item.querySelector(".gallery-caption").textContent;
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = caption;
                lightbox.classList.add("open");
            }
        });
    });

    lightboxClose.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) lightbox.classList.remove("open");
    });

    // 7. Newsletter Subscription Handlers (Supports multiple newsletter forms)
    const newsletterForms = document.querySelectorAll(".newsletter-form");
    
    newsletterForms.forEach(form => {
        form.addEventListener("submit", (e) => {
            const actionUrl = form.getAttribute("action");
            const domainMail = form.getAttribute("data-domain-mail");
            const emailInput = form.querySelector("input[type='email']");
            const feedbackEl = form.parentElement.querySelector(".newsletter-feedback");
            const subscriberEmail = emailInput ? emailInput.value : "";

            if (!actionUrl) {
                e.preventDefault();
                if (domainMail) {
                    window.location.href = `mailto:${domainMail}?subject=Newsletter%20Subscription&body=Please%20add%20${encodeURIComponent(subscriberEmail)}%20to%20your%20newsletter%20list.`;
                    if (feedbackEl) feedbackEl.textContent = "Opening your email client to complete subscription...";
                } else {
                    if (feedbackEl) feedbackEl.textContent = "Thank you for subscribing! (Admin: Add your domain mail in HTML)";
                }
                form.reset();
            }
        });
    });

    // 8. Cookie Consent System (Persists until browser data/cookies are cleared)
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptCookiesBtn = document.getElementById("acceptCookies");
    const declineCookiesBtn = document.getElementById("declineCookies");

    function saveCookieConsent(status) {
        // Set browser cookie for 10 years (3650 days)
        const d = new Date();
        d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
        document.cookie = `school_cookie_consent=${status};expires=${d.toUTCString()};path=/;SameSite=Lax`;
        
        // Fallback storage so it also remembers when opening index.html locally
        try {
            localStorage.setItem("school_cookie_consent", status);
        } catch (e) {}
    }

    function hasCookieConsent() {
        const cookieMatch = document.cookie.match(/(^| )school_cookie_consent=([^;]+)/);
        let localMatch = null;
        try {
            localMatch = localStorage.getItem("school_cookie_consent");
        } catch (e) {}
        return Boolean(cookieMatch || localMatch);
    }

    // Only show banner if consent has never been given (or was cleared)
    if (cookieBanner && !hasCookieConsent()) {
        setTimeout(() => cookieBanner.classList.add("show"), 1000);
    }

    if (acceptCookiesBtn && cookieBanner) {
        acceptCookiesBtn.addEventListener("click", () => {
            saveCookieConsent("accepted");
            cookieBanner.classList.remove("show");
        });
    }

    if (declineCookiesBtn && cookieBanner) {
        declineCookiesBtn.addEventListener("click", () => {
            saveCookieConsent("declined");
            cookieBanner.classList.remove("show");
        });
    }

    // 9. Smooth Scroll Reveal Animations
    function triggerScrollReveal() {
        const reveals = document.querySelectorAll(".page-section.active .reveal");
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 60) {
                el.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", triggerScrollReveal);
    triggerScrollReveal();
    // 10. FAQ Accordion Functionality
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        questionBtn.addEventListener("click", () => {
            // Optional: Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });
            // Toggle current item
            item.classList.toggle("active");
        });
    });
    // Single-Page Enroll Trigger -> Opens Fixed Modal
    const enrollTriggers = document.querySelectorAll(".enroll-trigger");
    const enrollModal = document.getElementById("enrollModal");
    const understoodBtn = document.getElementById("understoodBtn");

    enrollTriggers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }

            if (enrollModal) {
                enrollModal.classList.add("open");
            }
        });
    });

    // Close modal when clicking "Understood"
    if (understoodBtn && enrollModal) {
        understoodBtn.addEventListener("click", () => {
            enrollModal.classList.remove("open");
        });
    }
    
});
// // Enhanced Newsletter Submission via AJAX (Stays on the same page)
//     const newsletterForms = document.querySelectorAll(".newsletter-form");
    
//     newsletterForms.forEach(form => {
//         form.addEventListener("submit", async (e) => {
//             const actionUrl = form.getAttribute("action");
//             const feedbackEl = form.parentElement.querySelector(".newsletter-feedback");
            
//             // If it's a Formspree URL, submit via fetch (AJAX)
//             if (actionUrl && actionUrl.includes("formspree.io")) {
//                 e.preventDefault();
//                 const formData = new FormData(form);
                
//                 if (feedbackEl) feedbackEl.textContent = "Submitting...";

//                 try {
//                     const response = await fetch(actionUrl, {
//                         method: "POST",
//                         body: formData,
//                         headers: { 'Accept': 'json' }
//                     });

//                     if (response.ok) {
//                         if (feedbackEl) feedbackEl.textContent = "Thank you for subscribing! Check your inbox soon.";
//                         form.reset();
//                     } else {
//                         if (feedbackEl) feedbackEl.textContent = "Oops! Something went wrong. Please try again.";
//                     }
//                 } catch (error) {
//                     if (feedbackEl) feedbackEl.textContent = "Network error. Please check your connection.";
//                 }
//             }
//         });
//     });