// Interactive features and user experience enhancements
class InteractionManager {
    constructor() {
        this.activeModals = [];
        this.carousels = new Map();
        this.init();
    }

    init() {
        this.setupBusinessCardInteractions();
        this.setupFormInteractions();
        this.setupCarousels();
        this.setupTooltips();
        this.setupSearchFunctionality();
        this.setupAccessibilityFeatures();
        this.setupHeroParticles();
        this.setupScrollIndicator();
        this.setupClickParticleEffect();
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


    // Custom neural network with curved edges and symbol nodes
    setupHeroParticles() {
        const container = document.getElementById('particles-js');
        if (!container) return;

        // Create canvas for custom neural network
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);

        // Setup canvas
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Neural network nodes
        const nodes = [];
        const nodeCount = 60; // Increased from 40 for higher density
        // Add infinity symbol
        const symbols = ['η', 'ξ', '∞'];

        // Create regular nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8, // Slightly faster movement
                vy: (Math.random() - 0.5) * 0.8,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                color: ['#1a237e', '#283593', '#3949ab', '#1565c0', '#0d47a1'][Math.floor(Math.random() * 5)], // Darker blues for better contrast
                opacity: Math.random() * 0.4 + 0.4, // Increased opacity (0.4-0.8)
                size: Math.random() * 10 + 16, // Larger symbols (16-26px)
                isCenter: false
            });
        }

        // // Add central infinity symbol
        // nodes.push({
        //     x: canvas.width / 2,
        //     y: canvas.height / 2,
        //     vx: 0,
        //     vy: 0,
        //     symbol: '∞',
        //     color: '#000000',
        //     opacity: 0.8,
        //     size: 24,
        //     isCenter: true
        // });

        // Animation loop
        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update node positions (except center node)
            nodes.forEach(node => {
                if (!node.isCenter) {
                    node.x += node.vx;
                    node.y += node.vy;

                    // Bounce off edges
                    if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
                    if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

                    // Keep within bounds
                    node.x = Math.max(0, Math.min(canvas.width, node.x));
                    node.y = Math.max(0, Math.min(canvas.height, node.y));
                } else {
                    // Keep center node at center
                    node.x = canvas.width / 2;
                    node.y = canvas.height / 2;
                }
            });

            // Draw straight connections with better visibility
            ctx.strokeStyle = `rgba(26, 35, 126, 0.6)`; // Darker blue connections
            ctx.lineWidth = 2.5; // Slightly thicker lines

            // for (let i = 0; i < nodes.length; i++) {
            //     for (let j = i + 1; j < nodes.length; j++) {
            //         const dx = nodes[j].x - nodes[i].x;
            //         const dy = nodes[j].y - nodes[i].y;
            //         const distance = Math.sqrt(dx * dx + dy * dy);

            //         if (distance < 180) { // Increased connection range
            //             ctx.beginPath();
            //             ctx.moveTo(nodes[i].x, nodes[i].y);
            //             ctx.lineTo(nodes[j].x, nodes[j].y);
            //             ctx.globalAlpha = (1 - distance / 180) * 0.8; // Higher opacity
            //             ctx.stroke();
            //         }
            //     }
            // }

            // Draw symbol nodes with enhanced visibility
            nodes.forEach(node => {
                ctx.globalAlpha = node.opacity;
                ctx.fillStyle = node.color;
                ctx.font = `bold ${node.size}px 'Times New Roman', serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Add stronger glow effect
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 8;
                ctx.fillText(node.symbol, node.x, node.y);

                // Add second layer for better visibility
                ctx.shadowBlur = 3;
                ctx.fillText(node.symbol, node.x, node.y);

                ctx.shadowBlur = 0;
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };

        animate();
        console.log('Custom neural network with curved edges and symbols initialized');
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

    // Setup click particle gyro effect
    setupClickParticleEffect() {
        // Add event listener to window instead of document to catch all clicks
        window.addEventListener('click', (e) => {
            // Get accurate click coordinates
            const x = e.clientX;
            const y = e.clientY;

            console.log(`Click detected at: (${x}, ${y}) on element:`, e.target);
            console.log(`Page scroll position: ${window.scrollY}`);

            this.createParticleGyro(x, y);
        }, true); // Use capture phase

        // Also add to document as fallback
        document.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            console.log(`Document click backup at: (${x}, ${y})`);
        });

        console.log('Click particle effect initialized');
    }

    createParticleGyro(x, y) {
        const particleCount = 20;
        const particles = [];

        // Color palette
        const colors = [
            '#ff6b35', '#f7931e', '#ffd23f', '#06ffa5',
            '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'
        ];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';

            const size = Math.random() * 8 + 4; // 4-12px
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                position: fixed;
                left: ${x - size/2}px;
                top: ${y - size/2}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                filter: grayscale(0%) !important;
                box-shadow: 0 0 10px ${color}80;
                transform-origin: center center;
                will-change: transform, opacity;
            `;

            document.body.appendChild(particle);

            // Calculate random direction and distance
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const distance = Math.random() * 150 + 50; // 50-200px
            const duration = Math.random() * 800 + 600; // 600-1400ms

            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            // Animate particle in gyro motion
            particle.animate([
                {
                    transform: 'scale(1) rotate(0deg)',
                    opacity: '1'
                },
                {
                    transform: `translate(${targetX - x}px, ${targetY - y}px) scale(0.5) rotate(720deg)`,
                    opacity: '0'
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => {
                particle.remove();
            };
        }

        console.log(`Created particle gyro at (${x}, ${y})`);
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
