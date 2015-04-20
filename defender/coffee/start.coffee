size = $(window).width() / 6
pos = new Point($(window).width() / 2, $(window).height() / 3)
armSize = 1.5
strokeWidth = @size / 7
primaryColor = '#00b3ff'
secondaryColor = '#23e96b'

#Bottom Right
arm0 = new Path.Line({
        from: pos + size
        to: pos + (size * armSize)
        strokeColor: secondaryColor
        strokeWidth: strokeWidth
    })
#Top Right
arm1 = new Path.Line({
        from: [pos.x + size, pos.y - size]
        to: [pos.x + (size * armSize), pos.y - (size * armSize)]
        strokeColor: secondaryColor
        strokeWidth: strokeWidth
    })
#Top Left
arm2 = new Path.Line({
        from: pos - size
        to: pos + (size * armSize * -1)
        strokeColor: secondaryColor
        strokeWidth: strokeWidth
    })
#Bottom Left
arm3 = new Path.Line({
        from: [pos.x - size, pos.y + size]
        to: [pos.x - (size * armSize), pos.y + (size * armSize)]
        strokeColor: secondaryColor
        strokeWidth: strokeWidth
    })
outerCircle = new Path.Circle({
        center: pos
        radius: size
        strokeColor: primaryColor
        strokeWidth: strokeWidth
    })
innerCircle = new Path.Circle({
        center: pos
        radius: 1 # size * 0.6
        strokeColor: secondaryColor
        strokeWidth: strokeWidth
    })

body = new Group([arm0, arm1, arm2, arm3, outerCircle, innerCircle])
