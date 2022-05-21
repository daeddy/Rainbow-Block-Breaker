import { Bar } from "components";
import { RGBColor } from "utils/colors";

export default class GameCanvas {
  private _canvas: HTMLCanvasElement;
  private _canvasCtx: CanvasRenderingContext2D | null;
  private _imgData!: ImageData;
  private _pixels!: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._canvasCtx = this._canvas.getContext("2d");
    this.width = this._canvas.width;
    this.height = this._canvas.height;
    this.clear();
  }

  public renderBar(bar: Bar) {
    this._canvasCtx.beginPath();
    this._canvasCtx.fillStyle = `rgb(${bar.color.red},${bar.color.green},${bar.color.blue})`;
    this._canvasCtx.fillRect(bar.x, bar.y, bar.width, bar.height);
    this._canvasCtx.stroke();
  }

  public clear() {
    this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._imgData = this._canvasCtx.getImageData(0, 0, this._canvas.width, this._canvas.height);
    this._pixels = this._imgData.data;
  }

  public render() {
    this._canvasCtx.putImageData(this._imgData, 0, 0);
  }

  public setPixel(x: number, y:number, color: RGBColor): void {
    var widthBase = this._imgData.width * 4;
  
    var index = ((y * widthBase) + (x * 4));
    this._pixels[index] = color.red; //R
    this._pixels[index + 1] = color.green; //G
    this._pixels[index + 2] = color.blue; //B
    this._pixels[index + 3] = 0xFF; //A
  }

  public offsetLeft() { return this._canvas.offsetLeft; }
}