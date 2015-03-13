var scale = "A B C# D E F# G#";

var bpm = 120;
var beat = 60 / bpm;

var OctaveGenerator = function(scale, pattern) {
  var octStart = _.random(2, 4);
  var index = 0;
  this.next = function () {
    return octStart + pattern[index % pattern.length];
    index += 1;
  }
}

var NoteGenerator = function (scale, pattern) {
  var odds = [];
  for (var i = 0; i < scale.length; i+=2) {
    odds.push(scale[i]);
  }
  var noteStart = _.random(0, )
  var index = 0;
  this.next = function() {
    return
    index += 1;
  }
}

var metronome = function(step) {
  var step = step;
  var time = 0;
  
  this.next = function() {
    time += step;
    return beat * time;
  }
}

var Instrument = function(id) {
  
}

var SongBuilder = function(length) {
   
}

//for bug testing
var piano = Instruments.piano.wad;
piano.play({pitch: 'C#4'});







