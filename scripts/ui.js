// UI Management System
class UIManager {
    constructor() {
        this.currentSection = 'hero';
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupScrollProgress();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
        this.setupLoadingScreen();
        this.createParticles();
    }

    setupNavigation() {
        // Navigation dots
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                this.scrollToSection(sectionId);
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                if (this.mobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            this.updateActiveNavigation(sectionId);
        }
    }

    updateActiveNavigation(activeId) {
        // Update navigation dots
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        const activeDot = document.querySelector(`[data-section="${activeId}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }

        this.currentSection = activeId;

        // Dispatch section change event for 3D scene
        document.dispatchEvent(new CustomEvent('sectionChange', {
            detail: { section: activeId }
        }));
    }

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-mobile-menu');

        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileBtn = document.getElementById('mobile-menu-btn');

            if (this.mobileMenuOpen &&
                !mobileMenu.contains(e.target) &&
                e.target !== mobileBtn) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            mobileMenu.classList.toggle('active');
        }
    }

    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-10% 0px -60% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    const sectionId = entry.target.id;
                    this.updateActiveNavigation(sectionId);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    setupKeyboardNavigation() {
        const sections = ['hero', 'about', 'skills', 'projects', 'contact'];

        document.addEventListener('keydown', (e) => {
            let targetIndex = sections.indexOf(this.currentSection);

            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = Math.min(targetIndex + 1, sections.length - 1);
                    this.scrollToSection(sections[targetIndex]);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = Math.max(targetIndex - 1, 0);
                    this.scrollToSection(sections[targetIndex]);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToSection('hero');
                    break;
                case 'End':
                    e.preventDefault();
                    this.scrollToSection('contact');
                    break;
            }
        });
    }

    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 500);
                }
            }, 1000);
        });
    }

    createParticles() {
        const particleBg = document.getElementById('particle-bg');
        if (!particleBg) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
            particleBg.appendChild(particle);
        }
    }

    updateTheme(primaryColor, accentColor, background) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.setProperty('--gradient-bg', background);
        document.body.style.background = background;

        // Update 3D scene theme
        if (window.scene3D) {
            window.scene3D.updateTheme(primaryColor, accentColor);
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Public methods
    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
        if (window.scene3D) {
            window.scene3D.pauseAnimation();
        }
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
        if (window.scene3D) {
            window.scene3D.resumeAnimation();
        }
    }

    resetCamera() {
        if (window.scene3D) {
            window.scene3D.resetCamera();
        }
    }
}

// Initialize UI manager
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
});

// Export for global access
window.uiManager = uiManager;
