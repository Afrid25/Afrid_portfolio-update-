// Critical fixes for portfolio functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Applying critical fixes...');

    // Fix 1: Lower IntersectionObserver threshold for better section visibility
    setTimeout(() => {
        if (window.uiManager && window.uiManager.setupIntersectionObserver) {
            // Override the threshold to be more lenient
            const observerOptions = {
                threshold: 0.1,  // Reduced from 0.3
                rootMargin: '0px 0px -20% 0px'  // More lenient margins
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        const sectionId = entry.target.id;
                        if (window.uiManager && window.uiManager.updateActiveNavigation) {
                            window.uiManager.updateActiveNavigation(sectionId);
                        }
                    }
                });
            }, observerOptions);

            // Re-observe all sections
            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });

            console.log('IntersectionObserver threshold fixed');
        }
    }, 500);

    // Fix 2: Fallback section visibility
    setTimeout(() => {
        document.querySelectorAll('.section').forEach(section => {
            if (!section.classList.contains('fade-in')) {
                section.classList.add('fade-in');
                console.log('Fallback: Made section visible:', section.id);
            }
        });
    }, 2000); // Wait 2 seconds, then make all sections visible

    // Fix 3: Admin panel save button fix
    setTimeout(() => {
        const saveBtn = document.getElementById('admin-save');
        if (saveBtn) {
            // Remove existing listeners and add a new one
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            newSaveBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Save button clicked (fixed version)');

                if (window.adminManager && window.adminManager.saveChanges) {
                    window.adminManager.saveChanges();
                } else {
                    console.error('Admin manager not available');
                }
            });
            console.log('Admin save button fixed');
        }
    }, 1000);

    // Fix 4: Reduce particle count for better performance
    setTimeout(() => {
        const particleBg = document.getElementById('particle-bg');
        if (particleBg && particleBg.children.length > 80) {
            // Remove excess particles
            while (particleBg.children.length > 80) {
                particleBg.removeChild(particleBg.lastChild);
            }
            console.log('Particle count reduced to 80 for better performance');
        }
    }, 100);

    // Fix 5: Ensure 3D scene loads properly
    setTimeout(() => {
        if (!window.scene3D) {
            console.warn('3D scene not loaded, initializing...');
            if (typeof Scene3D !== 'undefined') {
                window.scene3D = new Scene3D();
            }
        }
    }, 2000);

    console.log('Critical fixes applied successfully!');
});
