import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('shapesIds');
  const selectElement = document.querySelector('.geometry');
  const btnElement = document.querySelector('.btn');
  const inputElement = document.querySelector('.shapeSize');

  

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
  let shape = null;
  let shapeType = null;
  let shapeCollection = [];
  let ids = [];
  let scaleNumber = 1;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const directionalLight = new THREE.DirectionalLight( 0xd1d5db, 0.5 );
  directionalLight.position.set(0, 10, 0);
  directionalLight.castShadow = true;
  scene.add( directionalLight );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();
  controls.addEventListener('change', renderer.render( scene, camera ));

  const createShape = (shapeType) => {
    if(shapeType === 'cube') {
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      shape = new THREE.Mesh( geometry, material );
      shape.position.z = -15;     
      scene.add( shape );
      shapeCollection.push(shape);
    }
    if(shapeType === 'sphere') {
      const geometry = new THREE.SphereGeometry( 2, 64, 48 );
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      shape = new THREE.Mesh( geometry, material );      
      shape.position.z = -15;
      shape.position.y = -5;
      shape.position.x = -5;
      scene.add( shape );
      shapeCollection.push(shape);
    }
    if(shapeType === 'pyramid') {
      const geometry = new THREE.ConeGeometry( 2, 5, 8 );
      const material = new THREE.MeshBasicMaterial( {color: 0xa1ff00} );
      shape = new THREE.Mesh( geometry, material );
      shape.position.z = -15;
      shape.position.y = +5;
      shape.position.x = 5;
      scene.add( shape );
      shapeCollection.push(shape);
    }
    shapeType && list.insertAdjacentHTML('beforeend', `<li id=${shape?.uuid}>${shape?.uuid}  <button class="closeBtn" data-id=${shape?.uuid}>X</button></li>`);
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
      if(objectId) {
        remove(objectId);
        const item = document.getElementById(b.dataset.id);
        item.remove();
      }
    }));
  });

  inputElement.addEventListener('change', (e) => {
    scaleNumber = e.target.value
  })

  function remove (id) {
    let selectedObject = scene.children.find(c => c.uuid === id);
    if(selectedObject) {
      selectedObject.removeFromParent();
      animate();
    }    
  }
  
  function animate() {
    if(shapeCollection.length) {
      shapeCollection.forEach(item => {
        item.scale.set(scaleNumber,scaleNumber,scaleNumber);
        item.rotation.y += 0.01;
        item.rotation.z += 0.01;
      })      
    }
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
  }
  animate();
});