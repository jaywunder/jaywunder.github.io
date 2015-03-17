(function() {
  var Attacker, Defender, Entity, FRICTION, e, onFrame, path,
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
      this.strokeColor = '#bab8b5';
      this.makeBody();
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

    return Entity;

  })();

  Defender = (function(_super) {
    __extends(Defender, _super);

    function Defender(size, x, y, vx, vy, ax, ay) {
      Defender.__super__.constructor.call(this, size, x, y, vx, vy, ax, ay);
    }

    Defender.prototype.body = null;

    Defender.prototype.update = function() {
      this.draw;
      return this.move;
    };

    Defender.prototype.draw = function() {};

    Defender.prototype.move = function() {};

    return Defender;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker() {
      return Attacker.__super__.constructor.apply(this, arguments);
    }

    return Attacker;

  })(Entity);

  e = new Attacker(50, 0, 0, 0, 0, 0, 0);

  onFrame = function() {
    return console.log("wot, m8?");
  };

  path = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'white'
  });

}).call(this);
