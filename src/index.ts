import BlockBreaker from './game/BlockBreaker';

window.addEventListener("load", (e) => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const container = document.getElementById("container") as HTMLDivElement;
  const width = window.innerWidth > 728 ? 728 : window.innerWidth;
  const height = window.innerWidth > 728 ? 600 : window.innerHeight * 0.85;

  canvas.width = width;
  canvas.height = height;
  new BlockBreaker(container, canvas, width, height);
});