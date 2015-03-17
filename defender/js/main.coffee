FRICTION = 0.6

class Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        @size = size

        @pos = new Point x, y
        @v = new Point vx, vy
        @a = new Point ax, ay

        @alive = true

        @makeSelf()

    makeSelf: ->
        body = new Rectangle {
            size: [@size, @size],
            center: [@pos.x, @pos.y]
        }

    update: ->
        @draw()
        @move()

    draw: ->

    move: ->


class Defender extends Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        super size, x, y, vx, vy, ax, ay

    makeSelf: ->


    update: ->
        @draw
        @move

    draw: ->


    move: ->


class Attacker extends Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        super size, x, y, vx, vy, ax, ay

    update: ->
        @draw
        @move

    draw: ->


    move: ->
        @x += @vx
        @y += @vy

new Entity(10, 0, 0, 0, 0, 0, 0);
