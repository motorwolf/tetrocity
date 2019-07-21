const HEIGHT: number = 25;
const WIDTH: number = 10;
const STARTING_POSITION: number = Math.floor((WIDTH - 1) / 2);

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

interface RenderableGame {
  getHeight(): number;
  getWidth(): number;
  isFilled(r: number, c: number): boolean;
}

function htmlRender(game: RenderableGame){
  let gameboard = document.getElementById('gameboard');
  gameboard.innerHTML = '';
  for(let r = 0; r < game.getHeight(); r++) {
    let row = document.createElement('div');
    row.className = 'row';
    for(let c = 0; c < game.getWidth(); c++){
        let cell = document.createElement('div');
        cell.className = game.isFilled(r,c) ? 'cell filled' : 'cell';
        row.appendChild(cell);
      }
      gameboard.appendChild(row);
    }
}

function consoleRender(game: RenderableGame){
  console.log("==========================")
  for(let r = 0; r < game.getHeight(); r++){
    let row: string = '';
    for(let c = 0; c < game.getWidth(); c++){
      row += game.isFilled(r,c) ? '[]' : '00';
    }
    console.log(row);
  }
}


class Game implements RenderableGame {

  private grid: number[][];
  private interval: number;
  private totalScore: number;
  private shape: string[];
  private pieceRow: number;
  private pieceCol: number;

  constructor() {
    this.grid = [];
    this.interval = 10;
    for (let r = 0; r < HEIGHT; r++) {
      let row = [];
      for (let c = 0; c < WIDTH; c++) {
        row = [...row, 0];
      }
      this.grid = [...this.grid, row];
    }
    this.totalScore = 0;
    this.pieceRow = 0;
    this.pieceCol = STARTING_POSITION;
    this.shape = SHAPES[3].diagram;
  }

  getHeight(){
    return this.grid.length;
  }

  getWidth(){
    return this.grid[0].length;
  }

  getInterval(){
    return this.interval;
  }

  canPieceAdvance(direction){
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

    //boundary check
    if(row + this.shape.length > HEIGHT || col < 0 || col + this.shape[0].length > WIDTH){
      return false;
    }

    for(let r = 0; r < this.shape.length; r++){
      for(let c = 0; c < this.shape[0].length; c++){
        if(this.grid[row + r][col + c] === 1 && this.shape[r][c] === '1'){
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
    const rowsCleared = this.clearRows();
    if(rowsCleared > 0) this.totalScore++;
    this.pieceRow = 0;
    this.pieceCol = STARTING_POSITION;
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].diagram;
  }

  isFilled(r: number,c: number): boolean {
    if (this.grid[r][c] === 1) return true
    if(r >= this.pieceRow && r < this.pieceRow + this.shape.length){
      if(c >= this.pieceCol && c < this.pieceCol + this.shape[0].length){
        return this.shape[r - this.pieceRow][c - this.pieceCol] === '1'
      }
    }
    return false
  }

  rotatePiece(){ 
    // Currently this only rotates to the right
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
    if(!this.canPieceAdvance(null)) this.shape = oldShape;
  }

  bigDrop(){
    while(this.canPieceAdvance('down')){
      this.pieceRow++;
    }
    this.fill();
  }

  dropPiece() {
    if(this.canPieceAdvance('down')){
      this.pieceRow++;
    } 
    else {
      this.fill();
    }
  }

  movePiece(direction: string) {
    if(this.canPieceAdvance(direction)){
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
    }
  }

  turn(){
    this.dropPiece();
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
}

function browserGame(){
  const game = new Game;
  document.addEventListener('keydown', e => {
          switch(e.key){
            case('ArrowUp'):
              game.rotatePiece();
              break;
            case('ArrowLeft'):
              game.movePiece('left');
              break;
            case('ArrowRight'):
              game.movePiece('right');
              break;
            case('ArrowDown'):
              game.bigDrop();
              break;
          }
        })
  const tick = () => {
    game.turn();
    htmlRender(game);
  }
  const gameTime = setInterval(tick, game.getInterval() * 100);
}

function consoleGame(){
  const game = new Game();
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
          game.rotatePiece();
          break;
        case('left'):
          game.movePiece('left');
          break;
        case('right'):
          game.movePiece('right');
          break;
        case('down'):
          game.bigDrop();
          break;
      }
    }
  });
  const tick = () => {
    game.turn();
    consoleRender(game);
  }
  const runGame = setInterval(tick, game.getInterval() * 100);
}

browserGame();


