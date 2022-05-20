import { RGBColor } from "utils/colors";

class Particle {
  x: number;
  y: number;

  vx: number = 0;
  vy: number = 0;
  color: RGBColor = { red: 255, green: 255, blue: 255 };

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
}

export default Particle;