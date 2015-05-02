var voice = new Wad({
    source  : 'mic',
    reverb  : {
        wet : 0.4
    },
    filter  : {
        type      : 'highpass',
        frequency : 700
    },
    panning : -0.2
});

// You must give your browser permission to use your microphone before calling play().
voice.play();
