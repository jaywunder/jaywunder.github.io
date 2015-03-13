var elem = document.getElementById('mainCanvas');
var two = new Two({
  width: $("#background").width(),
  height: $("#background").height()
}).appendTo(elem);

var mouse = new Two.Vector();
var delta = new Two.Vector();
var radius = 50;

var ball = two.makeCircle(two.width / 2, two.height / 2, radius);
ball.noStroke().fill = "#e9ab4d";

var curve = two.makeCurve(110, 100, 120, 50, 140, 150, 160, 50, 180, 150, 190, 100, true);
curve.linewidth = 2;
curve.scale = 1.75;
curve.rotation = Math.PI / 2; // Quarter-turn
curve.noFill();
curve.translation.x = (two.width / 2) ;//- curve.x;
curve.translation.y = (two.height / 2) ;//- curve.y;
var frame = 0;
two.bind('update', function(frameCount) {
  frame += 0.001;
  frame %= 120;
  _.each(curve.vertices, function (v, i) {
    v.x += Math.sin(_.random(-1, 1)) * 10;
    v.y += Math.sin(_.random(-1, 1)) * 10;
  });
  _.each(ball.vertices, function (v, i) {
    v.x += Math.sin(_.random(-1, 1)) * 10;
    v.y += Math.sin(_.random(-1, 1)) * 10;
  });
  curve.translation.x = (two.width / 2);
  curve.translation.y = (two.height / 2);
  ball.translation.x = (two.width / 2);
  ball.translation.y = (two.height / 2);
}).play();