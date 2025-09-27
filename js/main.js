// Main JavaScript functionality for Bhudev Network Website

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    initSearch();
    initContactForm();
    initPageTransitions();
    initCategoryFilter();
    initHeaderWordAnimation();
    initFAQAccordion();
    // Category Filter for Apps Grid
    function initCategoryFilter() {
        const categoryBtns = document.querySelectorAll('.filter-category-btn');
        const appCards = document.querySelectorAll('.app-card');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const selected = this.textContent.trim().toLowerCase();

                appCards.forEach(card => {
                    // Get card category
                    let cardCategory = card.getAttribute('data-category');
                    let show = false;
                    if (selected === 'all') {
                        show = true;
                    } else if (selected === 'singing' || selected === 'dance' || selected === 'music' || selected === 'others') {
                        // For demo, match by card title (adjust if you add data-category for these)
                        const title = card.querySelector('.app-title')?.textContent.toLowerCase() || '';
                        show = title.includes(selected);
                    } else {
                        show = cardCategory && cardCategory.toLowerCase() === selected;
                    }
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function () {
            nav.classList.toggle('active');

            // Animate hamburger icon
            this.classList.toggle('active');

            // Update aria-label for accessibility
            const isExpanded = nav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            // Lock/unlock body scroll when menu is open/closed
            document.body.classList.toggle('menu-open', isExpanded);
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// FAQ Accordion (accessible, only-one-open behavior)
function initFAQAccordion(){
    const toggles = Array.from(document.querySelectorAll('.faq-toggle'));
    if(!toggles.length) return;

    function hideImmediately(answerEl){
        if(!answerEl) return;
        answerEl.setAttribute('hidden','');
        answerEl.style.display = 'none';
        answerEl.style.maxHeight = '0px';
        answerEl.style.visibility = 'hidden';
    }

    function showAndAnimate(answerEl){
        if(!answerEl) return;
        answerEl.removeAttribute('hidden');
        answerEl.style.display = 'block';
        answerEl.style.visibility = 'visible';
        const height = answerEl.scrollHeight;
        requestAnimationFrame(()=>{ answerEl.style.maxHeight = height + 'px'; });
    }

    // init state
    toggles.forEach(btn => {
        const id = btn.getAttribute('aria-controls');
        const ans = document.getElementById(id);
        btn.setAttribute('aria-expanded','false');
        if(ans) hideImmediately(ans);
    });

    toggles.forEach(btn => {
        const id = btn.getAttribute('aria-controls');
        const ans = document.getElementById(id);

        if(ans){
            ans.addEventListener('transitionend', (e)=>{
                if(e.propertyName === 'max-height' && ans.style.maxHeight === '0px'){
                    hideImmediately(ans);
                }
            });
        }

        function openThis(){
            toggles.forEach(other => {
                const otherId = other.getAttribute('aria-controls');
                const otherAns = document.getElementById(otherId);
                other.setAttribute('aria-expanded','false');
                if(otherAns){ otherAns.style.maxHeight = '0px'; }
                if(other && other !== btn){ const parent = other.closest('.faq-item'); if(parent) parent.classList.remove('active'); }
            });

            btn.setAttribute('aria-expanded','true');
            if(ans) showAndAnimate(ans);
            const parent = btn.closest('.faq-item'); if(parent) parent.classList.add('active');
        }

        btn.addEventListener('click', ()=>{
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            if(expanded){
                btn.setAttribute('aria-expanded','false');
                if(ans) ans.style.maxHeight = '0px';
                const parent = btn.closest('.faq-item'); if(parent) parent.classList.remove('active');
            } else {
                openThis();
                if(ans){ ans.setAttribute('tabindex','-1'); ans.focus(); }
            }
        });

        btn.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); btn.click(); }
        });
    });
}

// Animate header words one-by-one (fade + scale)
function initHeaderWordAnimation() {
    const el = document.querySelector('.typewriter-title');
    if (!el) return;

    const words = Array.from(el.querySelectorAll('.word'));
    if (!words.length) return;

    // Reset initial state
    words.forEach(w => w.classList.remove('show'));

    // Helper to start the sequence
    function startSequence() {
        // show first word immediately to avoid an empty header
        words[0].classList.add('show');

        // Use shorter timings on narrow screens
        const isMobile = window.innerWidth <= 768;
        const initialDelay = isMobile ? 120 : 200;
        const stagger = isMobile ? 220 : 320;

        // Reveal remaining words after the first
        words.slice(1).forEach((w, i) => {
            setTimeout(() => w.classList.add('show'), initialDelay + i * stagger);
        });
    }

    // Only run animation when the header is visible (prevents it running off-screen)
    const ph = document.querySelector('.page-header') || el.closest('.page-header');
    if (ph && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startSequence();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.25 });
        obs.observe(ph);
    } else {
        // fallback: start immediately
        startSequence();
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    const pageHeader = document.querySelector('.page-header');

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset > 100;

        if (header) {
            header.classList.toggle('scrolled', scrolled);
            if (pageHeader) pageHeader.classList.toggle('header-small', scrolled);
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger animations for grid items
                if (entry.target.classList.contains('app-card') ||
                    entry.target.classList.contains('contact-item') ||
                    entry.target.classList.contains('story-card')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation (include story cards)
    document.querySelectorAll('.app-card, .contact-item, .story-card, .section-title').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Search Functionality
function initSearch() {
    // Support both the dedicated `.search-input` and the filter input used in the UI
    const searchInput = document.querySelector('.search-input') || document.querySelector('.filter-search-input');

    if (!searchInput) return;

    // Debounced live filter for the visible app cards
    let searchTimeout;
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();

        searchTimeout = setTimeout(() => {
            if (query.length === 0) {
                // show all cards when empty
                document.querySelectorAll('.app-card').forEach(c => c.style.display = '');
            } else {
                filterCards(query);
            }
        }, 150);
    });

    // Optional: press Escape to clear
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            document.querySelectorAll('.app-card').forEach(c => c.style.display = '');
        }
    });
}
// Filter app cards by query (matches title, url text, and category)
function filterCards(query) {
    const cards = Array.from(document.querySelectorAll('.app-card'));
    cards.forEach(card => {
        const title = (card.querySelector('.app-title')?.textContent || '').toLowerCase();
        const url = (card.querySelector('.app-url')?.textContent || '').toLowerCase();
        const category = (card.querySelector('.app-category')?.textContent || '').toLowerCase();

        const match = title.includes(query) || url.includes(query) || category.includes(query);
        card.style.display = match ? '' : 'none';
    });
}


// Contact Form Functionality
function initContactForm() {
    const contactForms = document.querySelectorAll('.contact-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();

                // Show success message
                showNotification('Message sent successfully!', 'success');

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        backgroundColor: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        borderRadius: '5px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Page Transitions
function initPageTransitions() {
    // Add transition class to main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.classList.add('page-transition');

    // Trigger loaded state after DOM is ready
    setTimeout(() => {
        mainContent.classList.add('loaded');
    }, 100);

    // Handle internal link navigation
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Fade out current page
            mainContent.classList.remove('loaded');

            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function () {
    // Add any scroll-based functionality here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics here
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function (registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
