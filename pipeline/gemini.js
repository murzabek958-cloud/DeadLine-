'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Shared JSON parser ────────────────────────────────────────────────────
function parseGeminiJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini returned invalid JSON');
    return JSON.parse(match[0]);
  }
}

// ─── Параметрлерді парсинг ─────────────────────────────────────────────────
// "Жасанды интеллект, 10 слайд, орысша, бизнес стиль"
// → { topic, slideCount, language, style }

function parseUserInput(input) {
  const parts = input.split(',').map(s => s.trim());
  const topic = parts[0];

  let slideCount = null;
  let language   = null;
  let style      = null;

  for (const part of parts.slice(1)) {
    const lower = part.toLowerCase();

    // Слайд саны
    const numMatch = lower.match(/(\d+)\s*(слайд|slide|бет|страниц)/);
    if (numMatch) {
      slideCount = Math.min(Math.max(parseInt(numMatch[1]), 5), 15);
      continue;
    }

    // Тіл
    if (lower.includes('қаз') || lower.includes('каз') || lower.includes('kazakh')) {
      language = 'Kazakh'; continue;
    }
    if (lower.includes('орыс') || lower.includes('рус') || lower.includes('russian')) {
      language = 'Russian'; continue;
    }
    if (lower.includes('ағыл') || lower.includes('англ') || lower.includes('english')) {
      language = 'English'; continue;
    }

    // Стиль
    if (lower.includes('бизнес') || lower.includes('корпор') || lower.includes('business')) {
      style = 'business'; continue;
    }
    if (lower.includes('минимал') || lower.includes('minimal')) {
      style = 'minimal'; continue;
    }
    if (lower.includes('креатив') || lower.includes('creative') || lower.includes('яркий') || lower.includes('жарқын')) {
      style = 'creative'; continue;
    }
    if (lower.includes('академ') || lower.includes('ғылым') || lower.includes('научн')) {
      style = 'academic'; continue;
    }
    if (lower.includes('презент') || lower.includes('питч') || lower.includes('pitch')) {
      style = 'pitch'; continue;
    }
  }

  return { topic, slideCount, language, style };
}

// ─── Стиль нұсқаулары ─────────────────────────────────────────────────────
function styleGuide(style) {
  switch (style) {
    case 'business':
      return `STYLE: Corporate business presentation.
- Dark or cold mood dominant. Accent colors: deep blue, charcoal, white.
- Clean typography, no decorative excess.
- Stat cards and data-driven slides preferred.
- Professional, confident tone.`;

    case 'minimal':
      return `STYLE: Minimalist presentation.
- Light mood preferred. Maximum whitespace.
- Only 2-3 elements per slide. No decorative clutter.
- Thin accent lines only. No corner circles or grid dots.
- Short, punchy text. Typography-focused.`;

    case 'creative':
      return `STYLE: Creative / bold presentation.
- Vivid or warm mood. Bold accent colors: electric blue, magenta, gold.
- Mix layouts freely. Use grid_dots, corner_circle generously.
- Expressive typography. Variety is key — no two slides alike.
- Energy and personality in every slide.`;

    case 'academic':
      return `STYLE: Academic / scientific presentation.
- Cold or dark mood. Blue and teal accent tones.
- Data-heavy: prefer stat cards, bullet lists over decorative elements.
- Precise, factual language. No fluff.
- Citations and structured content preferred.`;

    case 'pitch':
      return `STYLE: Startup pitch deck.
- Dark vivid mood. Bold accent: electric blue, neon green, gold.
- Cover slide must be stunning. Stats slides must be impactful.
- Short punchy text. Every slide answers: "So what?"
- Problem → Solution → Market → Traction → Ask structure preferred.`;

    default:
      return `STYLE: Professional mixed presentation. Balance between visual variety and content clarity.`;
  }
}

// ─── 1. Generate ──────────────────────────────────────────────────────────
async function generateSlides(topic, options = {}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

  const slideCount = options.slideCount || null;
  const language   = options.language   || null;
  const style      = options.style      || null;

  const slideCountRule = slideCount
    ? `Generate EXACTLY ${slideCount} slides — no more, no less.`
    : `Generate 7 to 10 slides.`;

  const languageRule = language
    ? `Write ALL text content in ${language}. Title, subtitle, body, bullets — everything in ${language}.`
    : `Write content in the same language as the topic.`;

  const styleSection = styleGuide(style);

  const prompt = `
You are a professional presentation designer and art director.
Create a compelling presentation on: "${topic}".

${slideCountRule}
Each slide must feel visually distinct — like a real designer made each one individually.

Respond ONLY with valid JSON. No markdown, no explanation, no code blocks.

Return this structure:
{
  "title": "Presentation title",
  "slides": [
    {
      "index": 1,
      "title": "...",
      "subtitle": "...",
      "body": "...",
      "bullets": ["...", "..."],
      "stats": [{ "value": "...", "label": "..." }],
      "imageQuery": "...",
      "composition": {
        "image": "full_background",
        "overlay": "dark_gradient_left",
        "textPosition": "center_left",
        "layout": "single_column",
        "mood": "dark",
        "accentColor": "#d4a843",
        "elements": ["eyebrow", "title", "divider", "subtitle"],
        "decorative": ["accent_line_left", "corner_circle"]
      }
    }
  ]
}

─── STYLE DIRECTIVE ───────────────────────────────────────────
${styleSection}

─── LANGUAGE DIRECTIVE ────────────────────────────────────────
${languageRule}
Only include fields that have actual content — set unused fields to null.

─── FIELD RULES ───────────────────────────────────────────────

imageQuery:
  - English only (regardless of content language)
  - Specific, photographic, descriptive
  - Include scene, mood, lighting
  - Good: "ancient Silk Road caravan crossing Central Asian steppe at golden hour cinematic"
  - Bad: "Kazakhstan history"

composition.image:
  "full_background"  "right_half"  "left_half"
  "top_strip"        "bottom_strip"  "corner_accent"  "none"

composition.overlay:
  "none"  "dark_gradient_left"  "dark_gradient_right"
  "dark_gradient_bottom"  "dark_full"  "light_full"  "color_wash"

composition.textPosition:
  "center"  "center_left"  "center_right"
  "top_left"  "top_center"  "bottom_left"  "bottom_center"
  "left_column"  "right_column"

composition.layout:
  "single_column"  "two_column_bullets"  "stat_cards_row"  "stat_cards_grid"

composition.mood:
  "dark"  "light"  "warm"  "cold"  "vivid"

composition.elements (only include what exists):
  "eyebrow"  "title"  "subtitle"  "divider"
  "body"  "bullets"  "stats"  "quote_mark"

composition.decorative (optional):
  "accent_line_left"  "accent_line_right"
  "corner_circle"  "bottom_rule"  "grid_dots"

─── COMPOSITION RULES ─────────────────────────────────────────

Every slide must have a different composition from the others.
Slide 1 is always the cover: full_background, strong overlay, large title.
Last slide is always closing: full_background, centered, minimal text.
Middle slides: mix freely.

─── QUALITY RULES ─────────────────────────────────────────────

- Keep generous empty space. Never overcrowd.
- Match textPosition with image placement.
- imageQuery must always be in English.
- bullets: max 6. stats: max 4. body: 1–3 sentences.
- Vary accent colors across slides.
- Mentally check every slide before returning JSON.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return parseGeminiJSON(text);
}

// ─── 2. Review & Improve ──────────────────────────────────────────────────
async function reviewAndImproveSlides(presentation) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
  const presentationJSON = JSON.stringify(presentation, null, 2);

  const prompt = `
You are a senior art director and visual QC specialist reviewing a presentation
before it is rendered at 1280×720 pixels.

Do not redesign the entire presentation. Preserve the existing visual concept.
Only fix actual visual, readability, overflow, collision, consistency, or
content-density problems.

Here is the presentation JSON to review:

${presentationJSON}

─── REVIEW CRITERIA ──────────────────────────────────────────────────────────

READABILITY
- Is text readable over the image? If not, fix overlay or textPosition.
- Is the title too long (>8 words)? Shorten it if yes.
- If image="full_background" and overlay="dark_gradient_left": textPosition must be center_left.
- If image="full_background" and overlay="dark_gradient_right": textPosition must be center_right.

OVERFLOW / DENSITY
- Does the text block overflow? Cut content.
- Too many bullets (>6) or body sentences (>3)? Trim.

COLLISION / PLACEMENT
- Does textPosition conflict with image placement? Fix it.
- Does text land over important image subjects? Fix textPosition.

KNOWN BAD PATTERNS — fix automatically:
  1. top_strip + bottom_center → change textPosition to "center"
  2. full_background + dark_gradient_left + subtitle+body+bullets → remove body
  3. full_background + bottom_center → change to "center" + add overlay
  4. imageQuery mismatched with topic → rewrite imageQuery
  5. full_background + overlay=none + image present → add "dark_gradient_bottom"

CONTRAST
- Light text on light background → fix overlay or mood.

COMPOSITION
- Preserve empty space. Adjacent slides too similar → vary one property.

IMAGE QUERY
- Must be English, specific, photographic (scene + mood + lighting).
- Vague query → rewrite.

─── RULES ──────────────────────────────────────────────────────────────────
- Do NOT change slides that pass all checks.
- Preserve original text as much as possible.
- Do NOT return HTML, CSS, or SVG.
- Keep the same number of slides.

─── OUTPUT ─────────────────────────────────────────────────────────────────
Respond ONLY with valid JSON. No markdown. No explanation.
Return the full presentation object with all slides.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let reviewed;
  try {
    reviewed = parseGeminiJSON(text);
  } catch {
    console.warn('[Review] Invalid JSON — using original.');
    return presentation;
  }

  if (!reviewed?.slides || reviewed.slides.length !== presentation.slides.length) {
    console.warn('[Review] Slide count mismatch — using original.');
    return presentation;
  }

  return reviewed;
}

module.exports = { generateSlides, reviewAndImproveSlides, parseUserInput };
