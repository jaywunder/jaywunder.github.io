function ay(n) {
    n = n || '';
    console.log("ay " + n);
}

function loadGame() {
    $("#content").load("ajax/game.html", function() {
        ay('game');
    });
};

function loadStart() {
    $('#content').load('ajax/start.html', function () {
        ay('start');
    });
};

function loadScores() {
    $('#content').load('ajax/scores.html', function () {
        ay('scores');
    });
};
