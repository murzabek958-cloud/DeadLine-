'use strict';

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');

async function renderSlide(html, outputPath) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || '/data/data/com.termux/files/usr/bin/chromium-browser',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.screenshot({ path: outputPath, type: 'png' });
  } finally {
    await browser.close();
  }
}

async function renderAllSlides(htmlSlides) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slides-'));
  const pngPaths = [];

  for (let i = 0; i < htmlSlides.length; i++) {
    const outPath = path.join(tmpDir, `slide-${String(i + 1).padStart(3, '0')}.png`);
    await renderSlide(htmlSlides[i], outPath);
    pngPaths.push(outPath);
  }

  return { pngPaths, tmpDir };
}

module.exports = { renderAllSlides };
