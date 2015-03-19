FRICTION = 0.6
DEFENDER_SIZE = $(window).width() / 25
ATTACKER_SIZE = $(window).width() / 25


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
        @move()
        @rotate()

    move: ->

    rotate: ->

################################################################################
#DEFENDER#######################################################################
################################################################################
class Defender extends Entity
    constructor: (size, x, y) ->
        super size, x, y, 0, 0, 0, 0

        @armSize = 1.5
        @strokeWidth = @size / 7
        @frame = 0
        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"
        @maxVelocity = 2

        @makeBody()

    makeBody: () ->
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
                radius: @size * 0.6
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })

        @body = new Group([@arm0, @arm1, @arm2, @arm3, @outerCircle, @innerCircle])

    update: () ->
        @move()
        @rotate()
        # @keepInBounds()
        @innerCircle.radius += 20

    move: () ->
        #velocity changes
        @v   += @a
        @pos += @v #if @isInBounds()
        @keepInBounds()
        #move @body to @pos
        @body.position = @pos

    keyBoard: (e) ->
        accel = 0.5
        key = e.keyCode
        if key is 97 # left
            # console.log("left")
            @v.x -= accel if @v.x > -@maxVelocity
        if key is 119 # up
            # console.log("up")
            @v.y -= accel if @v.y > -@maxVelocity
        if key is 100 # right
            # console.log("right")
            @v.x += accel if @v.x < @maxVelocity
        if key is 115 # down
            # console.log("down")
            @v.y += accel if @v.y < @maxVelocity
        if key is 32
            console.log("space")

    isInBounds: () ->
        # TODO: fix isInBounds method
        return true

    keepInBounds: () ->
        @pos.x = -@size * 1.5 if @pos.x > view.bounds.width  + (@size * 2)
        @pos.y = -@size * 1.5 if @pos.y > view.bounds.height + (@size * 2)
        @pos.x = view.bounds.width  + (@size * 1.5) if @pos.x < -@size * 2
        @pos.y = view.bounds.height + (@size * 1.5) if @pos.y < -@size * 2

    rotate: () ->
        @body.rotate(0.6)


################################################################################
#ATTACKER#######################################################################
################################################################################
class Attacker extends Entity
    constructor: (size, x, y, target) ->
        super size, x, y, 0, 0, 0, 0

        @target = target
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

    trackDefender: () ->
        #TODO: track the defender
        @v.x -= @a.x if @target.pos.x < @pos.x # defender to the left
        @v.y -= @a.y if @target.pos.y < @pos.y # defender is above
        @v.x += @a.x if @target.pos.x > @pos.x # defender to the right
        @v.x += @a.y if @target.pos.y > @pos.y # defender is below

    move: () ->
        #velocity changes
        @v   += @a
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
#GAME###########################################################################
################################################################################
#TODO: make level class also
class Game
    constructor: () ->
        @entities = []
        @difficulty = 1
        @attackerAmount = Math.floor(@difficulty * 3)

        @makeEntities()

    makeEntities: () ->
        def = new Defender(DEFENDER_SIZE, view.center.x, view.center.y)
        $(window).on('keypress', (e) ->
            def.keyBoard(e)
            console.log(e)
        )
        @entities.push def
        for i in [0...@attackerAmount] by 1
            @entities.push new Attacker(ATTACKER_SIZE, view.center.x, view.center.y)

    mainloop: () ->
        @updateEntities()
        # @collideEntities(0)

    updateEntities: () ->
        for entity in @entities
            console.log(entity)
            entity.update()

    collideEntities: (index) ->
        for e in [index...@entities.length] by 1
            console.log(@entities[e])

        collideEntities(index + 1)


################################################################################
#MAIN###########################################################################
################################################################################
# defender = new Defender(50, view.center.x, view.center.y);

game = new Game()

onFrame = () ->
    # defender.update()
    game.mainloop()
    view.draw()

setInterval(onFrame, 10/6)

# $(window).on("keypress",(e) ->
#     # defender.keyBoard(e)
#     # console.log(e)
#     )






























path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
})
