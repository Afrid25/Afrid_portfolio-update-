// Main JavaScript functionality with enhanced features

// Create floating particles
function createParticles() {
    const particleBg = document.getElementById('particle-bg');
    if (!particleBg) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
        particleBg.appendChild(particle);
    }
}

// Enhanced smooth scrolling with section highlighting
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active navigation state
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Update active navigation state
function updateActiveNavigation(activeId) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current section nav item
    const activeNav = document.querySelector(`[href="#${activeId}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Intersection Observer for section animations and navigation updates
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-10% 0px -60% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');

                // Update navigation for visible section
                const sectionId = entry.target.id;
                updateActiveNavigation(sectionId);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Add navigation dots for quick section jumping
function createNavigationDots() {
    const navDots = document.createElement('div');
    navDots.id = 'nav-dots';
    navDots.innerHTML = `
        <div class="nav-dot" data-section="hero" title="Hero"></div>
        <div class="nav-dot" data-section="about" title="About"></div>
        <div class="nav-dot" data-section="skills" title="Skills"></div>
        <div class="nav-dot" data-section="projects" title="Projects"></div>
        <div class="nav-dot" data-section="contact" title="Contact"></div>
    `;

    document.body.appendChild(navDots);

    // Add click handlers
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active dot on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionId = section.id;
                document.querySelectorAll('.nav-dot').forEach(dot => {
                    dot.classList.remove('active');
                });
                document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
            }
        });
    });
}

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        document.querySelector('.progress-bar').style.width = scrollPercent + '%';
    });
}

// Add keyboard navigation
function initKeyboardNavigation() {
    let currentSectionIndex = 0;
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];

    document.addEventListener('keydown', function(e) {
        // Arrow keys for section navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
            const targetSection = document.getElementById(sections[currentSectionIndex]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
            const targetSection = document.getElementById(sections[currentSectionIndex]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Home/End keys
        if (e.key === 'Home') {
            e.preventDefault();
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
            currentSectionIndex = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            currentSectionIndex = sections.length - 1;
        }
    });
}

// Add loading animation
function initLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    document.body.appendChild(loader);

    // Hide loader after content loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Add mobile menu toggle
function initMobileMenu() {
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.id = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        background: var(--primary-color);
        color: black;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 18px;
    `;

    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <button id="close-mobile-menu">×</button>
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
        </div>
    `;

    document.body.appendChild(mobileMenuBtn);
    document.body.appendChild(mobileMenu);

    // Show/hide mobile menu button based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            mobileMenu.classList.remove('active');
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });

    document.getElementById('close-mobile-menu').addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initSmoothScrolling();
    initIntersectionObserver();
    createNavigationDots();
    createScrollProgress();
    initKeyboardNavigation();
    initLoadingAnimation();
    initLazyLoading();
    initMobileMenu();
});
