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
Array.prototype.enumerate3D = function*() {
  if(!this[0][0][0]) throw('not a 3D array');
  for (let x of Number.range(this.length)) {
    for (let y of Number.range(this[x].length)) {
      for (let z of Number.range(this[x][y].length)) {
        yield [x + this[x].length * (y + this[x][y].length * z), this.get3D(x,y,z)]
      }
    }
  }
}
Array.prototype.get3D = function(x, y, z) {
  if(!this[0][0][0]) throw('not a 3D array');
  try {
    return this[x][y][z]
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  bpm: 120,
  beat: 60 / 120,
}
