// Art 109 Three.js Picture + Text Demo

// This is the basic script before modification


import * as THREE from "../build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "../src/PointerLockControls.js";
// Extract globals from external script

// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  500 / 500,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

// Add a polygon to the scene
const geometry = new THREE.IcosahedronGeometry(2, 1);
const matLineBasic = new THREE.LineBasicMaterial( {
  color: 0xaa42f5,
  linewidth: 4
 } );
const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe, matLineBasic);
scene.add(line);


const texture2 = new THREE.TextureLoader().load( 'Assets/dino.png' );
// Immediately use the texture for material creation
const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
// Create plane geometry
const geometry2 = new THREE.PlaneGeometry( 48, 48 );
// Apply image texture to plane geometry
const plane = new THREE.Mesh( geometry2, material2 );
// Position plane geometry
plane.position.set(0 , 0 , -40);
// Place plane geometry
scene.add( plane );

const texture3 = new THREE.TextureLoader().load( 'Assets/donkey.png' );
// Immediately use the texture for material creation
const material3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } );
// Create plane geometry
const geometry3 = new THREE.PlaneGeometry( 48, 48 );
// Apply image texture to plane geometry
const donkey = new THREE.Mesh( geometry3, material3 );
// Position plane geometry
donkey.position.set(0 , 0 , -40);
// Place plane geometry
scene.add( donkey );




// Position our camera so we can see the shape
camera.position.z = 10;

// Add a directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(directionalLight);

// Add an ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambientLight);

// Define and then call the render loop
// Define
function render() {
  requestAnimationFrame(render);

  // Rotate our shape
  line.rotation.x += 0.005;
  line.rotation.y += 0.005;
  renderer.render(scene, camera);
}
// Call
render();
