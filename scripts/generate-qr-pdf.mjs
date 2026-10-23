import { readFile, writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const STATIONS = Array.from({ length: 10 }, (_, i) => ({
  n: String(i + 1).padStart(2, "0"),
}));

const INK = rgb(0.031, 0.031, 0.039);
const MUTED = rgb(0.42, 0.44, 0.48);
const HAIRLINE = rgb(0.85, 0.85, 0.87);

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const COLS = 2;
const ROWS = 2;
const PER_PAGE = 4;

const doc = await PDFDocument.create();
const font = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);

const images = new Map();
for (const station of STATIONS) {
  const bytes = await readFile(`public/qr/station-${station.n}.png`);
  images.set(station.n, await doc.embedPng(bytes));
}

const PAGE_COUNT = Math.ceil(STATIONS.length / PER_PAGE);
const gridTop = PAGE_H - 118;
const cellW = (PAGE_W - MARGIN * 2) / COLS;
const cellH = (gridTop - MARGIN) / ROWS;
const qrSize = Math.min(cellW - 36, cellH - 90);

const pageLabel = (page, total) =>
  `${page} / ${total}`;

for (let pageIndex = 0; pageIndex < PAGE_COUNT; pageIndex++) {
  const page = doc.addPage([PAGE_W, PAGE_H]);

  page.drawText("Campus GeoQuest", {
    x: MARGIN,
    y: PAGE_H - 58,
    size: 20,
    font: bold,
    color: INK,
  });
  page.drawText("Ten locations. Ten clues. One trail.", {
    x: MARGIN,
    y: PAGE_H - 76,
    size: 9,
    font,
    color: MUTED,
  });
  page.drawText("Location QR codes", {
    x: MARGIN,
    y: PAGE_H - 92,
    size: 9,
    font: bold,
    color: MUTED,
  });
  const pageText = pageLabel(pageIndex + 1, PAGE_COUNT);
  page.drawText(pageText, {
    x: PAGE_W - MARGIN - font.widthOfTextAtSize(pageText, 9),
    y: PAGE_H - 58,
    size: 9,
    font,
    color: MUTED,
  });
  page.drawText("Print at 100% scale. Cut along the boxes.", {
    x: MARGIN,
    y: PAGE_H - 108,
    size: 8,
    font,
    color: MUTED,
  });

  for (let slot = 0; slot < PER_PAGE; slot++) {
    const index = pageIndex * PER_PAGE + slot;
    if (index >= STATIONS.length) break;
    const station = STATIONS[index];

    const col = slot % COLS;
    const row = Math.floor(slot / COLS);
    const cellX = MARGIN + col * cellW;
    const cellTop = gridTop - row * cellH;

    page.drawRectangle({
      x: cellX + 6,
      y: cellTop - cellH + 8,
      width: cellW - 12,
      height: cellH - 16,
      borderColor: HAIRLINE,
      borderWidth: 0.8,
    });

    const contentH = qrSize + 34;
    const qrTop = cellTop - (cellH - contentH) / 2;
    const qrX = cellX + (cellW - qrSize) / 2;
    const qrY = qrTop - qrSize;
    page.drawImage(images.get(station.n), {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    const label = `Location ${station.n}`;
    const labelSize = 9.5;
    const labelWidth = bold.widthOfTextAtSize(label, labelSize);
    page.drawText(label, {
      x: cellX + (cellW - labelWidth) / 2,
      y: qrY - 17,
      size: labelSize,
      font: bold,
      color: INK,
    });

    const token = `GEOQUEST:ST-${station.n}`;
    const tokenSize = 7.5;
    const tokenWidth = font.widthOfTextAtSize(token, tokenSize);
    page.drawText(token, {
      x: cellX + (cellW - tokenWidth) / 2,
      y: qrY - 29,
      size: tokenSize,
      font,
      color: MUTED,
    });
  }

  page.drawText("Campus GeoQuest · Geological Trail", {
    x: MARGIN,
    y: 22,
    size: 7.5,
    font,
    color: MUTED,
  });
}

const bytes = await doc.save();
await writeFile("public/qr/campus-geoquest-qr.pdf", bytes);
console.log(`generated campus-geoquest-qr.pdf (${PAGE_COUNT} pages, ${STATIONS.length} codes)`);
