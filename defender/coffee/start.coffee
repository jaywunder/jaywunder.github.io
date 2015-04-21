size = $(window).width() / 6
pos = new Point($(window).width() / 2, $(window).height() / 3)
armSize = 1.5
strokeWidth = @size / 7
primaryColor = '#00b3ff'
secondaryColor = '#23e96b'

Defender = require './entities/Defender.coffee'

new Defender(0, 0)
