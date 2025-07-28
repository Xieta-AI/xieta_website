// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Business Carousel
    let currentSlide = 0;
    const cards = document.querySelectorAll('.business-card');
    const track = document.getElementById('business-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const maxSlides = cards.length > 3 ? cards.length - 3 : 0; // Show 3 cards at once
    
    function updateCarousel() {
        if (track && cards.length > 3) {
            const slideWidth = 100 / 3; // Show 3 cards at once
            track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        }
    }
    
    function nextSlide() {
        if (currentSlide < maxSlides) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Initialize carousel
    updateCarousel();
    
    // Add smooth scrolling behavior
    if (track) {
        track.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        });
    }
    
    // Enhanced business card interactions
    cards.forEach((card, index) => {
        // Add mouse tracking effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNavLink(); // Call once on load
    
    // Counter animation for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.floor(current);
                    const originalText = counter.textContent;
                    const suffix = originalText.replace(/[\d]/g, '');
                    counter.textContent = displayValue + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    // Restore original text
                    const originalText = counter.dataset.original || counter.textContent;
                    counter.textContent = originalText;
                }
            };
            
            // Store original text
            counter.dataset.original = counter.textContent;
            updateCounter();
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation for stats section
                if (entry.target.classList.contains('culture-stats')) {
                    setTimeout(animateCounters, 200);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('[data-aos], .business-card, .stat-item, .value-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Observe sections for counter animation
    const cultureStats = document.querySelector('.culture-stats');
    if (cultureStats) {
        observer.observe(cultureStats);
    }
    
    // Parallax effect for hero section
    function parallaxEffect() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }
    
    // Throttle parallax for performance
    let ticking = false;
    function requestParallax() {
        if (!ticking) {
            requestAnimationFrame(parallaxEffect);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    
    // Lazy loading for placeholder images
    function lazyLoadPlaceholders() {
        const placeholders = document.querySelectorAll('.founder-placeholder, .business-placeholder');
        
        placeholders.forEach(placeholder => {
            // Add loading animation
            placeholder.classList.add('loading');
            
            // Simulate image loading
            setTimeout(() => {
                placeholder.classList.remove('loading');
                placeholder.style.background = 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)';
            }, Math.random() * 1000 + 500);
        });
    }
    
    lazyLoadPlaceholders();
    
    // Form validation (if forms are added later)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    // Expose utility functions globally
    window.EternalSite = {
        validateForm,
        animateCounters,
        updateNavbarOnScroll,
        updateActiveNavLink
    };
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Recalculate positions after resize
            updateActiveNavLink();
            
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }, 250);
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
        
        // Tab navigation for accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
    // Enhanced parallax effect for hero and other sections
    function enhancedParallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const visionImage = document.querySelector('.city-skyline');
        
        // Hero parallax
        if (hero) {
            const rate = scrolled * -0.4;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Vision image parallax
        if (visionImage) {
            const rect = visionImage.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const rate = (window.innerHeight - rect.top) * 0.1;
                visionImage.style.transform = `translateY(${rate}px)`;
            }
        }
    }
    
    // Enhanced navbar behavior with backdrop filter
    function enhancedUpdateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }
    
    // Combined scroll handler for performance
    function handleScroll() {
        updateNavbarOnScroll();
        updateActiveNavLink();
        if (!ticking) {
            requestAnimationFrame(() => {
                enhancedParallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Single scroll event listener
    window.addEventListener('scroll', handleScroll);
    updateNavbarOnScroll(); // Initial call
    
    // Image loading optimization and error handling
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading animation
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        });
        
        // Handle image loading errors
        img.addEventListener('error', () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.opacity = '0.5';
            
            // Create fallback for business logos
            if (img.classList.contains('business-logo-img')) {
                const logoContainer = img.parentElement;
                const fallbackText = img.alt;
                
                logoContainer.innerHTML = `
                    <div class="logo-fallback">
                        <span>${fallbackText}</span>
                    </div>
                `;
            }
        });
        
        // Initially hide images until loaded
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    console.log('Eternal website initialized successfully');
});