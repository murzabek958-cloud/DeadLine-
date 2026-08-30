'use strict';

require('dotenv').config();

const { generateSlides, reviewAndImproveSlides } = require('./pipeline/gemini');
const { fetchImage } = require('./pipeline/unsplash');
const { buildSlideHTML } = require('./pipeline/htmlBuilder');
const { renderAllSlides } = require('./pipeline/renderer');
const { exportToPptx } = require('./pipeline/pptxExporter');
const fs = require('fs');

async function generatePresentation(topic) {
  console.log(`[Pipeline] Topic: ${topic}`);

  // 1. Gemini — generate slide content
  console.log('[Pipeline] Generating content with Gemini...');
  const presentation = await generateSlides(topic);
  console.log(`[Pipeline] ${presentation.slides.length} slides generated`);

  // 2. Gemini — review and improve (QC pass)
  console.log('[Pipeline] Running visual QC with Gemini...');
  const reviewedPresentation = await reviewAndImproveSlides(presentation);
  console.log('[Pipeline] QC complete');

  const { slides, title } = reviewedPresentation;

  // 3. Unsplash + HTML — fetch image and build HTML for each slide
  console.log('[Pipeline] Fetching images and building HTML...');
  const htmlSlides = [];

  for (const slide of slides) {
    console.log(`[Image] query="${slide.imageQuery}"`);
    const imageUrl = await fetchImage(typeof slide.imageQuery === 'string' ? slide.imageQuery : '');
    const html = buildSlideHTML(slide, imageUrl);
    htmlSlides.push(html);
  }

  // 4. Renderer — HTML → PNG
  console.log('[Pipeline] Rendering slides to PNG...');
  const { pngPaths, tmpDir } = await renderAllSlides(htmlSlides);

  // 5. PPTX — PNG → PPTX
  console.log('[Pipeline] Exporting to PPTX...');
  const pptxPath = await exportToPptx(pngPaths, title);

  // Cleanup temp PNGs
  try {
    for (const p of pngPaths) fs.unlinkSync(p);
    fs.rmdirSync(tmpDir);
  } catch {}

  console.log(`[Pipeline] Done: ${pptxPath}`);
  return { pptxPath, title };
}

module.exports = { generatePresentation };
