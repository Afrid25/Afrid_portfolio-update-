// 3D Scene Management
class Scene3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objects = [];
        this.currentSection = 'hero';
        this.targetCameraPosition = { x: 0, y: 0, z: 5 };
        this.isTransitioning = false;

        // Section camera positions
        this.sectionPositions = {
            hero: { x: 0, y: 0, z: 5 },
            about: { x: 2, y: 1, z: 4 },
            skills: { x: -2, y: -1, z: 4 },
            projects: { x: 1, y: -2, z: 4 },
            contact: { x: -1, y: 2, z: 4 }
        };

        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLighting();
        this.createObjects();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('hero-3d');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI * 0.8;
        this.controls.minPolarAngle = Math.PI * 0.2;
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x00ff41, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light
        const pointLight = new THREE.PointLight(0xff073a, 0.5, 100);
        pointLight.position.set(-5, -5, -5);
        this.scene.add(pointLight);

        // Spot light for dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 0.3);
        spotLight.position.set(0, 10, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
    }

    createObjects() {
        // Main geometric objects
        this.createCube();
        this.createTorus();
        this.createSphere();
        this.createIcosahedron();
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff41,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-3, 0, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff41,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
        wireframe.position.copy(cube.position);

        this.scene.add(cube);
        this.scene.add(wireframe);
        this.objects.push(cube);
    }

    createTorus() {
        const geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff073a,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });

        const torus = new THREE.Mesh(geometry, material);
        torus.position.set(3, 0, 0);
        torus.castShadow = true;
        torus.receiveShadow = true;

        // Wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff073a,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
        wireframe.position.copy(torus.position);

        this.scene.add(torus);
        this.scene.add(wireframe);
        this.objects.push(torus);
    }

    createSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 2, 0);
        sphere.castShadow = true;
        sphere.receiveShadow = true;

        this.scene.add(sphere);
        this.objects.push(sphere);
    }

    createIcosahedron() {
        const geometry = new THREE.IcosahedronGeometry(0.6);
        const material = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });

        const icosahedron = new THREE.Mesh(geometry, material);
        icosahedron.position.set(0, -2, 0);
        icosahedron.castShadow = true;
        icosahedron.receiveShadow = true;

        this.scene.add(icosahedron);
        this.objects.push(icosahedron);
    }

    createParticles() {
        this.particles = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.01, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x00ff41 : 0xff073a,
                transparent: true,
                opacity: Math.random() * 0.8 + 0.2
            });

            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );

            particle.userData = {
                speed: Math.random() * 0.02 + 0.01,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize(),
                originalOpacity: material.opacity
            };

            this.scene.add(particle);
            this.particles.push(particle);
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Listen for section changes from UI
        document.addEventListener('sectionChange', (e) => {
            this.changeSection(e.detail.section);
        });
    }

    changeSection(sectionId) {
        if (this.isTransitioning || !this.sectionPositions[sectionId]) return;

        this.currentSection = sectionId;
        this.targetCameraPosition = this.sectionPositions[sectionId];
        this.isTransitioning = true;

        // Smooth camera transition
        this.animateCameraTransition();
    }

    animateCameraTransition() {
        const duration = 2000; // 2 seconds
        const startPosition = this.camera.position.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Interpolate camera position
            this.camera.position.lerpVectors(startPosition, this.targetCameraPosition, easeProgress);

            // Look at center
            this.camera.lookAt(0, 0, 0);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
            }
        };

        animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Update controls
        this.controls.update();

        // Animate objects
        this.objects.forEach((object, index) => {
            const speed = 0.01 * (index + 1);

            switch(index) {
                case 0: // Cube
                    object.rotation.x += speed;
                    object.rotation.y += speed * 0.7;
                    object.position.y = Math.sin(time + index) * 0.5;
                    break;
                case 1: // Torus
                    object.rotation.x += speed * 0.5;
                    object.rotation.z += speed * 1.2;
                    object.position.y = Math.cos(time + index) * 0.3;
                    break;
                case 2: // Sphere
                    object.rotation.y += speed * 2;
                    object.position.x = Math.sin(time * 0.5 + index) * 1;
                    object.position.z = Math.cos(time * 0.5 + index) * 1;
                    break;
                case 3: // Icosahedron
                    object.rotation.x += speed * 1.5;
                    object.rotation.y += speed * 0.8;
                    object.position.x = Math.sin(time * 0.3 + index) * 0.8;
                    object.position.z = Math.cos(time * 0.3 + index) * 0.8;
                    break;
            }
        });

        // Animate particles
        this.particles.forEach(particle => {
            particle.position.add(
                particle.userData.direction.clone().multiplyScalar(particle.userData.speed)
            );

            // Wrap particles around scene
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(particle.position[axis]) > 15) {
                    particle.position[axis] *= -0.95;
                }
            });

            // Pulsing effect
            particle.material.opacity = particle.userData.originalOpacity +
                Math.sin(time * 2 + particle.position.x * 0.1) * 0.3;
        });

        this.renderer.render(this.scene, this.camera);
    }

    // Public methods
    resetCamera() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
    }

    pauseAnimation() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimation() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    updateTheme(primaryColor, accentColor) {
        // Update lighting colors
        this.scene.children.forEach(child => {
            if (child.type === 'DirectionalLight') {
                child.color.setStyle(primaryColor);
            } else if (child.type === 'PointLight') {
                child.color.setStyle(accentColor);
            }
        });

        // Update object colors
        this.objects.forEach((object, index) => {
            if (index === 0) { // Cube
                object.material.color.setStyle(primaryColor);
            } else if (index === 1) { // Torus
                object.material.color.setStyle(accentColor);
            }
        });
    }
}

// Initialize 3D scene when DOM is loaded
let scene3D;
document.addEventListener('DOMContentLoaded', () => {
    scene3D = new Scene3D();
});

// Export for global access
window.scene3D = scene3D;
