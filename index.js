'use strict';

require('dotenv').config();

const { generateSlides, reviewAndImproveSlides, parseUserInput } = require('./pipeline/gemini');
const { fetchImage }    = require('./pipeline/unsplash');
const { buildSlideHTML } = require('./pipeline/htmlBuilder');
const { renderAllSlides } = require('./pipeline/renderer');
const { exportToPptx }  = require('./pipeline/pptxExporter');
const fs = require('fs');

async function generatePresentation(userInput) {
  // Пайдаланушы енгізуін парсинг жаса
  const { topic, slideCount, language, style } = parseUserInput(userInput);

  console.log(`[Pipeline] Topic: ${topic}`);
  if (slideCount) console.log(`[Pipeline] Slides: ${slideCount}`);
  if (language)   console.log(`[Pipeline] Language: ${language}`);
  if (style)      console.log(`[Pipeline] Style: ${style}`);

  // 1. Генерация
  console.log('[Pipeline] Generating content with Gemini...');
  const presentation = await generateSlides(topic, { slideCount, language, style });
  console.log(`[Pipeline] ${presentation.slides.length} slides generated`);

  // 2. Review
  console.log('[Pipeline] Running visual QC with Gemini...');
  const reviewed = await reviewAndImproveSlides(presentation);
  console.log('[Pipeline] QC complete');

  const { slides, title } = reviewed;

  // 3. Unsplash + HTML
  console.log('[Pipeline] Fetching images and building HTML...');
  const htmlSlides = [];
  for (const slide of slides) {
    console.log(`[Image] query="${slide.imageQuery}"`);
    const imageUrl = await fetchImage(typeof slide.imageQuery === 'string' ? slide.imageQuery : '');
    const html = buildSlideHTML(slide, imageUrl);
    htmlSlides.push(html);
  }

  // 4. Render
  console.log('[Pipeline] Rendering slides to PNG...');
  const { pngPaths, tmpDir } = await renderAllSlides(htmlSlides);

  // 5. PPTX
  console.log('[Pipeline] Exporting to PPTX...');
  const pptxPath = await exportToPptx(pngPaths, title);

  // Cleanup
  try {
    for (const p of pngPaths) fs.unlinkSync(p);
    fs.rmdirSync(tmpDir);
  } catch {}

  console.log(`[Pipeline] Done: ${pptxPath}`);
  return { pptxPath, title };
}

module.exports = { generatePresentation };
