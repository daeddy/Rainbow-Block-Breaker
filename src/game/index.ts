import { Blocks, Particle, Bar, GameCanvas } from 'components';
import { DEFAULT_COLOR } from 'utils/colors';

class BlockBreaker {
  private _height: number;
  private _width: number;
  private _canvas: GameCanvas;
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

    if (this._canvas) {
      if (this._elapsed > this._fpsInterval) {
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this._then = this._now - (this._elapsed % this._fpsInterval);

        this._canvas.clear();

        // render blocks
        this._blocks.values.forEach(block => {
          if (block) {
            this._canvas.setPixel(block.x, block.y, block.color);
          }
        });

        var removeBalls: Particle[] = new Array();
        this._balls.forEach(ball => {
          var bSpeed: number = ball.speed();
          var bRadian: number = ball.radian();

          // Render a line of length speed
          for (var i = 0; i < bSpeed; i++) {
            ball.x += ball.xSpeed / bSpeed;
            ball.y += ball.ySpeed / bSpeed;

            var hitParticle: Particle | undefined = this._blocks.getParticle(ball.X(), ball.Y());
            if (hitParticle) {
              var removedP: Particle | undefined = this._blocks.removeParticle(ball.X(), ball.Y());
              if (removedP) {
                // hit particle moves at an angle from the coliding ball
                removedP.xSpeed = Math.cos(bRadian + Math.PI * 2 / (30 * Math.random()) - 15) * 3;
                removedP.ySpeed = 1;
                removedP.color = hitParticle.color;
                this._fallBlocks.push(removedP);
              }
              // colliding ball inverts y-direction
              ball.invertYDirection();
            }

            // if ball hit the edges invert x-direction
            if ((ball.x < 0 && ball.xSpeed < 0) || (ball.x > this._width && ball.xSpeed > 0)) {
              ball.invertXDirection();
            }
            // if ball out of bounds (top) invert y-direction
            if (ball.y < 0 && ball.ySpeed < 0) {
              ball.invertYDirection();
            }
            // if ball out of bounds (bottom) remove
            if (ball.y > this._height || ball.y < 0) {
              removeBalls.push(ball);
            }
            // if it hit the bar invert direction
            if (this._bar.hitTestPoint(ball.x, ball.y)) {
              ball.ySpeed = -Math.abs(ball.ySpeed);
            }

            this._canvas.setPixel(ball.X(), ball.Y(), ball.color);
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
          fallP.ySpeed += 0.1;
          fallP.x += fallP.xSpeed;
          if (fallP.x < 0) {
            fallP.x += this._width;
          }
          fallP.y += fallP.ySpeed;
          this._canvas.setPixel(fallP.X(), fallP.Y(), fallP.color);

          if (this._bar.hitTestPoint(fallP.x, fallP.y)) {
            var newball: Particle = new Particle(fallP.x, fallP.y, fallP.color);
            newball.xSpeed = Math.random() * 10;
            newball.ySpeed = Math.random() * 9 + 1;
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

        // Draw
        this._canvas.render();
      }

      if (this._blocks.count() == 0) {
        alert("Done!\n");
        this.init();
      } else if (this._balls.length == 0) {
        alert("Try again");
        this.init();
      } else {
        window.requestAnimationFrame(this.update.bind(this));
      }

      // bar renders independant of fps constraint
      this._canvas.renderBar(this._bar);
    }
  }

  public touchmove = (evt: any) => {
    this._bar.x = evt.touches[0].clientX - this._canvas.offsetLeft() - (this._bar.width / 2);
    if (this._bar.x + this._bar.width > this._width) {
      this._bar.x = this._width - this._bar.width;
    }
    if (this._bar.x < 0) {
      this._bar.x = 0;
    }
    evt.preventDefault();
  }

  public mousemove = (evt: any) => {
    this._bar.x = evt.clientX - this._canvas.offsetLeft() - (this._bar.width / 2);
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

    const barHeight = 10;
    const barY = this._height - barHeight - 2;
    this._bar = new Bar(0, barY, 200, barHeight);

    // Start with white ball in the middle
    var _initialBall: Particle = new Particle(this._width / 2, this._height / 2, DEFAULT_COLOR);
    _initialBall.xSpeed = Math.random() * 100;
    _initialBall.ySpeed = Math.random() * 9 - 1;

    this._balls = new Array();
    this._balls.push(_initialBall);

    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();

    window.requestAnimationFrame(this.update.bind(this));
  }

  constructor(container: HTMLDivElement, canvas: HTMLCanvasElement, width: number, height: number) {
    this._width = width;
    this._height = height;
    this._canvas = new GameCanvas(canvas);

    // Controll is the entire container area 
    container.addEventListener('mousemove', this.mousemove.bind(this), false);
    container.addEventListener('touchmove', this.touchmove.bind(this), false);

    this.init();
  }
}

export default BlockBreaker;
