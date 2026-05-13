import { lerp } from "./Types";

export interface IRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface IHSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

export function lerpRGBA(color1: IRGBA, color2: IRGBA, t: number): IRGBA {
  return {
    r: lerp(color1.r, color2.r, t),
    g: lerp(color1.g, color2.g, t),
    b: lerp(color1.b, color2.b, t),
    a: lerp(color1.a, color2.a, t)
  };
}



export class Colors {
  static black_ish = Colors.toRGB(0x222);
  static gray = Colors.toRGB(0x777);
  static white_ish = Colors.toRGB(0xDDD);
  static white = Colors.toRGB(0xFFF);
  static red = Colors.toRGB(0xF40);
  static yellow = Colors.toRGB(0xDB3);
  static green = Colors.toRGB(0x0A6);
  static blue = Colors.toRGB(0x39E);
  static orange = Colors.toRGB(0xF80);
  static transparent = { r: 0, g: 0, b: 0, a: 0 };
  static dark_red = Colors.darken(Colors.red);
  static dark_yellow = Colors.darken(Colors.yellow);
  static dark_green = Colors.darken(Colors.green);
  static dark_blue = Colors.darken(Colors.blue);
  static light_gray = Colors.lighten(Colors.gray);
  static dark_orange = Colors.darken(Colors.orange);
  static semi_black = { r: 60, g: 60, b: 60, a: 160 };
  static semi_white = { r: 200, g: 200, b: 200, a: 160 };

  static toRGB(colorNumber: number): IRGBA {
    if (typeof colorNumber === "string") return colorNumber;
    // Convert the numeric color to hexadecimal
    let r = (colorNumber & 3840) >> 8;
    let g = (colorNumber & 240) >> 4;
    let b = colorNumber & 15;
    return {
      r: r * 17,
      g: g * 17,
      b: b * 17,
      a: 255
    };
  }

  static toCss(rgba: IRGBA) {
    const { r, g, b, a } = rgba;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }

  static lighten(color: IRGBA, factor: number = 0.2): IRGBA {
    const r = Math.min(255, color.r + (255 - color.r) * factor);
    const g = Math.min(255, color.g + (255 - color.g) * factor);
    const b = Math.min(255, color.b + (255 - color.b) * factor);
    return { r, g, b, a: color.a };
  }

  // Function to make a color darker by a specified factor
  static darken(color: IRGBA, factor: number = 0.3): IRGBA {
    if (typeof color === 'number') {
      color = Colors.toRGB(color);
    }
    const r = color.r * (1 - factor);
    const g = color.g * (1 - factor);
    const b = color.b * (1 - factor);
    return { r, g, b, a: color.a };
  }

  static byLetter: Record<string | number, IRGBA> = {
    "○": Colors.red,
    "✕": Colors.blue,
    "□": Colors.green,
    "△": Colors.yellow,
    "◉": Colors.yellow,
    "·": Colors.gray,
    S: Colors.red,
    L: Colors.blue,
    E: Colors.green,
    G: Colors.yellow,
    O: Colors.red,
    ".": Colors.red,
    ",": Colors.red,
    ":": Colors.red,
    ";": Colors.red,
    "!": Colors.blue,
    "?": Colors.green,
    "'": Colors.yellow,
    '"': Colors.yellow,
    "(": Colors.yellow,
    ")": Colors.yellow,
    "<": Colors.blue,
    ">": Colors.blue,
    "/": Colors.green,
    "|": Colors.gray,
    "@": Colors.green,
    "↑": Colors.red,
    "↓": Colors.red,
    "←": Colors.red,
    "→": Colors.red
  };

  static hslToRgb(h: number, s: number, l: number, a = 1): IRGBA {
    let r, g, b;
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    let byte = (a: number) => {
      if (a <= 0) return 0;
      if (a >= 1) return 255;
      return (a * 255) | 0;
    }
    return { r: byte(r), g: byte(g), b: byte(b), a: byte(a) };
  }

  static rgbaToHsl({ r, g, b, a }: IRGBA): IHSLA {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number, s: number, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // Achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l, a: a / 255 };
  }

}
