class Particle {
  x:number;
  y:number;

  vx:number = 0;
  vy:number = 0;
  color:number[] = [];
  constructor(x:number=0, y:number=0 ) {
      this.x = x;
      this.y = y;
  }

  public X():number {
      return Math.round(this.x);
  }
  public Y():number {
      return Math.round(this.y);
  }
}

export default Particle;