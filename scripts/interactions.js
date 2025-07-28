// Interactive features and user experience enhancements
class InteractionManager {
    constructor() {
        this.activeModals = [];
        this.carousels = new Map();
        this.cursorTrail = {
            particles: [],
            mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, // Start at screen center
            isActive: false
        };
        this.init();
    }

    init() {
        this.setupBusinessCardInteractions();
        this.setupFormInteractions();
        this.setupCarousels();
        this.setupTooltips();
        this.setupSearchFunctionality();
        this.setupAccessibilityFeatures();
        this.setupCursorEffects();
        this.setupHeroParticles();
        this.setupScrollIndicator();
    }

    // Enhanced business card interactions
    setupBusinessCardInteractions() {
        const businessCards = document.querySelectorAll('.business-card');

        businessCards.forEach((card, index) => {
            // Add click interaction for mobile
            card.addEventListener('click', () => {
                this.expandCard(card);
            });

            // Add keyboard navigation
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Learn more about ${card.querySelector('h3')?.textContent || 'business'}`);

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.expandCard(card);
                }
            });

            // Add focus styles
            card.addEventListener('focus', () => {
                card.style.outline = '3px solid #007bff';
                card.style.outlineOffset = '2px';
            });

            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });

            // Enhanced hover effects with mouse tracking
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Expand card functionality
    expandCard(card) {
        const content = card.querySelector('.business-content');
        const title = card.querySelector('h3')?.textContent || 'Business Details';
        const description = card.querySelector('p')?.textContent || '';

        const modal = this.createModal({
            title: title,
            content: `
                <div class="expanded-business-card">
                    <div class="business-image-large">
                        <div class="business-placeholder-large">High-resolution business image</div>
                    </div>
                    <div class="business-details">
                        <p>${description}</p>
                        <div class="business-features">
                            <h4>Key Features:</h4>
                            <ul>
                                <li>Innovation-driven approach</li>
                                <li>Scalable solutions</li>
                                <li>Global market reach</li>
                                <li>Sustainable practices</li>
                            </ul>
                        </div>
                        <div class="business-actions">
                            <button class="btn btn-primary">Learn More</button>
                            <button class="btn btn-secondary">Contact Team</button>
                        </div>
                    </div>
                </div>
            `,
            className: 'business-modal'
        });

        this.showModal(modal);
    }

    // Form interactions and validation
    setupFormInteractions() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('input', () => {
                    this.validateField(input);
                });

                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                // Enhanced focus styles
                input.addEventListener('focus', () => {
                    input.parentElement?.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    input.parentElement?.classList.remove('focused');
                });
            });

            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    // Field validation
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        let isValid = true;
        let message = '';

        if (required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (value) {
            switch (type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        message = 'Please enter a valid phone number';
                    }
                    break;
                case 'url':
                    try {
                        new URL(value);
                    } catch {
                        isValid = false;
                        message = 'Please enter a valid URL';
                    }
                    break;
            }
        }

        this.updateFieldValidation(field, isValid, message);
        return isValid;
    }

    // Update field validation UI
    updateFieldValidation(field, isValid, message) {
        const container = field.parentElement;
        const errorElement = container?.querySelector('.field-error');

        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('error');

            if (!errorElement && message) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = message;
                container?.appendChild(error);
            } else if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    // Handle form submission
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(data, form);
        } else {
            this.showNotification('Please correct the errors above', 'error');
        }
    }

    // Submit form data
    async submitForm(data, form) {
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton?.textContent;

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
                submitButton.classList.add('loading');
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showNotification('Form submitted successfully!', 'success');
            form.reset();

        } catch (error) {
            this.showNotification('Failed to submit form. Please try again.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.classList.remove('loading');
            }
        }
    }

    // Carousel/Slider functionality
    setupCarousels() {
        const carousels = document.querySelectorAll('.carousel');

        carousels.forEach((carousel, index) => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
            const indicators = carousel.querySelector('.carousel-indicators');

            if (slides.length === 0) return;

            const carouselData = {
                element: carousel,
                slides: slides,
                currentSlide: 0,
                totalSlides: slides.length,
                autoPlay: carousel.dataset.autoplay === 'true',
                interval: parseInt(carousel.dataset.interval) || 5000
            };

            this.carousels.set(index, carouselData);

            // Create indicators
            if (indicators) {
                for (let i = 0; i < slides.length; i++) {
                    const indicator = document.createElement('button');
                    indicator.className = 'carousel-indicator';
                    indicator.setAttribute('data-slide', i);
                    indicator.addEventListener('click', () => this.goToSlide(index, i));
                    indicators.appendChild(indicator);
                }
            }

            // Navigation buttons
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousSlide(index));
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextSlide(index));
            }

            // Keyboard navigation
            carousel.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.previousSlide(index);
                        break;
                    case 'ArrowRight':
                        this.nextSlide(index);
                        break;
                }
            });

            // Touch/swipe support
            this.setupSwipeGestures(carousel, index);

            // Auto-play
            if (carouselData.autoPlay) {
                this.startAutoPlay(index);

                // Pause on hover
                carousel.addEventListener('mouseenter', () => this.pauseAutoPlay(index));
                carousel.addEventListener('mouseleave', () => this.startAutoPlay(index));
            }

            // Initialize first slide
            this.updateCarousel(index);
        });
    }

    // Carousel navigation methods
    nextSlide(carouselIndex) {
        const carousel = this.carousels.get(carouselIndex);
        carousel.currentSlide = (carousel.currentSlide + 1) % carousel.totalSlides;
        this.updateCarousel(carouselIndex);
    }

    previousSlide(carouselIndex) {
        const carousel = this.carousels.get(carouselIndex);
        carousel.currentSlide = carousel.currentSlide === 0 ? carousel.totalSlides - 1 : carousel.currentSlide - 1;
        this.updateCarousel(carouselIndex);
    }

    goToSlide(carouselIndex, slideIndex) {
        const carousel = this.carousels.get(carouselIndex);
        carousel.currentSlide = slideIndex;
        this.updateCarousel(carouselIndex);
    }

    updateCarousel(carouselIndex) {
        const carousel = this.carousels.get(carouselIndex);
        const { slides, currentSlide, element } = carousel;

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update indicators
        const indicators = element.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    // Auto-play functionality
    startAutoPlay(carouselIndex) {
        const carousel = this.carousels.get(carouselIndex);
        if (carousel.autoPlayTimer) {
            clearInterval(carousel.autoPlayTimer);
        }

        carousel.autoPlayTimer = setInterval(() => {
            this.nextSlide(carouselIndex);
        }, carousel.interval);
    }

    pauseAutoPlay(carouselIndex) {
        const carousel = this.carousels.get(carouselIndex);
        if (carousel.autoPlayTimer) {
            clearInterval(carousel.autoPlayTimer);
        }
    }

    // Swipe gesture support
    setupSwipeGestures(element, carouselIndex) {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });

        element.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        element.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;

            const threshold = 50;
            const restraint = 100;

            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.previousSlide(carouselIndex);
                } else {
                    this.nextSlide(carouselIndex);
                }
            }
        });
    }

    // Tooltip functionality
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            element.addEventListener('focus', (e) => {
                this.showTooltip(e.target);
            });

            element.addEventListener('blur', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element) {
        const text = element.dataset.tooltip;
        const position = element.dataset.tooltipPosition || 'top';

        const tooltip = document.createElement('div');
        tooltip.className = `tooltip-popup tooltip-${position}`;
        tooltip.textContent = text;
        tooltip.id = 'active-tooltip';

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust position if tooltip goes off-screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        if (top < 10) {
            top = rect.bottom + 10;
            tooltip.classList.remove('tooltip-top');
            tooltip.classList.add('tooltip-bottom');
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Search functionality
    setupSearchFunctionality() {
        const searchInputs = document.querySelectorAll('[data-search]');

        searchInputs.forEach(input => {
            const target = input.dataset.search;
            const targetElements = document.querySelectorAll(target);

            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.filterElements(targetElements, query);
            });
        });
    }

    filterElements(elements, query) {
        elements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const matches = text.includes(query);

            element.style.display = matches || query === '' ? '' : 'none';

            if (matches && query !== '') {
                element.classList.add('search-highlight');
            } else {
                element.classList.remove('search-highlight');
            }
        });
    }

    // Accessibility enhancements
    setupAccessibilityFeatures() {
        // Skip to content link
        this.createSkipLink();

        // Keyboard navigation improvements
        this.enhanceKeyboardNavigation();

        // Screen reader announcements
        this.setupAriaLiveRegions();

        // High contrast mode detection
        this.detectHighContrastMode();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            z-index: 999;
            padding: 8px;
            background: #000;
            color: #fff;
            text-decoration: none;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.left = '6px';
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-focus');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-focus');
        });
    }

    setupAriaLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Make announce function globally available
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    detectHighContrastMode() {
        const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
        }
    }

    // Modal system
    createModal({ title, content, className = '' }) {
        const modal = document.createElement('div');
        modal.className = `modal-overlay ${className}`;
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Close button functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.hideModal(modal));

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });

        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Focus management
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        this.activeModals.push(modal);
    }

    hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);

        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }
    }

    // Notification system
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }

    // Modern cursor effects using optimized library approach
    setupCursorEffects() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Initialize spiral cursor effect immediately - always visible
        console.log('Initializing spiral cursor effect...');
        this.initSpiralCursor();
    }

    initSpiralCursor() {
        // Prevent multiple instances
        if (this.cursorTrail.isActive) {
            console.log('Spiral cursor already active');
            return;
        }

        console.log('Creating spiral cursor particles...');

        const particles = [];
        const particleCount = 12; // Increased count for more variety with new symbols
        const mouse = { x: 0, y: 0 };

        // Extended mathematical and Greek symbols
        const symbols = ['∞', 'Ξ', 'η', 'π', 'φ',  'λ', 'μ','θ', 'Ω'];
        const allElements = symbols;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'cursor-orbit-particle';

            // Larger size variation for better visibility
            const size = 18 + Math.random() * 10; // 18-28px
            const randomElement = allElements[Math.floor(Math.random() * allElements.length)];

            // Random shape variation
            const shapes = ['circle', 'square', 'diamond', 'triangle'];
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

            let shapeStyles = '';
            switch(randomShape) {
                case 'circle':
                    shapeStyles = 'border-radius: 50%;';
                    break;
                case 'square':
                    shapeStyles = 'border-radius: 2px;';
                    break;
                case 'diamond':
                    shapeStyles = 'border-radius: 2px; transform: rotate(45deg);';
                    break;
                case 'triangle':
                    shapeStyles = 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);';
                    break;
            }

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                ${shapeStyles}
                pointer-events: none;
                z-index: 9999;
                opacity: 0.85;
                transition: opacity 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${size * 0.7}px;
                font-weight: bold;
                font-family: 'Times New Roman', serif;
            `;

            // Vibrant colors that stand out on white background
            const colorPalettes = [
                '#2563eb', // Bright blue
                '#dc2626', // Bright red
                '#16a34a', // Bright green
                '#ca8a04', // Golden yellow
                '#9333ea', // Bright purple
                '#ea580c', // Bright orange
                '#0891b2', // Bright cyan
                '#be123c'  // Bright rose
            ];

            const randomColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

            particle.style.background = `transparent`;
            particle.style.color = randomColor;
            particle.style.boxShadow = `0 0 8px ${randomColor}40`; // Light glow for visibility

            // Add the symbol/element
            particle.textContent = randomElement;

            document.body.appendChild(particle);

            particles.push({
                element: particle,
                angle: (i * Math.PI * 2) / particleCount,
                baseRadius: 35 + Math.random() * 25, // Base spiral distance
                radiusOffset: Math.random() * Math.PI * 2, // Random spiral phase
                spiralSpeed: 0.02 + Math.random() * 0.03, // Spiral in/out speed
                spiralAmplitude: 15 + Math.random() * 10, // How far spiral extends
                speed: 0.008 + Math.random() * 0.012, // Rotational speed
                size: size,
                symbol: randomElement,
                x: 0,
                y: 0
            });
        }

        // Track mouse movement and update global mouse position
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            this.cursorTrail.mouse.x = e.clientX;
            this.cursorTrail.mouse.y = e.clientY;
        });

        // Initialize mouse position immediately
        mouse.x = this.cursorTrail.mouse.x;
        mouse.y = this.cursorTrail.mouse.y;

        // Animation loop with spiral motion
        const animate = () => {
            particles.forEach((particle, index) => {
                // Update angle for spiral motion
                particle.angle += particle.speed;

                // Create spiral effect by gradually changing radius
                particle.radiusOffset += particle.spiralSpeed;
                const currentRadius = particle.baseRadius + Math.sin(particle.radiusOffset) * particle.spiralAmplitude;

                // Calculate spiral position
                particle.x = mouse.x + Math.cos(particle.angle) * currentRadius;
                particle.y = mouse.y + Math.sin(particle.angle) * currentRadius;

                // Apply position (center the particle)
                particle.element.style.left = `${particle.x - particle.size/2}px`;
                particle.element.style.top = `${particle.y - particle.size/2}px`;
            });
        };

        // Start continuous animation
        const continuousAnimate = () => {
            animate();
            requestAnimationFrame(continuousAnimate);
        };

        continuousAnimate();

        // Store for reference
        this.cursorTrail.particles = particles;
        this.cursorTrail.isActive = true;
    }

    // Toggle spiral cursor effects (optional utility)
    toggleSpiralCursor() {
        if (this.cursorTrail.isActive) {
            this.cursorTrail.particles.forEach(particle => {
                particle.element.style.opacity = '0';
                setTimeout(() => {
                    if (particle.element.parentNode) {
                        particle.element.remove();
                    }
                }, 300);
            });
            this.cursorTrail.particles = [];
            this.cursorTrail.isActive = false;
        } else {
            this.initSpiralCursor();
        }
    }

    // Hero particles.js setup
    setupHeroParticles() {
        // Wait for particles.js to load
        if (typeof particlesJS === 'undefined') {
            setTimeout(() => this.setupHeroParticles(), 100);
            return;
        }

        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 120,
                    "density": {
                        "enable": true,
                        "value_area": 1000
                    }
                },
                "color": {
                    "value": ["#1e40af", "#7c3aed", "#dc2626", "#059669", "#ea580c"]
                },
                "shape": {
                    "type": ["circle", "triangle"],
                    "stroke": {
                        "width": 1,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 6
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 4,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 3,
                        "size_min": 1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 200,
                    "color": "#333333",
                    "opacity": 0.08,
                    "width": 1.5,
                    "shadow": {
                        "enable": true,
                        "color": "#000000",
                        "blur": 2
                    }
                },
                "move": {
                    "enable": true,
                    "speed": 0.8,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "bounce",
                    "bounce": true,
                    "attract": {
                        "enable": true,
                        "rotateX": 3000,
                        "rotateY": 3000
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": ["grab", "bubble"]
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 250,
                        "line_linked": {
                            "opacity": 0.4,
                            "color": "#ff6b6b"
                        }
                    },
                    "bubble": {
                        "distance": 200,
                        "size": 8,
                        "duration": 0.4,
                        "opacity": 0.8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 300,
                        "duration": 2
                    },
                    "push": {
                        "particles_nb": 6
                    },
                    "remove": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });

        console.log('Particles.js initialized for hero background');
    }

    // Setup scroll indicator functionality
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const scrollArrow = document.querySelector('.scroll-arrow');
        
        if (!scrollIndicator || !scrollArrow) return;

        // Add click functionality to scroll to next section
        scrollIndicator.addEventListener('click', () => {
            const businessesSection = document.querySelector('#businesses');
            if (businessesSection) {
                businessesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Add keyboard accessibility
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const businessesSection = document.querySelector('#businesses');
                if (businessesSection) {
                    businessesSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Make it focusable and add proper attributes
        scrollIndicator.setAttribute('tabindex', '0');
        scrollIndicator.setAttribute('role', 'button');
        scrollIndicator.setAttribute('aria-label', 'Scroll to next section');
        scrollIndicator.style.cursor = 'pointer';

        console.log('Scroll indicator functionality enabled');
    }
}

// Initialize interaction manager
document.addEventListener('DOMContentLoaded', () => {
    const interactionManager = new InteractionManager();
    window.InteractionManager = interactionManager;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionManager;
}
