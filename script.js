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
document.addEventListener('DOMContentLoaded', () => {
  const books = document.querySelectorAll('.book-3d');

  books.forEach((book) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentRotateY = parseFloat(book.dataset.rotateY) || -25;
    let currentRotateX = parseFloat(book.dataset.rotateX) || 5;

    const updateBookTransform = () => {
      book.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    };

    // Mouse Events (Desktop)
    book.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      book.style.transition = 'none'; // Instant response while dragging
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      currentRotateY += deltaX * 0.65;
      // Limit vertical tilt slightly so it stays standing upright on its edge
      currentRotateX = Math.max(-25, Math.min(25, currentRotateX - deltaY * 0.3));

      updateBookTransform();
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        book.style.transition = 'transform 0.1s ease-out';
      }
    });

    // Touch Events (Mobile & Tablets)
    book.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        book.style.transition = 'none';
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      currentRotateY += deltaX * 0.75;
      currentRotateX = Math.max(-25, Math.min(25, currentRotateX - deltaY * 0.3));

      updateBookTransform();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        book.style.transition = 'transform 0.1s ease-out';
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-btn');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      // Optional: You can add a small analytics log or toast notification here if desired
      console.log('Download initiated for Jerro Computer School flyer.');
    });
  }
});
// Automatic Annual Anniversary Counter (25 in 2026 -> 26 on Jan 1, 2027, etc.)
document.addEventListener('DOMContentLoaded', () => {
    const FOUNDING_YEAR = 2001; // 2026 - 2001 = 25 years; Jan 1, 2027 -> 26 years
    const currentYear = new Date().getFullYear();
    const schoolAge = Math.max(25, currentYear - FOUNDING_YEAR);

    document.querySelectorAll('.dynamic-school-years').forEach(el => {
        el.textContent = schoolAge;
    });

    document.querySelectorAll('.dynamic-current-year').forEach(el => {
        el.textContent = currentYear;
    });

    const floater = document.getElementById('anniversaryFloater');
    if (floater) {
        floater.setAttribute('title', `Celebrating ${schoolAge} Years of Excellence`);
        floater.addEventListener('click', (e) => {
            e.preventDefault();
            // Switch to Home page if user is currently on another tab
            const homePage = document.getElementById('page-home');
            if (homePage && !homePage.classList.contains('active')) {
                document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
                homePage.classList.add('active');
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.toggle('active', l.dataset.page === 'home');
                });
            }
            const target = document.getElementById('anniversary-milestone');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    // Keep floating crest positioned below navbar & hide on scroll for mobile only
    const navbarEl = document.querySelector('.navbar');
    function positionAnniversaryCrest() {
        if (!floater || !navbarEl) return;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (window.scrollY > 15) {
                floater.classList.add('mobile-scroll-hidden');
            } else {
                floater.classList.remove('mobile-scroll-hidden');
            }
        } else {
            floater.classList.remove('mobile-scroll-hidden');
        }

        const navBottom = navbarEl.getBoundingClientRect().bottom;
        const gap = isMobile ? 10 : 14;
        floater.style.top = `${Math.max(0, navBottom) + gap}px`;
    }

    positionAnniversaryCrest();
    window.addEventListener('scroll', positionAnniversaryCrest, { passive: true });
    window.addEventListener('resize', positionAnniversaryCrest);
});
// ==================== UNIVERSAL DYNAMIC YEAR & ACADEMIC SESSION UPDATER ====================
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const prevYear = currentYear - 1;
    const FOUNDING_YEAR = 2001;
    const schoolAge = Math.max(25, currentYear - FOUNDING_YEAR);

    // 1. Update designated classes and IDs
    document.querySelectorAll('.dynamic-school-years').forEach(el => {
        el.textContent = schoolAge;
    });

    document.querySelectorAll('.dynamic-current-year').forEach(el => {
        el.textContent = currentYear;
    });

    document.querySelectorAll('.dynamic-next-year').forEach(el => {
        el.textContent = nextYear;
    });

    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = currentYear;
    }

    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn && downloadBtn.hasAttribute('download')) {
        downloadBtn.setAttribute('download', `Jerro_Computer_School_Flyer_${currentYear}.pdf`);
    }

    // 2. Deep Text Node Scanner (Catches every stray year or session range anywhere in HTML)
    const walkTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let updated = text
                // Update academic year ranges like "2026–2027" -> "2027–2028"
                .replace(/2026\s*[–-]\s*2027/g, `${currentYear}–${nextYear}`)
                .replace(/2025\s*[–-]\s*2026/g, `${prevYear}–${currentYear}`)
                // Update founding range like "2001–2026" -> "2001–2027"
                .replace(/2001\s*[–-]\s*2026/g, `2001–${currentYear}`)
                // Update single year references (like prospectus titles, banners)
                .replace(/\b2026\b/g, `${currentYear}`)
                // Update past event captions (like Annual Tech Bootcamp 2025)
                .replace(/\b2025\b/g, `${prevYear}`);

            if (text !== updated) {
                node.nodeValue = updated;
            }
        } else {
            if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(node.tagName)) {
                for (let child of node.childNodes) {
                    walkTextNodes(child);
                }
            }
        }
    };

    walkTextNodes(document.body);

    // 3. Floating Anniversary Crest Controller & Mobile Scroll Hide
    const floater = document.getElementById('anniversaryFloater');
    const navbarEl = document.querySelector('.navbar');

    if (floater) {
        floater.setAttribute('title', `Celebrating ${schoolAge} Years of Excellence`);
        floater.addEventListener('click', (e) => {
            e.preventDefault();
            const homePage = document.getElementById('page-home');
            if (homePage && !homePage.classList.contains('active')) {
                document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
                homePage.classList.add('active');
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.toggle('active', l.dataset.page === 'home');
                });
            }
            const target = document.getElementById('anniversary-milestone');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    function positionAnniversaryCrest() {
        if (!floater || !navbarEl) return;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (window.scrollY > 15) {
                floater.classList.add('mobile-scroll-hidden');
            } else {
                floater.classList.remove('mobile-scroll-hidden');
            }
        } else {
            floater.classList.remove('mobile-scroll-hidden');
        }

        const navBottom = navbarEl.getBoundingClientRect().bottom;
        const gap = isMobile ? 10 : 14;
        floater.style.top = `${Math.max(0, navBottom) + gap}px`;
    }

    if (floater && navbarEl) {
        positionAnniversaryCrest();
        window.addEventListener('scroll', positionAnniversaryCrest, { passive: true });
        window.addEventListener('resize', positionAnniversaryCrest);
    }
});
