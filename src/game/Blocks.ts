import Particle from './Particle';
import ColorHSV from './ColorHSV';

class Blocks {
  private _count: number;
  count() { return this._count; }
  private _width: number;
  width(): number { return this._width; }
  private _height: number;
  height(): number { return this._height; }
  values: (Particle | undefined)[];
  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._count = width * height;
    this.values = new Array(width * height);
    var c: ColorHSV = new ColorHSV();
    for (var i: number = 0; i < this._width; i++) {
      c.h = 360 * i / this._width;
      for (var j: number = 0; j < this._height; j++) {
        var p: Particle = new Particle(i, j);
        p.color = c.value();
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