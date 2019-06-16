class Grid {

  constructor(height,width){
    this.height = height;
    this.width = width;
  }

  clear(){
    
  }
}

class Space {

  constructor(filled = false, x, y){
    this.filled = filled;
    this.x = x;
    this.y = y;
  }
  
  fill(){
    this.filled = true;
  }

}

class Shape {
  constructor(){}

  rotate(){
    
  }
}
