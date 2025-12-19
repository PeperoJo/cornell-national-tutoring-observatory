// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter Form Handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Here you would typically send the email to a server
            alert('Thank you for subscribing! You will receive our latest updates.');
            emailInput.value = '';
        });
    }

    // Blog Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-danger');
                btn.classList.add('btn-outline-danger');
            });
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger');

            const filter = this.getAttribute('data-filter');

            blogCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar inversion on full-screen hero (index page)
    const body = document.body;
    const heroSection = document.getElementById('hero-section');

    if (body.classList.contains('hero-navbar-transparent') && heroSection) {
        const updateNavbarState = () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            const navbarHeight = navbar.offsetHeight || 0;
            const heroTop = heroSection.offsetTop;
            const heroHeight = heroSection.offsetHeight;
            const heroBottom = heroTop + heroHeight;
            const scrollY = window.scrollY || window.pageYOffset || 0;

            // While the viewport top (plus navbar) is within the hero, invert navbar
            if (scrollY + navbarHeight < heroBottom) {
                body.classList.add('navbar-on-hero');
            } else {
                body.classList.remove('navbar-on-hero');
            }
        };

        // Try a few times while components load, then rely on scroll/resize
        let tries = 0;
        const initInterval = setInterval(() => {
            tries += 1;
            updateNavbarState();
            const navbar = document.querySelector('.navbar');
            if (navbar || tries > 20) {
                clearInterval(initInterval);
            }
        }, 100);

        window.addEventListener('scroll', updateNavbarState);
        window.addEventListener('resize', updateNavbarState);
        window.addEventListener('load', updateNavbarState);
    }

    // Darken entire navbar when mobile menu is expanded over hero, revert when collapsed
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbar && navbarCollapse) {
        navbarCollapse.addEventListener('shown.bs.collapse', () => {
            if (body.classList.contains('hero-navbar-transparent') && body.classList.contains('navbar-on-hero')) {
                navbar.classList.add('navbar-expanded-dark');
            }
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            navbar.classList.remove('navbar-expanded-dark');
        });
    }
});
