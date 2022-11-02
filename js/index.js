import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { getColor } from './colorHelper.js';

window.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('shapesIds');
  const selectElement = document.querySelector('.geometry');
  const btnElement = document.querySelector('.btn');
  const inputElement = document.querySelector('.shapeSize');

  const helpersSize = 10;

  const scene = new THREE.Scene();
  const camera = new THREE
    .PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.set(1, 0.5, 1);
  let shape = null;
  let shapeType = null;
  const shapeCollection = [];
  let scaleNumber = 1;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.target.position.set(0, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  const controls = new OrbitControls(camera, renderer.domElement);
  // an animation loop is required when either damping or auto-rotation are enabled
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 15;
  controls.maxDistance = 500;

  const helper = new THREE.GridHelper(helpersSize, 10);
  helper.position.x = helpersSize / 2;
  helper.position.z = helpersSize / 2;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  const axesHelper = new THREE.AxesHelper(helpersSize);
  scene.add(axesHelper);

  function getRandomPosition(geom) {
    const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(getColor()) });
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.z = Math.round((Math.random() * (helpersSize - 1)));
    mesh.position.x = Math.round((Math.random() * (helpersSize - 1)));
    mesh.position.y = Math.round((Math.random() * helpersSize)) + 1;
    return mesh;
  }

  const createShape = (currShapeType) => {
    if (currShapeType === 'cube') {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      shape = getRandomPosition(geometry);
    }
    if (currShapeType === 'sphere') {
      const geometry = new THREE.SphereGeometry(0.5, 64, 32);
      shape = getRandomPosition(geometry);
    }
    if (currShapeType === 'pyramid') {
      const geometry = new THREE.ConeGeometry(1, 2, 4);
      shape = getRandomPosition(geometry);
    }

    shape && scene.add(shape);
    shape && shapeCollection.push(shape);
    currShapeType && list.insertAdjacentHTML('beforeend', `
      <li id=${shape?.uuid}>
        ${shape?.uuid}
        <button class="closeBtn" data-id=${shape?.uuid}>X</button>
      </li>`);
  };

  selectElement.addEventListener('change', (e) => {
    shapeType = e.target.value;
  });

  btnElement.addEventListener('click', () => {
    createShape(shapeType);
    const closeElements = document.querySelectorAll('.closeBtn');
    closeElements.forEach((b) => b.addEventListener('click', () => {
      const objectId = b.dataset.id;
      if (objectId) {
        remove(objectId);
        const item = document.getElementById(b.dataset.id);
        item?.remove();
      }
    }));
  });

  inputElement.addEventListener('change', (e) => {
    scaleNumber = e.target.value;
  });

  function remove(id) {
    const shapeIdx = shapeCollection.findIndex((s) => s.uuid === id);
    shapeIdx >= 0 && shapeCollection.splice(shapeIdx, 1);
    const selectedObject = scene.children.find((c) => c.uuid === id);
    if (selectedObject) {
      selectedObject.removeFromParent();
    }
  }

  function animate() {
    if (shapeCollection.length) {
      shapeCollection.forEach((item) => {
        item.scale.set(scaleNumber, scaleNumber, scaleNumber);
        item.rotation.y += 0.01;
        item.rotation.z += 0.01;
      });
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
