import BlockBreaker from './game/BlockBreaker';

window.addEventListener("load", (e) => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const adDiv = document.getElementById("adDiv") as HTMLCanvasElement;
  const width = window.innerWidth > 728 ? 728 : window.innerWidth;
  const height = window.innerWidth > 728 ? 600 : window.innerHeight * 0.85;

  canvas.width = width;
  canvas.height = height;
  adDiv.height = window.innerHeight * 0.15;
  new BlockBreaker(canvas, width, height);
});