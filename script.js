/* ========================================
   PLOMEROPRO — Landing Page Scripts
   WOW Factor Interactions & Personalization
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── LOADER ──────────────────────── */
    const loader = document.getElementById('loader');

    const hideLoader = () => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Hide loader after content is ready
    document.body.style.overflow = 'hidden';
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 600);
    } else {
        window.addEventListener('load', () => setTimeout(hideLoader, 600));
    }

    // Fallback: hide loader after 3s max
    setTimeout(hideLoader, 3000);


    /* ── PERSONALIZATION ENGINE ──────── */
    const Personalization = {
        params: new URLSearchParams(window.location.search),

        init() {
            const name = this.params.get('n');
            const company = this.params.get('e');

            if (company) {
                this.apply({ type: 'company', value: company });
            } else if (name) {
                this.apply({ type: 'name', value: name });
            }
        },

        apply({ type, value }) {
            // Update page title
            document.title = `${value} | Servicio de Plomería`;

            // Update all elements with data-dynamic attribute
            document.querySelectorAll('[data-dynamic]').forEach(el => {
                const key = el.dataset.dynamic;

                switch (key) {
                    case 'name':
                    case 'logo':
                    case 'footer-name':
                        el.textContent = value;
                        break;
                    case 'title':
                        el.textContent = `${value} | Servicio de Plomería`;
                        break;
                }
            });

            // Update WhatsApp links with the name
            this.updateWhatsApp(value);

            // Update meta description
            this.updateMeta(value);
        },

        updateWhatsApp(name) {
            const message = encodeURIComponent(
                `Hola! Me comunico desde la página de ${name}. Quisiera hacer una consulta.`
            );

            document.querySelectorAll('[data-whatsapp]').forEach(el => {
                const baseUrl = el.href.split('?')[0];
                el.href = `${baseUrl}?text=${message}`;
            });
        },

        updateMeta(name) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) {
                meta.content = `${name} - Servicio profesional de plomería. Emergencias 24/7, garantía en todos los trabajos.`;
            }
        }
    };

    Personalization.init();


    /* ── EMERGENCY BAR ───────────────── */
    const emergencyBar = document.getElementById('emergencyBar');

    const handleEmergencyBar = () => {
        if (window.scrollY > 100) {
            emergencyBar.classList.add('hidden');
        } else {
            emergencyBar.classList.remove('hidden');
        }
    };

    window.addEventListener('scroll', handleEmergencyBar, { passive: true });


    /* ── HEADER SCROLL EFFECT ─────────── */
    const header = document.getElementById('header');

    const handleHeaderScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();


    /* ── MOBILE MENU ──────────────────── */
    const burger = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    burger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


    /* ── SMOOTH SCROLL ─────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });


    /* ── SERVICES TABS ────────────────── */
    const serviceTabs = document.querySelectorAll('.services__tab');
    const serviceCategories = document.querySelectorAll('.services__category');

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding category
            serviceCategories.forEach(cat => {
                if (cat.dataset.category === targetTab) {
                    cat.classList.add('active');
                    // Re-trigger reveal animations for items in this category
                    const items = cat.querySelectorAll('.reveal');
                    items.forEach((item, index) => {
                        item.classList.remove('visible');
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 50 + (index * 80));
                    });
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });

    // Initialize first category items
    const firstCategory = document.querySelector('.services__category.active');
    if (firstCategory) {
        const items = firstCategory.querySelectorAll('.reveal');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 300 + (index * 100));
        });
    }


    /* ── SCROLL REVEAL ANIMATIONS ─────── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Don't handle items that are inside non-active service categories
                const parentCategory = entry.target.closest('.services__category');
                if (parentCategory && !parentCategory.classList.contains('active')) {
                    return;
                }
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ── ANIMATED COUNTERS ────────────── */
    const counters = document.querySelectorAll('.counter__number');
    let countersAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const isDecimal = target % 1 !== 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1) + suffix;
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const countersSection = document.querySelector('.counters');
    if (countersSection) {
        const countersObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    countersObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        countersObserver.observe(countersSection);
    }


    /* ── GALLERY CAROUSEL ─────────────── */
    const carousel = document.getElementById('galleryCarousel');
    if (carousel) {
        const track = carousel.querySelector('.gallery__track');
        const slides = carousel.querySelectorAll('.gallery__slide');
        const prevBtn = carousel.querySelector('.gallery__nav--prev');
        const nextBtn = carousel.querySelector('.gallery__nav--next');
        const dots = carousel.querySelectorAll('.gallery__dot');
        let currentSlide = 0;
        let autoplayInterval;

        const goToSlide = (index) => {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            goToSlide((currentSlide + 1) % slides.length);
        };

        const prevSlide = () => {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        };

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.dataset.index));
                resetAutoplay();
            });
        });

        // Autoplay
        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        startAutoplay();

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }, { passive: true });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', startAutoplay);
    }


    /* ── BEFORE/AFTER COMPARISON SLIDER ── */
    const comparisons = document.querySelectorAll('[data-comparison]');

    comparisons.forEach(comparison => {
        const slider = comparison.querySelector('[data-slider]');
        const before = comparison.querySelector('.gallery__comparison-before');
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = comparison.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;

            before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            slider.style.left = `${percent}%`;
        };

        // Mouse events
        comparison.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSlider(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        comparison.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        comparison.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        comparison.addEventListener('touchend', () => {
            isDragging = false;
        });
    });


    /* ── FAQ ACCORDION ────────────────── */
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if wasn't active)
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ── CONTACT FORM → WHATSAPP ──────── */
    const contactForm = document.getElementById('contactForm');
    const whatsappNumber = '5491158055802';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const service = document.getElementById('contactService').value;
            const urgency = document.getElementById('contactUrgency').value;
            const message = document.getElementById('contactMessage').value.trim();

            // Build message
            let whatsappMessage = `Hola! Me comunico desde la página web.\n\n`;
            whatsappMessage += `👤 *Nombre:* ${name}\n`;
            whatsappMessage += `📞 *Teléfono:* ${phone}\n`;
            whatsappMessage += `🔧 *Servicio:* ${service}\n`;
            whatsappMessage += `⏰ *Urgencia:* ${urgency}\n`;

            if (message) {
                whatsappMessage += `💬 *Mensaje:* ${message}\n`;
            }

            whatsappMessage += `\n¡Gracias!`;

            // Encode and open WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank', 'noopener');

            // Show feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '¡Enviado! ✓';
            submitBtn.style.backgroundColor = '#25D366';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                contactForm.reset();
            }, 2000);
        });
    }


    /* ── WHATSAPP FLOAT VISIBILITY ─────── */
    const whatsappFloat = document.getElementById('whatsappFloat');

    if (whatsappFloat) {
        const handleWhatsappVisibility = () => {
            if (window.scrollY > 300) {
                whatsappFloat.classList.add('visible');
            } else {
                whatsappFloat.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleWhatsappVisibility, { passive: true });
    }


    /* ── MOBILE STICKY CTA ────────────── */
    const mobileCta = document.getElementById('mobileCta');

    if (mobileCta) {
        const handleMobileCta = () => {
            if (window.scrollY > 400) {
                mobileCta.classList.add('visible');
            } else {
                mobileCta.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleMobileCta, { passive: true });
    }


    /* ── EXIT INTENT POPUP ────────────── */
    const exitPopup = document.getElementById('exitPopup');
    const exitPopupClose = document.getElementById('exitPopupClose');
    let exitShown = false;

    if (exitPopup) {
        const showExitPopup = () => {
            if (!exitShown && window.scrollY > 200) {
                exitShown = true;
                exitPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        const hideExitPopup = () => {
            exitPopup.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Mouse leave viewport (top)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0) {
                showExitPopup();
            }
        });

        // Also show on mobile back button hint (beforeunload)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const st = window.scrollY;
            // If user scrolls up quickly near the top
            if (st < 50 && lastScrollTop > 200) {
                showExitPopup();
            }
            lastScrollTop = st;
        }, { passive: true });

        if (exitPopupClose) {
            exitPopupClose.addEventListener('click', hideExitPopup);
        }

        // Close on overlay click
        exitPopup.querySelector('.exit-popup__overlay').addEventListener('click', hideExitPopup);

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && exitPopup.classList.contains('active')) {
                hideExitPopup();
            }
        });
    }


    /* ── BUTTON RIPPLE EFFECT ─────────── */
    document.querySelectorAll('.btn--ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.setProperty('--ripple-x', x + 'px');
            this.style.setProperty('--ripple-y', y + 'px');
            this.classList.add('ripple-active');

            setTimeout(() => {
                this.classList.remove('ripple-active');
            }, 600);
        });
    });


    /* ── ACTIVE NAV HIGHLIGHT ──────────── */
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.header__nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });


    /* ── PARALLAX EFFECT ON HERO ──────── */
    const heroVideo = document.querySelector('.hero__video');

    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroVideo.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }


    /* ── CURRENT YEAR ──────────────────── */
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

});