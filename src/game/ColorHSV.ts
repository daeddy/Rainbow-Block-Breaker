class ColorHSV {
  h: number = 0.0;
  s: number = 1.0;
  v: number = 1.0;
  value(): number[] { return this.hsv2rgb() }

  hsv2rgb() {
    var h = this.h / 60;
    var s = this.s;
    var v = this.v;
    if (s == 0) return [v * 255, v * 255, v * 255];

    var rgb: number[] = [];
    var i = Math.floor(h);;
    var f = h - i;
    var v1 = v * (1 - s);
    var v2 = v * (1 - s * f);
    var v3 = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
      case 6:
        rgb = [v, v3, v1];
        break;

      case 1:
        rgb = [v2, v, v1];
        break;

      case 2:
        rgb = [v1, v, v3];
        break;

      case 3:
        rgb = [v1, v2, v];
        break;

      case 4:
        rgb = [v3, v1, v];
        break;

      case 5:
        rgb = [v, v1, v2];
        break;
    }

    return rgb.map(function (value) {
      return value * 255;
    });
  }

}

export default ColorHSV;