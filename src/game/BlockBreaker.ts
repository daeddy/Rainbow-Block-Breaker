import Blocks from './Blocks';
import Particle from './Particle';
import Bar from './Bar';

class BlockBreaker {
  private _height: number;
  private _width: number;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D | null;
  private _data!: ImageData;
  private _blocks!: Blocks;
  private _fallBlocks!: Particle[];
  private _balls!: Particle[];
  private _bar!: Bar;
  // fps stuff
  private _fps: number = 30;
  private _fpsInterval!: number;
  private _now!: number;
  private _then!: number;
  private _elapsed!: number;


  public update = () => {
    this._now = Date.now();
    this._elapsed = this._now - this._then;

    if (this._ctx) {
      if (this._elapsed > this._fpsInterval) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._data = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);

        var widthBase = this._data.width * 4;
        var data = this._data.data;
        this._blocks.values.forEach(block => {
          if (block) {
            //_canvas.setPixel(block.x, block.y, block.color);
            var idx = ((block.y * widthBase) + (block.x * 4));
            data[idx] = block.color[0]; //R
            data[idx + 1] = block.color[1]; //G
            data[idx + 2] = block.color[2]; //B
            data[idx + 3] = 0xFF; //A
          }
        });


        var removeBalls: Particle[] = new Array();
        this._balls.forEach(ball => {

          var bvx: number = ball.vx;
          var bvy: number = ball.vy;
          var bspeed: number = Math.sqrt(bvx * bvx + bvy * bvy);
          var bradius: number = Math.atan2(bvy, bvx);
          for (var i = 0; i < bspeed; i++) {
            ball.x += ball.vx / bspeed;
            ball.y += ball.vy / bspeed;

            var hitParticle: Particle | undefined = this._blocks.getParticle(ball.X(), ball.Y());
            if (hitParticle) {
              var removedP: Particle | undefined = this._blocks.removeParticle(ball.X(), ball.Y());
              if (removedP) {
                removedP.vx = Math.cos(bradius + Math.PI * 2 / (30 * Math.random()) - 15) * 3;
                removedP.vy = 1;
                removedP.color = hitParticle.color;
                this._fallBlocks.push(removedP);
              }
              ball.vy = -ball.vy;
            }

            if ((ball.x < 0 && ball.vx < 0) || (ball.x > this._width && ball.vx > 0)) {
              ball.vx = -ball.vx;
            }
            if (ball.y < 0 && ball.vy < 0) {
              ball.vy = -ball.vy;
            }
            if (ball.y > this._height) {
              removeBalls.push(ball);
            }
            if (this._bar.hitTestPoint(ball.x, ball.y)) {
              ball.vy = -Math.abs(ball.vy);
            }

            //_canvas.setPixel(ball.x, ball.y, ball.color);\
            var idx = (ball.Y() * widthBase) + (ball.X() * 4);
            data[idx] = ball.color[0]; //R
            data[idx + 1] = ball.color[1]; //G
            data[idx + 2] = ball.color[2]; //B
            data[idx + 3] = 0xFF; //A
          }
        });

        removeBalls.forEach(b => {
          var index = this._balls.indexOf(b);
          if (index != -1) {
            this._balls.splice(index, 1);
          }
        });

        var removeFallBs: Particle[] = new Array();
        this._fallBlocks.forEach(fallP => {
          fallP.vy += 0.1;
          fallP.x += fallP.vx;
          if (fallP.x < 0) {
            fallP.x += this._width;
          }
          fallP.y += fallP.vy;
          //_canvas.setPixel(fallP.x, fallP.y, fallP.color);
          var idx = ((fallP.Y() * widthBase) + (fallP.X() * 4));
          data[idx] = fallP.color[0]; //R
          data[idx + 1] = fallP.color[1]; //G
          data[idx + 2] = fallP.color[2]; //B
          data[idx + 3] = 0xFF; //A

          if (this._bar.hitTestPoint(fallP.x, fallP.y)) {
            var newball: Particle = new Particle(fallP.x, fallP.y);
            newball.vx = Math.random() * 10;
            newball.vy = Math.random() * 9 + 1;
            newball.color = fallP.color;
            this._balls.push(newball);
            removeFallBs.push(fallP);
          } else if (fallP.y > this._height) {
            removeFallBs.push(fallP);
          }
        });

        removeFallBs.forEach(b => {
          var index = this._fallBlocks.indexOf(b);
          if (index != -1) {
            this._fallBlocks.splice(index, 1);
          }
        });

        //描画
        this._ctx.putImageData(this._data, 0, 0);
      }

      if (this._blocks.count() == 0) {
        alert("CLEAR!\nおめでと");
        this.init();
      } else if (this._balls.length == 0) {
        alert("ゲームオーバー");
        this.init();
      } else {
        window.requestAnimationFrame(this.update.bind(this));
      }

      //bar
      this._ctx.beginPath();
      this._ctx.fillStyle = "red";
      this._ctx.fillRect(this._bar.x, this._bar.y, this._bar.width, this._bar.height);
      this._ctx.stroke();


      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      this._then = this._now - (this._elapsed % this._fpsInterval);
    }
  }

  public touchmove = (evt: any) => {
    this._bar.x = evt.touches[0].clientX - this._canvas.offsetLeft - (this._bar.width / 2);
    if (this._bar.x + this._bar.width > this._width) {
      this._bar.x = this._width - this._bar.width;
    }
    if (this._bar.x < 0) {
      this._bar.x = 0;
    }
    evt.preventDefault();
  }

  public mousemove = (evt: any) => {
    this._bar.x = evt.clientX - this._canvas.offsetLeft - (this._bar.width / 2);
    if (this._bar.x + this._bar.width > this._width) {
      this._bar.x = this._width - this._bar.width;
    }
    if (this._bar.x < 0) {
      this._bar.x = 0;
    }
  }

  public init = () => {
    this._blocks = new Blocks(this._width, 200);

    this._fallBlocks = new Array();

    this._bar = new Bar(200, 10);
    this._bar.y = this._height - this._bar.height - 2;

    var _ball: Particle = new Particle(this._width / 2, this._height / 2);
    _ball.vx = Math.random() * 10;
    _ball.vy = -Math.random() * 9 - 1;
    _ball.color = [0xFF, 0xFF, 0xFF];

    this._balls = new Array();
    this._balls.push(_ball);

    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();

    window.requestAnimationFrame(this.update.bind(this));
  }

  constructor(container: HTMLDivElement, canvas: HTMLCanvasElement, width: number, height: number) {
    this._width = width;
    this._height = height;
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
    // Controll is the entire container area 
    container.addEventListener('mousemove', this.mousemove.bind(this), false);
    container.addEventListener('touchmove', this.touchmove.bind(this), false);

    this.init();
  }
}

export default BlockBreaker;
