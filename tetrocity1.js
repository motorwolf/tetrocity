const HEIGHT = 25;
const WIDTH = 10;
const STARTING_POSITION = WIDTH/2;
const SHAPES = {
  square: [
    "11",
    "11",
  ],
  rightL:
  [
    "1.",
    "1.",
    "11",
  ],
  line: [
    "1",
    "1",
    "1",
    "1",
  ]

}

class Grid {

  constructor(){
    this.grid = [];
    this.interval = 3;
    for(let r = 0; r < HEIGHT; r++){
      let row = [];
      for(let c = 0; c < WIDTH; c++){
        row = [...row, 0];
      }
      this.grid = [...this.grid, row]
    }
    this.piece = {
      row: 0,
      col: Math.floor((WIDTH - 1)/2),
      shape: 'square', 
    }
  }
  
  logGrid(){
    this.grid.forEach(row => {
      console.log(row.join(''))
    })
    console.log("GRID ENDS HERE ==============")
  }

  renderPiece(shape, fill=true){
    this.piece.shape = shape;
    for(let r = 0; r < shape.length; r++){
      for(let c = 0; c < shape[0].length; c++){
        if(shape[r][c] === '1'){
          this.grid[this.piece.row + r][this.piece.col + c] = fill ? 1 : 0;
        }
      }
    }
  }
  dropPiece() {
    this.renderPiece(this.piece.shape, false);
    this.piece.row = this.piece.row + 1;
    this.renderPiece(this.piece.shape);
    this.logGrid()
  }
}
  

let griddy = new Grid;
griddy.renderPiece(SHAPES.square)
const drop = setInterval(() => griddy.dropPiece(), 1500)
const logTheEnd = () => {
  console.log('the end');
}
setTimeout(() => {
  clearInterval(drop);
  logTheEnd();
}, 20000)

