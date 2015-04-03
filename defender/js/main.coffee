String.prototype.repeat = ( num ) ->
    #I'm sorry for extending a primitive type, but it must be done
    return new Array( num + 1 ).join( this );

FRICTION = 0.6
SPRING = 0.6
DEFENDER_SIZE = $(window).width() / 50
ATTACKER_SIZE = $(window).width() / 50
LASER_SIZE =    $(window).width() / 60
TRACKING = false

################################################################################
#ENTITY#########################################################################
################################################################################
class Entity
    constructor: (size, x, y, vx, vy) ->
        @size = size
        @pos = new Point(x, y)
        @v = new Point(vx, vy)
        @alive = true

        @primaryColor = '#bab8b5'
        # @direction = new Path.Line({
        #     from: [@pos.x, @pos.y]
        #     to:   [@pos.x + (@v.x * 10), @pos.y + (@v.y * 10)]
        #     strokeColor: '#ffffff'
        #     strokeWidth: 5
        #     })

    updateDirection: () ->
        # @direction.segments[0] = new Segment({ point: [@pos.x, @pos.y]})
        # @direction.segments[1] = new Segment({ point: [@pos.x + (@v.x * 10), @pos.y + (@v.y * 10)]})

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

    damage: () ->


################################################################################
#DEFENDER#######################################################################
################################################################################
class Defender extends Entity
    constructor: (size, x, y) ->
        super size, x, y, 0, 0

        @health = @healthMax = 12
        @type = "defender"
        @armSize = 1.5
        @strokeWidth = @size / 7
        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"
        @maxVelocity = 5
        @accel = 0.5
        @timeSinceDamaged = 0
        @DAMAGE_COOLDOWN = 30

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
        @timeSinceDamaged += 1 if @timeSinceDamaged < @DAMAGE_COOLDOWN

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

    damage: (type) ->
        @health-- if type == "attacker" and @timeSinceDamaged == @DAMAGE_COOLDOWN
        @timeSinceDamaged = 0

    fireMahLazarz: ()->


################################################################################
#LASER##########################################################################
################################################################################
class Laser extends Entity
    constructor: (num, defender) ->
        @reference = defender["arm" + num]
        @from = @reference.segments[0].point
        @to   = @reference.segments[1].point
        vx = (@to.x - @from.x)
        vy = (@to.y - @from.y)
        super  LASER_SIZE, @reference.position.x, @reference.position.y, vx, vy
        @num = num
        @defender = defender
        @primaryColor = "#23e96b"
        @type = "laser"
        @magnitude = 15

        @makeBody()

    makeBody: () ->
        @pos.x = @reference.position.x
        @pos.y = @reference.position.y

        @body = new Path.Line({
            from: [@from.x, @from.y]
            to:   [@to.x, @to.y]
            strokeColor: @primaryColor
            strokeWidth: DEFENDER_SIZE / 7
        })

    update: () ->
        @move()

    move: () ->
        @pos += @v
        @body.position = @pos

################################################################################
#ATTACKER#######################################################################
################################################################################
class Attacker extends Entity
    constructor: (size, x, y, target) ->
        super size, x, y, _.random(-5, 5), _.random(-5, 5)

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
        # console.log(@body)

    update: () ->
        @trackTarget()
        @move()
        @updateDirection()
        # @rotate()

    trackTarget: () ->
        @v.x -= @accel if @target.pos.x < @pos.x # defender to the left
        @v.y -= @accel if @target.pos.y < @pos.y # defender is above
        @v.x += @accel if @target.pos.x > @pos.x # defender to the right
        @v.y += @accel if @target.pos.y > @pos.y # defender is below

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

        @defender
        @makeEntities()

        @healthBar = $ "#health"
        @injuryBar = $ "#injury"

    makeEntities: () ->
        @defender = new Defender(DEFENDER_SIZE, view.center.x, view.center.y)
        @entities.push @defender

        for i in [0..@attackerAmount] by 1
            @entities.push new Attacker(
                ATTACKER_SIZE,
                view.center.x + _.random(-500, 500),
                view.center.y + _.random(-500, 500),
                @defender
            )
        for i in [0...4] by 1
            @entities.push new Laser(i, @defender)

    handleInput: () ->
        if Key.isDown("a") or Key.isDown("left") # left
            @defender.v.x -= @defender.accel if @defender.v.x > -@defender.maxVelocity
        if Key.isDown("w") or Key.isDown("up") # up
            @defender.v.y -= @defender.accel if @defender.v.y > -@defender.maxVelocity
        if Key.isDown("d") or Key.isDown("right") # right
            @defender.v.x += @defender.accel if @defender.v.x < @defender.maxVelocity
        if Key.isDown("s") or Key.isDown("down") # down
            @defender.v.y += @defender.accel if @defender.v.y < @defender.maxVelocity

        if Key.isDown("space")
            @fireMahLazarz()
            @defender.fireMahLazarz()
        if Key.isDown("escape")
            @defender.v = new Point(0, 0) # stop defender

    mainloop: () ->
        @handleInput()
        @updateEntities()
        @checkCollisions()
        @keepInBounds()
        @updateScoreBar()
        @updateHealthBar()

        view.draw()

    updateEntities: () ->
        for entity in @entities
            entity.update()

    updateHealthBar: () ->
        if @defender.health >= 0
            @healthBar.text("♡".repeat(@defender.health))
            @injuryBar.text("♡".repeat(@defender.healthMax - @defender.health))
                            # ♡ —
    updateScoreBar: () ->

    kill: (entity) ->
        entity.body.remove()
        @entities.splice(@entities.indexOf(entity), 1)

    spawnAttacker: () ->
        @entities.push new Attacker(
            ATTACKER_SIZE,
            view.center.x + _.random(-500, 500),
            view.center.y + _.random(-500, 500),
            @defender
        )

    fireMahLazarz: () ->

        for entity in @entities
            try
                if entity.type == "laser"
                    @kill(entity)
            catch error

        for i in [0...4] by 1
            @entities.push new Laser(i, @defender)


    checkCollisions: (index) ->
        index ?= 0

        for e in [index + 1...@entities.length] by 1
            try
                if @entities[index].pos.getDistance(@entities[e].pos) <= @entities[index].size + @entities[e].size
                    #collide each entity with the other entity
                    @collide(@entities[e], @entities[index])
                    @collide(@entities[index], @entities[e])

                    @entities[e].damage(@entities[index].type)
                    @entities[index].damage(@entities[e].type)

                    @checkDeath(@entities[e], @entities[index])
            catch error


        if index + 1 < @entities.length
            return @checkCollisions(index + 1)

    checkDeath: (e1, e2) ->
        if e1.type == "attacker" or e1.type == "laser"
            if e2.type == "attacker" or e2.type == "laser"
                if e1.type != e2.type
                    @kill(e1)
                    @kill(e2)
                    @spawnAttacker()

    collide: (e1, e2) ->
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
                @kill entity if entity.type == "laser"

            if entity.pos.y < entity.size
                #collide on top wall
                entity.v *= new Point SPRING, -SPRING
                entity.pos.y = entity.size
                @kill entity if entity.type == "laser"

            if entity.pos.x > view.bounds.width - entity.size
                #collide on right wall
                entity.v *= new Point -SPRING, SPRING
                entity.pos.x = view.bounds.width - entity.size
                @kill entity if entity.type == "laser"

            if entity.pos.y > view.bounds.height - entity.size
                #collide on bottom wall
                entity.v *= new Point SPRING, -SPRING
                entity.pos.y = view.bounds.height - entity.size
                @kill entity if entity.type == "laser"


################################################################################
#MAIN###########################################################################
################################################################################

game = new Game()

mainloop = () ->
    game.mainloop()

setTimeout(() ->
    $("#countdownText").text("THREE")
, 0)
setTimeout(() ->
    $("#countdownText").text("TWO")
, 750)
setTimeout(() ->
    $("#countdownText").text("ONE")
, 750 * 2)

setTimeout(() ->
    $("#countdownText").text("")
    setInterval(mainloop, 16)
, 750 * 3)

# path = new Path.Circle({
#     center: view.center + 300,
#     radius: 30,
#     strokeColor: 'white'
# })
