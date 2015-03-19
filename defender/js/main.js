(function() {
  var ATTACKER_SIZE, Attacker, DEFENDER_SIZE, Defender, Entity, FRICTION, Game, game, onFrame, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FRICTION = 0.6;

  DEFENDER_SIZE = $(window).width() / 25;

  ATTACKER_SIZE = $(window).width() / 25;

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
      this.armSize = 1.5;
      this.strokeWidth = this.size / 7;
      this.frame = 0;
      this.primaryColor = "#00b3ff";
      this.secondaryColor = "#23e96b";
      this.maxVelocity = 2;
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
      return this.innerCircle.radius += 20;
    };

    Defender.prototype.move = function() {
      this.v += this.a;
      this.pos += this.v;
      this.keepInBounds();
      return this.body.position = this.pos;
    };

    Defender.prototype.keyBoard = function(e) {
      var accel, key;
      accel = 0.5;
      key = e.keyCode;
      if (key === 97) {
        if (this.v.x > -this.maxVelocity) {
          this.v.x -= accel;
        }
      }
      if (key === 119) {
        if (this.v.y > -this.maxVelocity) {
          this.v.y -= accel;
        }
      }
      if (key === 100) {
        if (this.v.x < this.maxVelocity) {
          this.v.x += accel;
        }
      }
      if (key === 115) {
        if (this.v.y < this.maxVelocity) {
          this.v.y += accel;
        }
      }
      if (key === 32) {
        return console.log("space");
      }
    };

    Defender.prototype.isInBounds = function() {
      return true;
    };

    Defender.prototype.keepInBounds = function() {
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

    Defender.prototype.rotate = function() {
      return this.body.rotate(0.6);
    };

    return Defender;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker(size, x, y, target) {
      Attacker.__super__.constructor.call(this, size, x, y, 0, 0, 0, 0);
      this.target = target;
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

    Attacker.prototype.trackDefender = function() {
      if (this.target.pos.x < this.pos.x) {
        this.v.x -= this.a.x;
      }
      if (this.target.pos.y < this.pos.y) {
        this.v.y -= this.a.y;
      }
      if (this.target.pos.x > this.pos.x) {
        this.v.x += this.a.x;
      }
      if (this.target.pos.y > this.pos.y) {
        return this.v.x += this.a.y;
      }
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

  Game = (function() {
    function Game() {
      this.entities = [];
      this.difficulty = 1;
      this.attackerAmount = Math.floor(this.difficulty * 3);
      this.makeEntities();
    }

    Game.prototype.makeEntities = function() {
      var def, i, _i, _ref, _results;
      def = new Defender(DEFENDER_SIZE, view.center.x, view.center.y);
      $(window).on('keypress', function(e) {
        def.keyBoard(e);
        return console.log(e);
      });
      this.entities.push(def);
      _results = [];
      for (i = _i = 0, _ref = this.attackerAmount; _i < _ref; i = _i += 1) {
        _results.push(this.entities.push(new Attacker(ATTACKER_SIZE, view.center.x, view.center.y)));
      }
      return _results;
    };

    Game.prototype.mainloop = function() {
      return this.updateEntities();
    };

    Game.prototype.updateEntities = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        console.log(entity);
        _results.push(entity.update());
      }
      return _results;
    };

    Game.prototype.collideEntities = function(index) {
      var e, _i, _ref;
      for (e = _i = index, _ref = this.entities.length; _i < _ref; e = _i += 1) {
        console.log(this.entities[e]);
      }
      return collideEntities(index + 1);
    };

    return Game;

  })();

  game = new Game();

  onFrame = function() {
    game.mainloop();
    return view.draw();
  };

  setInterval(onFrame, 10 / 6);

  path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
  });

}).call(this);
