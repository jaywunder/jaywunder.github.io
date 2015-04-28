let GLOBALS = require('./globals.js');
let patterns = require('./patterns.js');
/**
 * yields time for note
 */
function *metronome({step: step}) {
  console.log(step);
  let time = 0;
  while (true) {
    time += step;
    yield GLOBALS.beat * time;
  }
}
/**
 * yields note from scale
 */
function *noteGenerator({scale: scale, pattern: pattern}) {
  let odds = [];
  for (let i = 0; i < scale.length; i += 2) {
    odds.push(scale[i]);
  }
  let index = 0;
  while (true) {
    yield odds[index % odds.length];
    index++;
  }
}
/**
 * yields octange from range
 */
function *octaveGenerator({range: range, pattern: pattern}) {
  let index = -1;
  while (true) {
    index++;
    index %= pattern.length
    yield range[pattern[index]];
  }
}
/**
 * yields current intrument info for song
 */
function *instrumentGenerator({type:type}) {
  console.log(type);
  let metro = new metronome({
    step: 0.5
  });
  console.log('metro');
  let noteGen = new noteGenerator({
    scale: patterns.scales[0],
    pattern: patterns.scalePatters
  });
  console.log('noteGen');
  let octaveGen = new octaveGenerator({
    range: [2,3,4],
    pattern: patterns.octavePatterns[0]
  })
  console.log('octaveGen');
  // while (true) {
  for (let i of Number.range(10)) {
    console.log(i);
    yield {
      pitch: noteGen.next().value + octaveGen.next().value,
      wait: metro.next().value
    }
  }
}

module.exports = {
  *noteGenerator: noteGenerator,
  *octaveGenerator: octaveGenerator,
  *metronome: metronome,
  *instrumentGenerator: instrumentGenerator
}
