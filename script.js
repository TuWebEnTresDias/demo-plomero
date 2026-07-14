/* ========================================
   PLOMEROPRO — Landing Page Scripts
   Personalization & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

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


    /* ── CONTACT FORM → WHATSAPP ──────── */
    const contactForm = document.getElementById('contactForm');
    const whatsappNumber = '5491158055802';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const service = document.getElementById('contactService').value;
            const message = document.getElementById('contactMessage').value.trim();

            // Build message
            let whatsappMessage = `Hola! Me comunico desde la página web.\n\n`;
            whatsappMessage += `👤 *Nombre:* ${name}\n`;
            whatsappMessage += `📞 *Teléfono:* ${phone}\n`;
            whatsappMessage += `🔧 *Servicio:* ${service}\n`;

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


    /* ── CURRENT YEAR ──────────────────── */
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

});
