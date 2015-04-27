let GLOBALS = require('./globals.js');

let scene, camera, renderer;
let geometry, material, mesh;

let boxes = [];
let boxWidth = 30;
let boxHeight = 30;
let boxDepth = 30;
let boxDistance = 15;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  // let backgroundGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  // let backgroundMaterial = new THREE.MeshBasicMaterial({color: 0x4a19dc});
  // let backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  // scene.add(backgroundMesh);

  geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
  material = new THREE.MeshBasicMaterial( { color: 0xf0ff50, wireframe: true } );

  for (let x of Number.range(8)) {
    for (let y of Number.range(8)) {
      for (let z of Number.range(8)) {
        let mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = (x * 220) - (4 * 220);
        mesh.position.y = (y * 220) - (4 * 220);
        mesh.position.z = (z * 220) - (4 * 220);
        scene.add(mesh);
        boxes.push(mesh);
      }
    }
  }


  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  $('body').append(renderer.domElement)
}

function animate() {

  requestAnimationFrame( animate );

  for (let [i, box] of boxes.enumerate()) {
    box.position.x += 0;
    box.position.y += 0;
  }
  renderer.render( scene, camera );

}

modules.exports = {
  boxes: boxes
}
