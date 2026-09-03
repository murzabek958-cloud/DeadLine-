'use strict';

// ─── Groq клиенті (fetch арқылы, SDK орнатпай) ───────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL   = 'openai/gpt-oss-120b';

async function groqChat(systemPrompt, userPrompt, label) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[${res.status}] ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Токен логы
  if (data.usage) {
    console.log(`[Tokens] ${label} — input: ${data.usage.prompt_tokens}, output: ${data.usage.completion_tokens}, total: ${data.usage.total_tokens}`);
  }

  return text;
}

// ─── Retry helper ─────────────────────────────────────────────────────────
async function withRetry(fn, label) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const msg = err.message || '';
      const is503 = msg.includes('503') || msg.includes('fetch failed');
      const is429 = msg.includes('429') || msg.includes('quota') || msg.includes('rate_limit') || msg.includes('Rate limit');

      if (!is503 && !is429) throw err;

      let delay = Math.min(5000 * attempt, 30000);
      if (is429) {
        const match = msg.match(/try again in (\d+\.?\d*)s/i) || msg.match(/retry[^0-9]*(\d+)[^0-9]*s/i);
        delay = match ? (parseFloat(match[1]) + 2) * 1000 : 30000;
      }

      const reason = is429 ? '429 Rate limit' : '503';
      console.warn(`[Groq] ${label} — attempt ${attempt} failed (${reason}). Retry in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ─── JSON parser ──────────────────────────────────────────────────────────
function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid JSON from Groq');
    return JSON.parse(match[0]);
  }
}

// ─── Параметрлерді парсинг ────────────────────────────────────────────────
function parseUserInput(input) {
  const parts = input.split(',').map(s => s.trim());
  const topic = parts[0];

  let slideCount = null;
  let language   = null;
  let style      = null;

  for (const part of parts.slice(1)) {
    const lower = part.toLowerCase();

    const numMatch = lower.match(/(\d+)\s*(слайд|slide|бет|страниц)/);
    if (numMatch) { slideCount = Math.min(Math.max(parseInt(numMatch[1]), 5), 15); continue; }

    if (lower.includes('қаз') || lower.includes('каз') || lower.includes('kazakh')) { language = 'Kazakh'; continue; }
    if (lower.includes('орыс') || lower.includes('рус') || lower.includes('russian')) { language = 'Russian'; continue; }
    if (lower.includes('ағыл') || lower.includes('англ') || lower.includes('english')) { language = 'English'; continue; }

    if (lower.includes('бизнес') || lower.includes('корпор') || lower.includes('business')) { style = 'business'; continue; }
    if (lower.includes('минимал') || lower.includes('minimal')) { style = 'minimal'; continue; }
    if (lower.includes('креатив') || lower.includes('creative')) { style = 'creative'; continue; }
    if (lower.includes('академ') || lower.includes('ғылым') || lower.includes('научн')) { style = 'academic'; continue; }
    if (lower.includes('питч') || lower.includes('pitch')) { style = 'pitch'; continue; }
  }

  return { topic, slideCount, language, style };
}

// ─── Стиль нұсқаулары ────────────────────────────────────────────────────
function styleGuide(style) {
  switch (style) {
    case 'business':  return `STYLE: Corporate business. Dark/cold mood. Deep blue, charcoal, white. Clean typography. Data-driven slides.`;
    case 'minimal':   return `STYLE: Minimalist. Light mood. Max whitespace. 2-3 elements per slide. No clutter.`;
    case 'creative':  return `STYLE: Creative/bold. Vivid colors. Bold accents. Variety in layout.`;
    case 'academic':  return `STYLE: Academic/scientific. Blue/teal tones. Data-heavy. Precise language.`;
    case 'pitch':     return `STYLE: Startup pitch. Dark vivid. Bold accent. Short punchy text. Problem→Solution→Market→Ask.`;
    default:          return `STYLE: Professional mixed. Balance visual variety and content clarity.`;
  }
}

// ─── 1. Generate ─────────────────────────────────────────────────────────
async function generateSlides(topic, options = {}) {
  const slideCount = options.slideCount || null;
  const language   = options.language   || null;
  const style      = options.style      || null;

  const slideCountRule = slideCount
    ? `Generate EXACTLY ${slideCount} slides.`
    : `Generate 7 to 10 slides.`;

  const languageRule = language
    ? `Write ALL text in ${language}. Title, subtitle, body, bullets — everything in ${language}.`
    : `Write content in the same language as the topic.`;

  const system = `You are a professional presentation designer. You ALWAYS respond with valid JSON only. No markdown, no explanation, no code blocks. Just raw JSON.`;

  const user = `Create a presentation on: "${topic}".

${slideCountRule}
${styleGuide(style)}
${languageRule}

Return this JSON structure:
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
      "imageQuery": "English photographic query with scene, mood, lighting",
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

RULES:
- composition.image: "full_background" "right_half" "left_half" "top_strip" "bottom_strip" "corner_accent" "none"
- composition.overlay: "none" "dark_gradient_left" "dark_gradient_right" "dark_gradient_bottom" "dark_full" "light_full" "color_wash"
- composition.textPosition: "center" "center_left" "center_right" "top_left" "top_center" "bottom_left" "bottom_center" "left_column" "right_column"
- composition.layout: "single_column" "two_column_bullets" "stat_cards_row" "stat_cards_grid"
- composition.mood: "dark" "light" "warm" "cold" "vivid"
- composition.elements: "eyebrow" "title" "subtitle" "divider" "body" "bullets" "stats" "quote_mark"
- composition.decorative: "accent_line_left" "accent_line_right" "corner_circle" "bottom_rule" "grid_dots"
- Slide 1: cover — full_background, strong overlay, large title
- Last slide: closing — full_background, centered, minimal text
- Each slide must have different composition
- imageQuery: English only, specific, photographic
- bullets: max 6, stats: max 4, body: 1-3 sentences
- Set unused fields to null`;

  const text = await withRetry(() => groqChat(system, user, 'generateSlides'), 'generateSlides');
  return parseJSON(text);
}

// ─── 2. Review & Improve ─────────────────────────────────────────────────
async function reviewAndImproveSlides(presentation) {
  const presentationJSON = JSON.stringify(presentation, null, 2);

  const system = `You are a senior art director doing visual QC. You ALWAYS respond with valid JSON only. No markdown, no explanation. Just raw JSON.`;

  const user = `Review this presentation JSON and fix visual problems only. Do NOT redesign. Keep same number of slides.

${presentationJSON}

Fix only:
- Text readability over images (fix overlay or textPosition)
- Title too long (>8 words) → shorten
- full_background + dark_gradient_left → textPosition must be center_left
- full_background + dark_gradient_right → textPosition must be center_right
- Too many bullets (>6) or body sentences (>3) → trim
- full_background + overlay=none → add dark_gradient_bottom
- Vague imageQuery → rewrite in English with scene+mood+lighting

Return the full corrected presentation JSON.`;

  const text = await withRetry(() => groqChat(system, user, 'reviewSlides'), 'reviewSlides');

  let reviewed;
  try {
    reviewed = parseJSON(text);
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
