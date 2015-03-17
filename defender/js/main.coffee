FRICTION = 0.6

class Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        @size = size

        @pos = new Point(x, y)
        @v = new Point(vx, vy)
        @a = new Point(ax, ay)

        @alive = true

        @strokeColor = '#bab8b5'

        @makeBody()

    makeBody: () ->
        @body = new Path.Circle({
            center: [@pos.x, @pos.y],
            radius: @size,
            strokeColor: @strokeColor
        })

    update: ->
        @draw()
        @move()

    draw: ->

    move: ->


class Defender extends Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        super size, x, y, vx, vy, ax, ay

    body: null

    update: ->
        @draw
        @move

    draw: ->


    move: ->


class Attacker extends Entity


e = new Attacker(50, 0, 0, 0, 0, 0, 0);

onFrame = () ->
    console.log("wot, m8?")


path = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'white'
})
