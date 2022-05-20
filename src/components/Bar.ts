import { RGBColor } from "utils/colors";

const BAR_COLOR: RGBColor = { red: 255, green: 0, blue: 0 };
class Bar {
  x: number = 0;
  y: number = 0;
  width: number = 50;
  height: number = 10;
  color: RGBColor = BAR_COLOR

  hitTestPoint(x:number, y:number):boolean {
    if (x >= this.x && x <= this.x + this.width && y >= this.y  && this.y <= this.y + this.height) {
      return true;
    } else {
      return false;
    }
  }

  constructor(x: number, y: number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export default Bar;