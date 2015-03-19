FRICTION = 0.6
DEFENDER_SIZE = $(window).width() / 25
ATTACKER_SIZE = $(window).width() / 25
TRACKING = false

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

        @name = "defender"
        @armSize = 1.5
        @strokeWidth = @size / 7
        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"
        @maxVelocity = 5

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
        @innerCircle.radius += 20

    move: () ->
        #velocity changes
        @v   += @a
        @pos += @v #if @isInBounds()
        #move @body to @pos
        @body.position = @pos

    keyBoard: (e) ->
        # console.log(e.type)
        if e.type is 'keydown'
            @keyDown(e)

    keyDown: (e) ->
        accel = 0.5
        key = e.which
        if key is 65 or key is 37 # left
            # console.log("left")
            @v.x -= accel if @v.x > -@maxVelocity
        if key is 87 or key is 38 # up
            # console.log("up")
            @v.y -= accel if @v.y > -@maxVelocity
        if key is 68 or key is 39 # right
            # console.log("right")
            @v.x += accel if @v.x < @maxVelocity
        if key is 83 or key is 40 # down
            # console.log("down")
            @v.y += accel if @v.y < @maxVelocity
        if key is 32
            @v = @a = new Point(0, 0)
            console.log("space")
        if key is 16
            TRACKING = !TRACKING
            console.log(TRACKING)

    keyUp: (e) ->
        #TODO: slow down defender on keyup?

    rotate: () ->
        @body.rotate(0.6)

#TODO: make a laser class

################################################################################
#ATTACKER#######################################################################
################################################################################
class Attacker extends Entity
    constructor: (size, x, y, target) ->
        super size, x, y, _.random(-5, 5), _.random(-5, 5), 0, 0

        @name = "attacker"

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
        # if TRACKING is true
        # @trackTarget()
        @move()
        @rotate()

    trackTarget: () ->
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
        @attackerpos = new Path.Circle(new Point(0, 0), 20)
        @attackerpos.fillColor = "#FFFFFF"

    makeEntities: () ->
        def = new Defender(DEFENDER_SIZE, view.center.x, view.center.y)
        $(window)
        .on('keydown', (e) ->
            def.keyBoard(e)
        ).on('keyup', (e) ->
            def.keyBoard(e)
        )
        @entities.push def
        for i in [0..@attackerAmount] by 1
            @entities.push new Attacker(ATTACKER_SIZE, view.center.x, view.center.y, def)

        console.log @entities

    mainloop: () ->
        @updateEntities()
        @checkCollisions()
        @keepInBounds()
        # @attackerpos.position = @entities[3].body.position
        view.draw()

    updateEntities: () ->
        for entity in @entities
            entity.update()

    collide: (e1, e2) ->
        # console.log(e1.name + " just collided with " + e2.name)

    checkCollisions: (index) ->
        index ?= 0

        for e in [index + 1...@entities.length] by 1
            # console.log @entities[e].pos
            if @entities[index].pos.getDistance(@entities[e].pos) <= @entities[index].size + @entities[e].size
                @collide(@entities[index], @entities[e])

        if index + 1 < @entities.length
            @checkCollisions(index + 1)

    keepInBounds: () ->
        for entity in @entities
            entity.pos.x = -entity.size * 1.5 if entity.pos.x > view.bounds.width  + (entity.size * 2)
            entity.pos.y = -entity.size * 1.5 if entity.pos.y > view.bounds.height + (entity.size * 2)
            entity.pos.x = view.bounds.width  + (entity.size * 1.5) if entity.pos.x < -entity.size * 2
            entity.pos.y = view.bounds.height + (entity.size * 1.5) if entity.pos.y < -entity.size * 2


################################################################################
#MAIN###########################################################################
################################################################################
# defender = new Defender(50, view.center.x, view.center.y);

game = new Game()

onFrame = () ->
    # defender.update()
    game.mainloop()

setInterval(onFrame, 100/6)






























path = new Path.Circle({
    center: view.center + 300,
    radius: 30,
    strokeColor: 'white'
})
