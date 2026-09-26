import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const b64 = fs.readFileSync(path.join(root, "public/logo-icon-128.png")).toString("base64");
const dataUri = `data:image/png;base64,${b64}`;

function makeSvg(size, withRing) {
  const r = size / 2;
  const strokeWidth = withRing ? 8 * (size / 512) : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Ashutosh Choudhary logo">
  <defs>
    <clipPath id="logo-circle-${size}"><circle cx="${r}" cy="${r}" r="${r}" /></clipPath>${
      withRing
        ? `
    <linearGradient id="logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>`
        : ""
    }
  </defs>
  <circle cx="${r}" cy="${r}" r="${r}" fill="#070b14" />
  <image href="${dataUri}" width="${size}" height="${size}" clip-path="url(#logo-circle-${size})" preserveAspectRatio="xMidYMid slice" />${
    withRing
      ? `
  <circle cx="${r}" cy="${r}" r="${r - strokeWidth / 2}" fill="none" stroke="url(#logo-ring)" stroke-width="${strokeWidth}" opacity="0.85" />`
      : ""
  }
</svg>`;
}

fs.writeFileSync(path.join(root, "public/logo.svg"), makeSvg(512, true));
fs.writeFileSync(path.join(root, "src/app/icon.svg"), makeSvg(32, false));
fs.writeFileSync(path.join(root, "src/app/apple-icon.svg"), makeSvg(180, false));

console.log("Logo SVG files generated.");
