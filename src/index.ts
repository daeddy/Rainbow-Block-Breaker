import BlockBreaker from './game';

const MIN_WIDTH = 700;
const MIN_HEIGHT = 600;

window.addEventListener("load", (e) => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const container = document.getElementById("container") as HTMLDivElement;
  const width = window.innerWidth > MIN_WIDTH ? MIN_WIDTH : window.innerWidth;
  const height = window.innerWidth > MIN_WIDTH ? MIN_HEIGHT : window.innerHeight * 0.85;

  canvas.width = width;
  canvas.height = height;
  const game = new BlockBreaker(container, canvas, 100);

  game.init();
});