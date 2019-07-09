var HEIGHT = 25;
var WIDTH = 10;
var STARTING_POSITION = Math.floor((WIDTH - 1) / 2);
var SHAPES = [
    { type: "square",
        diagram: ["11", "11"]
    },
    { type: "rightL",
        diagram: ["1.", "1.", "11"]
    },
    { type: "leftL",
        diagram: [".1",
            ".1",
            "11",
        ]
    },
    { type: 'rightZ',
        diagram: ["1.",
            "11",
            ".1",
        ]
    },
    { type: "leftZ",
        diagram: [
            ".1",
            "11",
            "1."
        ]
    },
    { type: 'line',
        diagram: ["1", "1", "1", "1"]
    },
    { type: 'prong',
        diagram: [
            ".1.",
            "111",
        ]
    }
];
var Game = /** @class */ (function () {
    function Game(type) {
        this.grid = [];
        this.gameType = type;
        this.interval = 3;
        for (var r = 0; r < HEIGHT; r++) {
            var row = [];
            for (var c = 0; c < WIDTH; c++) {
                var filler = r > HEIGHT / 2 ? 1 : 0;
                row = row.concat([filler]);
            }
            this.grid = this.grid.concat([row]);
        }
        this.totalScore = 0;
        this.piece;
        piece = {
            row: 0,
            col: STARTING_POSITION,
            shape: SHAPES[3].schema
        };
    }
    Game.prototype.startGame = function () {
        var _this = this;
        var drop = setInterval(function () { return _this.dropPiece(); }, 800);
        var logTheEnd = function () {
            console.log("the end");
        };
        setTimeout(function () {
            clearInterval(drop);
            logTheEnd();
        }, 1000000);
    };
    Game.prototype.renderGrid = function (type) {
        switch (type) {
            case ('console'):
                this.logGrid();
                break;
            case ('web'):
                this.buildElements();
                break;
            default:
                console.log('No type.');
        }
    };
    Game.prototype.buildElements = function () {
        var gameboard = document.getElementById('gameboard');
        gameboard.innerHTML = '';
        this.grid.forEach(function (gridRow) {
            var row = document.createElement('div');
            row.className = 'row';
            gridRow.forEach(function (column) {
                var cell = document.createElement('div');
                cell.className = column === 0 ? 'cell' : 'cell filled';
                row.appendChild(cell);
            });
            gameboard.appendChild(row);
        });
    };
    Game.prototype.logGrid = function () {
        this.grid.forEach(function (row) {
            console.log(row.join(""));
        });
        console.log("=========================");
    };
    Game.prototype.renderPiece = function (shape, fill, testMove) {
        if (fill === void 0) { fill = true; }
        if (testMove === void 0) { testMove = false; }
        for (var r = 0; r < shape.length; r++) {
            for (var c = 0; c < shape[0].length; c++) {
                if (shape[r][c] === "1") {
                    // if(this.grid[this.piece.row + r] === undefined){
                    //   console.log("R",r);
                    //   console.log('row', this.piece.row);
                    //   console.log("testMove",testMove);
                    //   console.log("fill",fill);
                    // }
                    if (this.piece.row + r > HEIGHT - 1) {
                        return false;
                    }
                    if (this.grid[this.piece.row + r][this.piece.col + c] === 1 && testMove) {
                        return false;
                    }
                    if (!testMove) {
                        this.grid[this.piece.row + r][this.piece.col + c] = fill ? 1 : 0;
                    }
                }
            }
        }
        return true;
    };
    Game.prototype.clear = function () {
        this.renderPiece(this.piece.shape, false);
    };
    Game.prototype.fill = function () {
        this.renderPiece(this.piece.shape, true);
    };
    Game.prototype.testMove = function () {
        return this.renderPiece(this.piece.shape, false, true);
    };
    Game.prototype.dropPiece = function () {
        this.clear();
        this.piece.row = this.piece.row + 1;
        if (this.pieceCanAdvance()) {
            this.fill();
        }
        else {
            this.piece.row = this.piece.row - 1;
            this.fill();
            this.landPiece();
        }
        this.renderGrid(this.gameType);
    };
    Game.prototype.rotatePiece = function () {
        // Currently this only rotates to the right
        this.clear();
        var oldShape = this.piece.shape.slice();
        var newShape = [];
        while (oldShape[0] !== '') {
            var newShapeLine = '';
            for (var r = oldShape.length - 1; r > -1; r--) {
                newShapeLine += oldShape[r][0];
                oldShape[r] = oldShape[r].slice(1);
            }
            newShape.push(newShapeLine);
        }
        this.piece.shape = newShape;
        this.fill();
    };
    Game.prototype.bigDrop = function () {
        this.clear();
        this.piece.row = (this.grid.length - this.piece.shape.length) - 1;
        while (!this.testMove()) {
            this.piece.row--;
        }
        this.fill();
    };
    Game.prototype.pieceCanAdvance = function () {
        if (this.piece.row > HEIGHT - 1) {
            return false;
        }
        var nextLine = this.piece.row + this.piece.shape.length;
        if (nextLine < this.grid.length && this.grid[nextLine].indexOf(1) === -1) {
            return true;
        }
        return this.testMove();
    };
    Game.prototype.landPiece = function () {
        var rowsCleared = this.clearRows();
        if (rowsCleared > 0)
            this.totalScore++;
        this.piece.row = 0;
        this.piece.col = STARTING_POSITION;
        this.piece.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].schema;
        this.fill();
    };
    Game.prototype.movePiece = function (offset) {
        this.clear();
        var newCol = this.piece.col + offset;
        if (newCol > -1 && newCol <= (WIDTH - this.piece.shape[0].length)) {
            this.piece.col = this.piece.col + offset;
            if (this.pieceCanAdvance()) {
                this.fill();
            }
            else {
                this.piece.col = this.piece.col - offset;
                this.fill();
            }
        }
    };
    Game.prototype.youAreDead = function () {
        return this.grid[0].indexOf(1) !== -1;
    };
    Game.prototype.clearRows = function () {
        var _this = this;
        var counter = 0;
        this.grid.forEach(function (row, i) {
            if (row.every(function (char) { return char === 1; })) {
                counter++;
                _this.grid.splice(i, 1);
                _this.grid.splice(0, 0, Array.from({ length: WIDTH }, function () { return 0; }));
            }
        });
        return counter;
    };
    Game.prototype.keyLogger = function (enabled) {
        var _this = this;
        if (enabled) {
            if (this.gameType === 'console') {
                var readline = require('readline');
                readline.emitKeypressEvents(process.stdin);
                process.stdin.setRawMode(true);
                process.stdin.on('keypress', function (str, key) {
                    if (key.ctrl && key.name === 'c') {
                        process.exit();
                    }
                    else {
                        switch (key.name) {
                            case ('up'):
                                _this.rotatePiece();
                                break;
                            case ('left'):
                                _this.movePiece(-1);
                                break;
                            case ('right'):
                                _this.movePiece(1);
                                break;
                            case ('down'):
                                _this.bigDrop();
                                break;
                        }
                    }
                });
            }
            if (this.gameType === 'web') {
                document.addEventListener('keydown', function (e) {
                    switch (e.key) {
                        case ('ArrowUp'):
                            _this.rotatePiece();
                            break;
                        case ('ArrowLeft'):
                            _this.movePiece(-1);
                            break;
                        case ('ArrowRight'):
                            _this.movePiece(1);
                            break;
                        case ('ArrowDown'):
                            _this.bigDrop();
                            break;
                    }
                });
            }
        }
    };
    return Game;
}());
console.log('load');
var griddy = new Game('web');
griddy.keyLogger(true);
griddy.startGame();
