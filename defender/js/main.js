(function() {
  var $mainCanvas, ATTACKER_DEATH, ATTACKER_SIZE, Attacker, DEFENDER_SIZE, Defender, Entity, FRICTION, Game, HEALTH_GAIN, HealthUp, LASER_SIZE, Laser, MAX_HEALTH_GAIN, POWERUP_SIZE, Powerup, SPRING, TRACKING, game, mainloop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
  };

  $mainCanvas = $("#mainCanvas");

  ATTACKER_DEATH = "attacker-death";

  MAX_HEALTH_GAIN = "maxHealth-gain";

  HEALTH_GAIN = "health-gain";

  FRICTION = 0.6;

  SPRING = 0.6;

  DEFENDER_SIZE = $(window).width() / 50;

  ATTACKER_SIZE = $(window).width() / 50;

  LASER_SIZE = $(window).width() / 60;

  POWERUP_SIZE = $(window).width() / 65;

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

    Entity.prototype.update = function() {
      this.move();
      return this.rotate();
    };

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

    Entity.prototype.damage = function(type) {};

    Entity.prototype.move = function() {
      this.pos += this.v;
      return this.body.position = this.pos;
    };

    Entity.prototype.rotate = function() {};

    return Entity;

  })();

  Laser = (function(_super) {
    __extends(Laser, _super);

    function Laser(num, defender) {
      var vx, vy;
      this.reference = defender["arm" + num];
      this.from = this.reference.segments[0].point;
      this.to = this.reference.segments[1].point;
      vx = (this.to.x - this.from.x) / 2;
      vy = (this.to.y - this.from.y) / 2;
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

    Laser.prototype.damage = function(type) {
      if (type === "true") {
        return this.alive = false;
      }
    };

    return Laser;

  })(Entity);

  Powerup = (function(_super) {
    __extends(Powerup, _super);

    function Powerup(x, y) {
      Powerup.__super__.constructor.call(this, POWERUP_SIZE, x, y, 0, 0);
    }

    Powerup.prototype.type = "powerup";

    Powerup.prototype.trigger = "nothing";

    Powerup.prototype.makeBody = function() {
      return this.body = new PointText({
        point: [50, 50],
        content: "P",
        fillColor: 'black',
        fontFamily: 'Courier New',
        fontSize: 25
      });
    };

    Powerup.prototype.damage = function(type) {
      if (type === "laser" || type === "defender") {
        $mainCanvas.trigger(this.trigger);
        return this.alive = false;
      }
    };

    return Powerup;

  })(Entity);

  HealthUp = (function(_super) {
    __extends(HealthUp, _super);

    function HealthUp(x, y) {
      HealthUp.__super__.constructor.call(this, x, y);
      this.makeBody();
    }

    HealthUp.prototype.trigger = HEALTH_GAIN;

    HealthUp.prototype.makeBody = function() {
      return this.body = new PointText({
        point: [this.pos.x, this.pos.y],
        content: "♡",
        fillColor: '#f24e3f',
        fontFamily: 'Courier New',
        fontSize: 25
      });
    };

    return HealthUp;

  })(Powerup);

  Defender = (function(_super) {
    __extends(Defender, _super);

    function Defender(x, y) {
      Defender.__super__.constructor.call(this, DEFENDER_SIZE, x, y, 0, 0);
      this.health = this.healthMax = 12;
      this.score = 0;
      this.type = "defender";
      this.armSize = 1.5;
      this.strokeWidth = this.size / 7;
      this.primaryColor = "#00b3ff";
      this.secondaryColor = "#23e96b";
      this.maxVelocity = 5;
      this.accel = 0.5;
      this.timeSinceDamaged = 0;
      this.DAMAGE_COOLDOWN = 30;
      this.timeSinceLazar = 0;
      this.LAZAR_COOLDOWN = 100;
      this.lazarRate = 1;
      this.currentCheckPoint = 0;
      this.makeBody();
      this.makeBindings();
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
        radius: 1,
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
      return this.body = new Group([this.arm0, this.arm1, this.arm2, this.arm3, this.outerCircle, this.innerCircle]);
    };

    Defender.prototype.makeBindings = function() {
      var $this;
      $this = this;
      $mainCanvas.on(ATTACKER_DEATH, function(event, entity) {
        return $this.onScore(entity);
      });
      return $mainCanvas.on(HEALTH_GAIN, function() {
        return $this.onHealthGain();
      });
    };

    Defender.prototype.update = function() {
      this.move();
      this.rotate();
      this.updateDirection();
      this.updateStats();
      return this.updateLazar();
    };

    Defender.prototype.updateStats = function() {
      if (this.score > 2) {
        return this.healthMax = 14;
      }
    };

    Defender.prototype.updateLazar = function() {
      var radius;
      if (this.timeSinceLazar < this.LAZAR_COOLDOWN) {
        this.timeSinceLazar += this.lazarRate;
      }
      radius = (this.size * 0.6) / (this.LAZAR_COOLDOWN / this.timeSinceLazar);
      this.setInnerCircle(radius);
      if (this.timeSinceDamaged < this.DAMAGE_COOLDOWN) {
        return this.timeSinceDamaged += 1;
      }
    };

    Defender.prototype.move = function() {
      this.pos += this.v;
      return this.body.position = this.pos;
    };

    Defender.prototype.rotate = function() {
      return this.body.rotate(0.6);
    };

    Defender.prototype.damage = function(type) {
      if (type === "attacker" && this.timeSinceDamaged === this.DAMAGE_COOLDOWN) {
        this.health--;
        this.timeSinceDamaged = 0;
        return this.timeSinceLazar = 0;
      }
    };

    Defender.prototype.canFireMahLazarz = function() {
      if (this.timeSinceLazar >= this.LAZAR_COOLDOWN) {
        return true;
      } else {
        return false;
      }
    };

    Defender.prototype.setInnerCircle = function(radius) {
      this.innerCircle.remove();
      return this.innerCircle = new Path.Circle({
        center: this.pos,
        radius: radius,
        strokeColor: this.secondaryColor,
        strokeWidth: this.strokeWidth
      });
    };

    Defender.prototype.raiseHealth = function() {
      this.maxHealth += 2;
      return $mainCanvas.trigger(MAX_HEALTH_GAIN);
    };

    Defender.prototype.onScore = function(entity) {
      this.score += entity.scoreValue;
      if (this.score % 10 === 0) {
        return this.raiseHealth();
      }
    };

    Defender.prototype.onHealthGain = function() {
      if (this.health < this.healthMax) {
        return this.health++;
      }
    };

    return Defender;

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
      this.scoreValue = 1;
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

    Attacker.prototype.damage = function(type) {
      if (type === "laser") {
        return this.alive = false;
      }
    };

    return Attacker;

  })(Entity);

  Game = (function() {
    function Game() {
      this.entities = [];
      this.difficulty = 1;
      this.ATTACKER_AMOUNT = Math.floor(this.difficulty * 3);
      this.numAttackers = 0;
      this.makeEntities();
      this.makeBindings();
      this.healthFull = $("#healthContainer");
      this.healthBar = $("#health");
      this.injuryBar = $("#injury");
      this.scoreBar = $("#score");
    }

    Game.prototype.makeEntities = function() {
      var i, _i, _ref, _results;
      this.defender = new Defender(view.center.x, view.center.y);
      this.entities.push(this.defender);
      this.entities.push(new HealthUp(view.center.x + 100, view.center.y + 100));
      _results = [];
      for (i = _i = 0, _ref = this.ATTACKER_AMOUNT; _i <= _ref; i = _i += 1) {
        this.numAttackers++;
        _results.push(this.entities.push(new Attacker(ATTACKER_SIZE, view.center.x + _.random(-500, 500), view.center.y + _.random(-500, 500), this.defender)));
      }
      return _results;
    };

    Game.prototype.makeBindings = function() {
      var $this;
      $this = this;
      $mainCanvas.on(ATTACKER_DEATH, function() {
        return $this.spawnAttacker();
      });
      return $mainCanvas.on(MAX_HEALTH_GAIN, function() {
        return $this.animateHealthBar();
      });
    };

    Game.prototype.makeStars = function() {
      var i, starLayer, _i, _ref, _results;
      starLayer = new Layer({
        strokeColor: 'white',
        strokeWidth: 3,
        position: view.center
      });
      _results = [];
      for (i = _i = 0, _ref = $(window).width() / 3; _i <= _ref; i = _i += 1) {
        _results.push(starLayer.children.push(new Path.Circle({
          radius: _.random(5, 5),
          point: _.random($(window).width(), $(window).height()),
          strokeColor: 'white',
          strokeWidth: 3
        })));
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
      if (Key.isDown("shift")) {
        console.log("shiftaki");
      }
      if (Key.isDown("space")) {
        if (this.defender.canFireMahLazarz()) {
          this.fireMahLazarz();
        }
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
      this.updateRandomSpawns();
      this.updateScoreBar();
      this.updateHealthBar();
      this.updateDeadEntities();
      return view.draw();
    };

    Game.prototype.updateEntities = function() {
      var entity, _i, _len, _ref;
      _ref = this.entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        entity.update();
      }
      if (this.numAttackers < this.ATTACKER_AMOUNT) {
        return this.spawnAttacker();
      }
    };

    Game.prototype.updateHealthBar = function() {
      if (this.defender.health >= 0) {
        this.healthBar.text("♡".repeat(this.defender.health));
        return this.injuryBar.text("♡".repeat(this.defender.healthMax - this.defender.health));
      }
    };

    Game.prototype.updateScoreBar = function() {
      return this.scoreBar.text(this.defender.score);
    };

    Game.prototype.updateDeadEntities = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (entity.alive === false) {
          if (entity.type === "attacker") {
            $mainCanvas.trigger(ATTACKER_DEATH, entity);
          }
          entity.body.remove();
          _results.push(this.entities.splice(this.entities.indexOf(entity), 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Game.prototype.updateRandomSpawns = function() {
      if (_.random(-75, 1) === _.random(-1, 75)) {
        return this.entities.push(new HealthUp(view.center.x + _.random(-500, 500), view.center.y + _.random(-500, 500)));
      }
    };

    Game.prototype.kill = function(entity) {
      return entity.alive = false;
    };

    Game.prototype.animateHealthBar = function() {
      var animation, animationEnd;
      animation = "animated rubberBand";
      animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.healthBar.addClass(animation);
      this.injuryBar.addClass(animation);
      return this.healthBar.one(animationEnd, function() {
        $(this).removeClass(animation);
        return $("#injury").removeClass(animation);
      });
    };

    Game.prototype.spawnAttacker = function() {
      return this.entities.push(new Attacker(ATTACKER_SIZE, view.center.x + _.random(-500, 500), view.center.y + _.random(-500, 500), this.defender));
    };

    Game.prototype.fireMahLazarz = function() {
      var entity, i, _i, _j, _len, _ref, _results;
      this.defender.timeSinceLazar = 0;
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
          if (entity.type === "laser") {
            this.kill(entity);
          }
        }
        if (entity.pos.y < entity.size) {
          entity.v *= new Point(SPRING, -SPRING);
          entity.pos.y = entity.size;
          if (entity.type === "laser") {
            this.kill(entity);
          }
        }
        if (entity.pos.x > view.bounds.width - entity.size) {
          entity.v *= new Point(-SPRING, SPRING);
          entity.pos.x = view.bounds.width - entity.size;
          if (entity.type === "laser") {
            this.kill(entity);
          }
        }
        if (entity.pos.y > view.bounds.height - entity.size) {
          entity.v *= new Point(SPRING, -SPRING);
          entity.pos.y = view.bounds.height - entity.size;
          if (entity.type === "laser") {
            _results.push(this.kill(entity));
          } else {
            _results.push(void 0);
          }
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
