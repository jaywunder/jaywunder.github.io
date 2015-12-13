var scene = new THREE.Scene({
  backgroundColor: 0xffffff,
  ambientLightColor: 0xffffff,
});
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

areaLight1 = new THREE.AreaLight( 0xffffff, 1 );
areaLight1.position.set( 0.0001, 10.0001, -18.5001 );
areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 );
areaLight1.width = 10;
areaLight1.height = 1;

scene.add( areaLight1 );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
var controls = new THREE.OrbitControls( camera );
scene.add( cube );
camera.position.z = 5;

var amount = 10;
var boxes = [];
for (var i = 0; i < amount; i++) {
  var boxRow = [];
  for (var j = 0; j < amount; j++) {
    var geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
    var material = new THREE.MeshBasicMaterial({
      color: 0x2194ce,
      vertexColors: THREE.VertexColors,
    });
    var box = new THREE.Mesh( geometry, material );

    box.position.x += i * 0.4;
    box.position.y += j * 0.4;

    boxRow.push(box);
    scene.add(box);
  }
  boxes.push(boxRow);
}

var frame = 0;
var render = function () {
  frame += 0.01;
  frame %= 120;
  requestAnimationFrame(render);

  for (var i = 0; i < amount; i++) {
    for (var j = 0; j < amount; j++) {
      boxes[i][j].position.z += Math.cos(frame) * i / 1000;
      boxes[i][j].position.z += Math.cos(frame) * j / 1000;
      boxes[i][j].rotation.z += 0.1;
      boxes[i][j].rotation.x += 0.1;
    }
  }

  cube.rotation.x += 0.1;
  cube.rotation.y -= 0.1;
  cube.rotation.z += 0.1;
  cube.position.x = Math.cos(frame);

  controls.update();
  renderer.render( scene, camera );
};

render();
