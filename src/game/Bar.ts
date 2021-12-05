class Bar {
  x:number = 0;
  y:number = 0;
  width:number = 50;
  height:number = 10;

  hitTestPoint(x:number, y:number):boolean {
      if (x >= this.x && x <= this.x + this.width && y >= this.y  && this.y <= this.y + this.height) {
          return true;
      } else {
          return false;
      }
  }

  constructor(width:number, height:number) {
      this.width = width;
      this.height = height;
  }
}

export default Bar;