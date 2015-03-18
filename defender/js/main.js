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
      this.strokeWidth = 6;
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
      this.circle = new Path.Circle({
        center: [this.pos.x, this.pos.y],
        radius: this.size,
        strokeColor: this.primaryColor,
        strokeWidth: this.strokeWidth
      });
      this.body = new Group([this.arm0, this.arm1, this.arm2, this.arm3, this.circle]);
      return this.body;
    };

    Defender.prototype.update = function() {
      this.draw();
      this.move();
      return this.rotate();
    };

    Defender.prototype.draw = function() {};

    Defender.prototype.move = function() {};

    Defender.prototype.rotate = function() {};

    return Defender;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker() {
      return Attacker.__super__.constructor.apply(this, arguments);
    }

    return Attacker;

  })(Entity);

  defender = new Defender(50, view.center.x, view.center.y, 0, 0, 0, 0);

  onFrame = function() {
    return console.log("wot, m8?");
  };

  path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
  });

}).call(this);
