FRICTION = 0.6
SPRING = 0.6
DEFENDER_SIZE = $(window).width() / 50
ATTACKER_SIZE = $(window).width() / 50
TRACKING = false

################################################################################
#ENTITY#########################################################################
################################################################################
class Entity
    constructor: (size, x, y, vx, vy, ax, ay) ->
        @size = size
        @pos = new Point(x, y)
        @v = new Point(vx, vy)
        @alive = true

        @primaryColor = '#bab8b5'
        @direction = new Path.Line({
            from: [@pos.x, @pos.y]
            to:   [@pos.x + (@v.x * 10), @pos.y + (@v.y * 10)]
            strokeColor: '#ffffff'
            strokeWidth: 5
            })

    updateDirection: () ->
        @direction.segments[0] = new Segment({ point: [@pos.x, @pos.y]})
        @direction.segments[1] = new Segment({ point: [@pos.x + (@v.x * 10), @pos.y + (@v.y * 10)]})

    makeBody: () ->
        @body = new Path.Circle({
            center: [@pos.x, @pos.y],
            radius: @size,
            strokeColor: @strokeColor
        })

    limitVelocity: () ->
        v.x = @maxVelocity if v.x > @maxVelocity
        v.x = -@maxVelocity if v.x < -@maxVelocity
        v.y = @maxVelocity if v.y > @maxVelocity
        v.y = -@maxVelocity if v.y < -@maxVelocity

################################################################################
#DEFENDER#######################################################################
################################################################################
class Defender extends Entity
    constructor: (size, x, y) ->
        super size, x, y, 0, 0, 0, 0

        @type = "defender"
        @armSize = 1.5
        @strokeWidth = @size / 7
        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"
        @maxVelocity = 5
        @accel = 3

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
        @updateDirection()
        @innerCircle.radius += 20

    move: () ->
        @pos += @v # add velocity to position

        @body.position = @pos # move @body to @pos

    keyBoard: (e) ->
        if e.type is 'keydown'
            @keyDown(e)

    keyDown: (e) ->
        key = e.which
        if Key.isDown("a") or Key.isDown("left") # left
            @v.x -= @accel if @v.x > -@maxVelocity
        if Key.isDown("w") or Key.isDown("up") # up
            @v.y -= @accel if @v.y > -@maxVelocity
        if Key.isDown("d") or Key.isDown("right") # right
            @v.x += @accel if @v.x < @maxVelocity
        if Key.isDown("s") or Key.isDown("down") # down
            @v.y += @accel if @v.y < @maxVelocity

        if key is 32 # space key this is temporary
            @v = new Point(0, 0) # stop defender

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

        @rotation = 0
        @target = target
        @type = "attacker"
        @maxVelocity = 10
        @strokeWidth = @size / 10
        @primaryColor = "#f24e3f"
        @accel = 0.1

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
                strokeColor: @primaryColor
                strokeWidth: @strokeWidth
                closed: true
            })
        console.log(@body)

    update: () ->
        @trackTarget()
        @move()
        @updateDirection()
        # @rotate()

    trackTarget: () ->
        # console.log "------"
        if @target.pos.x <= @pos.x # defender to the left
            # console.log "left"
            @v.x -= @accel

        if @target.pos.y <= @pos.y # defender is above
            # console.log "up"
            @v.y -= @accel

        if @target.pos.x > @pos.x # defender to the right
            # console.log "right"
            @v.x += @accel

        if @target.pos.y > @pos.y # defender is below
            # console.log "down"
            @v.y += @accel

    move: () ->
        @pos += @v # entity position changes
        @body.position = @pos # body position changes

    rotate: () ->
        #find theta... "Theta!? Where are you, Theta?"
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
        view.draw()

    updateEntities: () ->
        for entity in @entities
            entity.update()

    checkCollisions: (index) ->
        index ?= 0

        for e in [index + 1...@entities.length] by 1
            # console.log @entities[e].pos
            if @entities[index].pos.getDistance(@entities[e].pos) <= @entities[index].size + @entities[e].size
                #collide each entity with the other entity
                @collide(@entities[index], @entities[e])
                @collide(@entities[e], @entities[index])

        if index + 1 < @entities.length
            return @checkCollisions(index + 1)

    collide: (e1, e2) ->
        #FIXME: collisions
        dx = e1.pos.x - e2.pos.x
        dy = e1.pos.y - e2.pos.y

        angle = Math.atan2(dy, dx)
        minDist = e1.size + e2.size

        targetX = e1.pos.x + Math.cos(angle) * minDist
        targetY = e2.pos.y + Math.sin(angle) * minDist

        ax = (targetX - e2.pos.x) * SPRING / 50
        ay = (targetY - e2.pos.y) * SPRING / 50

        e1.v += new Point ax, ay

    keepInBounds: () ->
        for entity in @entities
            if entity.pos.x < entity.size
                #collide on left wall
                entity.v *= new Point -SPRING, SPRING
                entity.pos.x = entity.size

            if entity.pos.y < entity.size
                #collide on top wall
                entity.v *= new Point SPRING, -SPRING
                entity.pos.y = entity.size

            if entity.pos.x > view.bounds.width - entity.size
                #collide on right wall
                entity.v *= new Point -SPRING, SPRING
                entity.pos.x = view.bounds.width - entity.size

            if entity.pos.y > view.bounds.height - entity.size
                #collide on bottom wall
                entity.v *= new Point SPRING, -SPRING
                entity.pos.y = view.bounds.height - entity.size


################################################################################
#MAIN###########################################################################
################################################################################

game = new Game()

onFrame = () ->
    game.mainloop()

setInterval(onFrame, 16)

# path = new Path.Circle({
#     center: view.center + 300,
#     radius: 30,
#     strokeColor: 'white'
# })
