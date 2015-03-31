(function() {
  var ATTACKER_SIZE, Attacker, DEFENDER_SIZE, Defender, Entity, FRICTION, Game, SPRING, TRACKING, game, onFrame,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FRICTION = 0.6;

  SPRING = 0.6;

  DEFENDER_SIZE = $(window).width() / 50;

  ATTACKER_SIZE = $(window).width() / 50;

  TRACKING = false;

  Entity = (function() {
    function Entity(size, x, y, vx, vy, ax, ay) {
      this.size = size;
      this.pos = new Point(x, y);
      this.v = new Point(vx, vy);
      this.alive = true;
      this.primaryColor = '#bab8b5';
      this.direction = new Path.Line({
        from: [this.pos.x, this.pos.y],
        to: [this.pos.x + (this.v.x * 10), this.pos.y + (this.v.y * 10)],
        strokeColor: '#ffffff',
        strokeWidth: 5
      });
    }

    Entity.prototype.updateDirection = function() {
      this.direction.segments[0] = new Segment({
        point: [this.pos.x, this.pos.y]
      });
      return this.direction.segments[1] = new Segment({
        point: [this.pos.x + (this.v.x * 10), this.pos.y + (this.v.y * 10)]
      });
    };

    Entity.prototype.makeBody = function() {
      return this.body = new Path.Circle({
        center: [this.pos.x, this.pos.y],
        radius: this.size,
        strokeColor: this.strokeColor
      });
    };

    Entity.prototype.update = function() {
      this.move();
      return this.rotate();
    };

    Entity.prototype.move = function() {};

    Entity.prototype.rotate = function() {};

    return Entity;

  })();

  Defender = (function(_super) {
    __extends(Defender, _super);

    function Defender(size, x, y) {
      Defender.__super__.constructor.call(this, size, x, y, 0, 0, 0, 0);
      this.name = "defender";
      this.armSize = 1.5;
      this.strokeWidth = this.size / 7;
      this.primaryColor = "#00b3ff";
      this.secondaryColor = "#23e96b";
      this.maxVelocity = 5;
      this.accel = 3;
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
        radius: this.size * 0.6,
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      return this.body = new Group([this.arm0, this.arm1, this.arm2, this.arm3, this.outerCircle, this.innerCircle]);
    };

    Defender.prototype.update = function() {
      this.move();
      this.rotate();
      this.updateDirection();
      return this.innerCircle.radius += 20;
    };

    Defender.prototype.move = function() {
      this.pos += this.v;
      return this.body.position = this.pos;
    };

    Defender.prototype.keyBoard = function(e) {
      if (e.type === 'keydown') {
        return this.keyDown(e);
      }
    };

    Defender.prototype.keyDown = function(e) {
      var key;
      key = e.which;
      if (Key.isDown("a") || Key.isDown("left")) {
        if (this.v.x > -this.maxVelocity) {
          this.v.x -= this.accel;
        }
      }
      if (Key.isDown("w") || Key.isDown("up")) {
        if (this.v.y > -this.maxVelocity) {
          this.v.y -= this.accel;
        }
      }
      if (Key.isDown("d") || Key.isDown("right")) {
        if (this.v.x < this.maxVelocity) {
          this.v.x += this.accel;
        }
      }
      if (Key.isDown("s") || Key.isDown("down")) {
        if (this.v.y < this.maxVelocity) {
          this.v.y += this.accel;
        }
      }
      if (key === 32) {
        return this.v = new Point(0, 0);
      }
    };

    Defender.prototype.keyUp = function(e) {};

    Defender.prototype.rotate = function() {
      return this.body.rotate(0.6);
    };

    return Defender;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker(size, x, y, target) {
      Attacker.__super__.constructor.call(this, size, x, y, _.random(-5, 5), _.random(-5, 5), 0, 0);
      this.rotation = 0;
      this.target = target;
      this.name = "attacker";
      this.maxVelocity = 10;
      this.strokeWidth = this.size / 10;
      this.primaryColor = "#f24e3f";
      this.accel = 0.1;
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
        strokeColor: this.primaryColor,
        strokeWidth: this.strokeWidth,
        closed: true
      });
      return console.log(this.body);
    };

    Attacker.prototype.update = function() {
      this.trackTarget();
      this.move();
      return this.updateDirection();
    };

    Attacker.prototype.trackTarget = function() {
      if (this.target.pos.x <= this.pos.x) {
        this.v.x -= this.accel;
      }
      if (this.target.pos.y <= this.pos.y) {
        this.v.y -= this.accel;
      }
      if (this.target.pos.x > this.pos.x) {
        this.v.x += this.accel;
      }
      if (this.target.pos.y > this.pos.y) {
        return this.v.y += this.accel;
      }
    };

    Attacker.prototype.move = function() {
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

    return Attacker;

  })(Entity);

  Game = (function() {
    function Game() {
      this.entities = [];
      this.difficulty = 1;
      this.attackerAmount = Math.floor(this.difficulty * 3);
      this.makeEntities();
    }

    Game.prototype.makeEntities = function() {
      var def, i, _i, _ref;
      def = new Defender(DEFENDER_SIZE, view.center.x, view.center.y);
      $(window).on('keydown', function(e) {
        return def.keyBoard(e);
      }).on('keyup', function(e) {
        return def.keyBoard(e);
      });
      this.entities.push(def);
      for (i = _i = 0, _ref = this.attackerAmount; _i <= _ref; i = _i += 1) {
        this.entities.push(new Attacker(ATTACKER_SIZE, view.center.x, view.center.y, def));
      }
      return console.log(this.entities);
    };

    Game.prototype.mainloop = function() {
      this.updateEntities();
      this.keepInBounds();
      return view.draw();
    };

    Game.prototype.updateEntities = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        _results.push(entity.update());
      }
      return _results;
    };

    Game.prototype.collide = function(e1, e2) {
      var vi1, vi2;
      vi1 = e1.v;
      vi2 = e2.v;
      e1.v += vi2 / 30;
      return e2.v += vi1 / 30;
    };

    Game.prototype.checkCollisions = function(index) {
      var e, _i, _ref, _ref1;
      if (index == null) {
        index = 0;
      }
      for (e = _i = _ref = index + 1, _ref1 = this.entities.length; _i < _ref1; e = _i += 1) {
        if (this.entities[index].pos.getDistance(this.entities[e].pos) <= this.entities[index].size + this.entities[e].size) {
          this.collide(this.entities[index], this.entities[e]);
        }
      }
      if (index + 1 < this.entities.length) {
        return this.checkCollisions(index + 1);
      }
    };

    Game.prototype.keepInBounds = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (entity.pos.x < entity.size) {
          entity.v *= new Point(-SPRING, SPRING);
          entity.pos.x = entity.size;
        }
        if (entity.pos.y < entity.size) {
          entity.v *= new Point(SPRING, -SPRING);
          entity.pos.y = entity.size;
        }
        if (entity.pos.x > view.bounds.width - entity.size) {
          entity.v *= new Point(-SPRING, SPRING);
          entity.pos.x = view.bounds.width - entity.size;
        }
        if (entity.pos.y > view.bounds.height - entity.size) {
          entity.v *= new Point(SPRING, -SPRING);
          _results.push(entity.pos.y = view.bounds.height - entity.size);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Game;

  })();

  game = new Game();

  onFrame = function() {
    return game.mainloop();
  };

  setInterval(onFrame, 16);

}).call(this);
