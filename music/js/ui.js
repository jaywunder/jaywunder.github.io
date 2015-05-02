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
  //make a scene
  scene = new THREE.Scene({background: 0xf0ff50});
  //fov, apect ratio, near, far
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1500 );
  camera.position.z = 1000;

  controls = new THREE.OrbitControls(camera);

  let light = new THREE.AmbientLight(0xffdd00); // soft white light, that doesn't work
  scene.add(light);

  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  let notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let octaves = [1, 2, 3, 4, 5 , 6, 7, 8];
  let times = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

  for (let x of Number.range(boxAmount)) {
    let row = [];
    for (let y of Number.range(boxAmount)) {
      let depth = [];
      for (let z of Number.range(boxAmount)) {
        //convert position into a color
        let color = `#${Math.floor(255 * ((x + 1) / 9)).toString(16)}` +
                     `${Math.floor(255 * ((y + 1) / 9)).toString(16)}` +
                     `${Math.floor(255 * ((z + 1) / 9)).toString(16)}`;
        material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
        let mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = (x * boxPadding) - ((boxAmount/2) * boxPadding);
        mesh.position.y = (y * boxPadding) - ((boxAmount/2) * boxPadding);
        mesh.position.z = (z * boxPadding) - ((boxAmount/2) * boxPadding);
        mesh.info = {
          note: notes[x],
          octave: octaves[y],
          time: times[z]
        };

        depth.push(mesh);
      }
      row.push(depth);
    }
    boxes.push(row);
  }


  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  $('body').append(renderer.domElement);
}
let frame = 0;
let currentBox = 0;
function animate() {
  frame += 0.005;
  requestAnimationFrame(animate);

  for (let [i, box] of boxes.enumerate3D()) {

  }
  boxes[0][0][0].material.color = 0x000;

  camera.position.x = Math.cos(frame) * 700;
  camera.position.z = Math.sin(frame) * 700;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render( scene, camera );
}

module.exports = {
  boxes: boxes,
  scene: scene,
  camera: camera,
  renderer: renderer,
  controls: controls
};
