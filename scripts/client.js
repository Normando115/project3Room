// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core

// 2 for shower
// 3 for toilet
//4 for open door
// 5 for Window
//6 for person wakes up
// press 1 to make water faceut spit water
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "./src/PointerLockControls.js";
import {
  FontLoader
} from "./src/FontLoader.js"
import {
  GLTFLoader
} from "./src/GLTFLoader.js";

// Establish variables
let camera, scene, renderer, controls, material, mixer, action;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

// const geometry4 = new THREE.IcosahadedronGeometry(2,1);
// const matLineBasic = new THREE.LineBasicMaterial( {
//   color: 0xaa42f5,
//   linewidth: 4
// });
// const wireframe= new THREE.WireframeGeometry(geometry4)
// const line = new THREE.LineSegments(wireframe, matLineBasic);
// lne.position.set (0,10,0);
// scene.add( plane);

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);


  // First Image (red and purple glitch map)
  // Load image as texture
  const texture = new THREE.TextureLoader().load( 'assets/poster1.jpg' );
  // Immediately use the texture for material creation
  const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry = new THREE.PlaneGeometry( 42, 36 );
  // Apply image texture to plane geometry
  const plane = new THREE.Mesh( geometry, material );
  // Position plane geometry
  plane.position.set(80 , 60 , -178);
  // Place plane geometry
  scene.add( plane );

  // Second Image (Text with image and white background)
  // Load image as texture
  const texture2 = new THREE.TextureLoader().load( 'assets/poster2.jpg' );
  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry2 = new THREE.PlaneGeometry( 30, 30 );
  // Apply image texture to plane geometry
  const plane2 = new THREE.Mesh( geometry2, material2 );
  // Position plane geometry
  plane2.position.set(-85 , 50 , -100);
    plane2.rotation.set(0 , 67.51 , 0);
  // Place plane geometry
  scene.add( plane2 );

  const texture3 = new THREE.TextureLoader().load( 'assets/poster3.jpg' );
  // immediately use the texture for material creation
  const material3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry3 = new THREE.PlaneGeometry( 45, 35 );
  // Apply image texture to plane geometry
  const plane3 = new THREE.Mesh( geometry3, material3 );
  // Position plane geometry
  plane3.position.set(-85 , 70 , -140);
    plane3.rotation.set(0 , 67.51 , 0);
  // Place plane geometry
  scene.add( plane3 );

    const texture4 = new THREE.TextureLoader().load( 'assets/poster4.jpg' );
    // immediately use the texture for material creation
    const material4 = new THREE.MeshBasicMaterial( { map: texture4, side: THREE.DoubleSide } );
    // Create plane geometry
    const geometry4 = new THREE.PlaneGeometry( 30, 30 );
    // Apply image texture to plane geometry
    const plane4 = new THREE.Mesh( geometry4, material4 );
    // Position plane geometry
    plane4.position.set(-85 , 70 , -20);
      plane4.rotation.set(0 , 67.51 , 0);
    // Place plane geometry
    scene.add( plane4 );

        const texture5 = new THREE.TextureLoader().load( 'assets/poster5.jpg' );
        // immediately use the texture for material creation
        const material5 = new THREE.MeshBasicMaterial( { map: texture5, side: THREE.DoubleSide } );
        // Create plane geometry
        const geometry5 = new THREE.PlaneGeometry( 20, 30 );
        // Apply image texture to plane geometry
        const plane5 = new THREE.Mesh( geometry5, material5 );
        // Position plane geometry
        plane5.position.set(-85 , 35 , -40);
          plane5.rotation.set(0 , 67.51 , 0);
        // Place plane geometry
        scene.add( plane5 );
let mesh1;
  // Load preanimated model, add material, and add it to the scene
const loader = new GLTFLoader();
loader.load(
  "./assets/room.glb",
	function ( gltf ) {
mesh1 = gltf.scene;
mesh1.scale.set(20,20,20);
mesh1.position.set(-90,2 ,120);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh1 );
  },
)
let mesh2;
  // Load preanimated model, add material, and add it to the scene
const loader2 = new GLTFLoader();
loader2.load(
  "./assets/bed.glb",
	function ( gltf ) {
mesh2 = gltf.scene;
mesh2.scale.set(4,6,8);
mesh2.position.set(60,0 ,-160);
mesh2.rotation.set(0,124.1,0)
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh2 );
  },
)
let mesh3;
  // Load preanimated model, add material, and add it to the scene
const loader3 = new GLTFLoader();
loader3.load(
  "./assets/bed.glb",
	function ( gltf ) {
mesh3 = gltf.scene;
mesh3.scale.set(4,6,8);
mesh3.position.set(-30,0 ,23);
mesh3.rotation.set(0,14.1,0)
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh3 );
  },
)
let mesh4;
  // Load preanimated model, add material, and add it to the scene
const loader4 = new GLTFLoader();
loader4.load(
  "./assets/chair.glb",
	function ( gltf ) {
mesh4 = gltf.scene;
mesh4.scale.set(3,2,3);
mesh4.position.set(88,0 ,-105);
mesh4.rotation.set(0,121,0);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh4 );
  },
)

let mesh5;
  // Load preanimated model, add material, and add it to the scene
const loader5 = new GLTFLoader();
loader5.load(
  "../../assets/table.glb",
	function ( gltf ) {
mesh5 = gltf.scene;
mesh5.scale.set(4,4,4);
mesh5.position.set(90,0 ,-127);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh5 );
  },
)

let mesh6;
  // Load preanimated model, add material, and add it to the scene
const loader6 = new GLTFLoader();
loader6.load(
  "./assets/light.glb",
	function ( gltf ) {
mesh6 = gltf.scene;
mesh6.scale.set(2,2,2);
mesh6.position.set(78,18 ,-140);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh6 );
  },
)

let mesh7;
  // Load preanimated model, add material, and add it to the scene
const loader7 = new GLTFLoader();
loader7.load(
  "./assets/tablet.glb",
	function ( gltf ) {
mesh7 = gltf.scene;
mesh7.scale.set(5,5,5);
mesh7.position.set(0,0 ,0);
mesh7.rotation.set(0,11,0);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh7 );
  },
)

let mesh8;
  // Load preanimated model, add material, and add it to the scene
const loader8 = new GLTFLoader();
loader8.load(
  "../../assets/monitor.glb",
	function ( gltf ) {
mesh8 = gltf.scene;
mesh8.scale.set(2,2,2);
mesh8.position.set(90,18 ,-120);
mesh8.rotation.set(0,15.5,0);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh8 );
  },
)

let mesh9;
  // Load preanimated model, add material, and add it to the scene
const loader9 = new GLTFLoader();
loader9.load(
  "../../assets/food.glb",
	function ( gltf ) {
mesh9 = gltf.scene;
mesh9.scale.set(2,2,2);
mesh9.position.set(-100,5 ,-50);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		scene.add( mesh9 );
  },
)

// let mesh10;
//   // Load preanimated model, add material, and add it to the scene
// const loader10 = new GLTFLoader();
// loader10.load(
//   "../../assets.box2.glb",
// 	function ( gltf ) {
// mesh10 = gltf.scene;
// mesh10.scale.set(2,2,2);
// mesh10.position.set(-100,0 ,-50);
// 		gltf.animations; // Array<THREE.AnimationClip>
// 		gltf.scene; // THREE.Group
// 		gltf.scenes; // Array<THREE.Group>
// 		gltf.cameras; // Array<THREE.Camera>
// 		gltf.asset; // Object
// 		scene.add( mesh10 );
//   },
// )

         // Add Text under models
         const loader71 = new FontLoader();
                loader71.load( '../../assets/helvetiker_regular.typeface.json', function ( font ) {
                  // Define font color
                  const color = 0x2E5999;
                  // Define font material
                  const matDark = new THREE.LineBasicMaterial( {
                    color: color,
                    side: THREE.DoubleSide
                  } );

                });

  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
