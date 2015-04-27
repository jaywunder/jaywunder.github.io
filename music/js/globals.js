Number.range = function*(start, end, step) {
  if (!start) throw('Error: no arguments supplied to range function')
  if (!end) {
    end = start;
    start = 0;
  }
  step = step || 1;
  for (let i = start; i < end; i += step) {
    yield i;
  }
};
Array.prototype.enumerate = function*() {
  for (let i = 0; i < this.length; i++) {
    yield [i, this[i]]
  }
};

module.exports = {
  bpm: 120,
  beat: 60 / module.exports.bpm,
}
