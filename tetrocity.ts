const HEIGHT = 25;
const WIDTH = 10;
const STARTING_POSITION = Math.floor((WIDTH - 1) / 2);

interface Shape {
  type: string;
  diagram: string[];
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
    diagram: 
    [".1",
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
  shape: string[];
  pieceRow: number;
  pieceCol: number;

  constructor(type) {
    this.grid = [];
    this.gameType = type;
    this.interval = 3;
    for (let r = 0; r < HEIGHT; r++) {
      let row = [];
      for (let c = 0; c < WIDTH; c++) {
        const filler: number = r > HEIGHT/2 ? 1 : 0;
        row = [...row, filler];
      }
      this.grid = [...this.grid, row];
    }
    this.totalScore = 0;
    this.pieceRow = 0;
    this.pieceCol = STARTING_POSITION;
    this.shape = SHAPES[3].diagram;
  }

  startGame(){
    const drop = setInterval(() => this.dropPiece(), 1000);
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
      row.className = 'row';
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

  canPieceAdvance(direction){
    this.clear();
    let row = this.pieceRow;
    let col = this.pieceCol;
    
    switch(direction){
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

    if(row + this.shape.length > HEIGHT || col < 0 || col + this.shape[0].length > WIDTH){
      this.fill();
      return false;
    }
    for(let r = 0; r < this.shape.length; r++){
      for(let c = 0; c < this.shape[0].length; c++){
        if(this.grid[row + r][col + c] === 1){
          this.fill();
          return false;
        } 
      }
    }
    return true;
  }

  fill(){
    for(let r = 0; r < this.shape.length; r++){
      for(let c = 0; c < this.shape[0].length; c++){
        if(this.shape[r][c] === '1'){
          this.grid[this.pieceRow + r][this.pieceCol + c] = 1;
        }
      }
    }
  }

  clear(){
    for(let r = 0; r < this.shape.length; r++){
      for(let c = 0; c < this.shape[0].length; c++){
        if(this.shape[r][c] === '1'){
          this.grid[this.pieceRow + r][this.pieceCol + c] = 0;
        }
      }
    }
  }

  rotatePiece(){ 
    // Currently this only rotates to the right
    this.clear();
    let oldShape = [...this.shape];
    let newShape = [];
    while(oldShape[0] !== ''){
      let newShapeLine = '';
      for(let r = oldShape.length - 1; r > -1; r--){
        newShapeLine += oldShape[r][0];
        oldShape[r] = oldShape[r].slice(1);
      }
      newShape.push(newShapeLine);
    }
    this.shape = newShape;
    if((this.pieceCol + this.shape[0].length) >= WIDTH - 1){
      this.pieceCol = WIDTH - this.shape[0].length;
    }
    this.canPieceAdvance(null) ? this.fill() : this.shape = oldShape;
  }

  bigDrop(){
    this.clear();
    while(this.canPieceAdvance('down')){
      this.pieceRow++;
    }
    this.fill();
    this.landPiece();
  }

  dropPiece() {
    this.clear();
    if(this.canPieceAdvance('down')){
      this.pieceRow++;
      this.fill();
    } 
    else {
      this.fill();
      this.landPiece();
    }
    this.renderGrid(this.gameType);
    // rendering will now be handled in the type of file.
  }

  landPiece(){
    const rowsCleared = this.clearRows();
    if(rowsCleared > 0) this.totalScore++;
    this.pieceRow = 0;
    this.pieceCol = STARTING_POSITION;
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].diagram;
    this.fill();
  }

  movePiece(direction) {
    if(this.canPieceAdvance(direction)){
      this.clear();
      switch(direction){
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
  }

  areYouDead() {
    return this.grid[0].indexOf(1) !== -1
  }

  clearRows(){
    let counter = 0;
    this.grid.forEach((row,i) => {
      if(row.every(char => char === 1)){
        counter++;
        const newRow = [];
        for(let i = 0; i < WIDTH; i++){
          newRow.push(0);
        }
        this.grid.splice(i,1);
        this.grid.splice(0,0,newRow);
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
            debugger;
            switch(key.name){
              case('up'):
                this.rotatePiece();
                break;
              case('left'):
                this.movePiece('left');
                break;
              case('right'):
                this.movePiece('right');
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
let griddy = new Game('console');
griddy.keyLogger(true);
griddy.startGame();
