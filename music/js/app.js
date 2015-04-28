let GLOBALS = require('./globals.js');
let ui = require('./ui.js');

for (let v of Number.range(5)) {
  console.log( v );
}

let instruments = require('./instruments.js');
let generators = require('./generators.js');

let inst = instruments.flute;
inst.play({pitch: 'C#4'});

let time = 0;
let beat = GLOBALS.beat
// let song = ['C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'F2', 'F3', 'F2', 'F3', 'F2', 'F3', 'F2', 'F3',
//             'Ab2', 'Ab3', 'Ab2', 'Ab3', 'Ab2', 'Ab3', 'Ab2', 'Ab3', 'G2', 'G3', 'G2', 'G3', 'G2', 'G3', 'G2']

// for (let note of song) {
//   time += 0.5;
//   piano.play({
//     pitch: note,
//     wait: beat * time
//     });
// }

function foo() {
  let song = generators.instrumentGenerator({type: 'piano'})
  for (let note of song) {
    console.log(note);
    inst.play(note);
  }
  // bass.play({pitch: 'C#4'});
}

$('#playButton').on('click', () => foo())
