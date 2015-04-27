let patters = require('./patterns.js')

function *OctaveGenerator(scale, pattern) {
  let octStart = _.random(2, 4)
  let index = 0;
  this.next = function () {
    return octStart + pattern[index % pattern.length];
    index += 1;
  }
}

function *NoteGenerator(scale, pattern) {
  let odds = [];
  for (let i = 0; i < scale.length; i += 2) {
    odds.push(scale[i]);
  }
  let noteStart = _.random(0, 5)
  let index = 0;
  this.next = function() {
    return index += 1;
  }
}

function *Metronome(step) {
  let time = 0;
  while (true) {
    time += step;
    yield beat * time;
  }
}

function *SongGenerator(length) {

}



module.exports = {
  NoteGenerator: NoteGenerator,
  OctaveGenerator: OctaveGenerator,
  Metronome: Metronome,
  SongGenerator: SongGenerator
}
