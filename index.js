'use strict';

require('dotenv').config();

const { generateSlides, reviewAndImproveSlides, parseUserInput } = require('./pipeline/gemini');
const { fetchImage }    = require('./pipeline/unsplash');
const { buildSlideHTML } = require('./pipeline/htmlBuilder');
const { renderAllSlides } = require('./pipeline/renderer');
const { exportToPptx }  = require('./pipeline/pptxExporter');
const fs = require('fs');

function simplifyQuery(query) {
  const words = query.split(/[\s,]+/).filter(w => w.length > 3);
  const simple = words.slice(0, 4).join(' ');
  return simple;
}

async function fetchImageWithFallback(query, topic) {
  let url = await fetchImage(query);
  if (url) return url;

  const simple = simplifyQuery(query);
  if (simple && simple !== query) {
    console.log(`[Image] retry with simplified: "${simple}"`);
    url = await fetchImage(simple);
    if (url) return url;
  }

  if (topic) {
    console.log(`[Image] retry with topic: "${topic}"`);
    url = await fetchImage(topic + ' dramatic lighting');
    if (url) return url;
  }

  return null;
}

async function generatePresentation(userInput) {
  const { topic, slideCount, language, style } = parseUserInput(userInput);

  console.log(`[Pipeline] Topic: ${topic}`);
  if (slideCount) console.log(`[Pipeline] Slides: ${slideCount}`);
  if (language)   console.log(`[Pipeline] Language: ${language}`);
  if (style)      console.log(`[Pipeline] Style: ${style}`);

  // 1. Генерация
  console.log('[Pipeline] Generating content with Groq...');
  const presentation = await generateSlides(topic, { slideCount, language, style });
  console.log(`[Pipeline] ${presentation.slides.length} slides generated`);

  // 2. Review
  console.log('[Pipeline] Running visual QC...');
  const reviewed = await reviewAndImproveSlides(presentation);
  console.log('[Pipeline] QC complete');

  const { slides, title } = reviewed;

  // FIX: index-ті мәжбүрлеп орнату — Groq index-ті дұрыс бермеуі мүмкін
  slides.forEach((slide, i) => {
    slide.index = i + 1;
  });

  // 3. Unsplash + HTML
  console.log('[Pipeline] Fetching images and building HTML...');
  const htmlSlides = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const query = typeof slide.imageQuery === 'string' ? slide.imageQuery : '';
    console.log(`[Image] slide ${i+1}: query="${query}"`);
    const imageUrl = await fetchImageWithFallback(query, topic);
    // FIX: globalIndex береміз — index сенімді болсын деп
    const html = buildSlideHTML(slide, imageUrl, i);
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
