(function() {
  var Attacker, Defender, Entity, FRICTION,
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
      this.makeSelf();
    }

    Entity.prototype.makeSelf = function() {
      var body;
      return body = new Rectangle({
        size: [this.size, this.size],
        center: [this.pos.x, this.pos.y]
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

    Defender.prototype.makeSelf = function() {};

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

    function Attacker(size, x, y, vx, vy, ax, ay) {
      Attacker.__super__.constructor.call(this, size, x, y, vx, vy, ax, ay);
    }

    Attacker.prototype.update = function() {
      this.draw;
      return this.move;
    };

    Attacker.prototype.draw = function() {};

    Attacker.prototype.move = function() {
      this.x += this.vx;
      return this.y += this.vy;
    };

    return Attacker;

  })(Entity);

  new Entity(10, 0, 0, 0, 0, 0, 0);

}).call(this);
