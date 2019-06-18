class Grid {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  clear() {}
}

class Space {
  constructor(filled = false, x, y) {
    this.filled = filled;
    this.x = x;
    this.y = y;
  }

  fill() {
    this.filled = true;
  }
}

const gameData = {
  startingPosition: { x: 40, y: 0 }
};

const shapes = {
  square: {
    bricks: [[0,0],[0,1],[1,0],[1,1]],
  },
  longBar: {
    bricks: [[0,0],[0,1],[0,2],[0,3]],
  },
  leftL: {
    bricks: [[0,0],[0,1],[0,2],[1,2]],
  },
  rightL: {
    bricks: [[1,0],[1,1],[1,2],[0,2]],
  },
  leftS: {
    bricks: [[0,0],[1,0],[1,1],[1,2]],
  },
  rightS: {},
  threeBar: {}
};

class Shape {
  constructor(type) {}

  rotate() {}
}
