'use strict';

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');

async function renderSlide(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for every CSS background image to finish loading
    await page.evaluate(async () => {
      const elements = Array.from(document.querySelectorAll('*'));

      const urls = elements
        .map(el => getComputedStyle(el).backgroundImage)
        .filter(bg => bg && bg !== 'none')
        .flatMap(bg => {
          const matches = [...bg.matchAll(/url\(["']?(.*?)["']?\)/g)];
          return matches.map(m => m[1]);
        })
        .filter(url => url && url.startsWith('http'));

      const uniqueUrls = [...new Set(urls)];

      await Promise.all(
        uniqueUrls.map(url => new Promise(resolve => {
          const img = new Image();

          img.onload = () => resolve();
          img.onerror = () => resolve();

          img.src = url;
        }))
      );

      // Give Chromium one extra rendering frame
      await new Promise(resolve => requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      }));
    });

    // Debug: report whether background images exist
    const debug = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .map(el => {
          const bg = getComputedStyle(el).backgroundImage;

          return {
            tag: el.tagName,
            backgroundImage: bg,
          };
        })
        .filter(x => x.backgroundImage && x.backgroundImage !== 'none');
    });

    console.log(
      `[Renderer] Background images found: ${debug.length}`
    );

    await page.screenshot({
      path: outputPath,
      type: 'png',
    });

  } finally {
    await browser.close();
  }
}

async function renderAllSlides(htmlSlides) {
  const tmpDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'slides-')
  );

  const pngPaths = [];

  for (let i = 0; i < htmlSlides.length; i++) {
    const outPath = path.join(
      tmpDir,
      `slide-${String(i + 1).padStart(3, '0')}.png`
    );

    await renderSlide(htmlSlides[i], outPath);
    pngPaths.push(outPath);
  }

  return {
    pngPaths,
    tmpDir,
  };
}

module.exports = {
  renderAllSlides,
};
