(function() {
  var ATTACKER_SIZE, Attacker, DEFENDER_SIZE, Defender, Entity, FRICTION, Game, LASER_SIZE, Laser, SPRING, TRACKING, game, mainloop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
  };

  FRICTION = 0.6;

  SPRING = 0.6;

  DEFENDER_SIZE = $(window).width() / 50;

  ATTACKER_SIZE = $(window).width() / 50;

  LASER_SIZE = $(window).width() / 60;

  TRACKING = false;

  Entity = (function() {
    function Entity(size, x, y, vx, vy) {
      this.size = size;
      this.pos = new Point(x, y);
      this.v = new Point(vx, vy);
      this.alive = true;
      this.primaryColor = '#bab8b5';
    }

    Entity.prototype.updateDirection = function() {};

    Entity.prototype.makeBody = function() {
      return this.body = new Path.Circle({
        center: [this.pos.x, this.pos.y],
        radius: this.size,
        strokeColor: this.strokeColor
      });
    };

    Entity.prototype.limitVelocity = function() {
      if (v.x > this.maxVelocity) {
        v.x = this.maxVelocity;
      }
      if (v.x < -this.maxVelocity) {
        v.x = -this.maxVelocity;
      }
      if (v.y > this.maxVelocity) {
        v.y = this.maxVelocity;
      }
      if (v.y < -this.maxVelocity) {
        return v.y = -this.maxVelocity;
      }
    };

    Entity.prototype.damage = function() {};

    return Entity;

  })();

  Defender = (function(_super) {
    __extends(Defender, _super);

    function Defender(size, x, y) {
      Defender.__super__.constructor.call(this, size, x, y, 0, 0);
      this.health = this.healthMax = 12;
      this.type = "defender";
      this.armSize = 1.5;
      this.strokeWidth = this.size / 7;
      this.primaryColor = "#00b3ff";
      this.secondaryColor = "#23e96b";
      this.maxVelocity = 5;
      this.accel = 0.5;
      this.timeSinceDamaged = 0;
      this.DAMAGE_COOLDOWN = 30;
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
      this.innerCircle.radius += 20;
      if (this.timeSinceDamaged < this.DAMAGE_COOLDOWN) {
        return this.timeSinceDamaged += 1;
      }
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

    Defender.prototype.damage = function(type) {
      if (type === "attacker" && this.timeSinceDamaged === this.DAMAGE_COOLDOWN) {
        this.health--;
      }
      return this.timeSinceDamaged = 0;
    };

    Defender.prototype.fireMahLazers = function() {};

    return Defender;

  })(Entity);

  Laser = (function(_super) {
    __extends(Laser, _super);

    function Laser(num, defender) {
      var vx, vy;
      this.reference = defender["arm" + num];
      this.from = this.reference.segments[0].point;
      this.to = this.reference.segments[1].point;
      vx = this.to.x - this.from.x;
      vy = this.to.y - this.from.y;
      Laser.__super__.constructor.call(this, LASER_SIZE, this.reference.position.x, this.reference.position.y, vx, vy);
      this.num = num;
      this.defender = defender;
      this.primaryColor = "#23e96b";
      this.type = "laser";
      this.magnitude = 15;
      this.makeBody();
    }

    Laser.prototype.makeBody = function() {
      this.pos.x = this.reference.position.x;
      this.pos.y = this.reference.position.y;
      return this.body = new Path.Line({
        from: [this.from.x, this.from.y],
        to: [this.to.x, this.to.y],
        strokeColor: this.primaryColor,
        strokeWidth: DEFENDER_SIZE / 7
      });
    };

    Laser.prototype.update = function() {
      return this.move();
    };

    Laser.prototype.move = function() {
      this.pos += this.v;
      return this.body.position = this.pos;
    };

    return Laser;

  })(Entity);

  Attacker = (function(_super) {
    __extends(Attacker, _super);

    function Attacker(size, x, y, target) {
      Attacker.__super__.constructor.call(this, size, x, y, _.random(-5, 5), _.random(-5, 5));
      this.rotation = 0;
      this.target = target;
      this.type = "attacker";
      this.maxVelocity = 10;
      this.strokeWidth = this.size / 10;
      this.primaryColor = "#f24e3f";
      this.accel = 0.1;
      this.makeBody();
    }

    Attacker.prototype.makeBody = function() {
      return this.body = new Path({
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
    };

    Attacker.prototype.update = function() {
      this.trackTarget();
      this.move();
      return this.updateDirection();
    };

    Attacker.prototype.trackTarget = function() {
      if (this.target.pos.x < this.pos.x) {
        this.v.x -= this.accel;
      }
      if (this.target.pos.y < this.pos.y) {
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
      this.defender;
      this.makeEntities();
      this.$healthBar = $("#health");
      this.$injuryBar = $("#injury");
    }

    Game.prototype.makeEntities = function() {
      var i, _i, _j, _ref, _results;
      this.defender = new Defender(DEFENDER_SIZE, view.center.x, view.center.y);
      this.entities.push(this.defender);
      for (i = _i = 0, _ref = this.attackerAmount; _i <= _ref; i = _i += 1) {
        this.entities.push(new Attacker(ATTACKER_SIZE, view.center.x + _.random(-500, 500), view.center.y + _.random(-500, 500), this.defender));
      }
      _results = [];
      for (i = _j = 0; _j < 4; i = _j += 1) {
        _results.push(this.entities.push(new Laser(i, this.defender)));
      }
      return _results;
    };

    Game.prototype.handleInput = function() {
      if (Key.isDown("a") || Key.isDown("left")) {
        if (this.defender.v.x > -this.defender.maxVelocity) {
          this.defender.v.x -= this.defender.accel;
        }
      }
      if (Key.isDown("w") || Key.isDown("up")) {
        if (this.defender.v.y > -this.defender.maxVelocity) {
          this.defender.v.y -= this.defender.accel;
        }
      }
      if (Key.isDown("d") || Key.isDown("right")) {
        if (this.defender.v.x < this.defender.maxVelocity) {
          this.defender.v.x += this.defender.accel;
        }
      }
      if (Key.isDown("s") || Key.isDown("down")) {
        if (this.defender.v.y < this.defender.maxVelocity) {
          this.defender.v.y += this.defender.accel;
        }
      }
      if (Key.isDown("space")) {
        this.fireMahLazers();
        this.defender.fireMahLazers();
      }
      if (Key.isDown("escape")) {
        return this.defender.v = new Point(0, 0);
      }
    };

    Game.prototype.mainloop = function() {
      this.handleInput();
      this.updateEntities();
      this.checkCollisions();
      this.keepInBounds();
      this.updateScoreBar();
      this.updateHealthBar();
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

    Game.prototype.updateHealthBar = function() {
      if (this.defender.health >= 0) {
        this.$healthBar.text("♡".repeat(this.defender.health));
        return this.$injuryBar.text("♡".repeat(this.defender.healthMax - this.defender.health));
      }
    };

    Game.prototype.updateScoreBar = function() {};

    Game.prototype.kill = function(entity) {
      entity.body.remove();
      return this.entities.splice(this.entities.indexOf(entity), 1);
    };

    Game.prototype.fireMahLazers = function() {
      var entity, i, _i, _j, _len, _ref, _results;
      console.log("fireMahLazers");
      _ref = this.entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (entity.type === "laser") {
          this.kill(entity);
        }
      }
      _results = [];
      for (i = _j = 0; _j < 4; i = _j += 1) {
        _results.push(this.entities.push(new Laser(i, this.defender)));
      }
      return _results;
    };

    Game.prototype.checkCollisions = function(index) {
      var e, _i, _ref, _ref1;
      if (index == null) {
        index = 0;
      }
      for (e = _i = _ref = index + 1, _ref1 = this.entities.length; _i < _ref1; e = _i += 1) {
        if (this.entities[index].pos.getDistance(this.entities[e].pos) <= this.entities[index].size + this.entities[e].size) {
          this.collide(this.entities[e], this.entities[index]);
          this.collide(this.entities[index], this.entities[e]);
          this.entities[e].damage(this.entities[index].type);
          this.entities[index].damage(this.entities[e].type);
        }
      }
      if (index + 1 < this.entities.length) {
        return this.checkCollisions(index + 1);
      }
    };

    Game.prototype.collide = function(e1, e2) {
      var angle, ax, ay, dx, dy, minDist, targetX, targetY;
      dx = e1.pos.x - e2.pos.x;
      dy = e1.pos.y - e2.pos.y;
      angle = Math.atan2(dy, dx);
      minDist = e1.size + e2.size;
      targetX = e1.pos.x + Math.cos(angle) * minDist;
      targetY = e2.pos.y + Math.sin(angle) * minDist;
      ax = (targetX - e2.pos.x) * SPRING / 50;
      ay = (targetY - e2.pos.y) * SPRING / 50;
      return e1.v += new Point(ax, ay);
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

  mainloop = function() {
    return game.mainloop();
  };

  setTimeout(function() {
    return $("#countdownText").text("THREE");
  }, 0);

  setTimeout(function() {
    return $("#countdownText").text("TWO");
  }, 750);

  setTimeout(function() {
    return $("#countdownText").text("ONE");
  }, 750 * 2);

  setTimeout(function() {
    $("#countdownText").text("");
    return setInterval(mainloop, 16);
  }, 750 * 3);

}).call(this);
