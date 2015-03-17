
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

var $ocean = $("#mainCanvas");

function Fish() {
    //define size variables
    var width = 50 / 3;
    var height = 120 / 3;

    var tailFactor = 5;

    var x = view.center.x;
    var y = view.center.y;

    var lineWidth = 4;

    //gotta go fast. sanic speed!
    var velocity = new Point(
        _.random(-6, 6),
        _.random(-6, 6)
    );
    var targetVelocity = new Point(
        velocity.x + _.random(-2, 2),
        velocity.y + _.random(-2, 2)
    )

    //colors
    var colorPrimary = randColor;//"#d58610";
    var colorSecondary = ColorLuminance(randColor, -0.35);//"#bc4509";

    //Shaping fish
    var head = new Path.Ellipse({
        center: new Point(x, y),
        radius: [width, height],
        fillColor: colorPrimary,
        strokeColor: colorSecondary,
        strokeWidth: lineWidth
    })

    var tail = new Path({
        segments: [
            new Segment({
                point: [x + width, y],
                handleOut: [-(width / 2), height * (tailFactor / 2)]
            }),
            new Segment({
                point: [x, y + (height * tailFactor)],
            }),
            new Segment({
                point: [x - width, y],
                handleOut: [(width / 2), height * (tailFactor / 2)]
            })
        ],
        fillColor: colorPrimary,
        strokeColor: colorSecondary,
        strokeWidth: lineWidth
    })

    var finLeft = new Path({
        segments: [
            new Segment({
                point: [x + (width * 0.8), y],
                handleOut: [width * 2.5, height / 2]
            }),
            new Segment({
                point: [x + (width / 1.6), y + (height)]
            })
        ],
        fillColor: colorPrimary,
        strokeColor: colorSecondary,
        strokeWidth: lineWidth
    });

    var finRight = new Path({
        segments: [
            new Segment({
                point: [x - (width * 0.8), y],
                handleOut: [-width * 2.5, height / 2]
            }),
            new Segment({
                point: [x - (width / 1.6), y + (height)]
            })
        ],
        fillColor: colorPrimary,
        strokeColor: colorSecondary,
        strokeWidth: lineWidth
    });

    var fish = new Group([head, tail, finLeft, finRight])
    fish.data.rotation = 0;

    function move() {

        //move the velocity to the taget velocity
        if (velocity.x < targetVelocity.x) velocity.x += 0.01;
        if (velocity.x > targetVelocity.x) velocity.x -= 0.01;
        if (velocity.y < targetVelocity.y) velocity.y += 0.01;
        if (velocity.y > targetVelocity.y) velocity.y -= 0.01;

        //check if the fish has reached the target velocity
        if (Math.round(velocity.x) == Math.round(targetVelocity.x) &&
            Math.round(velocity.y) == Math.round(targetVelocity.y)) {
            //if it has reached the target, make a new target
            targetVelocity = new Point(
                velocity.x + _.random(-2, 2),
                velocity.y + _.random(-2, 2)
            );
        }

        //this will actually move the fish
        fish.position += velocity
    }

    fish.data.rotation = 0;
    function rotate() {

        console.log(fish.id + ": " + fish.data.rotation);
        var theta = Math.atan(velocity.y / velocity.x) * (180 / Math.PI);

//        if (velocity.x < 0) theta += 180;
        if (Math.floor(fish.data.rotation) != Math.floor(theta)) {
            fish.rotation = theta;
            fish.data.rotation = theta;
            console.log(fish.id + " rotated")
        }
        console.log(fish.id + ": " + theta);

        return theta;
    }

    function keepInBounds() {

        if (fish.position.x < -height * 5) fish.position.x = $ocean.width() + (height * 5);
        if (fish.position.y < -height * 5) fish.position.y = $ocean.height() + (height * 5);
        if (fish.position.x > $ocean.width() + height * 5) fish.position.x = -height * 5;
        if (fish.position.y > $ocean.height() + height * 5) fish.position.y = -height * 5;
    }

    this.update = function() {
        move();
        rotate();
        keepInBounds()
    }
}

var fishAmount = 1;
var fishes = [];
for (var i = 0; i < fishAmount; i++) {
    fishes.push(new Fish());
}

function onFrame() {
    for (var i = 0; i < fishAmount; i++) {
        fishes[i].update();
    }
}

function onMouseDown() {

}


$(window).on("keydown", function() {
	console.log("hey there")
});
