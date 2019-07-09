const HEIGHT: number = 25;
const WIDTH: number = 10;
const STARTING_POSITION: number = Math.floor((WIDTH - 1) / 2);

interface Shape {
  type: string,
  diagram: string[],
}

interface Piece {
    row: number;
    col: number;
    shape: string[];
}

const SHAPES: Shape[] = [
  { type: "square",
    diagram: ["11", "11"],
  },
  { type: "rightL",
    diagram: ["1.", "1.", "11"],
  },
  { type: "leftL",
    diagram: 
    [".1",
    ".1",
    "11",
    ]
  },
  { type: 'rightZ',
    diagram: 
    ["1.",
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
  {type: 'line',
    diagram: ["1", "1", "1", "1"],
  },
  {type: 'prong',
  diagram: [
    ".1.",
    "111",
    ],
  }
];

class Game {

  grid: number[][];
  gameType: string;
  interval: number;
  totalScore: number;
  piece: Piece;

  constructor(type) {
    this.grid = [];
    this.gameType = type;
    this.interval = 3;
    for (let r = 0; r < HEIGHT; r++) {
      let row: number[] = [];
      for (let c = 0; c < WIDTH; c++) {
        const filler: number = r > HEIGHT/2 ? 1 : 0;
        row = [...row, filler];
      }
      this.grid = [...this.grid, row];
    }
    this.totalScore = 0;
    this.piece = {
      row: 0,
      col: STARTING_POSITION,
      shape: SHAPES[3].diagram,
    };
  }

  startGame(){
    const drop = setInterval(() => this.dropPiece(), 800);
    const logTheEnd = () => {
      console.log("the end");
    };
    setTimeout(() => {
      clearInterval(drop);
      logTheEnd();
    }, 1000000);
  }

  renderGrid(type){
    switch(type){
      case('console'):
        this.logGrid();
        break;
      case('web'):
        this.buildElements();
        break;
      default:
        console.log('No type.');
    }
  }

  buildElements(){
    let gameboard = document.getElementById('gameboard');
    gameboard.innerHTML = '';
    this.grid.forEach(gridRow => {
      let row = document.createElement('div');
      row.className = 'row'
      gridRow.forEach(column => {
        let cell = document.createElement('div');
        cell.className = column === 0 ? 'cell' : 'cell filled'
        row.appendChild(cell);
      });
      gameboard.appendChild(row);
    });
  }

  logGrid() {
    this.grid.forEach(row => {
      console.log(row.join(""));
    });
    console.log("=========================");
  }

  renderPiece(shape, fill = true, testMove = false) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === "1") {
          // if(this.grid[this.piece.row + r] === undefined){
          //   console.log("R",r);
          //   console.log('row', this.piece.row);
          //   console.log("testMove",testMove);
          //   console.log("fill",fill);
          // }
          if(this.piece.row + r > HEIGHT - 1){
            return false;
          }
          if(this.grid[this.piece.row + r][this.piece.col + c] === 1 && testMove){
            return false;
          }
          if(!testMove){
            this.grid[this.piece.row + r][this.piece.col + c] = fill ? 1 : 0;
          }
        }
      }
    }
    return true;
  }

  clear() {
    this.renderPiece(this.piece.shape, false)
  }

  fill(): void {
    this.renderPiece(this.piece.shape, true)
  }

  testMove(): boolean {
    return this.renderPiece(this.piece.shape, false, true)
  }

  dropPiece() {
    this.clear();
    this.piece.row = this.piece.row + 1;
    if(this.pieceCanAdvance()){
      this.fill()
    } 
    else {
      this.piece.row = this.piece.row - 1;
      this.fill();
      this.landPiece();
    }
    this.renderGrid(this.gameType);
  }

  rotatePiece(){ 
    // Currently this only rotates to the right
    this.clear();
    let oldShape = [...this.piece.shape];
    let newShape = [];
    while(oldShape[0] !== ''){
      let newShapeLine = '';
      for(let r = oldShape.length - 1; r > -1; r--){
        newShapeLine += oldShape[r][0];
        oldShape[r] = oldShape[r].slice(1);
      }
      newShape.push(newShapeLine);
    }
    this.piece.shape = newShape;
    this.fill();
  }

  bigDrop(){
    this.clear();
    this.piece.row = (this.grid.length - this.piece.shape.length) - 1;
    while(!this.testMove()){
      this.piece.row--;
    }
    this.fill();
  }

  pieceCanAdvance() {
    if (this.piece.row > HEIGHT - 1) {
      return false;
    }
    
    let nextLine = this.piece.row + this.piece.shape.length;
    if (nextLine < this.grid.length && this.grid[nextLine].indexOf(1) === -1) {
      return true;
    }
    return this.testMove()
  }

  landPiece(): void {
    const rowsCleared = this.clearRows();
    if(rowsCleared > 0) this.totalScore++;
    this.piece.row = 0;
    this.piece.col = STARTING_POSITION;
    this.piece.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].diagram;
    this.fill();
  }

  movePiece(offset: number) {
    this.clear();
    const newCol = this.piece.col + offset;
    if(newCol > -1 && newCol <= (WIDTH - this.piece.shape[0].length)){
      this.piece.col = this.piece.col + offset;
      if(this.pieceCanAdvance()){
        this.fill();
      }
      else {
        this.piece.col = this.piece.col - offset;
        this.fill();
      }
    }
  }

  youAreDead() {
    return this.grid[0].indexOf(1) !== -1
  }

  clearRows(){
    let counter = 0;
    this.grid.forEach((row,i) => {
      if(row.every(char => char === 1)){
        counter++;
        this.grid.splice(i,1);
        this.grid.splice(0,0,Array.from({length: WIDTH},() => 0));
      }
    });
    return counter; 
  }


  keyLogger (enabled){
    if(enabled){
      if(this.gameType === 'console'){
        const readline = require('readline');
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str,key) => {
          if(key.ctrl && key.name === 'c'){
            process.exit();
          }
          else {
            switch(key.name){
              case('up'):
                this.rotatePiece();
                break;
              case('left'):
                this.movePiece(-1);
                break;
              case('right'):
                this.movePiece(1);
                break;
              case('down'):
                this.bigDrop();
                break;
            }
          }
        })
      }
      if(this.gameType === 'web'){
        document.addEventListener('keydown', e => {
          switch(e.key){
            case('ArrowUp'):
              this.rotatePiece();
              break;
            case('ArrowLeft'):
              this.movePiece(-1);
              break;
            case('ArrowRight'):
              this.movePiece(1);
              break;
            case('ArrowDown'):
              this.bigDrop();
              break;
          }
        })
      }
    }
  }
}

console.log('load');
let griddy = new Game('web');
griddy.keyLogger(true);
griddy.startGame();
