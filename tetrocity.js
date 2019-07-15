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
        diagram: [".1",
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
        this.pieceRow = 0;
        this.pieceCol = STARTING_POSITION;
        this.shape = SHAPES[3].diagram;
    }
    Game.prototype.startGame = function () {
        var _this = this;
        var drop = setInterval(function () { return _this.dropPiece(); }, 1000);
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
    Game.prototype.canPieceAdvance = function (direction) {
        this.clear();
        var row = this.pieceRow;
        var col = this.pieceCol;
        switch (direction) {
            case 'down':
                row++;
                break;
            case 'left':
                col--;
                break;
            case 'right':
                col++;
                break;
            default:
                break;
        }
        if (row + this.shape.length > HEIGHT || col < 0 || col + this.shape[0].length > WIDTH) {
            this.fill();
            return false;
        }
        for (var r = 0; r < this.shape.length; r++) {
            for (var c = 0; c < this.shape[0].length; c++) {
                if (this.grid[row + r][col + c] === 1) {
                    this.fill();
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.fill = function () {
        for (var r = 0; r < this.shape.length; r++) {
            for (var c = 0; c < this.shape[0].length; c++) {
                if (this.shape[r][c] === '1') {
                    this.grid[this.pieceRow + r][this.pieceCol + c] = 1;
                }
            }
        }
    };
    Game.prototype.clear = function () {
        for (var r = 0; r < this.shape.length; r++) {
            for (var c = 0; c < this.shape[0].length; c++) {
                if (this.shape[r][c] === '1') {
                    this.grid[this.pieceRow + r][this.pieceCol + c] = 0;
                }
            }
        }
    };
    Game.prototype.rotatePiece = function () {
        // Currently this only rotates to the right
        this.clear();
        var oldShape = this.shape.slice();
        var newShape = [];
        while (oldShape[0] !== '') {
            var newShapeLine = '';
            for (var r = oldShape.length - 1; r > -1; r--) {
                newShapeLine += oldShape[r][0];
                oldShape[r] = oldShape[r].slice(1);
            }
            newShape.push(newShapeLine);
        }
        this.shape = newShape;
        if ((this.pieceCol + this.shape[0].length) >= WIDTH - 1) {
            this.pieceCol = WIDTH - this.shape[0].length;
        }
        this.canPieceAdvance(null) ? this.fill() : this.shape = oldShape;
    };
    Game.prototype.bigDrop = function () {
        this.clear();
        while (this.canPieceAdvance('down')) {
            this.pieceRow++;
        }
        this.fill();
        this.landPiece();
    };
    Game.prototype.dropPiece = function () {
        this.clear();
        if (this.canPieceAdvance('down')) {
            this.pieceRow++;
            this.fill();
        }
        else {
            this.fill();
            this.landPiece();
        }
        this.renderGrid(this.gameType);
        // rendering will now be handled in the type of file.
    };
    Game.prototype.landPiece = function () {
        var rowsCleared = this.clearRows();
        if (rowsCleared > 0)
            this.totalScore++;
        this.pieceRow = 0;
        this.pieceCol = STARTING_POSITION;
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].diagram;
        this.fill();
    };
    Game.prototype.movePiece = function (direction) {
        if (this.canPieceAdvance(direction)) {
            this.clear();
            switch (direction) {
                case 'down':
                    this.pieceRow++;
                    break;
                case 'left':
                    this.pieceCol--;
                    break;
                case 'right':
                    this.pieceCol++;
                    break;
                default:
                    console.log("No direction.");
            }
            this.fill();
        }
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
                        debugger;
                        switch (key.name) {
                            case ('up'):
                                _this.rotatePiece();
                                break;
                            case ('left'):
                                _this.movePiece('left');
                                break;
                            case ('right'):
                                _this.movePiece('right');
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
var griddy = new Game('console');
griddy.keyLogger(true);
griddy.startGame();
