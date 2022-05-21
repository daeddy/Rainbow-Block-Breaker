import { Blocks, Particle, Bar } from 'components';
import { DEFAULT_COLOR } from 'utils/colors';
import GameCanvas from './GameCanvas';

class BlockBreaker {
  private _canvas: GameCanvas;
  private _blocks!: Blocks;
  private _blocksAreaHeight: number;
  private _fallBlocks!: Set<Particle>;
  private _balls!: Set<Particle>;
  private _bar!: Bar;
  // fps stuff
  private _fps: number = 30;
  private _fpsInterval!: number;
  private _now!: number;
  private _then!: number;
  private _elapsed!: number;

  private _handleWin() {
    alert("Done!\n");
    this.init();
  }

  private _handleLose() {
    alert("Try again");
    this.init();
  }

  private _drawMovingParticle(particle: Particle, particleSet: Set<Particle>) {
    // if out of bounds remove
    if (particle.y > this._canvas.height || particle.y < 0) {
      particleSet.delete(particle);
    } 
    // if particle hit the edges (sides) invert x-direction
    else if ((particle.x < 0 && particle.xSpeed < 0) || (particle.x > this._canvas.width && particle.xSpeed > 0)) {
      particle.invertXDirection();
    }
    // if particle out of bounds (top) invert y-direction
    else if (particle.y < 0 && particle.ySpeed < 0) {
      particle.invertYDirection();
    }
    // in boundry, draw particle pixel
    else {
      this._canvas.setPixel(particle.X(), particle.Y(), particle.color);
    }
  }

  private _update() {
    this._now = Date.now();
    this._elapsed = this._now - this._then;

    if (this._canvas) {
      if (this._elapsed > this._fpsInterval) {
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this._then = this._now - (this._elapsed % this._fpsInterval);

        this._canvas.clear();

        // set block pixels
        this._blocks.values.forEach(block => {
          if (block) {
            this._canvas.setPixel(block.x, block.y, block.color);
          }
        });

        // set ball pixels
        this._balls.forEach(ball => {
          var bSpeed: number = ball.speed();

          // Render a line of length speed
          for (var i = 0; i < bSpeed; i++) {
            ball.x += ball.xSpeed / bSpeed;
            ball.y += ball.ySpeed / bSpeed;

            var hitParticle: Particle | undefined = this._blocks.getParticle(ball.X(), ball.Y());
            if (hitParticle) {
              var removedP: Particle | undefined = this._blocks.removeParticle(ball.X(), ball.Y());
              if (removedP) {
                // hit ball moves at an angle from the coliding ball
                removedP.xSpeed = Math.cos(ball.radian() + Math.PI * 2 / (30 * Math.random()) - 15) * 3;
                removedP.ySpeed = 1;
                removedP.color = hitParticle.color;
                this._fallBlocks.add(removedP);
              }
              // colliding ball inverts y-direction
              ball.invertYDirection();
            }
            // if it hit the bar invert direction
            if (this._bar.collided(ball.x, ball.y)) {
              ball.ySpeed = -Math.abs(ball.ySpeed);
            }
            this._drawMovingParticle(ball, this._balls);
          }
        });

        // set falling blocks pixels
        this._fallBlocks.forEach(fallP => {
          // if hit a bar remove and converto to new ball
          if (this._bar.collided(fallP.x, fallP.y)) {
            var newball: Particle = new Particle(fallP.x, this._canvas.height - this._bar.height + 1, fallP.color);
            newball.xSpeed = Math.random() * 10;
            newball.ySpeed = Math.random() * 9 + 1;

            this._balls.add(newball);
            this._fallBlocks.delete(fallP);
          } else {
            fallP.ySpeed += 0.1;
            fallP.x += fallP.xSpeed;
            fallP.y += fallP.ySpeed;
            // Draw pixel
            this._drawMovingParticle(fallP, this._fallBlocks);
          }
        });

        // Draw everything
        this._canvas.render();
      }

      if (this._blocks.count() == 0) {
        this._handleWin();
      } else if (this._balls.size == 0) {
        this._handleLose();
      } else {
        window.requestAnimationFrame(this._update.bind(this));
      }

      // bar renders independant of fps constraint
      this._canvas.renderBar(this._bar);
    }
  }

  private _touchmove(evt: any) {
    this._bar.x = evt.touches[0].clientX - this._canvas.offsetLeft() - (this._bar.width / 2);
    if (this._bar.x + this._bar.width > this._canvas.width) {
      this._bar.x = this._canvas.width - this._bar.width;
    }
    if (this._bar.x < 0) {
      this._bar.x = 0;
    }
    evt.preventDefault();
  }

  private _mousemove(evt: any) {
    this._bar.x = evt.clientX - this._canvas.offsetLeft() - (this._bar.width / 2);
    if (this._bar.x + this._bar.width > this._canvas.width) {
      this._bar.x = this._canvas.width - this._bar.width;
    }
    if (this._bar.x < 0) {
      this._bar.x = 0;
    }
  }

  public init() {
    this._blocks = new Blocks(this._canvas.width, this._blocksAreaHeight);

    this._fallBlocks = new Set<Particle>();

    const barHeight = 10;
    const barY = this._canvas.height - barHeight - 2;
    this._bar = new Bar(0, barY, 200, barHeight);

    // Start with white ball in the middle
    var _initialBall: Particle = new Particle(this._canvas.width / 2, this._canvas.height / 2, DEFAULT_COLOR);
    _initialBall.xSpeed = Math.random() * 10;
    _initialBall.ySpeed = Math.random() * 9 - 1;

    this._balls = new Set<Particle>();
    this._balls.add(_initialBall);

    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();

    window.requestAnimationFrame(this._update.bind(this));
  }

  constructor(container: HTMLDivElement, canvas: HTMLCanvasElement, blocksAreaHeight: number) {
    this._canvas = new GameCanvas(canvas);
    this._blocksAreaHeight = blocksAreaHeight;
    // Controll is the entire container area 
    container.addEventListener('mousemove', this._mousemove.bind(this), false);
    container.addEventListener('touchmove', this._touchmove.bind(this), false);
  }
}

export default BlockBreaker;
