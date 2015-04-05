String.prototype.repeat = ( num ) ->
    #I'm sorry for extending a primitive type, but it must be done
    return new Array( num + 1 ).join( this );

$mainCanvas = $("#mainCanvas")

ATTACKER_DEATH = "attacker-death"
MAX_HEALTH_GAIN = "maxHealth-gain"
HEALTH_GAIN = "health-gain"
HEALTH_GAIN_DOUBLE = "health-gain-double"

FRICTION = 0.6
SPRING = 0.6
DEFENDER_SIZE = $(window).width() / 50
ATTACKER_SIZE = $(window).width() / 50
LASER_SIZE    = $(window).width() / 60
POWERUP_SIZE  = $(window).width() / 65
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

    update: () ->
        @move()
        @rotate()

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

    damage: (type) ->

    move: () ->
        @pos += @v # add velocity to position
        @body.position = @pos # move @body to @pos

    rotate: () ->

################################################################################
#LASER##########################################################################
################################################################################
class Laser extends Entity
    constructor: (num, defender) ->
        # onsole.log "Laser #{num} at the ready!"
        @reference = defender["arm" + num]
        @from = @reference.segments[0].point
        @to   = @reference.segments[1].point
        vx = (@to.x - @from.x) / 2
        vy = (@to.y - @from.y) / 2
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

    damage: (type) ->
        if type == "true"
            @alive = false

################################################################################
#POWERUPS#######################################################################
################################################################################
class Powerup extends Entity
    constructor: (x, y) ->
        super POWERUP_SIZE, x, y, 0, 0
        # @makeBody()

    type: "powerup"
    trigger: "nothing"

    makeBody: () ->
        @body = new PointText({
            point: [50, 50],
            content: "P",
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontSize: 25
        });

    damage: (type) ->
        if type == "laser" or type == "defender"
            $mainCanvas.trigger(@trigger)
            @alive = false

class HealthUp extends Powerup
    constructor: (x, y) ->
        super x, y
        @makeBody()

    trigger: HEALTH_GAIN

    makeBody: () ->
        @body = new PointText({
            point: [@pos.x, @pos.y],
            content: "♡",
            fillColor: '#f24e3f',
            fontFamily: 'Courier New',
            fontSize: 25
        });

class HealthUpDouble extends Powerup
    constructor: (x, y) ->
        super x, y
        @makeBody()

    trigger: HEALTH_GAIN_DOUBLE

    makeBody: () ->
        @heart1 = new PointText(
            point: [@pos.x, @pos.y],
            content: "♡",
            fillColor: '#f24e3f',
            fontFamily: 'Courier New',
            fontSize: 25
        );

        @heart2 = new PointText(
            point: [@pos.x + 7, @pos.y - 7],
            content: "♡",
            fillColor: '#f24e3f',
            fontFamily: 'Courier New',
            fontSize: 25
        );

        @body = new Group([@heart1, @heart2])

################################################################################
#DEFENDER#######################################################################
################################################################################
class Defender extends Entity
    constructor: (x, y) ->
        super DEFENDER_SIZE, x, y, 0, 0

        @health = @healthMax = 12
        @score = 0
        @type = "defender"
        @armSize = 1.5
        @strokeWidth = @size / 7
        @primaryColor = "#00b3ff"
        @secondaryColor = "#23e96b"
        @maxVelocity = 5
        @accel = 0.5
        @timeSinceDamaged = 0
        @DAMAGE_COOLDOWN = 30
        @timeSinceLazar = 0
        @LAZAR_COOLDOWN = 100
        @lazarRate = 1
        @currentCheckPoint = 0

        @makeBody()
        @makeBindings()

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
                radius: 1 # @size * 0.6
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })

        @body = new Group([@arm0, @arm1, @arm2, @arm3, @outerCircle, @innerCircle])

    makeBindings: () ->
        $this = this
        $mainCanvas.on(ATTACKER_DEATH, (event, entity) -> $this.onScore(entity))
        $mainCanvas.on(HEALTH_GAIN, -> $this.onHealthGain(1))
        $mainCanvas.on(HEALTH_GAIN_DOUBLE, -> $this.onHealthGain(2))

    update: () ->
        @move()
        @rotate()
        @updateDirection()
        @updateStats()
        @updateLazar()

    updateStats: () ->
        if @score > 2
            @healthMax = 14

    updateLazar: () ->
        @timeSinceLazar += @lazarRate if @timeSinceLazar < @LAZAR_COOLDOWN
        radius = (@size * 0.6) / (@LAZAR_COOLDOWN / @timeSinceLazar)
        @setInnerCircle(radius)
        @timeSinceDamaged += 1 if @timeSinceDamaged < @DAMAGE_COOLDOWN

    move: () ->
        @pos += @v # add velocity to position
        @body.position = @pos # move @body to @pos

    rotate: () ->
        @body.rotate(0.6)

    damage: (type) ->
        if type == "attacker" and @timeSinceDamaged == @DAMAGE_COOLDOWN
            @health--
            @timeSinceDamaged = 0
            @timeSinceLazar = 0

    canFireMahLazarz: ()->
        if @timeSinceLazar >= @LAZAR_COOLDOWN
            return true
        else
            return false

    setInnerCircle: (radius) ->
        @innerCircle.remove()

        @innerCircle = new Path.Circle({
                center: @pos
                radius: radius
                strokeColor: @secondaryColor
                strokeWidth: @strokeWidth
            })

    raiseHealth: () ->
        @maxHealth += 2
        $mainCanvas.trigger(MAX_HEALTH_GAIN)

    onScore: (entity) ->
        @score += entity.scoreValue
        @raiseHealth() if @score % 10 == 0

    onHealthGain: (amount) ->
        @health += amount if @health < @healthMax

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
        @scoreValue = 1

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

    damage: (type) ->
        if type == "laser"
            @alive = false

################################################################################
#GAME###########################################################################
################################################################################
#TODO: make level class also
class Game
    constructor: () ->
        @entities = []
        @difficulty = 1
        @ATTACKER_AMOUNT = Math.floor(@difficulty * 3)
        @numAttackers = 0

        @makeEntities()
        @makeBindings()
        # @makeStars()

        @healthFull = $("#healthContainer")
        @healthBar  = $("#health")
        @injuryBar  = $("#injury")
        @scoreBar   = $("#score")

    makeEntities: () ->
        @defender = new Defender(view.center.x, view.center.y)
        @entities.push @defender

        @entities.push new HealthUpDouble(view.center.x + 100, view.center.y + 100)

        for i in [0..@ATTACKER_AMOUNT] by 1
            @numAttackers++
            @entities.push new Attacker(
                ATTACKER_SIZE,
                view.center.x + _.random(-500, 500),
                view.center.y + _.random(-500, 500),
                @defender
            )

    makeBindings: () ->
        $this = this
        $mainCanvas.on(ATTACKER_DEATH, -> $this.spawnAttacker())
        $mainCanvas.on(MAX_HEALTH_GAIN, -> $this.animateHealthBar())

    makeStars: () ->
        starLayer = new Layer({
            # children: ,
            strokeColor: 'white'
            strokeWidth: 3
            position: view.center
        })

        for i in [0..$(window).width() / 3] by 1
            starLayer.children.push new Path.Circle {
                radius: _.random 5, 5
                point: _.random $(window).width(), $(window).height()
                strokeColor: 'white'
                strokeWidth: 3
                }

    handleInput: () ->
        if Key.isDown("a") or Key.isDown("left") # left
            @defender.v.x -= @defender.accel if @defender.v.x > -@defender.maxVelocity
        if Key.isDown("w") or Key.isDown("up") # up
            @defender.v.y -= @defender.accel if @defender.v.y > -@defender.maxVelocity
        if Key.isDown("d") or Key.isDown("right") # right
            @defender.v.x += @defender.accel if @defender.v.x < @defender.maxVelocity
        if Key.isDown("s") or Key.isDown("down") # down
            @defender.v.y += @defender.accel if @defender.v.y < @defender.maxVelocity
        if Key.isDown("shift")
            console.log "shiftaki"
        if Key.isDown("space")
            if @defender.canFireMahLazarz()
                @fireMahLazarz()
        if Key.isDown("escape")
            @defender.v = new Point(0, 0) # stop defender

    mainloop: () ->
        @handleInput()
        @updateEntities()
        @checkCollisions()
        @keepInBounds()
        @updateRandomSpawns()
        @updateScoreBar()
        @updateHealthBar()
        @updateDeadEntities()

        view.draw()

    updateEntities: () ->
        for entity in @entities
            entity.update()

        if @numAttackers < @ATTACKER_AMOUNT
            @spawnAttacker()

    updateHealthBar: () ->
        if @defender.health >= 0
            @healthBar.text("♡".repeat(@defender.health))
            @injuryBar.text("♡".repeat(@defender.healthMax - @defender.health))

    updateScoreBar: () ->
        @scoreBar.text(@defender.score)

    updateDeadEntities: () ->
        for entity in @entities
            if entity.alive == false
                $mainCanvas.trigger(ATTACKER_DEATH, entity) if entity.type == "attacker" # trigger jQuery event
                entity.body.remove() #remove the entity body from the view
                @entities.splice(@entities.indexOf(entity), 1) #remove entity from @entities array

    updateRandomSpawns: () ->
        if _.random(500) == 1
            @entities.push new HealthUp(
                view.center.x + _.random(-500, 500),
                view.center.y + _.random(-500, 500)
            )
        else if _.random(700) == 1
            @entities.push new HealthUpDouble(
                view.center.x + _.random(-500, 500),
                view.center.y + _.random(-500, 500)
            )

    kill: (entity) ->
        # sets the entity to be destroyed in updateDeadEntities
        entity.alive = false

    animateHealthBar: () ->
        # class to add to health and injury bars
        animation = "animated rubberBand"
        # ton of crap to check when animations end
        animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

        # add animation to health bar and injury bar
        @healthBar.addClass(animation)
        @injuryBar.addClass(animation)
        @healthBar.one(animationEnd, -> # use ".one" so it will activate, then unbind
            # remove animation classes from elements
            $(this).removeClass(animation)
            $("#injury").removeClass(animation)
            );

    spawnAttacker: () ->
        #creates a new Attacker
        @entities.push new Attacker(
            ATTACKER_SIZE,
            view.center.x + _.random(-500, 500),
            view.center.y + _.random(-500, 500),
            @defender
        )

    fireMahLazarz: () ->
        @defender.timeSinceLazar = 0
        for entity in @entities
            #kill all existing lasers... just in case
            if entity.type == "laser"
                @kill(entity)

        for i in [0...4] by 1
            #spawn four new lasers
            @entities.push new Laser(i, @defender)

    checkCollisions: (index) ->
        index ?= 0

        for e in [index + 1...@entities.length] by 1
            if @entities[index].pos.getDistance(@entities[e].pos) <= @entities[index].size + @entities[e].size
                #collide each entity with the other entity
                @collide(@entities[e], @entities[index])
                @collide(@entities[index], @entities[e])

                @entities[e].damage(@entities[index].type)
                @entities[index].damage(@entities[e].type)

        if index + 1 < @entities.length
            return @checkCollisions(index + 1)

    collide: (e1, e2) ->
        #math. I just know it works, I kinda understand it.
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
, 750) # 1000 ms is too long, 750 is better, even though it's not a full second
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
