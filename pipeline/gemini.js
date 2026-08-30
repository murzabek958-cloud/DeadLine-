'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Shared JSON parser (used by both functions) ───────────────────────────
function parseGeminiJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini returned invalid JSON');
    return JSON.parse(match[0]);
  }
}

// ─── 1. Generate ──────────────────────────────────────────────────────────
async function generateSlides(topic) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  const prompt = `
You are a professional presentation designer and art director.
Create a compelling presentation on: "${topic}".

Generate 7 to 10 slides. Each slide must feel visually distinct — like a real designer made each one individually.

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

─── FIELD RULES ───────────────────────────────────────────

imageQuery:
  - English only
  - Specific, photographic, descriptive
  - Include scene, mood, lighting
  - Good: "ancient Silk Road caravan crossing Central Asian steppe at golden hour cinematic"
  - Bad: "Kazakhstan history"

composition.image — how the photo is placed:
  "full_background"     image covers the entire slide
  "right_half"          image occupies the right 50% of the slide
  "left_half"           image occupies the left 45% of the slide
  "top_strip"           image is a horizontal band at the top (~35% height)
  "bottom_strip"        image is a horizontal band at the bottom
  "corner_accent"       small image in one corner (specify which in decorative)
  "none"                no image, solid color background

composition.overlay — gradient or color over the image:
  "none"
  "dark_gradient_left"       dark on left, transparent right
  "dark_gradient_right"      dark on right, transparent left
  "dark_gradient_bottom"     transparent top, dark bottom
  "dark_full"                uniform dark over entire image
  "light_full"               light wash over image
  "color_wash"               accentColor at low opacity over image

composition.textPosition — where the text block sits:
  "center"
  "center_left"
  "center_right"
  "top_left"
  "top_center"
  "bottom_left"
  "bottom_center"
  "left_column"              text in left column (used with right_half image)
  "right_column"             text in right column (used with left_half image)

composition.layout — internal text arrangement:
  "single_column"
  "two_column_bullets"       bullets split into 2 columns
  "stat_cards_row"           stat cards in a horizontal row
  "stat_cards_grid"          stat cards in a 2x2 grid

composition.mood:
  "dark"     dark background, light text
  "light"    light background, dark text
  "warm"     warm tones (browns, golds)
  "cold"     cool tones (blues, grays)
  "vivid"    saturated accent color dominant

composition.accentColor:
  A hex color that fits the slide's mood and topic.
  Vary this across slides — not the same color every time.

composition.elements — what content to render (only include what exists):
  "eyebrow"      small uppercase label above title
  "title"        main heading
  "subtitle"     secondary heading
  "divider"      horizontal rule between elements
  "body"         paragraph text
  "bullets"      bullet list
  "stats"        stat cards
  "quote_mark"   large decorative quotation mark

composition.decorative — purely visual elements (optional):
  "accent_line_left"     vertical colored line on left edge
  "accent_line_right"    vertical colored line on right edge
  "corner_circle"        decorative circle in corner
  "bottom_rule"          thin line at bottom
  "grid_dots"            subtle dot grid background texture

─── COMPOSITION VARIETY RULES ─────────────────────────────

Every slide must have a different composition from the others.
Vary: image placement, overlay type, text position, mood, accent color.

Slide 1 is always the cover: full_background image, strong overlay, large title.
Last slide is always closing: full_background, centered, minimal text.
Middle slides: mix freely — split layouts, top strips, stat cards, columns, etc.

─── CONTENT RULES ─────────────────────────────────────────

Write content in the same language as the topic.
Only include fields that have actual content — set unused fields to null.

─── FINAL ART-DIRECTOR QA ────────────────────────────────────────

Before returning the JSON, review the complete presentation as if you
were looking at the rendered slides.

For EVERY slide:
- Keep generous empty space.
- Never overcrowd the slide.
- Never allow title, subtitle, body, bullets or stats to overlap.
- Do not put text over important parts of an image.
- Match textPosition with image placement.
- Keep title hierarchy strong and readable.
- Titles should normally use strong weight; body and bullets should remain
  normal weight.
- Use typography that supports Kazakh and Russian Cyrillic.
- Prefer readable Noto Sans / DejaVu Sans compatible typography.
- Do not make every text element bold.
- Shorten content when necessary instead of creating a crowded slide.

VISUAL COMPOSITION:
- Decorative elements are NOT only for image fallbacks.
- Use decorative elements on normal slides when they improve composition.
- Usually use 1–3 meaningful decorative elements.
- Vary decorative elements between slides.
- Use accent lines, circles, bottom rules and grid dots strategically.
- Do not repeat the exact same visual treatment on every slide.
- Preserve intentional empty space.

VISUALIZATION:
- When the topic contains a process, comparison, structure, timeline,
  relationship, statistics or other visual concept, prefer a visual
  composition instead of presenting everything as plain text.
- Use shapes, visual groupings, arrows, cards or other available visual
  structures when appropriate.
- Do not rely only on photographs.

IMAGE FALLBACK:
- If imageQuery is null or no image is found, the slide must still look
  intentionally designed.
- Use decorative visual elements and balanced empty space.
- Never let a missing image produce a visually empty slide.

FINAL CHECK:
Before returning JSON, mentally inspect every slide for:
readability, hierarchy, spacing, visual balance, image/text balance,
Cyrillic readability, overcrowding and visual variety.

If a slide fails the check, revise its content or composition before
returning JSON.

bullets: max 6 items. stats: max 4 items.
body: 1–3 sentences maximum.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return parseGeminiJSON(text);
}

// ─── 2. Review & Improve ──────────────────────────────────────────────────
async function reviewAndImproveSlides(presentation) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

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

For each slide, mentally render it at 1280×720 and check:

READABILITY
- Is text readable over the image? If not, fix overlay or textPosition.
- Is the title too long (>8 words)? Shorten it if yes.
- Is Cyrillic text natural and concise?
- If image="full_background" and overlay="dark_gradient_left" or "dark_gradient_right":
  the text MUST be positioned on the dark side (center_left for left gradient,
  center_right for right gradient). If textPosition is on the bright side — FIX IT.

OVERFLOW / DENSITY
- Does the text block overflow its card or frame? If yes, cut content.
- Are there too many bullets (>6) or body sentences (>3)? Trim.
- Are there too many visual elements on one slide? Remove the least important.

COLLISION / PLACEMENT
- Does textPosition conflict with image placement?
  (e.g. left_column with full_background and no left overlay — fix overlay or textPosition)
- Does text land over the important subject of the image? Fix textPosition or composition.image.

KNOWN BAD PATTERNS — automatically fix these:

  1. image="top_strip" + textPosition="bottom_center":
     The image occupies the top 38% of the slide. The bottom 62% is a large
     empty area with text stuck at the very bottom. This looks unbalanced.
     FIX: change textPosition to "center" so text sits in the middle of
     the empty lower area, or change image to "right_half" for a better split.

  2. image="full_background" + overlay="dark_gradient_left" + many text elements:
     If subtitle + body + bullets are all present, the text block is too tall
     for the dark gradient zone and the bottom lines lose contrast.
     FIX: remove body or merge it into subtitle, keep ≤2 content elements below title.

  3. image="full_background" + textPosition="bottom_center":
     The bottom of the image often contains important foreground subjects
     (hands, people, objects). Text at bottom_center lands directly on them.
     FIX: change textPosition to "center" and ensure overlay covers the center zone.
     Add "dark_gradient_bottom" or "dark_full" overlay if not already present.

  4. imageQuery is conceptually mismatched with the slide topic:
     (e.g. "cyberpunk city streets" for a slide about AI ethics and privacy laws)
     FIX: rewrite imageQuery to match the actual topic.
     Good: "surveillance camera network city security abstract blue cinematic"
     Bad:  "neon city street rain cyberpunk"

CONTRAST
- Is contrast sufficient for the mood? If mood is "light" but overlay is "dark_full", fix.
- If text is light and background is also light, fix overlay or mood.
- If image="full_background" and overlay="none" and image is present — this is dangerous.
  FIX: add at minimum "dark_gradient_bottom" overlay.

COMPOSITION
- Does the slide preserve empty space? If everything is filled, remove an element.
- Are adjacent slides too similar (same image type + same textPosition + same overlay)?
  If yes, change at least one composition property on one of them.

IMAGE QUERY
- Is imageQuery specific and descriptive (scene + mood + lighting)?
- If it's vague (e.g. "Kazakhstan history"), rewrite it.
- imageQuery must be in English only.
- imageQuery must describe a real photograph, not an illustration or concept.
  Good: "glowing neural network visualization dark background blue particles cinematic"
  Bad:  "artificial intelligence concept"

─── RULES ────────────────────────────────────────────────────────────────────

- Do NOT change slides that pass all checks.
- Only modify slides that have real problems.
- Preserve original text as much as possible.
- Only change title / body / bullets / composition / imageQuery if necessary.
- Do NOT return HTML, CSS, or SVG — JSON only.
- Do NOT redesign slides that are already visually solid.
- Keep the same number of slides.

─── OUTPUT ───────────────────────────────────────────────────────────────────

Respond ONLY with valid JSON in the exact same schema as the input.
No markdown, no explanation, no code blocks.

Return the full presentation object with all slides, modified or not.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let reviewed;
  try {
    reviewed = parseGeminiJSON(text);
  } catch (err) {
    // Fallback: if review JSON is broken, return original untouched
    console.warn('[Review] Gemini returned invalid JSON — skipping review, using original.');
    return presentation;
  }

  // Sanity check: reviewed must have same slide count
  if (
    !reviewed ||
    !Array.isArray(reviewed.slides) ||
    reviewed.slides.length !== presentation.slides.length
  ) {
    console.warn('[Review] Slide count mismatch or missing slides — skipping review, using original.');
    return presentation;
  }

  return reviewed;
}

module.exports = { generateSlides, reviewAndImproveSlides };
