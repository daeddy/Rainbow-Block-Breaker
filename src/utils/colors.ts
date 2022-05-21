export type RGBColor = {
  red: number,
  green: number,
  blue: number
}

export const DEFAULT_COLOR: RGBColor = { red: 0xFF, green: 0xFF, blue: 0xFF };

// https://en.wikipedia.org/wiki/HSL_and_HSV#:~:text=8%2CH))%3D%2B1%7D-,HSV%20to%20RGB,-%5Bedit%5D
const HSVToRGB = (hue: number, saturation: number, value: number): RGBColor => {
  if (
    (hue < 0 || hue > 360) ||             // [0, 360]
    (saturation < 0 || saturation > 1) || // [0, 1]
    (value < 0 || value > 1)              // [0, 1]
  ) {
    throw 'Incorrect HSV values [HSVToRGB]'
  }
  const h = hue/60;

  const c = value * saturation; // Chroma

  // Intermediate value X for the second largest component of this color
  const x = c * (1 - Math.abs(h % 2 - 1));

  if (h >= 0 && h < 1) {
    return { red: c * 255, green: x * 255, blue: 0 };
  }
  if (h >= 1 && h < 2) {
    return { red: x * 255, green: c  * 255, blue: 0 };
  }
  if (h >= 2 && h < 3) {
    return { red: 0, green: c  * 255, blue: x * 255 };
  }
  if (h >= 3 && h < 4) {
    return { red: 0, green: x * 255, blue: c  * 255 };
  }
  if (h >= 4 && h < 5) {
    return { red: x * 255, green: 0, blue: c  * 255 };
  }
  if (h >= 5 && h < 6) {
    return { red: c  * 255, green: 0, blue: x * 255 };
  }

  return DEFAULT_COLOR;
}

/*
  Create an "n" length array of rbg colors of increasing hue [0 - 360] 
  with max saturation and value (1 & 1)
*/
export const getRainbowColors = (n: number): RGBColor[]  => {
  const saturation = 1.0;
  const value = 1.0;
  const colors: RGBColor[] = [];

  for (let index: number = 0; index < n; index++) {
    const hue = (360 * index / n); // reduce to factor of 360
    const rgb = HSVToRGB(hue, saturation, value);
    colors.push(rgb); 
  }
  return colors;
}