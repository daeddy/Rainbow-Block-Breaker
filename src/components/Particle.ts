import { RGBColor, DEFAULT_COLOR } from "utils/colors";

class Particle {
  x: number;
  y: number;

  xSpeed: number = 0;
  ySpeed: number = 0;
  color: RGBColor = DEFAULT_COLOR;

  constructor(x: number = 0, y: number = 0, color: RGBColor) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public X(): number {
    return Math.round(this.x);
  }
  public Y(): number {
    return Math.round(this.y);
  }
  public speed(): number {
    return Math.sqrt(this.xSpeed * this.xSpeed + this.xSpeed * this.xSpeed)
  }
  public radian(): number { 
    return Math.atan2(this.ySpeed, this.xSpeed)
  }
}

export default Particle;