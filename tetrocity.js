var HEIGHT = 25;
var WIDTH = 10;
var STARTING_POSITION = Math.floor((WIDTH - 1) / 2);
var SHAPES = [
    { type: "square", diagram: ["11", "11"] },
    { type: "rightL", diagram: ["1.", "1.", "11"] },
    { type: "leftL", diagram: [".1", ".1", "11"] },
    { type: "rightZ", diagram: ["1.", "11", ".1"] },
    { type: "leftZ", diagram: [".1", "11", "1."] },
    { type: "line", diagram: ["1", "1", "1", "1"] },
    { type: "prong", diagram: [".1.", "111"] }
];
function htmlRender(game) {
    var gameboard = document.getElementById("gameboard");
    gameboard.innerHTML = "";
    for (var r = 0; r < game.getHeight(); r++) {
        var row = document.createElement("div");
        row.className = "row";
        for (var c = 0; c < game.getWidth(); c++) {
            var cell = document.createElement("div");
            cell.className = game.isFilled(r, c) ? "cell filled" : "cell";
            row.appendChild(cell);
        }
        gameboard.appendChild(row);
    }
}
function consoleRender(game) {
    console.log("==========================");
    for (var r = 0; r < game.getHeight(); r++) {
        var row = "";
        for (var c = 0; c < game.getWidth(); c++) {
            row += game.isFilled(r, c) ? "[]" : "00";
        }
        console.log(row);
    }
}
var Game = /** @class */ (function () {
    function Game() {
        this.grid = [];
        this.interval = 10;
        for (var r = 0; r < HEIGHT; r++) {
            var row = [];
            for (var c = 0; c < WIDTH; c++) {
                row = row.concat([0]);
            }
            this.grid = this.grid.concat([row]);
        }
        this.totalScore = 0;
        this.pieceRow = 0;
        this.pieceCol = STARTING_POSITION;
        this.shape = SHAPES[3].diagram;
    }
    Game.prototype.getHeight = function () {
        return this.grid.length;
    };
    Game.prototype.getWidth = function () {
        return this.grid[0].length;
    };
    Game.prototype.getInterval = function () {
        return this.interval;
    };
    Game.prototype.canPieceAdvance = function (direction) {
        if (direction === void 0) { direction = undefined; }
        var row = this.pieceRow;
        var col = this.pieceCol;
        switch (direction) {
            case "down":
                row++;
                break;
            case "left":
                col--;
                break;
            case "right":
                col++;
                break;
            default:
                break;
        }
        //boundary check
        if (row + this.shape.length > HEIGHT ||
            col < 0 ||
            col + this.shape[0].length > WIDTH) {
            return false;
        }
        for (var r = 0; r < this.shape.length; r++) {
            for (var c = 0; c < this.shape[0].length; c++) {
                if (this.grid[row + r][col + c] === 1 && this.shape[r][c] === "1") {
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.fill = function () {
        for (var r = 0; r < this.shape.length; r++) {
            for (var c = 0; c < this.shape[0].length; c++) {
                if (this.shape[r][c] === "1") {
                    this.grid[this.pieceRow + r][this.pieceCol + c] = 1;
                }
            }
        }
        var rowsCleared = this.clearRows();
        if (rowsCleared > 0)
            this.totalScore++;
        this.pieceRow = 0;
        this.pieceCol = STARTING_POSITION;
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].diagram;
    };
    Game.prototype.isFilled = function (r, c) {
        if (this.grid[r][c] === 1)
            return true;
        if (r >= this.pieceRow && r < this.pieceRow + this.shape.length) {
            if (c >= this.pieceCol && c < this.pieceCol + this.shape[0].length) {
                return this.shape[r - this.pieceRow][c - this.pieceCol] === "1";
            }
        }
        return false;
    };
    Game.prototype.rotatePiece = function () {
        // Currently this only rotates to the right
        var oldShape = this.shape.slice();
        var newShape = [];
        while (oldShape[0] !== "") {
            var newShapeLine = "";
            for (var r = oldShape.length - 1; r > -1; r--) {
                newShapeLine += oldShape[r][0];
                oldShape[r] = oldShape[r].slice(1);
            }
            newShape.push(newShapeLine);
        }
        this.shape = newShape;
        if (this.pieceCol + this.shape[0].length >= WIDTH - 1) {
            this.pieceCol = WIDTH - this.shape[0].length;
        }
        if (!this.canPieceAdvance())
            this.shape = oldShape;
    };
    Game.prototype.bigDrop = function () {
        while (this.canPieceAdvance("down")) {
            this.pieceRow++;
        }
        this.fill();
    };
    Game.prototype.dropPiece = function () {
        if (this.canPieceAdvance("down")) {
            this.pieceRow++;
        }
        else {
            this.fill();
        }
    };
    Game.prototype.movePiece = function (direction) {
        if (this.canPieceAdvance(direction)) {
            switch (direction) {
                case "down":
                    this.pieceRow++;
                    break;
                case "left":
                    this.pieceCol--;
                    break;
                case "right":
                    this.pieceCol++;
                    break;
                default:
                    console.log("No direction.");
            }
        }
    };
    Game.prototype.turn = function () {
        this.dropPiece();
    };
    Game.prototype.areYouDead = function () {
        return this.grid[0].indexOf(1) !== -1;
    };
    Game.prototype.clearRows = function () {
        var _this = this;
        var counter = 0;
        this.grid.forEach(function (row, i) {
            if (row.every(function (char) { return char === 1; })) {
                counter++;
                var newRow = [];
                for (var i_1 = 0; i_1 < WIDTH; i_1++) {
                    newRow.push(0);
                }
                _this.grid.splice(i, 1);
                _this.grid.splice(0, 0, newRow);
            }
        });
        return counter;
    };
    return Game;
}());
function browserGame() {
    var game = new Game();
    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowUp":
                game.rotatePiece();
                break;
            case "ArrowLeft":
                game.movePiece("left");
                break;
            case "ArrowRight":
                game.movePiece("right");
                break;
            case "ArrowDown":
                game.bigDrop();
                break;
        }
    });
    var tick = function () {
        game.turn();
        htmlRender(game);
    };
    var gameTime = setInterval(tick, game.getInterval() * 100);
}
function consoleGame() {
    var game = new Game();
    var readline = require("readline");
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on("keypress", function (str, key) {
        if (key.ctrl && key.name === "c") {
            process.exit();
        }
        else {
            switch (key.name) {
                case "up":
                    game.rotatePiece();
                    break;
                case "left":
                    game.movePiece("left");
                    break;
                case "right":
                    game.movePiece("right");
                    break;
                case "down":
                    game.bigDrop();
                    break;
            }
        }
    });
    var tick = function () {
        game.turn();
        consoleRender(game);
    };
    var runGame = setInterval(tick, game.getInterval() * 100);
}
consoleGame();
