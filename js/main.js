var elem = document.getElementById('mainCanvas');
var two = new Two({
  width: $("#background").width(),
  height: $("#background").height()
}).appendTo(elem);

//////////////////////////
//START BASIC SHAPE CODE//
//////////////////////////

var circle = two.makeCircle(-70, 0, 50);
var rect = two.makeRectangle(70, 0, 100, 100);

circle.fill = '#FF8000';
rect.fill = 'rgba(0, 200, 255, 0.75)';

var curve = two.makeCurve(110, 100, 120, 50, 140, 150, 160, 50, 180, 150, 190, 100, true);
curve.linewidth = 2;
curve.scale = 1.75;
curve.rotation = Math.PI / 2; // Quarter-turn
curve.noFill();

var group = two.makeGroup(circle, rect);
group.translation.set(two.width / 2, two.height / 2);
//group.scale = 0;
group.noStroke();

var frame = 0;
two.bind('update', function(frameCount) {
    frame += 0.01;
    frame %= 120;
    
    rect.rotation += 0.1;
    group.rotation += 0.1;
    
    group.translation.x += Math.cos(frame) * 2;
    group.translation.y += Math.sin(frame) * 2;
}).play();

////////////////////////
//START PLANETARY CODE//
////////////////////////

var earthAngle = 0,
    moonAngle  = 0,
    distance   = 30,
    radius     = 50,
    padding    = 100,
    orbit      = 200,
    offset     = orbit + padding;

var pos = getPositions(earthAngle++, orbit),
    earth = two.makeCircle(pos.x + offset, pos.y + offset, radius);
 
earth.stroke = "#123456";
earth.linewidth = 4;
earth.fill = "#194878";
 
var pos = getPositions(moonAngle, radius + distance);
var moon = two.makeCircle(earth.translation.x + pos.x, earth.translation.y + pos.y, radius / 4);

moon.fill = "#474747";

two.bind("update", function (frameCount) {
    var pos = getPositions(earthAngle++, orbit);
    earth.translation.x = pos.x + offset;
    earth.translation.y = pos.y + offset;
    var moonPos = getPositions(moonAngle, radius + distance);
    moon.translation.x = earth.translation.x + moonPos.x;
    moon.translation.y = earth.translation.y + moonPos.y;
    moonAngle += -2
});
 
two.play();

function getPositions(angle, orbit) {
    return {
        x: Math.cos(angle * Math.PI / 180) * orbit,
        y: Math.sin(angle * Math.PI / 180) * orbit
    };
}
