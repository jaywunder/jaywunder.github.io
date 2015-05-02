module.exports = {
  scales: [
    //major scales
    "C D E F G A B C",
    "G A B C D E F# G",
    "D E F# G A B C# D",
    "A B C# D E F# G#",
    "E F# G# A B C# D# E",
    "B C# D# E F# G# A# B",
    "F# G# A# B C# D# E# F#",
    "C# D# E# F# G# A# B# C#",
    "F G A Bb C D E F",
    "Bb C D Eb F G A Bb",
    "Eb F G Ab Bb C D Eb",
    "Ab Bb C Db Eb F G Ab",
    "Db Eb F Gb Ab Bb C Db",
    "Gb Ab Bb Cb Db Eb F Gb",
    "Cb Db Eb Fb Gb Ab Bb Cb",
    //minor scales
    //lower 3, 6, 7
    "C D Eb F G A B C",
    "G A Bb C D E F# G",
    "D E F G A B C# D",
    "A B C D E F# G#",
    "E F# G A B C# D# E",
    "B C# D E F# G# A# B",
    "F# G# A B C# D# E# F#",
    "C# D# E F# G# A# B# C#",
    "F G A A C D E F",
    "Bb C D D F G A Bb",
    "Eb F G G Bb C D Eb",
    "Ab Bb C C Eb F G Ab",
    "Db Eb F F Ab Bb C Db",
    "Gb Ab Bb B Db Eb F Gb",
    "Cb Db Eb G Gb Ab Bb Cb",
  ],
  octaves: [
    [2,3,4]
  ],
  tempos: [
    [0.5],
    [0.25],
    [0.25, 0.25, 0.5, 1],
    [0.5, 0.25, 0.25, 0.25],
    [0.5, 0.5, 0.15, 0.25]
  ],
  //patterns
  notePatterns: [
    [0, 2, 3, 4],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [3, 2, 3, 3, 4]
  ],
  octavePatterns: [
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [0, 0, 1, 0],
    [1, 0, 1, 1]
  ],
  metronomePatterns: [
    [1, 2, 3, 4]
  ]
};
