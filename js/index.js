import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('shapesIds');
  const selectElement = document.querySelector('.geometry');
  const btnElement = document.querySelector('.btn');
  

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
  let shape = null;
  let shapeType = null;
  let ids = [];
  
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  scene.add( directionalLight );
  directionalLight.position.set(5,5,5);
  

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

  const createShape = (shapeType) => {
    if(shapeType === 'cube') {
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      shape = new THREE.Mesh( geometry, material );
      shape.position.z = -15;
      console.dir('shape: ', shape);
      scene.add( shape );
      console.log('scene: ', scene);
    }
    if(shapeType === 'sphere') {
      const geometry = new THREE.SphereGeometry( 2, 32, 16 );
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      shape = new THREE.Mesh( geometry, material );
      
      shape.position.z = -15;
      shape.position.y = -5;
      shape.position.x = -5;
      scene.add( shape );
    }
    if(shapeType === 'pyramid') {
      const geometry = new THREE.ConeGeometry( 2, 5, 8 );
      const material = new THREE.MeshBasicMaterial( {color: 0xa1ff00} );
      shape = new THREE.Mesh( geometry, material );
      shape.position.z = -15;
      shape.position.y = +5;
      shape.position.x = 5;
      scene.add( shape );
    }
    shapeType && list.insertAdjacentHTML('beforeend', `<li>${shape?.uuid}  <button class="closeBtn" data-id=${shape?.uuid}>X</button></li>`);
    shapeType && ids.push(shape?.uuid);
  }

  selectElement.addEventListener('change', (e) => {
    shapeType = e.target.value;
  });

  btnElement.addEventListener('click', () => {
    createShape(shapeType);
    const closeElements = document.querySelectorAll('.closeBtn');
    closeElements.forEach(b => b.addEventListener('click', (e) => {
      const objectId = b.dataset.id;
      remove(objectId);
    }));
  });

  function remove (id) {
    let selectedObject = scene.children.find(c => c.uuid === id);
    selectedObject.removeFromParent();
    animate();
  }
  
  
  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
  }
  animate();
});