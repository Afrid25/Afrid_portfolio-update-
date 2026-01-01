// Admin panel functionality

document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
});

function initAdminPanel() {
    const adminControls = document.getElementById('admin-controls');
    if (!adminControls) return;

    adminControls.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <h4 style="color: #00ff41; margin-bottom: 0.5rem;">Quick Actions</h4>
            <button id="toggle-animations" style="background: #00ff41; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Pause Animations</button>
            <button id="reset-camera" style="background: #00ff41; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Reset Camera</button>
        </div>

        <div style="margin-bottom: 1rem;">
            <h4 style="color: #00ff41; margin-bottom: 0.5rem;">Theme Settings</h4>
            <label style="display: block; margin-bottom: 0.5rem;">
                <input type="checkbox" id="dark-mode" checked> Dark Mode
            </label>
            <label style="display: block;">
                <input type="checkbox" id="cyber-theme" checked> Cyber Theme
            </label>
        </div>

        <div style="margin-bottom: 1rem;">
            <h4 style="color: #00ff41; margin-bottom: 0.5rem;">Performance</h4>
            <button id="toggle-particles" style="background: #00ff41; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Hide Particles</button>
        </div>

        <div>
            <h4 style="color: #00ff41; margin-bottom: 0.5rem;">Export</h4>
            <button id="export-settings" style="background: #00ff41; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Export Portfolio Data</button>
        </div>
    `;

    // Add event listeners
    setupAdminEventListeners();
}

function setupAdminEventListeners() {
    // Toggle animations
    document.getElementById('toggle-animations').addEventListener('click', function() {
        const button = this;
        if (button.textContent === 'Pause Animations') {
            // Pause all CSS animations
            document.documentElement.style.setProperty('--animation-play-state', 'paused');
            button.textContent = 'Resume Animations';
        } else {
            document.documentElement.style.setProperty('--animation-play-state', 'running');
            button.textContent = 'Pause Animations';
        }
    });

    // Reset camera
    document.getElementById('reset-camera').addEventListener('click', function() {
        if (window.resetCamera) {
            window.resetCamera();
        }
    });

    // Theme toggles
    document.getElementById('dark-mode').addEventListener('change', function() {
        if (this.checked) {
            document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
        } else {
            document.body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)';
            document.body.style.color = '#000000';
        }
    });

    document.getElementById('cyber-theme').addEventListener('change', function() {
        const accentColor = this.checked ? '#00ff41' : '#007bff';
        document.documentElement.style.setProperty('--accent-color', accentColor);
    });

    // Toggle particles
    document.getElementById('toggle-particles').addEventListener('click', function() {
        const particleBg = document.getElementById('particle-bg');
        const button = this;

        if (particleBg.style.display === 'none') {
            particleBg.style.display = 'block';
            button.textContent = 'Hide Particles';
        } else {
            particleBg.style.display = 'none';
            button.textContent = 'Show Particles';
        }
    });

    // Export settings
    document.getElementById('export-settings').addEventListener('click', function() {
        const portfolioData = {
            title: document.title,
            sections: Array.from(document.querySelectorAll('section')).map(section => ({
                id: section.id,
                title: section.querySelector('h2')?.textContent || '',
                content: section.innerHTML
            })),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'portfolio-data.json';
        link.click();
    });
}

// Make resetCamera function available globally
window.resetCamera = function() {
    if (window.camera && window.controls) {
        window.camera.position.set(0, 0, 5);
        window.controls.reset();
    }
};
