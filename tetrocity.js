const HEIGHT = 25;
const WIDTH = 10;
const STARTING_POSITION = Math.floor((WIDTH - 1) / 2);
const SHAPES = [
  { type: "square",
    schema: ["11", "11"],
  },
  { type: "rightL",
    schema: ["1.", "1.", "11"],
  },
  {type: 'line',
    schema: ["1", "1", "1", "1"],
  },
  {type: 'prong',
  schema: [
    ".1.",
    "111",
    ],
  }
];

class Grid {
  constructor() {
    this.grid = [];
    this.interval = 3;
    for (let r = 0; r < HEIGHT; r++) {
      let row = [];
      for (let c = 0; c < WIDTH; c++) {
        const filler = r > HEIGHT/2 ? 1 : 0;
        row = [...row, filler];
      }
      this.grid = [...this.grid, row];
    }
    this.totalScore = 0;
    this.piece = {
      row: 0,
      col: STARTING_POSITION,
      shape: SHAPES[3].schema,
    };
  }

  logGrid() {
    this.grid.forEach(row => {
      console.log(row.join(""));
    });
    console.log("GRID ENDS HERE ==============");
  }

  renderPiece(shape, fill = true, testMove = false) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === "1") {
          if(this.grid[this.piece.row + r] === undefined){
            console.log("R",r);
            console.log('row', this.piece.row);
            console.log("testMove",testMove);
            console.log("fill",fill);
          }
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

  clear(shape) {
    this.renderPiece(shape, false)
  }

  fill(shape) {
    this.renderPiece(shape, true)
  }

  testMove(shape) {
    this.renderPiece(shape, false, true)
  }

  dropPiece() {
    this.clear(this.piece.shape);
    this.piece.row = this.piece.row + 1;
    if(this.pieceCanAdvance()){
      this.fill(this.piece.shape)
    } 
    else {
      this.piece.row = this.piece.row - 1;
      this.fill(this.piece.shape);
      this.landPiece();
    }
    this.logGrid();
  }

  rotatePiece(){
    this.clear(this.piece.shape);
    let oldShape = [...this.piece.shape];
    let newShape = [];//Array.from({length: oldShape[0].length}, () => '');
    while(oldShape[0] !== ''){
      let newShapeLine = '';
      for(let r = 0; r < oldShape.length; r++){
        newShapeLine += oldShape[r][0];
        oldShape[r] = oldShape[r].slice(1);
      }
      newShape.push(newShapeLine);
    }
    this.piece.shape = newShape;
    this.fill(this.piece.shape);
  }

  pieceCanAdvance() {
    if (this.piece.row > HEIGHT - 1) {
      return false;
    }
    
    let nextLine = this.piece.row + this.piece.shape.length;
    if (nextLine < this.grid.length && this.grid[nextLine].indexOf(1) === -1) {
      return true;
    }
    return this.renderPiece(this.piece.shape, false, true)
  }

  landPiece() {
    const rowsCleared = this.clearRows();
    if(rowsCleared > 0) this.totalScore++;
    this.piece.row = 0;
    this.piece.col = STARTING_POSITION;
    this.piece.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].schema;
    this.fill(this.piece.shape);
  }

  movePiece(offset) {
    this.clear(this.piece.shape);
    this.piece.col = this.piece.col + offset;
    if(this.pieceCanAdvance()){
      this.fill(this.piece.shape);
    }
    else {
      this.piece.col = this.piece.col - offset;
      this.fill(this.piece.shape);
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
  }

let griddy = new Grid();
const drop = setInterval(() => griddy.dropPiece(), 800);
const logTheEnd = () => {
  console.log("the end");
};
setTimeout(() => {
  clearInterval(drop);
  logTheEnd();
}, 1000000);

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
        griddy.rotatePiece();
        break;
      case('left'):
        griddy.movePiece(-1);
        break;
      case('right'):
        griddy.movePiece(1);
        break;
    }
  }
})

