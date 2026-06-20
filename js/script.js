/* ==========================================================================
   CREAMORA — Premium Dairy & Ice Cream Brand
   Vanilla JavaScript — no dependencies
   ==========================================================================
   FEATURES:
   1. Mobile menu toggle
   2. Sticky navbar (scroll-aware shadow)
   3. Smooth scroll for anchor links
   4. FAQ accordion (single-open behavior)
   5. Product filter by category
   6. Add to cart with badge counter
   7. Back to top button
   8. Toast notifications
   9. Contact + newsletter form handling
   10. Scroll reveal animations (IntersectionObserver)
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       Tiny helpers
       ---------------------------------------------------------------------- */
    const $ = (sel, scope = document) => scope.querySelector(sel);
    const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

    /* ----------------------------------------------------------------------
       1. Mobile Menu Toggle
       ---------------------------------------------------------------------- */
    const menuToggle = $('#menuToggle');
    const mobileNav = $('#mobileNav');
    const navBackdrop = $('#navBackdrop');
    const mobileNavLinks = $$('.mobile-nav__link');

    function openMenu() {
        menuToggle.classList.add('is-open');
        mobileNav.classList.add('is-open');
        navBackdrop.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggle.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        navBackdrop.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.contains('is-open') ? closeMenu() : openMenu();
        });
    }

    if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close menu on Esc
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Reset menu state on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 1024 && mobileNav.classList.contains('is-open')) {
                closeMenu();
            }
        }, 150);
    });

    /* ----------------------------------------------------------------------
       2. Sticky Navbar — add shadow when scrolled
       ---------------------------------------------------------------------- */
    const header = $('#header');
    const backToTopBtn = $('#backToTop');

    function handleScroll() {
        const scrolled = window.scrollY > 20;
        header.classList.toggle('is-scrolled', scrolled);

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('is-visible', window.scrollY > 400);
        }
    }

    // Throttle scroll with rAF
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    handleScroll(); // initial check

    /* ----------------------------------------------------------------------
       3. Smooth Scroll for anchor links
       (Native CSS smooth scroll handles most cases — this provides a JS fallback
       plus closes the menu on tap)
       ---------------------------------------------------------------------- */
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || targetId.length <= 1) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            // Let the browser handle scrolling natively (we set scroll-behavior: smooth).
            // Just close the mobile menu.
            if (mobileNav.classList.contains('is-open')) closeMenu();
        });
    });

    /* ----------------------------------------------------------------------
       4. FAQ Accordion — only one open at a time
       ---------------------------------------------------------------------- */
    const faqItems = $$('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    /* ----------------------------------------------------------------------
       5. Product Filter
       ---------------------------------------------------------------------- */
    const filterChips = $$('.filter-chip');
    const productCards = $$('.product-card');

    function applyFilter(filter) {
        productCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('is-hidden', !match);
        });
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => {
                c.classList.remove('is-active');
                c.setAttribute('aria-selected', 'false');
            });
            chip.classList.add('is-active');
            chip.setAttribute('aria-selected', 'true');
            applyFilter(chip.dataset.filter);
        });
    });

    // Allow category cards to trigger the filter as well
    $$('.category-card').forEach(card => {
        card.addEventListener('click', e => {
            const cat = card.dataset.category;
            if (!cat) return;
            const matchingChip = filterChips.find(c => c.dataset.filter === cat);
            if (matchingChip) {
                matchingChip.click();
            }
        });
    });

    /* ----------------------------------------------------------------------
       6. Add-to-cart with badge counter
       ---------------------------------------------------------------------- */
    const cartBadge = $('#cartBadge');
    let cartCount = 0;

    function updateCartBadge(productName) {
        cartCount++;
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
                { duration: 300, easing: 'ease-out' }
            );
        }
        showToast(`✓ ${productName} added to cart`);
    }

    // Quick-add (+) buttons inside product cards
    $$('.btn-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const name = card ? $('.product-card__name', card)?.textContent.trim() : 'Item';
            updateCartBadge(name);
        });
    });

    // Featured-section "Add to Cart" buttons
    $$('.featured-card .btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.featured-card');
            const name = card ? $('h3', card)?.textContent.trim() : 'Featured item';
            updateCartBadge(name);
        });
    });

    /* ----------------------------------------------------------------------
       7. Back to Top
       ---------------------------------------------------------------------- */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------------------
       8. Toast Notifications
       ---------------------------------------------------------------------- */
    const toastEl = $('#toast');
    let toastTimer;

    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('is-visible');
        }, 2200);
    }

    /* ----------------------------------------------------------------------
       9. Contact Form
       ---------------------------------------------------------------------- */
    const contactForm = $('#contactForm');
    const formStatus = $('#formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = $('#name', contactForm).value.trim();
            const email = $('#email', contactForm).value.trim();
            const message = $('#message', contactForm).value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = '⚠ Please fill in all required fields.';
                formStatus.style.color = '#E85555';
                return;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                formStatus.textContent = '⚠ Please enter a valid email.';
                formStatus.style.color = '#E85555';
                return;
            }

            formStatus.textContent = '✓ Message sent! We\'ll be in touch soon.';
            formStatus.style.color = '#10B981';
            contactForm.reset();
            showToast('✓ Message sent successfully');

            setTimeout(() => { formStatus.textContent = ''; }, 4000);
        });
    }

    // Newsletter form
    const newsletter = $('#newsletterForm');
    if (newsletter) {
        newsletter.addEventListener('submit', e => {
            e.preventDefault();
            const input = newsletter.querySelector('input');
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(input.value.trim())) {
                showToast('⚠ Enter a valid email');
                return;
            }
            showToast('✓ Subscribed! Welcome to Creamora 🎉');
            newsletter.reset();
        });
    }

    /* ----------------------------------------------------------------------
       10. Scroll-reveal fade-in for sections (IntersectionObserver)
       ---------------------------------------------------------------------- */
    const revealTargets = $$('.section, .hero__content, .hero__visual');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => {
            el.classList.add('fade-in');
            io.observe(el);
        });
    } else {
        // Fallback — just show everything
        revealTargets.forEach(el => el.classList.add('is-visible'));
    }

    /* ----------------------------------------------------------------------
       Active nav link on scroll (highlight current section in desktop nav)
       ---------------------------------------------------------------------- */
    const sections = $$('section[id]');
    const navLinks = $$('.nav__link');

    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        const navIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${id}`;
                        link.style.color = isActive ? 'var(--color-primary)' : '';
                        link.style.background = isActive ? 'var(--color-pink)' : '';
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        sections.forEach(section => navIO.observe(section));
    }

    /* ----------------------------------------------------------------------
       Search functionality with fuzzy match
       ---------------------------------------------------------------------- */
    function getEditDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        var matrix = [];
        for (var i = 0; i <= b.length; i++) matrix[i] = [i];
        for (var j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (var i = 1; i <= b.length; i++) {
            for (var j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    }

    const searchInput = $('#searchInput');
    if (searchInput) {
        // Create the dropdown results container
        const searchBox = searchInput.parentElement;
        searchBox.style.position = 'relative'; // Ensure parent is relative
        
        const resultsBox = document.createElement('div');
        resultsBox.id = 'searchResults';
        resultsBox.style.cssText = 'display: none; flex-direction: column; gap: 8px; position: absolute; top: calc(100% + 10px); right: -10px; width: calc(100vw - 40px); max-width: 400px; max-height: 60vh; overflow-y: auto; background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); padding: 12px; z-index: 1000;';
        searchBox.appendChild(resultsBox);

        // We close the dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                resultsBox.style.display = 'none';
            }
        });

        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                resultsBox.style.display = 'flex';
            }
        });

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const products = $$('.product-card');
            
            resultsBox.innerHTML = ''; // clear previous
            
            if (!term) {
                resultsBox.style.display = 'none';
                // Show all in the main grid
                products.forEach(card => card.classList.remove('is-hidden'));
                return;
            }
            
            resultsBox.style.display = 'flex';
            
            let matchCount = 0;
            products.forEach(card => {
                const nameEl = card.querySelector('.product-card__name');
                const name = nameEl ? nameEl.textContent : '';
                const nameLower = name.toLowerCase();
                const category = card.querySelector('.product-card__cat')?.textContent.toLowerCase() || '';
                const imgEl = card.querySelector('.product-card__img');
                const imgSrc = imgEl ? imgEl.src : '';
                const price = card.querySelector('.product-card__price')?.textContent || '';
                
                let show = false;
                if (nameLower.includes(term) || category.includes(term)) {
                    show = true;
                } else {
                    const termWords = term.split(/\s+/).filter(Boolean);
                    const nameWords = nameLower.split(/\s+/).filter(Boolean);
                    for (let tw of termWords) {
                        if (tw.length >= 3) {
                            for (let nw of nameWords) {
                                if (getEditDistance(tw, nw) <= 2) {
                                    show = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (show) {
                    card.classList.remove('is-hidden');
                    matchCount++;
                    const item = document.createElement('a');
                    item.href = '#products';
                    item.style.cssText = 'display: flex; align-items: center; gap: 12px; text-decoration: none; color: #333; padding: 8px; border-radius: 8px; transition: background 0.2s; cursor: pointer;';
                    item.onmouseover = () => item.style.background = '#f5f5f5';
                    item.onmouseout = () => item.style.background = 'transparent';
                    item.onclick = () => { resultsBox.style.display = 'none'; };
                    
                    item.innerHTML = `
                        <img src="${imgSrc}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
                        <div style="flex: 1; text-align: left;">
                            <div style="font-size: 0.95rem; font-weight: 600; line-height: 1.2;">${name}</div>
                            <div style="font-size: 0.85rem; color: #FF6B6B; margin-top: 4px;">${price}</div>
                        </div>
                    `;
                    resultsBox.appendChild(item);
                } else {
                    card.classList.add('is-hidden');
                }
            });

            if (matchCount === 0) {
                resultsBox.innerHTML = '<div style="text-align: center; color: #777; padding: 16px; font-size: 0.9rem;">No products found matching "' + term + '"</div>';
            }
        });
    }

    /* ----------------------------------------------------------------------
       Console signature
       ---------------------------------------------------------------------- */
    console.log('%c🍦 Creamora', 'color: #FF6B6B; font-size: 22px; font-weight: bold; font-family: serif;');
    console.log('%cPremium dairy crafted with love. Built mobile-first.', 'color: #7B4F2C; font-size: 12px;');

})();
