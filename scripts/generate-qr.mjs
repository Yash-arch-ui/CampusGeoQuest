import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const OUT_DIR = "public/qr";
const TOKENS = Array.from({ length: 10 }, (_, i) => `GEOQUEST:ST-${String(i + 1).padStart(2, "0")}`);

await mkdir(OUT_DIR, { recursive: true });

for (const token of TOKENS) {
  const n = token.slice(-2);
  await QRCode.toFile(`${OUT_DIR}/station-${n}.png`, token, {
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#08080A", light: "#FFFFFF" },
  });
  console.log(`generated station-${n}.png  (${token})`);
}

const rows = TOKENS.map((token) => {
  const n = token.slice(-2);
  return `
    <figure>
      <img src="./station-${n}.png" alt="Station ${n} QR code" />
      <figcaption>Station ${n}<br /><code>${token}</code></figcaption>
    </figure>`;
}).join("");

const sheet = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Campus GeoQuest — QR sheet</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #fff; color: #08080a; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      p { margin: 0 0 24px; font-size: 12px; color: #555; }
      main { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      figure { margin: 0; border: 1px solid #ddd; border-radius: 12px; padding: 16px; text-align: center; break-inside: avoid; }
      img { width: 100%; max-width: 320px; height: auto; }
      figcaption { margin-top: 8px; font-size: 14px; font-weight: 600; }
      code { font-size: 10px; font-weight: 400; color: #666; }
      @media print {
        body { padding: 0; }
        main { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        figure { border: 1px solid #ccc; }
      }
    </style>
  </head>
  <body>
    <h1>Campus GeoQuest — Station QR codes</h1>
    <p>Print, cut out, and place each code at its station. Tokens must stay exactly as shown.</p>
    <main>${rows}
    </main>
  </body>
</html>
`;

await writeFile(`${OUT_DIR}/print-sheet.html`, sheet);
console.log(`generated print-sheet.html`);
