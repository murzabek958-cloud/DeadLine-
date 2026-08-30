'use strict';

// ─── PALETTES ────────────────────────────────────────────────────────────────

const MOOD = {
  dark:  { bg: '#0d1117', text: '#ffffff', muted: 'rgba(255,255,255,0.6)',  surface: 'rgba(255,255,255,0.06)' },
  light: { bg: '#f5f2ed', text: '#1a1a1a', muted: 'rgba(0,0,0,0.45)',      surface: 'rgba(0,0,0,0.04)' },
  warm:  { bg: '#1e1209', text: '#f5e8d0', muted: 'rgba(245,232,208,0.6)', surface: 'rgba(255,255,255,0.06)' },
  cold:  { bg: '#0c1622', text: '#e8f0f8', muted: 'rgba(232,240,248,0.6)', surface: 'rgba(255,255,255,0.07)' },
  vivid: { bg: '#0a0a0a', text: '#ffffff', muted: 'rgba(255,255,255,0.65)', surface: 'rgba(255,255,255,0.08)' },
};

// ─── OVERLAY CSS ─────────────────────────────────────────────────────────────

function overlayCSS(type, accent) {
  const a = accent || '#000';
  switch (type) {
    case 'dark_gradient_left':
      return `background: linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 45%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.08) 100%);`;
    case 'dark_gradient_right':
      return `background: linear-gradient(270deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 45%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.06) 100%);`;
    case 'dark_gradient_bottom':
      return `background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%);`;
    case 'dark_full':
      return `background: rgba(0,0,0,0.62);`;
    case 'light_full':
      return `background: rgba(255,255,255,0.55);`;
    case 'color_wash':
      return `background: ${accent}22;`;
    default:
      return `display: none;`;
  }
}

// ─── IMAGE CSS ───────────────────────────────────────────────────────────────

function imagePlacement(imageType, img) {
  if (!img || imageType === 'none') return { wrapperCSS: '', imgCSS: '' };

  const base = `background-image: url('${img}'); background-size: cover; background-position: center;`;

  switch (imageType) {
    case 'full_background':
      return {
        wrapperCSS: `position: absolute; inset: 0; z-index: 0; ${base}`,
        imgCSS: '',
      };
    case 'right_half':
      return {
        wrapperCSS: `position: absolute; top: 0; right: 0; width: 52%; height: 100%; z-index: 0; ${base};
          border-left: 1px solid rgba(255,255,255,0.08);`,
        imgCSS: '',
      };
    case 'left_half':
      return {
        wrapperCSS: `position: absolute; top: 0; left: 0; width: 48%; height: 100%; z-index: 0; ${base}`,
        imgCSS: '',
      };
    case 'top_strip':
      return {
        wrapperCSS: `position: absolute; top: 0; left: 0; right: 0; height: 38%; z-index: 0; ${base} background-position: center 30%;
          -webkit-mask-image: linear-gradient(180deg, black 55%, transparent 100%);
          mask-image: linear-gradient(180deg, black 55%, transparent 100%);`,
        imgCSS: '',
      };
    case 'bottom_strip':
      return {
        wrapperCSS: `position: absolute; bottom: 0; left: 0; right: 0; height: 35%; z-index: 0; ${base} background-position: center 70%;`,
        imgCSS: '',
      };
    case 'corner_accent':
      return {
        wrapperCSS: `position: absolute; bottom: 0; right: 0; width: 38%; height: 55%; z-index: 0; ${base} border-radius: 24px 0 0 0; opacity: 0.75;`,
        imgCSS: '',
      };
    default:
      return { wrapperCSS: '', imgCSS: '' };
  }
}

// ─── TEXT POSITION CSS ───────────────────────────────────────────────────────

function textPositionCSS(pos, imageType) {
  // For split layouts the text column is handled separately
  if (pos === 'left_column') {
    const rightW = imageType === 'right_half' ? '52%' : '0%';
    return `position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; gap:18px; gap:18px;
            width: calc(48% - 0px); max-width: 580px; padding: 64px 56px 64px 80px;`;
  }
  if (pos === 'right_column') {
    return `position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; gap:18px; gap:18px;
            margin-left: 48%; width: calc(52% - 0px); padding: 64px 72px 64px 56px;`;
  }

  const shared = `position: absolute; z-index: 2; max-width: 700px; display:flex; flex-direction:column; gap:18px;`;
  switch (pos) {
    case 'center':
      return `${shared} top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 80%;`;
    case 'center_left':
      return `${shared} top: 50%; left: 80px; transform: translateY(-50%);`;
    case 'center_right':
      return `${shared} top: 50%; right: 80px; transform: translateY(-50%); text-align: right;`;
    case 'top_left':
      return `${shared} top: 64px; left: 80px;`;
    case 'top_center':
      return `${shared} top: 64px; left: 50%; transform: translateX(-50%); text-align: center;`;
    case 'bottom_left':
      return `${shared} bottom: 72px; left: 80px;`;
    case 'bottom_center':
      return `${shared} bottom: 96px; left: 50%; transform: translateX(-50%); text-align: center;`;
    default:
      return `${shared} top: 50%; left: 80px; transform: translateY(-50%);`;
  }
}

// ─── ELEMENT RENDERERS ───────────────────────────────────────────────────────

function renderEyebrow(slide, palette, accent) {
  if (!slide.subtitle && !slide.title) return '';
  const label = slide.subtitle || 'Overview';
  return `<div style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:11px; font-weight:700;
    letter-spacing:4px; text-transform:uppercase; color:${accent};
    margin-bottom:18px;">${label}</div>`;
}

function renderTitle(slide, palette, size) {
  if (!slide.title) return '';
  const fs = size || '48px';
  return `<h1 style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:${fs}; font-weight:700;
    line-height:1.15; color:${palette.text}; letter-spacing:-0.5px;
    margin:0;">${slide.title}</h1>`;
}

function renderSubtitle(slide, palette) {
  if (!slide.subtitle) return '';
  return `<p style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:18px; font-weight:400;
    line-height:1.6; color:${palette.muted}; margin:0;">${slide.subtitle}</p>`;
}

function renderBody(slide, palette) {
  if (!slide.body) return '';
  return `<p style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:16px; font-weight:400;
    line-height:1.85; color:${palette.muted}; margin:0;">${slide.body}</p>`;
}

function renderDivider(accent) {
  return `<div style="width:52px; height:3px; background:${accent}; border-radius:2px; margin-bottom:24px;"></div>`;
}

function renderAccentLine(pos, accent) {
  const isRight = pos === 'accent_line_right';
  const side = isRight ? 'right: 0;' : 'left: 0;';
  return `<div style="position:absolute; ${side} top:50%; transform:translateY(-50%);
    width:4px; height:200px; border-radius:2px; z-index:3;
    background:linear-gradient(180deg,transparent,${accent},transparent);"></div>`;
}

function renderCornerCircle(accent) {
  return `<div style="position:absolute; bottom:40px; right:72px; width:110px; height:110px;
    border:1px solid ${accent}44; border-radius:50%; z-index:3;"></div>`;
}

function renderBottomRule(palette) {
  return `<div style="position:absolute; bottom:40px; left:50%; transform:translateX(-50%);
    width:72px; height:2px; background:${palette.muted}; z-index:3; opacity:0.4;"></div>`;
}

function renderGridDots(accent) {
  // SVG dot pattern as data URI
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='2' cy='2' r='1.2' fill='${accent}' opacity='0.15'/></svg>`;
  const encoded = Buffer.from(svg).toString('base64');
  return `<div style="position:absolute; inset:0; z-index:1;
    background-image:url('data:image/svg+xml;base64,${encoded}');
    background-size:24px 24px; pointer-events:none;"></div>`;
}

function renderQuoteMark(accent) {
  return `<div style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:110px; line-height:0.7;
    color:${accent}; opacity:0.45; margin-bottom:24px; user-select:none;">"</div>`;
}

function renderBullets(slide, palette, accent) {
  if (!slide.bullets || !slide.bullets.length) return '';
  const items = slide.bullets.map(b =>
    `<li style="display:flex; align-items:flex-start; gap:12px; margin-bottom:14px;">
       <span style="color:${accent}; margin-top:3px; flex-shrink:0; font-size:13px;">▸</span>
       <span style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:16px; line-height:1.55;
         color:${palette.text}; font-weight:400;">${b}</span>
     </li>`
  ).join('');
  return `<ul style="list-style:none; margin:0; padding:0;">${items}</ul>`;
}

function renderBulletsGrid(slide, palette, accent) {
  if (!slide.bullets || !slide.bullets.length) return '';
  const items = slide.bullets.map(b =>
    `<div style="display:flex; align-items:flex-start; gap:10px;">
       <div style="width:7px; height:7px; border-radius:50%; background:${accent};
         flex-shrink:0; margin-top:5px;"></div>
       <span style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:15px; line-height:1.55;
         color:${palette.text}; font-weight:400;">${b}</span>
     </div>`
  ).join('');
  return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px 40px;">${items}</div>`;
}

function renderStats(slide, palette, accent) {
  if (!slide.stats || !slide.stats.length) return '';
  const cards = slide.stats.map(s =>
    `<div style="background:${palette.surface}; border:1px solid ${accent}22;
       border-radius:14px; padding:28px 36px; text-align:center; flex:1;">
       <div style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:46px; font-weight:700;
         color:${accent}; line-height:1; margin-bottom:10px;">${s.value}</div>
       <div style="font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; font-size:12px; font-weight:600;
         letter-spacing:2px; text-transform:uppercase; color:${palette.muted};">${s.label}</div>
     </div>`
  ).join('');
  return `<div style="display:flex; gap:24px; width:100%;">${cards}</div>`;
}

// ─── ELEMENT DISPATCHER ──────────────────────────────────────────────────────

function renderElement(el, slide, palette, accent, layout) {
  switch (el) {
    case 'eyebrow':      return renderEyebrow(slide, palette, accent);
    case 'title':        return renderTitle(slide, palette, layout === 'cover' ? '58px' : '38px');
    case 'subtitle':     return renderSubtitle(slide, palette);
    case 'divider':      return renderDivider(accent);
    case 'body':         return renderBody(slide, palette);
    case 'bullets':      return layout === 'two_column_bullets'
                           ? renderBulletsGrid(slide, palette, accent)
                           : renderBullets(slide, palette, accent);
    case 'stats':        return renderStats(slide, palette, accent);
    case 'quote_mark':   return renderQuoteMark(accent);
    default:             return '';
  }
}

// ─── MAIN BUILD FUNCTION ─────────────────────────────────────────────────────

// ─── COMPOSITION SANITIZER ───────────────────────────────────────────────────
// Catches known bad combos that Gemini occasionally produces and fixes them
// before HTML is generated. Does NOT redesign — only patches conflicts.

function sanitizeComposition(imageType, overlayType, textPos, img) {
  let safeOverlay  = overlayType;
  let safeTextPos  = textPos;

  // top_strip + bottom_center → mәтін суреттен тым алыс, кеңістік бос болады
  // Fix: мәтінді орталықтан төмен жылжыт
  if (imageType === 'top_strip' && textPos === 'bottom_center') {
    safeTextPos = 'bottom_center'; // kept — CSS fix handles it via mask-image fade
  }

  // full_background + overlay:none + image present = text unreadable
  // Fix: add dark_gradient_bottom as minimum scrim
  if (imageType === 'full_background' && overlayType === 'none' && img) {
    safeOverlay = 'dark_gradient_bottom';
  }

  // right_half or left_half + full-slide overlay makes no sense — skip overlay
  if ((imageType === 'right_half' || imageType === 'left_half') &&
      (overlayType === 'dark_full' || overlayType === 'light_full')) {
    safeOverlay = 'none';
  }

  return { safeOverlay, safeTextPos };
}

function buildSlideHTML(slide, imageUrl) {
  const comp = slide.composition || {};
  const imageType    = comp.image        || 'none';
  const overlayType  = comp.overlay      || 'none';
  const textPos      = comp.textPosition || 'center_left';
  const layout       = comp.layout       || 'single_column';
  const mood         = comp.mood         || 'dark';
  const accent       = comp.accentColor  || '#d4a843';
  const elements     = comp.elements     || ['title'];
  const decorative   = comp.decorative   || [];

  const img = imageUrl || '';
  const { safeOverlay, safeTextPos } = sanitizeComposition(imageType, overlayType, textPos, img);

  const palette = MOOD[mood] || MOOD.dark;
  const visualFallback = img ? '' : `<div style="position:absolute; right:70px; top:90px; width:360px; height:360px; z-index:1; opacity:.8; border-radius:50%; background:radial-gradient(circle at 35% 35%, ${accent}55 0, ${accent}18 28%, transparent 62%); box-shadow:0 0 90px ${accent}22;"></div><div style="position:absolute; right:145px; top:165px; width:210px; height:210px; z-index:1; border:1px solid ${accent}55; border-radius:50%;"></div><div style="position:absolute; right:210px; top:230px; width:80px; height:80px; z-index:1; background:${accent}33; border:1px solid ${accent}88; transform:rotate(45deg);"></div>`;
  console.log('[HTML] image:', img ? 'YES' : 'NO');

  // Image layer
  const { wrapperCSS } = imagePlacement(imageType, img);

  // Overlay layer — use sanitized overlay (may have been patched above)
  const hasOverlay = img && safeOverlay !== 'none';

  // Text block positioning — use sanitized textPos
  const textCSS = textPositionCSS(safeTextPos, imageType);

  // Content elements HTML
  const contentHTML = elements
    .map(el => renderElement(el, slide, palette, accent, layout))
    .join('\n');

  // Decorative elements HTML
  const decorHTML = decorative.map(d => {
    if (d === 'accent_line_left')  return renderAccentLine('accent_line_left', accent);
    if (d === 'accent_line_right') return renderAccentLine('accent_line_right', accent);
    if (d === 'corner_circle')     return renderCornerCircle(accent);
    if (d === 'bottom_rule')       return renderBottomRule(palette);
    if (d === 'grid_dots')         return renderGridDots(accent);
    return '';
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1280px; height: 720px; overflow: hidden; }
  .slide { position: relative; width: 1280px; height: 720px; background: ${palette.bg}; font-family:Noto Sans CJK KR, Noto Sans CJK SC, Noto Sans CJK JP, DejaVu Sans, sans-serif; }
</style>
</head>
<body>
<div class="slide">

        ${visualFallback}
  ${wrapperCSS ? `<div style="${wrapperCSS}"></div>` : `<div style="position:absolute; inset:0; z-index:0; background: radial-gradient(circle at 82% 20%, ${accent}22 0, transparent 32%), radial-gradient(circle at 15% 85%, ${accent}18 0, transparent 35%), linear-gradient(135deg, ${palette.bg}, #101820);"></div><div style="position:absolute; inset:0; z-index:0; opacity:.16; background-image: linear-gradient(${accent}55 1px, transparent 1px), linear-gradient(90deg, ${accent}55 1px, transparent 1px); background-size:48px 48px;"></div>`}

  ${hasOverlay ? `<div style="position:absolute; inset:0; z-index:1; ${overlayCSS(safeOverlay, accent)}"></div>` : ''}

  ${decorHTML}

  <div style="${textCSS}">
    ${contentHTML}
  </div>

</div>
</body>
</html>`;
}

module.exports = { buildSlideHTML };
