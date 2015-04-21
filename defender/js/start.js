(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Defender, Entity, GLOBALS,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity.coffee');

GLOBALS = require('../globals.coffee');

Defender = (function(superClass) {
  extend(Defender, superClass);

  function Defender(x, y) {
    Defender.__super__.constructor.call(this, GLOBALS.DEFENDER_SIZE, x, y, 0, 0);
    this.health = this.healthMax = 12;
    this.score = 0;
    this.type = 'defender';
    this.armSize = 1.5;
    this.strokeWidth = this.size / 7;
    this.primaryColor = '#00b3ff';
    this.secondaryColor = '#23e96b';
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
    GLOBALS.$mainCanvas.on(GLOBALS.ATTACKER_DEATH, function(event, entity) {
      return $this.onScore(entity);
    });
    return GLOBALS.$mainCanvas.on(GLOBALS.DEFENDER_HEALTH_GAIN, function(event, args) {
      return $this.onHealthGain(args.amount);
    });
  };

  Defender.prototype.update = function() {
    Defender.__super__.update.call(this);
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
    radius = this.size / (this.LAZAR_COOLDOWN / this.timeSinceLazar);
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
    if (type === 'attacker' && this.timeSinceDamaged === this.DAMAGE_COOLDOWN) {
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
    return GLOBALS.$mainCanvas.trigger(GLOBALS.MAX_HEALTH_GAIN);
  };

  Defender.prototype.onScore = function(entity) {
    this.score += entity.scoreValue;
    if (this.score % 10 === 0) {
      return this.raiseHealth();
    }
  };

  Defender.prototype.onHealthGain = function(amount) {
    if (this.health < this.healthMax) {
      return this.health += amount;
    }
  };

  return Defender;

})(Entity);

module.exports = Defender;



},{"../globals.coffee":3,"./Entity.coffee":2}],2:[function(require,module,exports){
var Entity, GLOBALS;

GLOBALS = require('../globals.coffee');

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

module.exports = Entity;



},{"../globals.coffee":3}],3:[function(require,module,exports){
module.exports = {
  $mainCanvas: $('#mainCanvas'),
  ATTACKER_DEATH: 'attacker-death',
  MAX_HEALTH_GAIN: 'maxHealth-gain',
  DEFENDER_HEALTH_GAIN: 'defender-health-gain',
  DEFENDER_INVULNERABLE: 'defender-invulnerable',
  DEFENDER_DAMAGED: 'defender-damaged',
  FRICTION: 0.6,
  SPRING: 0.6,
  DEFENDER_SIZE: $(window).width() / 50,
  ATTACKER_SIZE: $(window).width() / 50,
  LASER_SIZE: $(window).width() / 60,
  POWERUP_SIZE: $(window).width() / 65
};



},{}],4:[function(require,module,exports){
var Defender, armSize, pos, primaryColor, secondaryColor, size, strokeWidth;

size = $(window).width() / 6;

pos = new Point($(window).width() / 2, $(window).height() / 3);

armSize = 1.5;

strokeWidth = this.size / 7;

primaryColor = '#00b3ff';

secondaryColor = '#23e96b';

Defender = require('./entities/Defender.coffee');

new Defender(0, 0);



},{"./entities/Defender.coffee":1}]},{},[4]);
