// Admin Panel Management System
class AdminManager {
    constructor() {
        this.isLoggedIn = false;
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.setupKeyboardShortcut();
        this.loadAdminData();
        this.setupEventListeners();
    }

    loadData() {
        const defaultData = {
            password: 'admin123',
            theme: {
                primary: '#00ff41',
                accent: '#ff073a',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
            },
            profile: {
                name: 'MD AFRID FOISAL OPU',
                title: '2nd Semester CSE Student at IIUC',
                subtitle: 'Cyber Security Enthusiast | Web Developer | DSA Learner',
                image: 'assets/profile.jpg',
                about: `Hi, I'm <strong>MD AFRID FOISAL OPU</strong>, a 2nd Semester CSE student at IIUC.

I'm currently exploring <strong>Cyber Security</strong> while actively working on <strong>Web Development</strong> and strengthening my foundation in <strong>Data Structures & Algorithms</strong>.

My long-term goal is to become a professional cybersecurity engineer and build secure, meaningful web applications that create real impact.`
            },
            skills: [
                'Cyber Security',
                'Web Development',
                'Data Structures & Algorithms',
                'JavaScript',
                'HTML',
                'CSS',
                'Python',
                'Ethical Hacking'
            ],
            projects: [
                {
                    title: 'Blood for Life – Blood Bank Management Website',
                    description: 'A comprehensive blood bank management system to connect donors with those in need.',
                    image: 'assets/bloodbank.jpg',
                    link: 'https://afrid25.github.io/Blood-Bank-App/',
                    github: 'https://github.com/Afrid25/BOOK-OF-DEEDS-update-'
                },
                {
                    title: '3D Animated Portfolio',
                    description: 'An interactive 3D portfolio website showcasing skills and projects.',
                    image: 'assets/portfolio.jpg',
                    link: '',
                    github: ''
                }
            ],
            contact: {
                intro: 'Feel free to reach out for collaborations, opportunities, or just to connect!',
                email: '25afridfoisal00@gmail.com',
                github: 'https://github.com/Afrid25',
                youtube: 'https://youtube.com/@LifeCodeWithAfrid'
            }
        };

        const saved = localStorage.getItem('portfolio-admin-data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveData() {
        localStorage.setItem('portfolio-admin-data', JSON.stringify(this.data));
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.showLoginModal();
            }
        });
    }

    showLoginModal() {
        if (this.isLoggedIn) {
            this.showAdminPanel();
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'admin-login-modal';
        modal.innerHTML = `
            <div class="admin-login-content">
                <h3>Admin Access</h3>
                <input type="password" id="admin-password" placeholder="Enter password" autofocus>
                <div class="admin-login-actions">
                    <button id="admin-login-btn">Login</button>
                    <button id="admin-cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus password input
        setTimeout(() => {
            document.getElementById('admin-password').focus();
        }, 100);

        // Event listeners
        document.getElementById('admin-login-btn').addEventListener('click', () => {
            this.attemptLogin();
        });

        document.getElementById('admin-cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.attemptLogin();
            }
        });
    }

    attemptLogin() {
        const password = document.getElementById('admin-password').value;
        if (password === this.data.password) {
            this.isLoggedIn = true;
            document.querySelector('.admin-login-modal').remove();
            this.showAdminPanel();
            if (window.uiManager) {
                window.uiManager.showNotification('Admin access granted', 'success');
            }
        } else {
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-password').placeholder = 'Incorrect password';
            setTimeout(() => {
                document.getElementById('admin-password').placeholder = 'Enter password';
            }, 2000);
        }
    }

    showAdminPanel() {
        const overlay = document.getElementById('admin-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            this.populateAdminPanel();
        }
    }

    hideAdminPanel() {
        const overlay = document.getElementById('admin-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Close admin panel
        const closeBtn = document.getElementById('admin-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAdminPanel();
            });
        }

        // Tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Save changes
        const saveBtn = document.getElementById('admin-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveChanges();
            });
        }

        // Preview changes
        const previewBtn = document.getElementById('admin-preview');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.previewChanges();
            });
        }

        // Profile image upload
        const imageInput = document.getElementById('admin-image-input');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target, 'image-preview img');
            });
        }

        // Skills management
        const addSkillBtn = document.getElementById('add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.addSkill();
            });
        }

        // Projects management
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                this.addProject();
            });
        }

        // Password change
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.changePassword();
            });
        }

        // Reset data
        const resetBtn = document.getElementById('reset-data-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    this.resetData();
                }
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    populateAdminPanel() {
        // Profile tab
        document.getElementById('admin-name-input').value = this.data.profile.name;
        document.getElementById('admin-title-input').value = this.data.profile.title;
        document.getElementById('admin-subtitle-input').value = this.data.profile.subtitle;
        document.getElementById('admin-about-input').value = this.data.profile.about;
        document.querySelector('#image-preview img').src = this.data.profile.image;

        // Theme tab
        document.getElementById('admin-primary-color').value = this.data.theme.primary;
        document.getElementById('admin-accent-color').value = this.data.theme.accent;
        document.getElementById('admin-background').value = this.data.theme.background;

        // Skills tab
        this.populateSkills();

        // Projects tab
        this.populateProjects();

        // Contact tab
        document.getElementById('admin-contact-intro').value = this.data.contact.intro;
        document.getElementById('admin-contact-email').value = this.data.contact.email;
        document.getElementById('admin-contact-github').value = this.data.contact.github;
        document.getElementById('admin-contact-youtube').value = this.data.contact.youtube;
    }

    populateSkills() {
        const skillsList = document.getElementById('admin-skills-list');
        skillsList.innerHTML = '';

        this.data.skills.forEach((skill, index) => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-editor-item';
            skillItem.innerHTML = `
                <input type="text" value="${skill}" data-index="${index}">
                <button class="remove-skill-btn" data-index="${index}">×</button>
            `;
            skillsList.appendChild(skillItem);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeSkill(parseInt(e.target.dataset.index));
            });
        });
    }

    populateProjects() {
        const projectsList = document.getElementById('admin-projects-list');
        projectsList.innerHTML = '';

        this.data.projects.forEach((project, index) => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-editor-item';
            projectItem.innerHTML = `
                <h5>Project ${index + 1}</h5>
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" value="${project.title}" data-field="title" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <textarea data-field="description" data-index="${index}" rows="3">${project.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Image:</label>
                    <input type="file" data-field="image" data-index="${index}" accept="image/*">
                    <div class="image-preview">
                        <img src="${project.image}" alt="Project ${index + 1}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Live Demo URL:</label>
                    <input type="url" value="${project.link}" data-field="link" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>GitHub URL:</label>
                    <input type="url" value="${project.github}" data-field="github" data-index="${index}">
                </div>
                <button class="remove-project-btn admin-btn" data-index="${index}">Remove Project</button>
            `;
            projectsList.appendChild(projectItem);
        });

        // Add event listeners for remove buttons and image uploads
        document.querySelectorAll('.remove-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeProject(parseInt(e.target.dataset.index));
            });
        });

        document.querySelectorAll('input[data-field="image"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.handleImageUpload(e.target, `.project-editor-item:nth-child(${index + 1}) .image-preview img`);
            });
        });
    }

    handleImageUpload(input, previewSelector) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.querySelector(previewSelector);
                if (img) {
                    img.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    addSkill() {
        this.data.skills.push('New Skill');
        this.populateSkills();
    }

    removeSkill(index) {
        this.data.skills.splice(index, 1);
        this.populateSkills();
    }

    addProject() {
        this.data.projects.push({
            title: 'New Project',
            description: 'Project description',
            image: '',
            link: '',
            github: ''
        });
        this.populateProjects();
    }

    removeProject(index) {
        this.data.projects.splice(index, 1);
        this.populateProjects();
    }

    changePassword() {
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (current !== this.data.password) {
            alert('Current password is incorrect.');
            return;
        }

        if (newPass !== confirm) {
            alert('New passwords do not match.');
            return;
        }

        if (newPass.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        this.data.password = newPass;
        this.saveData();
        alert('Password changed successfully!');

        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }

    saveChanges() {
        // Collect all form data
        this.data.profile.name = document.getElementById('admin-name-input').value;
        this.data.profile.title = document.getElementById('admin-title-input').value;
        this.data.profile.subtitle = document.getElementById('admin-subtitle-input').value;
        this.data.profile.about = document.getElementById('admin-about-input').value;

        this.data.theme.primary = document.getElementById('admin-primary-color').value;
        this.data.theme.accent = document.getElementById('admin-accent-color').value;
        this.data.theme.background = document.getElementById('admin-background').value;

        // Update skills
        this.data.skills = [];
        document.querySelectorAll('#admin-skills-list input').forEach(input => {
            if (input.value.trim()) {
                this.data.skills.push(input.value.trim());
            }
        });

        // Update projects
        document.querySelectorAll('.project-editor-item').forEach((item, index) => {
            if (this.data.projects[index]) {
                this.data.projects[index].title = item.querySelector('[data-field="title"]').value;
                this.data.projects[index].description = item.querySelector('[data-field="description"]').value;
                this.data.projects[index].link = item.querySelector('[data-field="link"]').value;
                this.data.projects[index].github = item.querySelector('[data-field="github"]').value;

                const img = item.querySelector('.image-preview img');
                if (img && img.src && img.src.startsWith('data:')) {
                    this.data.projects[index].image = img.src;
                }
            }
        });

        // Update contact
        this.data.contact.intro = document.getElementById('admin-contact-intro').value;
        this.data.contact.email = document.getElementById('admin-contact-email').value;
        this.data.contact.github = document.getElementById('admin-contact-github').value;
        this.data.contact.youtube = document.getElementById('admin-contact-youtube').value;

        // Handle profile image
        const profileImg = document.querySelector('#image-preview img');
        if (profileImg && profileImg.src && profileImg.src.startsWith('data:')) {
            this.data.profile.image = profileImg.src;
        }

        this.saveData();
        this.applyChanges();

        if (window.uiManager) {
            window.uiManager.showNotification('Changes saved successfully!', 'success');
        }
    }

    previewChanges() {
        this.saveChanges();
        // Changes are applied immediately
    }

    applyChanges() {
        // Apply theme
        if (window.uiManager) {
            window.uiManager.updateTheme(
                this.data.theme.primary,
                this.data.theme.accent,
                this.data.theme.background
            );
        }

        // Apply profile
        document.getElementById('hero-name').textContent = this.data.profile.name;
        document.getElementById('hero-title').textContent = this.data.profile.title;
        document.getElementById('hero-subtitle').textContent = this.data.profile.subtitle;
        document.getElementById('profile-pic').src = this.data.profile.image;
        document.getElementById('about-text').innerHTML = this.data.profile.about;

        // Apply skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = this.data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('');

        // Apply projects
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = this.data.projects.map(project => `
            <div class="project-item">
                <a href="${project.link}" target="_blank" class="project-link">
                    <img src="${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        ${project.link ? '<span class="project-link-text">🔗 Live Demo</span>' : ''}
                        ${project.link && project.github ? ' | ' : ''}
                        ${project.github ? '<span class="project-link-text">📂 GitHub</span>' : ''}
                    </div>
                </a>
            </div>
        `).join('');

        // Apply contact
        document.getElementById('contact-intro').textContent = this.data.contact.intro;
        document.getElementById('contact-email').textContent = `Email: ${this.data.contact.email}`;
        document.getElementById('contact-github').href = this.data.contact.github;
        document.getElementById('contact-youtube').href = this.data.contact.youtube;
    }

    loadAdminData() {
        this.applyChanges();
    }

    resetData() {
        localStorage.removeItem('portfolio-admin-data');
        location.reload();
    }
}

// Initialize admin manager
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});

// Export for global access
window.adminManager = adminManager;
