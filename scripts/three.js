function animate() {
    requestAnimationFrame(animate);

    // Update controls
    if (controls) controls.update();

    // Rotate objects
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    if (torus) {
        torus.rotation.x += 0.005;
        torus.rotation.z += 0.01;
    }

    if (particles) {
        particles.rotation.y += 0.001;
    }

    // Subtle camera movement (auto idle animation)
    const time = Date.now() * 0.0005;
    camera.position.x = Math.sin(time) * 0.2;
    camera.position.y = Math.cos(time * 0.6) * 0.15;

    renderer.render(scene, camera);
}

// Expose for admin panel
window.camera = camera;
window.controls = controls;

// Start animation loop
animate();
