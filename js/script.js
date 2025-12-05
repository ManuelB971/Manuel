import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0x2c3e50, 0.5);
backLight.position.set(-5, -3, -5);
scene.add(backLight);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("assets/terre_texture.webp");

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    metalness: 0.2,
    roughness: 0.8,
    normalScale: new THREE.Vector2(0.5, 0.5)
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
    );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const moonGeometry = new THREE.SphereGeometry(1, 64, 64);
const moonTexture = textureLoader.load("assets/Mars_texture.webp");
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    metalness: 0.2,
    roughness: 0.8
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

const moonPivot = new THREE.Object3D();
earth.add(moonPivot);
moonPivot.add(moon);

moon.position.x = 8; 

camera.position.z = 15;
let targetZoom = camera.position.z;

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

window.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.5;
    targetZoom += event.deltaY * zoomSpeed * 0.01;
    targetZoom = Math.max(5, Math.min(targetZoom, 30)); 
});

function animate() {
    requestAnimationFrame(animate);

    camera.position.z += (targetZoom - camera.position.z) * 0.1;

    earth.rotation.y += 0.002;
    
    
    moonPivot.rotation.y += 0.005;
    
    moon.rotation.y += 0.01;
    
    stars.rotation.y += 0.0005;
    stars.rotation.x += 0.0002;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

animate();

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
});

// Gestion du menu mobile avec null checks
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const overlay = document.querySelector('.overlay');

if (menuToggle && navbar && overlay) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navbar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
        overlay.classList.remove('active');
    });
}
