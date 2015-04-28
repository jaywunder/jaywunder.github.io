let GLOBALS = require('./globals.js');

let scene, camera, renderer, controls;
let geometry, material, mesh;

let boxes = [];
let boxWidth = 30;
let boxHeight = 30;
let boxDepth = 30;
let boxPadding = 40;
let boxAmount = 8;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 1000;

  controls = new THREE.OrbitControls(camera)

  // let backgroundGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  // let backgroundMaterial = new THREE.MeshBasicMaterial({color: 0x4a19dc});
  // let backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  // scene.add(backgroundMesh);

  geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
  material = new THREE.MeshBasicMaterial( { color: 0xf0ff50, wireframe: false } );

  for (let x of Number.range(boxAmount)) {
    let row = [];
    for (let y of Number.range(boxAmount)) {
      let depth = [];
      for (let z of Number.range(boxAmount)) {
        //convert position into a color
        let color = `#${Math.floor(256 * (x / 9) - 1).toString(16)}` +
                    `${Math.floor(256 * (y / 9) - 1).toString(16)}` +
                    `${Math.floor(256 * (z / 9) - 1).toString(16)}`
        material = new THREE.MeshBasicMaterial( { color: color , wireframe: false } );
        let mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = (x * boxPadding) - ((boxAmount/2) * boxPadding);
        mesh.position.y = (y * boxPadding) - ((boxAmount/2) * boxPadding);
        mesh.position.z = (z * boxPadding) - ((boxAmount/2) * boxPadding);

        scene.add(mesh);
        depth.push(mesh);
      }
      row.push(depth);
    }
    boxes.push(row);
  }


  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  $('body').append(renderer.domElement)
}

function animate() {

  requestAnimationFrame( animate );

  for (let [i, box] of boxes.enumerate3D()) {
    // box.rotation.x += 0.05;
    box.rotation.y += 0.05;
  }
  renderer.render( scene, camera );
}

module.exports = {
  boxes: boxes
}
