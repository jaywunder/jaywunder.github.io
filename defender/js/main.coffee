FRICTION = 0.6

################################################################################
#ENTITY#########################################################################
################################################################################
class Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        @size = size

        @pos = new Point(x, y)
        @v = new Point(vx, vy)
        @a = new Point(ax, ay)

        @alive = true

        @primaryColor = '#bab8b5'

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

    rotate: ->

################################################################################
#DEFENDER#######################################################################
################################################################################
class Defender extends Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        super size, x, y, vx, vy, ax, ay

        @armSize = 1.5
        @strokeWidth = @size / 7

        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"

        @makeBody()

    makeBody: ->
        #Bottom Right
        @arm0 = new Path.Line({
                from: @pos + @size
                to: @pos + (@size * @armSize)
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })
        #Top Right
        @arm1 = new Path.Line({
                from: [@pos.x + @size, @pos.y - @size]
                to: [@pos.x + (@size * @armSize), @pos.y - (@size * @armSize)]
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })
        #Top Left
        @arm2 = new Path.Line({
                from: @pos - @size
                to: @pos + (@size * @armSize * -1)
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })
        #Bottom Left
        @arm3 = new Path.Line({
                from: [@pos.x - @size, @pos.y + @size]
                to: [@pos.x - (@size * @armSize), @pos.y + (@size * @armSize)]
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })
        @circle = new Path.Circle({
                center: [@pos.x, @pos.y]
                radius: @size
                strokeColor: @primaryColor
                strokeWidth: @strokeWidth
            })

        @body = new Group([@arm0, @arm1, @arm2, @arm3, @circle])

    update: ->
        @draw()
        @move()
        @rotate(1)

    draw: ->


    move: ->


    rotate: ->
        @body.rotate(1)



################################################################################
#ATTACKER#######################################################################
################################################################################
class Attacker extends Entity

################################################################################
#MAIN###########################################################################
################################################################################
defender = new Defender(100, view.center.x, view.center.y, 0, 0, 0, 0);

onFrame = () ->
    console.log("wot, m8?")
    defender.update()
    view.draw()

setInterval(onFrame, 10/6)

path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
})
