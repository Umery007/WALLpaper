export const DEFAULT_THEME_COLOR = "#ff3038";

function toReadableAccent(hexColor) {
  if (hexColor.toLowerCase() === DEFAULT_THEME_COLOR) {
    return {
      accent: DEFAULT_THEME_COLOR,
      accentHex: DEFAULT_THEME_COLOR,
    };
  }

  const red = parseInt(hexColor.slice(1, 3), 16) / 255;
  const green = parseInt(hexColor.slice(3, 5), 16) / 255;
  const blue = parseInt(hexColor.slice(5, 7), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;

  if (delta !== 0) {
    if (maximum === red) hue = ((green - blue) / delta) % 6;
    else if (maximum === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  hue = Math.round(((hue * 60 + 360) % 360) * 10) / 10;
  const lightness = (maximum + minimum) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  const readableLightness = Math.max(Math.round(lightness * 100), 62);
  const normalizedSaturation = Math.round(saturation * 100);

  const chroma = (1 - Math.abs((2 * readableLightness) / 100 - 1)) *
    (normalizedSaturation / 100);
  const hueSection = hue / 60;
  const secondary = chroma * (1 - Math.abs((hueSection % 2) - 1));
  const [redChannel, greenChannel, blueChannel] = hueSection < 1
    ? [chroma, secondary, 0]
    : hueSection < 2
      ? [secondary, chroma, 0]
      : hueSection < 3
        ? [0, chroma, secondary]
        : hueSection < 4
          ? [0, secondary, chroma]
          : hueSection < 5
            ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const offset = readableLightness / 100 - chroma / 2;
  const channels = [redChannel, greenChannel, blueChannel].map((channel) =>
    Math.round((channel + offset) * 255),
  );
  const accentHex = `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;

  return { accent: `hsl(${hue} ${normalizedSaturation}% ${readableLightness}%)`, accentHex };
}

function getRelativeLuminance(hexColor) {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hexColor.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function applyThemeColor(hexColor) {
  if (!/^#[\da-f]{6}$/i.test(hexColor)) return;

  const { accent, accentHex } = toReadableAccent(hexColor);
  const accentLuminance = getRelativeLuminance(accentHex);
  const darkTextContrast = (accentLuminance + 0.05) / 0.05;
  const whiteTextContrast = 1.05 / (accentLuminance + 0.05);
  const textColor = darkTextContrast > whiteTextContrast ? "#111827" : "#ffffff";
  const root = document.documentElement;

  root.style.setProperty("--primary-color", hexColor);
  root.style.setProperty("--primary-color-accent", accent);
  root.style.setProperty("--primary-color-ink", textColor);

  if (hexColor.toLowerCase() === DEFAULT_THEME_COLOR) {
    root.style.setProperty("--primary-button-bg", "#f3f4f6");
    root.style.setProperty("--primary-button-ink", "#111827");
    root.removeAttribute("data-custom-theme");
  } else {
    root.style.setProperty("--primary-button-bg", accent);
    root.style.setProperty("--primary-button-ink", textColor);
    root.setAttribute("data-custom-theme", "true");
  }
}
