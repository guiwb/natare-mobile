export const DEFAULT_BRAND_COLOR = '#4285F4';

const MIN_LUMINANCE = 0.12;
const MAX_LUMINANCE = 0.3;

type Triple = [number, number, number];

function hexToRgb(hex: string): Triple {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(rgb: Triple): string {
  const channels = rgb.map((channel) =>
    Math.round(channel).toString(16).padStart(2, '0'),
  );
  return `#${channels.join('')}`.toUpperCase();
}

function relativeLuminance(rgb: Triple): number {
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function rgbToHsl(rgb: Triple): Triple {
  const [red, green, blue] = rgb.map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) return [0, 0, lightness];

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue: number;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;

  return [hue / 6, saturation, lightness];
}

function hslToRgb([hue, saturation, lightness]: Triple): Triple {
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset: number) => {
    const k = (offset + hue * 12) % 12;
    return (
      255 * (lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1)))
    );
  };
  return [channel(0), channel(8), channel(4)];
}

export function readableBrandColor(hex: string): string {
  const rgb = hexToRgb(hex);
  const luminance = relativeLuminance(rgb);

  if (luminance >= MIN_LUMINANCE && luminance <= MAX_LUMINANCE) {
    return hex.toUpperCase();
  }

  const tooLight = luminance > MAX_LUMINANCE;
  const target = tooLight ? MAX_LUMINANCE : MIN_LUMINANCE;
  const [hue, saturation, lightness] = rgbToHsl(rgb);
  let low = tooLight ? 0 : lightness;
  let high = tooLight ? lightness : 1;

  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (relativeLuminance(hslToRgb([hue, saturation, middle])) > target) {
      high = middle;
    } else {
      low = middle;
    }
  }

  return rgbToHex(hslToRgb([hue, saturation, tooLight ? low : high]));
}

export function withAlpha(hex: string, alpha: number): string {
  const [red, green, blue] = hexToRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function shiftLightness(hex: string, delta: number): string {
  const [hue, saturation, lightness] = rgbToHsl(hexToRgb(hex));
  const shifted = Math.min(1, Math.max(0, lightness + delta));
  return rgbToHex(hslToRgb([hue, saturation, shifted]));
}

export function deepShade(
  hex: string,
  maxSaturation = 0.52,
  lightness = 0.08,
): string {
  const [hue, saturation] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(
    hslToRgb([hue, Math.min(saturation, maxSaturation), lightness]),
  );
}
