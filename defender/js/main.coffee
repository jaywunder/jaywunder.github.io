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
        @frame = 0
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
        @outerCircle = new Path.Circle({
                center: @pos
                radius: @size
                strokeColor: @primaryColor
                strokeWidth: @strokeWidth
            })
        @innerCircle = new Path.Circle({
                center: @pos
                radius: 10
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })

        @body = new Group([@arm0, @arm1, @arm2, @arm3, @outerCircle, @innerCircle])

    update: ->
        @draw()
        @move()
        @rotate(1)
        @innerCircle.radius += 20

    draw: ->


    move: ->


    rotate: ->
        @body.rotate(1)



################################################################################
#ATTACKER#######################################################################
################################################################################
class Attacker extends Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        super size, x, y, vx, vy, ax, ay

        @strokeColor = "#f24e3f"
        @strokeWidth = @size / 10

        @makeBody()

    makeBody: () ->
        @body = new Path({
                segments: [
                    new Segment({
                        point: [@pos.x + @size, @pos.y - @size]
                    })
                    new Segment({
                        point: [@pos.x - @size, @pos.y - @size]
                    })
                    new Segment({
                        point: [@pos.x, @pos.y + @size]
                    })
                ]
                strokeColor: @strokeColor
                strokeWidth: @strokeWidth
                closed: true
            })
        console.log(@body)

    update: () ->
        @move()
        @rotate()
        @keepInBounds()

    move: () ->
        #velocity changes
        @v += @a
        @pos += @v
        #body changes
        @body.position = @pos

    rotate: () ->
        #find theta
        theta = Math.atan(@v.y / @v.x) * (180 / Math.PI) - 90 # convert to degrees
        theta += 180 if @v.x < 0 # make sure theta is within the range
        @body.rotation = theta if theta != @body.data.rotation
        @body.data.rotation = theta

    keepInBounds: () ->
        @pos.x = -@size * 1.5 if @pos.x > view.bounds.width + (@size * 2)
        @pos.y = -@size * 1.5 if @pos.y > view.bounds.height + (@size * 2)
        @pos.x = view.bounds.width  + (@size * 1.5) if @pos.x < -@size * 2
        @pos.y = view.bounds.height + (@size * 1.5) if @pos.y < -@size * 2


################################################################################
#MAIN###########################################################################
################################################################################
defender = new Attacker(50, view.center.x, view.center.y, 5, -5, 0, 0);

onFrame = () ->
    # console.log("wot, m8?")
    defender.update()
    view.draw()

setInterval(onFrame, 10/6)

console.log(view)

path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
})
