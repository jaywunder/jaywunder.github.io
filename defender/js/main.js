(function() {
  var Attacker, Defender, Entity, FRICTION, defender, onFrame, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FRICTION = 0.6;

  Entity = (function() {
    function Entity(size, x, y, vx, vy, ax, ay) {
      this.size = size;
      this.pos = new Point(x, y);
      this.v = new Point(vx, vy);
      this.a = new Point(ax, ay);
      this.alive = true;
      this.primaryColor = '#bab8b5';
    }

    Entity.prototype.makeBody = function() {
      return this.body = new Path.Circle({
        center: [this.pos.x, this.pos.y],
        radius: this.size,
        strokeColor: this.strokeColor
      });
    };

    Entity.prototype.update = function() {
      this.draw();
      return this.move();
    };

    Entity.prototype.draw = function() {};

    Entity.prototype.move = function() {};

    Entity.prototype.rotate = function() {};

    return Entity;

  })();

  Defender = (function(_super) {
    __extends(Defender, _super);

    function Defender(size, x, y, vx, vy, ax, ay) {
      Defender.__super__.constructor.call(this, size, x, y, vx, vy, ax, ay);
      this.armSize = 1.5;
      this.strokeWidth = this.size / 7;
      this.frame = 0;
      this.primaryColor = "#00b3ff";
      this.secondaryColor = "#23e96b";
      this.makeBody();
    }

    Defender.prototype.makeBody = function() {
      this.arm0 = new Path.Line({
        from: this.pos + this.size,
        to: this.pos + (this.size * this.armSize),
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      this.arm1 = new Path.Line({
        from: [this.pos.x + this.size, this.pos.y - this.size],
        to: [this.pos.x + (this.size * this.armSize), this.pos.y - (this.size * this.armSize)],
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      this.arm2 = new Path.Line({
        from: this.pos - this.size,
        to: this.pos + (this.size * this.armSize * -1),
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      this.arm3 = new Path.Line({
        from: [this.pos.x - this.size, this.pos.y + this.size],
        to: [this.pos.x - (this.size * this.armSize), this.pos.y + (this.size * this.armSize)],
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      this.outerCircle = new Path.Circle({
        center: this.pos,
        radius: this.size,
        strokeColor: this.primaryColor,
        strokeWidth: this.strokeWidth
      });
      this.innerCircle = new Path.Circle({
        center: this.pos,
        radius: 10,
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      return this.body = new Group([this.arm0, this.arm1, this.arm2, this.arm3, this.outerCircle, this.innerCircle]);
    };

    Defender.prototype.update = function() {
      this.draw();
      this.move();
      this.rotate(1);
      return this.innerCircle.radius += 20;
    };

    Defender.prototype.draw = function() {};

    Defender.prototype.move = function() {};

    Defender.prototype.rotate = function() {
      return this.body.rotate(1);
    };

    return Defender;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker(size, x, y, vx, vy, ax, ay) {
      Attacker.__super__.constructor.call(this, size, x, y, vx, vy, ax, ay);
      this.strokeColor = "#f24e3f";
      this.strokeWidth = this.size / 10;
      this.makeBody();
    }

    Attacker.prototype.makeBody = function() {
      this.body = new Path({
        segments: [
          new Segment({
            point: [this.pos.x + this.size, this.pos.y - this.size]
          }), new Segment({
            point: [this.pos.x - this.size, this.pos.y - this.size]
          }), new Segment({
            point: [this.pos.x, this.pos.y + this.size]
          })
        ],
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        closed: true
      });
      return console.log(this.body);
    };

    Attacker.prototype.update = function() {
      this.move();
      this.rotate();
      return this.keepInBounds();
    };

    Attacker.prototype.move = function() {
      this.v += this.a;
      this.pos += this.v;
      return this.body.position = this.pos;
    };

    Attacker.prototype.rotate = function() {
      var theta;
      theta = Math.atan(this.v.y / this.v.x) * (180 / Math.PI) - 90;
      if (this.v.x < 0) {
        theta += 180;
      }
      if (theta !== this.body.data.rotation) {
        this.body.rotation = theta;
      }
      return this.body.data.rotation = theta;
    };

    Attacker.prototype.keepInBounds = function() {
      if (this.pos.x > view.bounds.width + (this.size * 2)) {
        this.pos.x = -this.size * 1.5;
      }
      if (this.pos.y > view.bounds.height + (this.size * 2)) {
        this.pos.y = -this.size * 1.5;
      }
      if (this.pos.x < -this.size * 2) {
        this.pos.x = view.bounds.width + (this.size * 1.5);
      }
      if (this.pos.y < -this.size * 2) {
        return this.pos.y = view.bounds.height + (this.size * 1.5);
      }
    };

    return Attacker;

  })(Entity);

  defender = new Attacker(50, view.center.x, view.center.y, 5, -5, 0, 0);

  onFrame = function() {
    defender.update();
    return view.draw();
  };

  setInterval(onFrame, 10 / 6);

  console.log(view);

  path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
  });

}).call(this);
