// Admin Login System
let loginAttempts = 0;
const maxAttempts = 3;
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    initAdminLogin();
});

function initAdminLogin() {
    // Listen for Ctrl+Shift+A to open admin login
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            if (!isLoggedIn) {
                showLoginModal();
            } else {
                showAdminPanel();
            }
        }
    });
}

function showLoginModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'admin-login-modal';
    modal.innerHTML = `
        <div class="admin-login-overlay">
            <div class="admin-login-content">
                <h3 style="color: #00ff41; margin-bottom: 1rem; text-align: center;">Admin Access</h3>
                <form id="admin-login-form">
                    <input type="password" id="admin-password" placeholder="Enter admin password"
                           style="width: 100%; padding: 10px; margin-bottom: 1rem; background: #1a1a1a; border: 1px solid #00ff41; color: #ffffff; border-radius: 4px;" required>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" style="flex: 1; background: #00ff41; color: black; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Login</button>
                        <button type="button" id="cancel-login" style="flex: 1; background: #ff073a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                </form>
                <div id="login-message" style="margin-top: 1rem; text-align: center; color: #ff073a;"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .admin-login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .admin-login-content {
            background: #0a0a0a;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #00ff41;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Handle form submission
    document.getElementById('admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        const messageDiv = document.getElementById('login-message');

        if (password === 'admin123') {
            isLoggedIn = true;
            loginAttempts = 0;
            modal.remove();
            style.remove();
            showAdminPanel();
        } else {
            loginAttempts++;
            if (loginAttempts >= maxAttempts) {
                messageDiv.textContent = 'Too many failed attempts. Try again later.';
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                    loginAttempts = 0;
                }, 3000);
            } else {
                messageDiv.textContent = `Incorrect password. ${maxAttempts - loginAttempts} attempts remaining.`;
            }
        }
    });

    // Handle cancel button
    document.getElementById('cancel-login').addEventListener('click', function() {
        modal.remove();
        style.remove();
    });

    // Focus on password input
    setTimeout(() => {
        document.getElementById('admin-password').focus();
    }, 100);
}

function showAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
    }
}

// Make functions globally available
window.showAdminPanel = showAdminPanel;
