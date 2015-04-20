function ay(n) {
    n = n || '';
    console.log("ay " + n);
}

console.log(paper);

function loadGame() {
    $("#content").load("ajax/game.html", function() {
        ay('game');
    });
}
