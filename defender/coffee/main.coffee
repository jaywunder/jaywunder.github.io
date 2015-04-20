paper.install(window);
paper.setup('mainCanvas');

Game = require './Game.coffee'

game = new Game()

path = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'white'
})

# console.log view
view.draw()
