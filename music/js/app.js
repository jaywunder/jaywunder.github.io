function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}

// 1 2 3 4 5
for (var v of foo()) {
    console.log( v );
}

// let Instruments = require('./instruments.js');
//
// let bpm = 120; // 68
// let beat = 60 / bpm;
// let bass = Instruments.bass.wad;
// let snare = Instruments.snare.wad;
// let flute = Instruments.flute.wad;
// let piano = Instruments.piano.wad;
//
// let notes = ['C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'C2', 'C3', 'C2'];
//
// let time = 0;
// for (let note of notes) {
//   time += 0.5;
//   // bass.play({ pitch : 'C3',  wait : beat * .5})
//   bass.play({
//     pitch: note,
//     wait: beat * time
//     });
// }
//
// piano.play({pitch: 'C4'});
// piano.play();
// bass.play({ pitch : 'C3',  wait : beat * .5})
// bass.play({ pitch : 'C2',  wait : beat * 1})
// bass.play({ pitch : 'C3',  wait : beat * 1.5})
// bass.play({ pitch : 'C2',  wait : beat * 2})
// bass.play({ pitch : 'C3',  wait : beat * 2.5})
// bass.play({ pitch : 'C2',  wait : beat * 3})
// bass.play({ pitch : 'C3',  wait : beat * 3.5})
// bass.play({ pitch : 'F2',  wait : beat * 4})
// bass.play({ pitch : 'F3',  wait : beat * 4.5})
// bass.play({ pitch : 'F2',  wait : beat * 5})
// bass.play({ pitch : 'F3',  wait : beat * 5.5})
// bass.play({ pitch : 'F2',  wait : beat * 6})
// bass.play({ pitch : 'F3',  wait : beat * 6.5})
// bass.play({ pitch : 'F2',  wait : beat * 7})
// bass.play({ pitch : 'F3',  wait : beat * 7.5})
// bass.play({ pitch : 'Ab2', wait : beat * 8})
// bass.play({ pitch : 'Ab3', wait : beat * 8.5})
// bass.play({ pitch : 'Ab2', wait : beat * 9})
// bass.play({ pitch : 'Ab3', wait : beat * 9.5})
// bass.play({ pitch : 'Ab2', wait : beat * 10})
// bass.play({ pitch : 'Ab3', wait : beat * 10.5})
// bass.play({ pitch : 'Ab2', wait : beat * 11})
// bass.play({ pitch : 'Ab3', wait : beat * 11.5})
// bass.play({ pitch : 'G2',  wait : beat * 12})
// bass.play({ pitch : 'G3',  wait : beat * 12.5})
// bass.play({ pitch : 'G2',  wait : beat * 13})
// bass.play({ pitch : 'G3',  wait : beat * 13.5})
// bass.play({ pitch : 'G2',  wait : beat * 14})
// bass.play({ pitch : 'G3',  wait : beat * 14.5})
// bass.play({ pitch : 'G2',  wait : beat * 15})
