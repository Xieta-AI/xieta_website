// Animation utilities and effects
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }
    
    // Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const options = {
            threshold: [0.1, 0.5, 0.8],
            rootMargin: '0px 0px -10% 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, options);
        
        // Observe all animatable elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    // Trigger animation based on element and visibility
    triggerAnimation(element, ratio) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;
        
        if (this.isReduced) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        setTimeout(() => {
            switch (animationType) {
                case 'fade-up':
                    this.fadeUp(element);
                    break;
                case 'fade-in':
                    this.fadeIn(element);
                    break;
                case 'scale-in':
                    this.scaleIn(element);
                    break;
                case 'slide-left':
                    this.slideLeft(element);
                    break;
                case 'slide-right':
                    this.slideRight(element);
                    break;
                default:
                    this.fadeIn(element);
            }
        }, delay);
    }
    
    // Animation methods
    fadeUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
    
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    slideLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    slideRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    // Scroll-based animations
    setupScrollAnimations() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        this.updateScrollAnimations(); // Initial call
    }
    
    updateScrollAnimations() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for backgrounds
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Progress indicators
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = Math.min(100, Math.max(0, 
                    ((windowHeight - rect.top) / (windowHeight + rect.height)) * 100
                ));
                const fill = bar.querySelector('.progress-fill');
                if (fill) {
                    fill.style.width = `${progress}%`;
                }
            }
        });
    }
    
    // Hover effects
    setupHoverEffects() {
        // Business cards hover effect
        const businessCards = document.querySelectorAll('.business-card');
        businessCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    card.style.transform = 'translateY(-12px) scale(1.02)';
                    card.style.transition = 'transform 0.3s ease';
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            });
        });
        
        // Interactive button effects
        const interactiveElements = document.querySelectorAll('.business-link, .btn');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    element.style.transform = 'translateY(-2px)';
                    element.style.transition = 'transform 0.2s ease';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Loading animations
    setupLoadingAnimations() {
        // Stagger animation for grid items
        const staggerElements = document.querySelectorAll('.business-grid .business-card');
        staggerElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('fade-in');
        });
        
        // Typewriter effect for headings
        this.setupTypewriterEffect();
    }
    
    // Typewriter effect
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 50;
            
            element.textContent = '';
            element.style.borderRight = '2px solid';
            element.style.animation = 'blink 1s infinite';
            
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }
            };
            
            // Start typewriter effect when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Counter animation with easing
    animateCounter(element, start, end, duration = 2000) {
        if (this.isReduced) {
            element.textContent = end;
            return;
        }
        
        const startTime = performance.now();
        const suffix = element.textContent.replace(/[\d]/g, '');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // Morphing background shapes
    createMorphingShapes() {
        const shapes = document.querySelectorAll('.morphing-shape');
        
        shapes.forEach(shape => {
            const animate = () => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                const randomScale = 0.8 + Math.random() * 0.4;
                
                shape.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
                shape.style.transition = 'transform 4s ease-in-out';
            };
            
            animate();
            setInterval(animate, 4000);
        });
    }
    
    // Clean up
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animations.clear();
    }
}

// CSS Keyframes injection
const injectKeyframes = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: currentColor; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.3);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    injectKeyframes();
    const animationController = new AnimationController();
    
    // Make it globally available
    window.AnimationController = animationController;
    
    // Handle reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener((e) => {
        animationController.isReduced = e.matches;
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}