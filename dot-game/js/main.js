var $wrapper = $("#wrapper");
var elem = document.getElementById("mainCanvas");
var two = new Two({
  width: $wrapper.width(),
  height: $wrapper.height()
}).appendTo(elem);

//constants
var DOT_AMOUNT = 20;
var MAX_RADIUS = 8;
var LEFT_BORDER = $wrapper.width() - ($wrapper.width() * 0.9);
var RIGHT_BORDER = $wrapper.width() * 0.9;
var TOP_BORDER = $wrapper.height() - ($wrapper.height() * 0.9);
var BOTTOM_BORDER = $wrapper.height() * 0.9;

/**
 *Dot Class
 */
function Dot(x, y) {
  var radius = $wrapper.width() / 200;
  if(radius > MAX_RADIUS) radius = MAX_RADIUS;
  
  var dot = two.makeCircle(x, y, radius);

  dot.fill = '#FF8000';
  dot.stroke = 'orangered';
  dot.linewidth = 3;
  
  return dot
}

function checkDotPos(dots, newPos) {
  var nearOthers = false;
  for (var i = 0; i < dots.length; i++) {
    if (newPos.distanceTo(dots[i].translation) < (MAX_RADIUS * 10)) {
      nearOthers = true;
    }
  }
  return !nearOthers;
}

function createDots() {
  var dots = [];
  
  for (var i = 0; i < DOT_AMOUNT; i++) {
    var newPos = new Two.Vector(
      _.random(RIGHT_BORDER, LEFT_BORDER),
      _.random(TOP_BORDER, BOTTOM_BORDER)
    );
    if(checkDotPos(dots, newPos)) {
      dots.push(new Dot(newPos.x, newPos.y));
    }
  }
  
  return dots;
}

function main() {
  var dots = createDots();
}

/**
 *Until the next comment, everything is modified boilerplate from an example
 */
var x, y, line, mouse = new Two.Vector();

var drag = function(e) {
  x = e.clientX;
  y = e.clientY;
  if (!line) {
    var v1 = makePoint(mouse);
    var v2 = makePoint(x, y);
    line = two.makeCurve([v1, v2], true);
    line.noFill().stroke = '#e06d0f';
    line.linewidth = 10;
    _.each(line.vertices, function(v) {
      v.addSelf(line.translation);
    });
    line.translation.clear();
  } else {
    var v1 = makePoint(x, y);
    line.vertices.push(v1);
  }
  mouse.set(x, y);
};

var dragEnd = function(e) {
  $(window)
    .unbind('mousemove', drag)
    .unbind('mouseup', dragEnd);
};

var touchDrag = function(e) {
  e.preventDefault();
  var touch = e.originalEvent.changedTouches[0];
  drag({
    clientX: touch.pageX,
    clientY: touch.pageY
  });
  return false;
};

var touchEnd = function(e) {
  e.preventDefault();
  $(window)
    .unbind('touchmove', touchDrag)
    .unbind('touchend', touchEnd);
  return false;
};

function makePoint(x, y) {
  if (arguments.length <= 1) {
    y = x.y;
    x = x.x;
  }
  var v = new Two.Vector(x, y);

  return v;
}

//$("#mainCanvas")
//  .on('mousedown', function(e) {
//    mouse.set(e.clientX, e.clientY);
//    line = null;
//    $(window)
//      .on('mousemove', drag);
////      .on('mousedown', dragEnd);
//  })
//  .on('touchstart', function(e) {
//    e.preventDefault();
//    var touch = e.originalEvent.changedTouches[0];
//    mouse.set(touch.pageX, touch.pageY);
//    line = null;
//    $(window)
//      .on('touchmove', touchDrag)
//      .on('touchend', touchEnd);
//    return false;
//  });
/*    </boilerplate class="haha_html_jokes">    */

function startGame() {
  $("#mainCanvas")
    .on('mousedown', startLine)
    .on('touchdown', startLine);
}
var line;
function startLine(e) {
  e.preventDefault();
  line = two.makeCurve(e.clientX, e.clientY, true);
  line.stroke = "#e06d0f"
  line.noFill();
  line.linewidth = 10;
  $("#mainCanvas")
    .on('mousemove', updateLine);
//    .on('touchmove', updateLine);
}

function updateLine(e) {
  if(e) {
    e.preventDefault();
    var newMouse = new Two.Vector(e.clientX, e.clientY);
    line.vertices.push(newMouse);
  }
}
startGame();
main();
//new Dot(100, 100);
two.bind('update', function(frameCount) {
  
}).play();
