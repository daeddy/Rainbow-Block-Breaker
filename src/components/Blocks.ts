import Particle from './Particle';
import { getRainbowColors } from 'utils/colors';

class Blocks {
  private _count: number;
  private _width: number;
  private _height: number;
  
  count() { return this._count; }
  width(): number { return this._width; }
  height(): number { return this._height; }

  values: (Particle | undefined)[];

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._count = width * height;
    this.values = new Array(width * height);

    const rainbowColors = getRainbowColors(this._width);
    for (var i: number = 0; i < this._width; i++) {
      for (var j: number = 0; j < this._height; j++) {
        var p: Particle = new Particle(i, j, rainbowColors[i]);
        this.values[i + j * this._width] = p;
      }
    }
  }

  getParticle(x: number, y: number): Particle | undefined {
    var index: number = x + y * this._width;
    if (index >= this.values.length || index < 0) {
      return undefined;
    }
    return this.values[x + y * this._width];
  }

  removeParticle(x: number, y: number): Particle | undefined {
    var p: Particle | undefined = this.values[x + y * this._width];
    if (p) {
      this._count--;
      this.values[x + y * this._width] = undefined;
    }
    return p;
  }
}

export default Blocks;