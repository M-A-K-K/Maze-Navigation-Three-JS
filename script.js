// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep the 3D object on a global variable so we can access it later
let object;

// Set which object to render
let objToRender = 'maze';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    `ma.gltf`,
    function (gltf) {
        object = gltf.scene;
        object.scale.set(0.1, 0.1, 0.1);
        scene.add(object);
        
        // Adjust camera position
        camera.position.set(0, 0, 200);
        camera.lookAt(object.position);

        // Create a bounding box for the model
        const objectBoundingBox = new THREE.Box3().setFromObject(object);

        // Function to check collision between block and model
        function checkCollision() {
            const movableBlockBoundingBox = new THREE.Box3().setFromObject(movableBlock);
            return movableBlockBoundingBox.intersectsBox(objectBoundingBox);
        }

        document.addEventListener('keydown', handleKeyDown, false);
    },
    function (xhr) {
        // While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // If there is an error, log it
        console.error(error);
    }
);

// Create a movable block
const blockGeometry = new THREE.BoxGeometry(10, 10, 10);
const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const movableBlock = new THREE.Mesh(blockGeometry, blockMaterial);
scene.add(movableBlock);

// Position the movable block
movableBlock.position.set(0, 5, 110);

// Function to handle movement and collision detection
// Function to handle movement and collision detection
// Function to handle movement and collision detection
function handleKeyDown(event) {
    const moveDistance = 5; // Set the distance to move on each key press
    let collisionDetected = false;

    // Move the block based on the key pressed
    switch (event.keyCode) {
        case 37: // Left arrow key
            movableBlock.position.x -= moveDistance;
            break;
        case 38: // Up arrow key
            movableBlock.position.z -= moveDistance;
            break;
        case 39: // Right arrow key
            movableBlock.position.x += moveDistance;
            break;
        case 40: // Down arrow key
            movableBlock.position.z += moveDistance;
            break;
    }

    // Check for collision after movement
    if (checkCollision()) {
        // If collision is detected, set the position back to its previous state
        collisionDetected = true;
        switch (event.keyCode) {
            case 37: // Left arrow key
                movableBlock.position.x += moveDistance;
                break;
            case 38: // Up arrow key
                movableBlock.position.z += moveDistance;
                break;
            case 39: // Right arrow key
                movableBlock.position.x -= moveDistance;
                break;
            case 40: // Down arrow key
                movableBlock.position.z -= moveDistance;
                break;
        }
    }

    // If collision is detected, show an alert
    if (collisionDetected) {
        alert("Collision detected!");
    }
}


// Movement controls
document.addEventListener('keydown', handleKeyDown, false);


// Instantiate a renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500)
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// Add controls to the camera for rotation and zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;

// Movement controls
document.addEventListener('keydown', handleKeyDown, false);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Add a listener to resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();
