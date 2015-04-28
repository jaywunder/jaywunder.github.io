module.exports = {
  bass: new Wad({
    source : 'sine',
    env: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.9,
      hold: 0.4,
      release: 0.1
    }
  }),
  snare: new Wad({
    source: "noise",
    env: {
      attack: 0.001,
      decay: 0.01,
      sustain: 0.2,
      release : 0.02
    },
    filter: {
      type: 'bandpass',
      frequency: 300,
      q: 0.180
    }
  }),
  piano: new Wad({
    source : 'square',
    env : {
      attack: 0.01,
      decay: 0.005,
      sustain: 0.2,
      hold: 0.015,
      release: 0.3
    },
    filter: {
      type: 'lowpass',
      frequency: 1200,
      q: 8.5,
      env: {
        attack: 0.2,
        frequency: 600
      }
    }
  }),
  flute: new Wad({
    source: 'square',
    env: {
      attack: 0.015,
      decay: 0.002,
      sustain: 0.5,
      hold: .25,
      release: 0.3
    },
    filter: {
      type: 'lowpass',
      frequency: 600,
      q: 7,
      env: {
        attack: 0.7,
        frequency: 1600
      }
    },
    vibrato: {
      attack: 8,
      speed: 8,
      magnitude: 100
    }
  })
};
