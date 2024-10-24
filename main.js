import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world.js";
import Stats from "three/examples/jsm/libs/stats.module";
import { createGui } from "./lilgui.js";
import { threshold } from "three/webgpu";

//stats setup
const stats = new Stats();
document.body.appendChild(stats.dom);

//camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(45, 45, 45);
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb);
document.getElementById("canvas").appendChild(renderer.domElement);

//controloorbits setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();
controls.enableDamping = true;
controls.dampingFactor = 0.15;

//scene setup
const scene = new THREE.Scene();
const world = new World();
world.generateWorld();
scene.add(world);

//lights setup
const setlights = () => {
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, 0.5);
  scene.add(light2);

  const light3 = new THREE.AmbientLight();
  light3.intensity = 0.1;
  scene.add(light3);
};

//responsiveness
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  stats.update();
  controls.update();
  renderer.render(scene, camera);
}

setlights();
createGui(world);
animate();
