// jshint -W117
// jshint -W097
'use strict';

// $('body').after('<canvas id="pixi-render"></canvas>');
var canvas = document.getElementById('pixi-render');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

let count = 0

class World {
  constructor() {
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
      backgroundColor: 0xffffff,
      view: document.getElementById('pixi-render'),
      preserveDrawingBuffer: true
    });
    this.view = this.renderer.view
    this.graphics = new PIXI.Graphics()
    this.stage.addChild(this.graphics)

    this.entities = [];
    this.fishNum = 15;
    this.createEntitites();

    setInterval(() => this.update(), 16)
  }

  createEntitites() {
    for (var i = 0; i < this.fishNum; i++) {
      this.entities.push(
        new Fish(
          (Math.random() * (this.view.width + 400)) - 200,
          (Math.random() * (this.view.height + 400)) - 200
        )
      )
    }
    for (let i in this.entities)
      this.stage.addChild(this.entities[i].body)
  }

  update() {
    this.checkEdges()
    for (let i in this.entities) {
      this.entities[i].update()
    }
  }

  render() {
    this.graphics.clear()
    for (let i in this.entities) {
      this.entities[i].render()
    }
  }

  checkEdges() {
    let outer = 250
    let inner = 200
    for (let i in this.entities) {
      if (this.entities[i].x > this.view.width + outer)
        this.entities[i].x = -inner

      if (this.entities[i].x < -outer)
        this.entities[i].x = this.view.width + inner

      if (this.entities[i].y > this.view.width + outer)
        this.entities[i].y = -inner

      if (this.entities[i].y < -outer)
        this.entities[i].y = this.view.width + inner
    }
  }
}

class Fish {
  constructor(x, y) {
    this.maxAcc = 0.25
    this.maxVel = 3 * Math.random() + 2

    this.tick = Math.random() * Math.PI
    this.x = x
    this.y = y
    this.vx = (Math.random() * 3 - 1.5) * this.maxVel
    this.vy = (Math.random() * 3 - 1.5) * this.maxVel
    this.ax = 0.0
    this.ay = 0.0

    this.rotation = 0

    this.body = new PIXI.Container()
    this.graphics = new PIXI.Graphics()

    this.meshPoints = []
    for (var i = 0; i < 20; i++)
      this.meshPoints.push(new PIXI.Point(i * 10, 0))
    let textures = ['orange0', 'black0', 'orange1', 'black1']
    let texName = textures[Math.floor(Math.random() * textures.length)]
    this.texture = PIXI.Texture.fromImage('/assets/koi-' + texName + '.png')
    this.mesh = new PIXI.mesh.Rope(this.texture, this.meshPoints)

    this.body.addChild(this.mesh)
    this.body.addChild(this.graphics)
  }

  update() {
    this.tick += 0.05;
    this.move()
    this.tail()
  }

  render() {
    this.body.position.x = this.x
    this.body.position.y = this.y
  }

  move() {
    let angle = Math.atan(this.vy / this.vx)
    // Fix issue with the domain of tangent function
    this.rotation = this.vx > 0 ? angle : angle - Math.PI
    this.body.rotation = this.rotation

    // Acceleration
    this.ax += Math.random() * 0.01 - 0.005
    this.ay += Math.random() * 0.01 - 0.005
    this.ax = this.ax > 0 ? Math.min(this.ax, this.maxAcc) : Math.max(this.ax, -this.maxAcc)
    this.ay = this.ay > 0 ? Math.min(this.ay, this.maxAcc) : Math.max(this.ay, -this.maxAcc)

    // if the velocity is at maximum then turn th other way
    this.ax *= this.vx === this.maxVel || this.vx === -this.maxVel ? -0.5 : 0.3
    this.ay *= this.vy === this.maxVel || this.vy === -this.maxVel ? -0.5 : 0.3

    // Velocity
    this.vx += this.ax
    this.vy += this.ay
    this.vx = this.vx > 0 ? Math.min(this.vx, this.maxVel) : Math.max(this.vx, -this.maxVel)
    this.vy = this.vy > 0 ? Math.min(this.vy, this.maxVel) : Math.max(this.vy, -this.maxVel)

    // Position
    this.x += this.vx
    this.y += this.vy
  }

  tail() {

    for (let i = 0; i < this.meshPoints.length; i++) {
      // this.meshPoints[i].x = i * 20 + Math.cos((i * 0.3) + this.rotation) * 10;
      this.meshPoints[i].y = Math.sin((i * 0.5) + this.tick) * 5;
    }
  }
}

let world = new World()

;(function animate() {
  world.renderer.render(world.stage);
  world.render()
  requestAnimationFrame( animate );
})()
