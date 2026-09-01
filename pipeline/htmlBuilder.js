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
      return { wrapperCSS: `position: absolute; inset: 0; z-index: 0; ${base}`, imgCSS: '' };
    case 'right_half':
      return {
        wrapperCSS: `position: absolute; top: 0; right: 0; width: 52%; height: 100%; z-index: 0; ${base};
          border-left: 1px solid rgba(255,255,255,0.08);`,
        imgCSS: '',
      };
    case 'left_half':
      return { wrapperCSS: `position: absolute; top: 0; left: 0; width: 48%; height: 100%; z-index: 0; ${base}`, imgCSS: '' };
    case 'top_strip':
      return {
        wrapperCSS: `position: absolute; top: 0; left: 0; right: 0; height: 38%; z-index: 0; ${base} background-position: center 30%;
          -webkit-mask-image: linear-gradient(180deg, black 55%, transparent 100%);
          mask-image: linear-gradient(180deg, black 55%, transparent 100%);`,
        imgCSS: '',
      };
    case 'bottom_strip':
      return {
        wrapperCSS: `position: absolute; bottom: 0; left: 0; right: 0; height: 35%; z-index: 0; ${base} background-position: center 70%;
          -webkit-mask-image: linear-gradient(0deg, black 55%, transparent 100%);
          mask-image: linear-gradient(0deg, black 55%, transparent 100%);`,
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

// ─── FALLBACK VISUAL ─────────────────────────────────────────────────────────
// Сурет жоқ болғанда тақырыпқа байланысты керемет SVG визуал

function buildFallbackVisual(accent, mood, index) {
  const a  = accent || '#d4a843';
  const a1 = a + 'cc';
  const a2 = a + '55';
  const a3 = a + '22';
  const a4 = a + '11';

  const variants = [
    // 0 — Neural network (нейрон желісі)
    `<svg width="560" height="560" viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute; right:-40px; top:-20px; z-index:1; opacity:0.85;">
      <defs>
        <radialGradient id="ng0" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="280" cy="280" r="280" fill="url(#ng0)"/>
      <!-- Connections -->
      <line x1="280" y1="280" x2="140" y2="160" stroke="${a2}" stroke-width="1"/>
      <line x1="280" y1="280" x2="420" y2="150" stroke="${a2}" stroke-width="1"/>
      <line x1="280" y1="280" x2="460" y2="320" stroke="${a2}" stroke-width="1"/>
      <line x1="280" y1="280" x2="380" y2="440" stroke="${a2}" stroke-width="1"/>
      <line x1="280" y1="280" x2="160" y2="420" stroke="${a2}" stroke-width="1"/>
      <line x1="280" y1="280" x2="100" y2="300" stroke="${a2}" stroke-width="1"/>
      <line x1="140" y1="160" x2="420" y2="150" stroke="${a3}" stroke-width="1"/>
      <line x1="420" y1="150" x2="460" y2="320" stroke="${a3}" stroke-width="1"/>
      <line x1="460" y1="320" x2="380" y2="440" stroke="${a3}" stroke-width="1"/>
      <line x1="380" y1="440" x2="160" y2="420" stroke="${a3}" stroke-width="1"/>
      <line x1="160" y1="420" x2="100" y2="300" stroke="${a3}" stroke-width="1"/>
      <line x1="100" y1="300" x2="140" y2="160" stroke="${a3}" stroke-width="1"/>
      <!-- Outer nodes -->
      <circle cx="140" cy="160" r="10" fill="${a}" opacity="0.7"/>
      <circle cx="420" cy="150" r="8"  fill="${a}" opacity="0.6"/>
      <circle cx="460" cy="320" r="12" fill="${a}" opacity="0.75"/>
      <circle cx="380" cy="440" r="9"  fill="${a}" opacity="0.65"/>
      <circle cx="160" cy="420" r="11" fill="${a}" opacity="0.7"/>
      <circle cx="100" cy="300" r="7"  fill="${a}" opacity="0.55"/>
      <!-- Halos -->
      <circle cx="140" cy="160" r="22" stroke="${a2}" stroke-width="1" fill="none"/>
      <circle cx="460" cy="320" r="26" stroke="${a2}" stroke-width="1" fill="none"/>
      <circle cx="160" cy="420" r="24" stroke="${a2}" stroke-width="1" fill="none"/>
      <!-- Center node -->
      <circle cx="280" cy="280" r="22" fill="${a}" opacity="0.9"/>
      <circle cx="280" cy="280" r="36" stroke="${a1}" stroke-width="1.5" fill="none"/>
      <circle cx="280" cy="280" r="54" stroke="${a2}" stroke-width="1" fill="none"/>
      <circle cx="280" cy="280" r="75" stroke="${a3}" stroke-width="1" fill="none"/>
    </svg>`,
      </svg>`,

    // 1 — Geometric prism (геометриялық призма)
    `<svg width="520" height="520" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute; right:-20px; top:20px; z-index:1; opacity:0.8;">
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <!-- Outer ring -->
      <circle cx="260" cy="260" r="220" stroke="${a3}" stroke-width="1" fill="none"/>
      <circle cx="260" cy="260" r="180" stroke="${a2}" stroke-width="1" fill="none"/>
      <!-- Hexagon -->
      <polygon points="260,80 416,170 416,350 260,440 104,350 104,170"
        stroke="${a1}" stroke-width="1.5" fill="${a4}"/>
      <!-- Inner hexagon -->
      <polygon points="260,150 360,205 360,315 260,370 160,315 160,205"
        stroke="${a2}" stroke-width="1" fill="${a3}"/>
      <!-- Center diamond -->
      <polygon points="260,210 310,260 260,310 210,260"
        fill="${a}" opacity="0.8"/>
      <!-- Connecting lines -->
      <line x1="260" y1="80"  x2="260" y2="150" stroke="${a2}" stroke-width="1"/>
      <line x1="416" y1="170" x2="360" y2="205" stroke="${a2}" stroke-width="1"/>
      <line x1="416" y1="350" x2="360" y2="315" stroke="${a2}" stroke-width="1"/>
      <line x1="260" y1="440" x2="260" y2="370" stroke="${a2}" stroke-width="1"/>
      <line x1="104" y1="350" x2="160" y2="315" stroke="${a2}" stroke-width="1"/>
      <line x1="104" y1="170" x2="160" y2="205" stroke="${a2}" stroke-width="1"/>
      <!-- Corner dots -->
      <circle cx="260" cy="80"  r="5" fill="${a}" opacity="0.9"/>
      <circle cx="416" cy="170" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="416" cy="350" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="260" cy="440" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="104" cy="350" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="104" cy="170" r="5" fill="${a}" opacity="0.9"/>
    </svg>`,

    // 2 — Data flow (деректер ағымы)
    `<svg width="540" height="540" viewBox="0 0 540 540" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute; right:-30px; top:30px; z-index:1; opacity:0.8;">
      <defs>
        <radialGradient id="dg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="270" cy="270" r="260" fill="url(#dg2)"/>
      <!-- Orbit rings -->
      <ellipse cx="270" cy="270" rx="220" ry="80" stroke="${a2}" stroke-width="1" fill="none" transform="rotate(-30 270 270)"/>
      <ellipse cx="270" cy="270" rx="220" ry="80" stroke="${a2}" stroke-width="1" fill="none" transform="rotate(30 270 270)"/>
      <ellipse cx="270" cy="270" rx="220" ry="80" stroke="${a2}" stroke-width="1" fill="none" transform="rotate(90 270 270)"/>
      <!-- Orbit dots -->
      <circle cx="490" cy="270" r="8"  fill="${a}" opacity="0.8"/>
      <circle cx="50"  cy="270" r="6"  fill="${a}" opacity="0.6"/>
      <circle cx="380" cy="90"  r="7"  fill="${a}" opacity="0.7"/>
      <circle cx="160" cy="450" r="5"  fill="${a}" opacity="0.55"/>
      <circle cx="380" cy="450" r="9"  fill="${a}" opacity="0.75"/>
      <circle cx="160" cy="90"  r="6"  fill="${a}" opacity="0.6"/>
      <!-- Center -->
      <circle cx="270" cy="270" r="40" fill="${a}" opacity="0.15"/>
      <circle cx="270" cy="270" r="24" fill="${a}" opacity="0.8"/>
      <circle cx="270" cy="270" r="55" stroke="${a1}" stroke-width="1.5" fill="none"/>
      <circle cx="270" cy="270" r="75" stroke="${a2}" stroke-width="1" fill="none"/>
    </svg>`,

    // 3 — Bar chart (баған диаграммасы)
    `<svg width="500" height="460" viewBox="0 0 500 460" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute; right:40px; top:60px; z-index:1; opacity:0.85;">
      <defs>
        <linearGradient id="bg3a" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0.2"/>
        </linearGradient>
        <linearGradient id="bg3b" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Grid lines -->
      <line x1="40" y1="60"  x2="460" y2="60"  stroke="${a3}" stroke-width="1"/>
      <line x1="40" y1="140" x2="460" y2="140" stroke="${a3}" stroke-width="1"/>
      <line x1="40" y1="220" x2="460" y2="220" stroke="${a3}" stroke-width="1"/>
      <line x1="40" y1="300" x2="460" y2="300" stroke="${a3}" stroke-width="1"/>
      <line x1="40" y1="380" x2="460" y2="380" stroke="${a2}" stroke-width="1.5"/>
      <!-- Bars -->
      <rect x="60"  y="160" width="55" height="220" rx="6" fill="url(#bg3b)"/>
      <rect x="140" y="100" width="55" height="280" rx="6" fill="url(#bg3a)"/>
      <rect x="220" y="200" width="55" height="180" rx="6" fill="url(#bg3b)"/>
      <rect x="300" y="80"  width="55" height="300" rx="6" fill="url(#bg3a)"/>
      <rect x="380" y="130" width="55" height="250" rx="6" fill="url(#bg3b)"/>
      <!-- Top dots -->
      <circle cx="87"  cy="160" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="167" cy="100" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="247" cy="200" r="5" fill="${a}" opacity="0.9"/>
      <circle cx="327" cy="80"  r="5" fill="${a}" opacity="0.9"/>
      <circle cx="407" cy="130" r="5" fill="${a}" opacity="0.9"/>
      <!-- Trend line -->
      <polyline points="87,160 167,100 247,200 327,80 407,130"
        stroke="${a1}" stroke-width="2" fill="none" stroke-dasharray="6 3"/>
    </svg>`,
    
    // 4 — Abstract circles (абстрактты шеңберлер)
    `<svg width="560" height="560" viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute; right:-50px; top:-30px; z-index:1; opacity:0.75;">
      <defs>
        <radialGradient id="cg4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="280" cy="280" r="270" fill="url(#cg4)"/>
      <!-- Offset circles -->
      <circle cx="280" cy="280" r="220" stroke="${a3}" stroke-width="1" fill="none"/>
      <circle cx="310" cy="260" r="170" stroke="${a2}" stroke-width="1.5" fill="none"/>
      <circle cx="260" cy="300" r="120" stroke="${a2}" stroke-width="1.5" fill="none"/>
      <circle cx="300" cy="270" r="70"  stroke="${a1}" stroke-width="2" fill="${a4}"/>
      <circle cx="290" cy="280" r="30"  fill="${a}" opacity="0.7"/>
      <!-- Accent dots scattered -->
      <circle cx="130" cy="140" r="8"  fill="${a}" opacity="0.5"/>
      <circle cx="430" cy="120" r="6"  fill="${a}" opacity="0.4"/>
      <circle cx="460" cy="400" r="10" fill="${a}" opacity="0.6"/>
      <circle cx="110" cy="390" r="7"  fill="${a}" opacity="0.45"/>
      <circle cx="280" cy="70"  r="5"  fill="${a}" opacity="0.5"/>
      <!-- Lines to dots -->
      <line x1="280" y1="280" x2="130" y2="140" stroke="${a3}" stroke-width="1"/>
      <line x1="280" y1="280" x2="430" y2="120" stroke="${a3}" stroke-width="1"/>
      <line x1="280" y1="280" x2="460" y2="400" stroke="${a3}" stroke-width="1"/>
      <line x1="280" y1="280" x2="110" y2="390" stroke="${a3}" stroke-width="1"/>
    </svg>`,
  ];

  return variants[index % variants.length];
}

// ─── TEXT POSITION CSS ───────────────────────────────────────────────────────

function textPositionCSS(pos, imageType) {
  if (pos === 'left_column') {
    return `position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; gap:18px;
            width: calc(48% - 0px); max-width: 580px; padding: 64px 56px 64px 80px;`;
  }
  if (pos === 'right_column') {
    return `position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; gap:18px;
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
  return `<div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:11px; font-weight:700;
    letter-spacing:4px; text-transform:uppercase; color:${accent}; margin-bottom:18px;">${label}</div>`;
}

function renderTitle(slide, palette, size) {
  if (!slide.title) return '';
  const fs = size || '48px';
  return `<h1 style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:${fs}; font-weight:700;
    line-height:1.15; color:${palette.text}; letter-spacing:-0.5px; margin:0;">${slide.title}</h1>`;
}

function renderSubtitle(slide, palette) {
  if (!slide.subtitle) return '';
  return `<p style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:18px; font-weight:400;
    line-height:1.6; color:${palette.muted}; margin:0;">${slide.subtitle}</p>`;
}

function renderBody(slide, palette) {
  if (!slide.body) return '';
  return `<p style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:16px; font-weight:400;
    line-height:1.85; color:${palette.muted}; margin:0;">${slide.body}</p>`;
}

function renderDivider(accent) {
  return `<div style="width:52px; height:3px; background:${accent}; border-radius:2px; margin-bottom:24px;"></div>`;
}

function renderAccentLine(pos, accent) {
  const side = pos === 'accent_line_right' ? 'right: 0;' : 'left: 0;';
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
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='2' cy='2' r='1.2' fill='${accent}' opacity='0.15'/></svg>`;
  const encoded = Buffer.from(svg).toString('base64');
  return `<div style="position:absolute; inset:0; z-index:1;
    background-image:url('data:image/svg+xml;base64,${encoded}');
    background-size:24px 24px; pointer-events:none;"></div>`;
}

function renderQuoteMark(accent) {
  return `<div style="font-family:Georgia,serif; font-size:110px; line-height:0.7;
    color:${accent}; opacity:0.45; margin-bottom:24px; user-select:none;">"</div>`;
}

function renderBullets(slide, palette, accent) {
  if (!slide.bullets || !slide.bullets.length) return '';
  const items = slide.bullets.map(b =>
    `<li style="display:flex; align-items:flex-start; gap:12px; margin-bottom:14px;">
       <span style="color:${accent}; margin-top:3px; flex-shrink:0; font-size:13px;">▸</span>
       <span style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:16px; line-height:1.55;
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
       <span style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:15px; line-height:1.55;
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
       <div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:46px; font-weight:700;
         color:${accent}; line-height:1; margin-bottom:10px;">${s.value}</div>
       <div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif; font-size:12px; font-weight:600;
         letter-spacing:2px; text-transform:uppercase; color:${palette.muted};">${s.label}</div>
     </div>`
  ).join('');
  return `<div style="display:flex; gap:24px; width:100%;">${cards}</div>`;
}

function renderElement(el, slide, palette, accent, layout) {
  switch (el) {
    case 'eyebrow':    return renderEyebrow(slide, palette, accent);
    case 'title':      return renderTitle(slide, palette, layout === 'cover' ? '58px' : '38px');
    case 'subtitle':   return renderSubtitle(slide, palette);
    case 'divider':    return renderDivider(accent);
    case 'body':       return renderBody(slide, palette);
    case 'bullets':    return layout === 'two_column_bullets'
                         ? renderBulletsGrid(slide, palette, accent)
                         : renderBullets(slide, palette, accent);
    case 'stats':      return renderStats(slide, palette, accent);
    case 'quote_mark': return renderQuoteMark(accent);
    default:           return '';
  }
}

// ─── COMPOSITION SANITIZER ───────────────────────────────────────────────────

function sanitizeComposition(imageType, overlayType, textPos, img) {
  let safeOverlay = overlayType;
  let safeTextPos = textPos;

  if (imageType === 'full_background' && overlayType === 'none' && img) {
    safeOverlay = 'dark_gradient_bottom';
  }
  if ((imageType === 'right_half' || imageType === 'left_half') &&
      (overlayType === 'dark_full' || overlayType === 'light_full')) {
    safeOverlay = 'none';
  }

  return { safeOverlay, safeTextPos };
}

// ─── MAIN BUILD FUNCTION ─────────────────────────────────────────────────────

function buildSlideHTML(slide, imageUrl) {
  const comp = slide.composition || {};
  const imageType   = comp.image        || 'none';
  const overlayType = comp.overlay      || 'none';
  const textPos     = comp.textPosition || 'center_left';
  const layout      = comp.layout       || 'single_column';
  const mood        = comp.mood         || 'dark';
  const accent      = comp.accentColor  || '#d4a843';
  const elements    = comp.elements     || ['title'];
  const decorative  = comp.decorative   || [];
  const idx         = (slide.index || 1) - 1;

  const palette = MOOD[mood] || MOOD.dark;
  const img     = imageUrl || '';

  const { safeOverlay, safeTextPos } = sanitizeComposition(imageType, overlayType, textPos, img);
  const { wrapperCSS } = imagePlacement(imageType, img);
  const hasOverlay = img && safeOverlay !== 'none';
  const textCSS    = textPositionCSS(safeTextPos, imageType);

  // Сурет жоқ болғанда: SVG fallback + gradient bg
  const hasRichContent = (slide.stats && slide.stats.length > 0) || (slide.bullets && slide.bullets.length > 0);
  const hasFallbackVisual = !img && !hasRichContent;
  const fallbackSVG = hasFallbackVisual ? buildFallbackVisual(accent, mood, idx) : '';

  const bgLayer = wrapperCSS
    ? `<div style="${wrapperCSS}"></div>`
    : `<div style="position:absolute; inset:0; z-index:0;
        background: radial-gradient(circle at 82% 20%, ${accent}22 0, transparent 32%),
                    radial-gradient(circle at 15% 85%, ${accent}18 0, transparent 35%),
                    linear-gradient(135deg, ${palette.bg}, #101820);"></div>
       <div style="position:absolute; inset:0; z-index:0; opacity:.14;
        background-image: linear-gradient(${accent}44 1px, transparent 1px),
                          linear-gradient(90deg, ${accent}44 1px, transparent 1px);
        background-size:48px 48px;"></div>`;

  const contentHTML = elements
    .map(el => renderElement(el, slide, palette, accent, layout))
    .join('\n');

  const decorHTML = decorative.map(d => {
    if (d === 'accent_line_left')  return renderAccentLine('accent_line_left', accent);
    if (d === 'accent_line_right') return renderAccentLine('accent_line_right', accent);
    if (d === 'corner_circle')     return renderCornerCircle(accent);
    if (d === 'bottom_rule')       return renderBottomRule(palette);
    if (d === 'grid_dots')         return renderGridDots(accent);
    return '';
  }).join('\n');

  console.log('[HTML] image:', img ? 'YES' : 'NO (SVG fallback #' + (idx % 5) + ')');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1280px; height: 720px; overflow: hidden; }
  .slide { position: relative; width: 1280px; height: 720px; background: ${palette.bg};
           font-family: Noto Sans CJK KR, DejaVu Sans, sans-serif; }
</style>
</head>
<body>
<div class="slide">

  ${bgLayer}
  ${fallbackSVG}
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
