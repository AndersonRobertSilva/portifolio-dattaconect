document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. FIXED HEADER ON SCROLL
    // ----------------------------------------------------
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // 2. MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        // Prevent scrolling on body when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileMenuBtn && closeMenuBtn && mobileMenu && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);
        
        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // ----------------------------------------------------
    // 3. SCROLL REVEAL ANIMATIONS
    // ----------------------------------------------------
    // Select all elements that should be animated on scroll
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    // Trigger animations for elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

});
