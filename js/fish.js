var elem = document.getElementById('theOcean');
var two = new Two({
  width: $("#background").width(),
  height: $("#background").height()
}).appendTo(elem);

//ColorLuminance was not written by me, find it here:
//http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function Fish() {
  //define size variables
  var width = 50 / 3;
  var height = 150 / 3;
  
  var x = 0;
  var y = 0;
  
  var lineWidth = 2;
  
  //define speed variables
  var velocity = new Two.Vector(
    _.random(-6, 6),
    _.random(-6, 6)
  );
  var nextVelocity = new Two.Vector(
    velocity.x + _.random(-2, 2),
    velocity.y + _.random(-2, 2)
  );
  
  //define color variables
  var colorMain = randColor;//"#d58610";
  var colorSecondary = ColorLuminance(randColor, -0.35);//"#bc4509";
  
  //instantiate fish group
  var fish = this.fish = two.makeGroup();
  
//Make Head
  var head = this.head = two.makeEllipse(x, y, width, height);
  head.fill = colorMain;
  head.stroke = colorSecondary;
  head.linewidth = lineWidth * 2;
  fish.add(head);
  
  var tailPoints = makeTailAnchors();
  var tail = this.tail = two.makeCurve(tailPoints, true);
  tail.curved = false;
  tail.linewidth = lineWidth * 2;
  tail.stroke = colorSecondary;
  tail.fill = colorMain;
  fish.add(tail);
  
//Make Fins
  //Right
  var finRight = this.finRight = two.makeCurve(
    x + width - (width / 5), 
    y + width + height / 6,
    x + width + width,
    y + height / 6,
    x + width - (width / 5),
    y - width + height / 6,
    true
  );
  finRight.linewidth = lineWidth;
  finRight.fill = colorMain;
  finRight.stroke = colorSecondary;
  fish.add(finRight);
  
  //Left
  var finLeft = this.finLeft = two.makeCurve(
    x - width + (width / 5), 
    y + width  + height / 6,
    x - width - width,
    y + height / 6,
    x - width + (width / 5),
    y - width + height / 6,
    true
  );
  finLeft.curved = true;
  finLeft.linewidth = lineWidth
  finLeft.fill = colorMain;
  finLeft.stroke = colorSecondary;
  fish.add(finLeft);
  
//Private Functions
  function makeAnchor(x, y, cmd) {
    var anchor = new Two.Anchor(x, y, x, y, x, y, cmd);
    anchor.position = anchor.clone();
    anchor.target = anchor.clone();
    
    return anchor;
  }
  
  function moveToTarget(anchor) {
    anchor.translation.x += (anchor.target.x - anchor.translation.x) * 0.125;
    anchor.translation.y += (anchor.target.y - anchor.translation.y) * 0.125;
  }
  
  function makeTailAnchors() {
    var segmentAmount = height / 3;
    var points = [];
    
    var anchorX = x - width - lineWidth;
    var anchorY = y;
    
    for (var i = 1; i < segmentAmount; i++) {
      var nextX = anchorX + (width / segmentAmount * i);
      var nextY = anchorY + (height * 4 / segmentAmount * i);
      var anchor = makeAnchor(nextX, nextY, Two.Commands.moveto);
      
      points.push(anchor);
    }
    //middle point
//    points.push(new Two.Anchor(x, x, x, y, y, y, Two.Commands.moveto));
    
    var anchorX = x + width + (lineWidth);
    for (var i = segmentAmount; i > 1; i--) {
      var nextX = anchorX - (width / segmentAmount * i);
      var nextY = anchorY + (height * 4 / segmentAmount * i);
      var anchor = makeAnchor(nextX, nextY, Two.Commands.moveto);
      
      points.push(anchor);
    }
    
    return points;
  }
  
  function keepInWindow() {
    //regulate x coord
    if (fish.translation.x > two.width * 1.5) { //right
      fish.translation.x = 0
    } else if (fish.translation.x < two.width * -0.2) { //left
      fish.translation.x = two.width * 1.5
    }
    //regulate y coord
    if (fish.translation.y > two.height * 1.5) { //top
      fish.translation.y = -height * 2
    } else if (fish.translation.y < two.height * -1.5) { //bottom
      fish.translation.y = two.height * 2
    }
  }
  
  fish.center()
  
  function move() {
    fish.translation.x += velocity.x;
    fish.translation.y += velocity.y;
  }
  
//Public Functions
  var rotate = this.rotate = function() {
    var theta = Math.atan(velocity.y / velocity.x) + (Math.PI / 2);
    if (velocity.x < 0) theta += Math.PI;
    
    if (velocity.x < nextVelocity.x) velocity.x += 0.01;
    if (velocity.x > nextVelocity.x) velocity.x -= 0.01;
    if (velocity.y < nextVelocity.y) velocity.y += 0.01;
    if (velocity.y > nextVelocity.y) velocity.y -= 0.01;
    
    if (Math.round(velocity.x) == Math.round(nextVelocity.x)
      &&Math.round(velocity.y) == Math.round(nextVelocity.y)) {
      nextVelocity = new Two.Vector(
        velocity.x + _.random(-2, 2),
        velocity.y + _.random(-2, 2)
      );
    }
    
    fish.rotation = theta;
    var tailTheta = Math.atan((nextVelocity.y - velocity.y) / (nextVelocity.x - velocity.x));
    rotateTail(tailTheta);
  }
  
  function rotateTail(rawTheta) {
    var theta = Math.floor(rawTheta * 10);
    
    var l = tail.vertices.length;
    //left half of tail
    for (var i = 1; i < tail.vertices.length / 2; i++) {
      //get right and left vertices
      var v = tail.vertices[i];    //left
      var w = tail.vertices[l-i-1];//right
      if (frame == 1) {
        var c = two.makeCircle(100, 100, 10);
        c.fill = "#b32727"
      }
//      console.log(theta);
      v.target.x = (i * i / (theta / 3)) + v.position.x;
      w.target.x = (i * i / (theta / 3)) + w.position.x;
      
//      moveToTarget(v);
//      moveToTarget(w);
    }
  }
  
  function limitSpeed() {
    
  }
  
  $("#infoBox");
  this.update = function() {
//    $("#infoBox").text(velocity + "..." + nextVelocity)
    move();
    rotate();
    keepInWindow();
    limitSpeed();
    
//    $infoBox.text(velocity + "..." + nextVelocity);
  }
  
}

var fishAmount = 10;
var fishArray = [];
for(var i = 0; i < fishAmount; i++) {
  fishArray.push(new Fish());
}

two.bind('update', function(frameCount) {
  for(var i = 0; i < fishAmount; i++) {
    fishArray[i].update();
  }
}).play();








