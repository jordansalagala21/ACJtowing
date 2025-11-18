// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

const closeMobileMenu = () => {
    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Here you would typically send this to a server
        // For now, we'll show a success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe feature items
document.querySelectorAll('.feature-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe testimonial cards
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe contact items
document.querySelectorAll('.contact-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Mobile Carousel/Slider functionality
class MobileCarousel {
    constructor(container, itemsSelector) {
        this.container = container;
        this.items = container.querySelectorAll(itemsSelector);
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile && this.items.length > 0) {
            this.init();
        }
        
        // Reinitialize on window resize
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (this.isMobile && !wasMobile) {
                this.init();
            } else if (!this.isMobile && wasMobile) {
                this.destroy();
            }
        });
    }
    
    init() {
        this.container.classList.add('mobile-carousel');
        this.createDots();
        this.addEventListeners();
        this.updateCarousel();
    }
    
    destroy() {
        this.container.classList.remove('mobile-carousel');
        if (this.dotsContainer) {
            this.dotsContainer.remove();
        }
        this.removeEventListeners();
        
        // Reset all items
        this.items.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }
    
    createDots() {
        // Remove existing dots if any
        const existingDots = this.container.parentElement.querySelector('.carousel-dots');
        if (existingDots) {
            existingDots.remove();
        }
        
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'carousel-dots';
        
        this.items.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        this.container.parentElement.appendChild(this.dotsContainer);
    }
    
    addEventListeners() {
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Mouse events for desktop testing
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    }
    
    removeEventListeners() {
        this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        this.container.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.removeEventListener('mouseleave', this.handleMouseUp.bind(this));
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
    }
    
    handleTouchEnd() {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        const threshold = 50; // minimum swipe distance
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        
        this.isDragging = false;
    }
    
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }
    
    handleMouseUp() {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
    }
    
    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Hide all items
        this.items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
}

// Initialize carousels for mobile
if (window.innerWidth <= 768) {
    // Services carousel
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        new MobileCarousel(servicesGrid, '.service-card');
    }
    
    // Testimonials carousel
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        new MobileCarousel(testimonialsGrid, '.testimonial-card');
    }
    
    // Features carousel
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
        new MobileCarousel(featuresGrid, '.feature-item');
    }
}
