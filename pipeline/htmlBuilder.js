'use strict';

const fs_   = require('fs');
const path_ = require('path');

function getLogoBase64() {
  try {
    const logoPath = path_.join(__dirname, '..', 'assets', 'logo_white.png');
    const data = fs_.readFileSync(logoPath);
    return 'data:image/png;base64,' + data.toString('base64');
  } catch (e) {
    return '';
  }
}
const LOGO_WHITE = getLogoBase64();


const MOOD = {
  dark:  { bg: '#0d1117', text: '#ffffff', muted: 'rgba(255,255,255,0.6)',  surface: 'rgba(255,255,255,0.06)' },
  light: { bg: '#f5f2ed', text: '#1a1a1a', muted: 'rgba(0,0,0,0.45)',      surface: 'rgba(0,0,0,0.04)' },
  warm:  { bg: '#1e1209', text: '#f5e8d0', muted: 'rgba(245,232,208,0.6)', surface: 'rgba(255,255,255,0.06)' },
  cold:  { bg: '#0c1622', text: '#e8f0f8', muted: 'rgba(232,240,248,0.6)', surface: 'rgba(255,255,255,0.07)' },
  vivid: { bg: '#0a0a0a', text: '#ffffff', muted: 'rgba(255,255,255,0.65)', surface: 'rgba(255,255,255,0.08)' },
};

function overlayCSS(type, accent) {
  switch (type) {
    case 'dark_gradient_left':
      return 'background:linear-gradient(90deg,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.80) 45%,rgba(0,0,0,0.40) 70%,rgba(0,0,0,0.08) 100%)';
    case 'dark_gradient_right':
      return 'background:linear-gradient(270deg,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.80) 45%,rgba(0,0,0,0.35) 70%,rgba(0,0,0,0.06) 100%)';
    case 'dark_gradient_bottom':
      return 'background:linear-gradient(180deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.75) 100%)';
    case 'dark_full':
      return 'background:rgba(0,0,0,0.62)';
    case 'light_full':
      return 'background:rgba(255,255,255,0.55)';
    case 'color_wash':
      return 'background:' + accent + '22';
    default:
      return 'display:none';
  }
}

function imagePlacement(imageType, img) {
  if (!img || imageType === 'none') return { wrapperCSS: '' };
  const base = "background-image:url('" + img + "');background-size:cover;background-position:center;";
  switch (imageType) {
    case 'full_background':
      return { wrapperCSS: 'position:absolute;inset:0;z-index:0;' + base };
    case 'right_half':
      return { wrapperCSS: 'position:absolute;top:0;right:0;width:52%;height:100%;z-index:0;' + base + 'border-left:1px solid rgba(255,255,255,0.08)' };
    case 'left_half':
      return { wrapperCSS: 'position:absolute;top:0;left:0;width:48%;height:100%;z-index:0;' + base };
    case 'top_strip':
      return { wrapperCSS: 'position:absolute;top:0;left:0;right:0;height:38%;z-index:0;' + base + 'background-position:center 30%;-webkit-mask-image:linear-gradient(180deg,black 55%,transparent 100%);mask-image:linear-gradient(180deg,black 55%,transparent 100%)' };
    case 'bottom_strip':
      return { wrapperCSS: 'position:absolute;bottom:0;left:0;right:0;height:35%;z-index:0;' + base + 'background-position:center 70%;-webkit-mask-image:linear-gradient(0deg,black 55%,transparent 100%);mask-image:linear-gradient(0deg,black 55%,transparent 100%)' };
    case 'corner_accent':
      return { wrapperCSS: 'position:absolute;bottom:0;right:0;width:38%;height:55%;z-index:0;' + base + 'border-radius:24px 0 0 0;opacity:0.75' };
    default:
      return { wrapperCSS: '' };
  }
}

// FIX 1: index параметрі кез-келген сан болса да жұмыс істейтін етіп түзету
function buildFallbackVisual(accent, mood, slideIndex) {
  const a  = accent || '#d4a843';
  const a1 = a + 'cc';
  const a2 = a + '55';
  const a3 = a + '22';
  const a4 = a + '11';
  // slideIndex кепілдікпен оң бүтін санға айналдыру
  const safeIndex = Math.max(0, Math.floor(Number(slideIndex) || 0));
  const v  = safeIndex % 3;

  if (v === 0) {
    return '<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;right:-30px;top:10px;z-index:1;opacity:0.8;">'
      + '<circle cx="250" cy="250" r="240" fill="' + a3 + '"/>'
      + '<circle cx="250" cy="250" r="160" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="250" cy="250" r="100" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<line x1="250" y1="250" x2="120" y2="130" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="250" y1="250" x2="390" y2="120" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="250" y1="250" x2="420" y2="300" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="250" y1="250" x2="340" y2="420" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="250" y1="250" x2="110" y2="390" stroke="' + a2 + '" stroke-width="1"/>'
      + '<circle cx="120" cy="130" r="10" fill="' + a + '" opacity="0.7"/>'
      + '<circle cx="390" cy="120" r="8"  fill="' + a + '" opacity="0.6"/>'
      + '<circle cx="420" cy="300" r="12" fill="' + a + '" opacity="0.75"/>'
      + '<circle cx="340" cy="420" r="9"  fill="' + a + '" opacity="0.65"/>'
      + '<circle cx="110" cy="390" r="11" fill="' + a + '" opacity="0.7"/>'
      + '<circle cx="120" cy="130" r="22" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="420" cy="300" r="26" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="250" cy="250" r="20" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="250" cy="250" r="34" stroke="' + a1 + '" stroke-width="1.5" fill="none"/>'
      + '<circle cx="250" cy="250" r="52" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '</svg>';
  }

  if (v === 1) {
    return '<svg width="480" height="480" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;right:-10px;top:20px;z-index:1;opacity:0.8;">'
      + '<circle cx="240" cy="240" r="230" stroke="' + a3 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="240" cy="240" r="185" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<polygon points="240,60 396,150 396,330 240,420 84,330 84,150" stroke="' + a1 + '" stroke-width="1.5" fill="' + a4 + '"/>'
      + '<polygon points="240,130 340,185 340,295 240,350 140,295 140,185" stroke="' + a2 + '" stroke-width="1" fill="' + a3 + '"/>'
      + '<polygon points="240,200 290,230 290,290 240,320 190,290 190,230" fill="' + a + '" opacity="0.5"/>'
      + '<circle cx="240" cy="60"  r="5" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="396" cy="150" r="5" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="396" cy="330" r="5" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="240" cy="420" r="5" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="84"  cy="330" r="5" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="84"  cy="150" r="5" fill="' + a + '" opacity="0.9"/>'
      + '</svg>';
  }

  return '<svg width="520" height="520" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;right:-40px;top:0;z-index:1;opacity:0.75;">'
    + '<circle cx="260" cy="260" r="250" fill="' + a3 + '"/>'
    + '<ellipse cx="260" cy="260" rx="210" ry="75" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(-30 260 260)"/>'
    + '<ellipse cx="260" cy="260" rx="210" ry="75" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(30 260 260)"/>'
    + '<ellipse cx="260" cy="260" rx="210" ry="75" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(90 260 260)"/>'
    + '<circle cx="470" cy="260" r="8"  fill="' + a + '" opacity="0.8"/>'
    + '<circle cx="50"  cy="260" r="6"  fill="' + a + '" opacity="0.6"/>'
    + '<circle cx="370" cy="80"  r="7"  fill="' + a + '" opacity="0.7"/>'
    + '<circle cx="150" cy="440" r="5"  fill="' + a + '" opacity="0.55"/>'
    + '<circle cx="370" cy="440" r="9"  fill="' + a + '" opacity="0.75"/>'
    + '<circle cx="260" cy="260" r="38" fill="' + a + '" opacity="0.15"/>'
    + '<circle cx="260" cy="260" r="22" fill="' + a + '" opacity="0.8"/>'
    + '<circle cx="260" cy="260" r="55" stroke="' + a1 + '" stroke-width="1.5" fill="none"/>'
    + '</svg>';
}

function textPositionCSS(pos, imageType) {
  if (pos === 'left_column') {
    return 'position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:18px;width:calc(48% - 0px);max-width:580px;padding:64px 56px 64px 80px';
  }
  if (pos === 'right_column') {
    return 'position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:18px;margin-left:48%;width:calc(52% - 0px);padding:64px 72px 64px 56px';
  }
  const shared = 'position:absolute;z-index:2;max-width:700px;display:flex;flex-direction:column;gap:18px;';
  switch (pos) {
    case 'center':        return shared + 'top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:80%';
    case 'center_left':   return shared + 'top:50%;left:80px;transform:translateY(-50%)';
    case 'center_right':  return shared + 'top:50%;right:80px;transform:translateY(-50%);text-align:right';
    case 'top_left':      return shared + 'top:64px;left:80px';
    case 'top_center':    return shared + 'top:64px;left:50%;transform:translateX(-50%);text-align:center';
    case 'bottom_left':   return shared + 'bottom:72px;left:80px';
    case 'bottom_center': return shared + 'bottom:96px;left:50%;transform:translateX(-50%);text-align:center';
    default:              return shared + 'top:50%;left:80px;transform:translateY(-50%)';
  }
}

function renderTitle(slide, palette, big) {
  if (!slide.title) return '';
  return '<h1 style="font-family:DejaVu Sans,Arial,sans-serif;font-size:' + (big || '42px') + ';font-weight:700;line-height:1.15;color:' + palette.text + ';letter-spacing:-0.5px;margin:0;">' + slide.title + '</h1>';
}
function renderSubtitle(slide, palette) {
  if (!slide.subtitle) return '';
  return '<p style="font-family:DejaVu Sans,Arial,sans-serif;font-size:17px;font-weight:400;line-height:1.55;color:' + palette.muted + ';margin:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">' + slide.subtitle + '</p>';
}
function renderBody(slide, palette) {
  if (!slide.body) return '';
  return '<p style="font-family:DejaVu Sans,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.65;color:' + palette.muted + ';margin:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">' + slide.body + '</p>';
}
function renderEyebrow(slide, accent) {
  const raw = slide.title || 'Overview';
  const label = raw.split(' ').slice(0, 4).join(' ');
  return '<div style="font-family:DejaVu Sans,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:' + accent + ';margin-bottom:18px;opacity:0.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + label + '</div>';
}
function renderDivider(accent) {
  return '<div style="width:52px;height:3px;background:' + accent + ';border-radius:2px;margin-bottom:24px;"></div>';
}
function renderQuoteMark(accent) {
  return '<div style="font-family:Georgia,serif;font-size:110px;line-height:0.7;color:' + accent + ';opacity:0.45;margin-bottom:24px;">"</div>';
}
function renderBullets(slide, palette, accent, grid) {
  if (!slide.bullets || !slide.bullets.length) return '';
  const items = slide.bullets.map(function(b) {
    return '<li style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;"><span style="color:' + accent + ';margin-top:3px;flex-shrink:0;font-size:13px;">&#9656;</span><span style="font-family:DejaVu Sans,Arial,sans-serif;font-size:18px;line-height:1.55;color:' + palette.text + ';font-weight:400;">' + b + '</span></li>';
  }).join('');
  if (grid) {
    const gridItems = slide.bullets.map(function(b) {
      return '<div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:7px;height:7px;border-radius:50%;background:' + accent + ';flex-shrink:0;margin-top:5px;"></div><span style="font-family:DejaVu Sans,Arial,sans-serif;font-size:17px;line-height:1.55;color:' + palette.text + ';font-weight:400;">' + b + '</span></div>';
    }).join('');
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 40px;">' + gridItems + '</div>';
  }
  return '<ul style="list-style:none;margin:0;padding:0;">' + items + '</ul>';
}
function renderStats(slide, palette, accent) {
  if (!slide.stats || !slide.stats.length) return '';
  const count = slide.stats.length;
  const useGrid = count >= 4;
  const cards = slide.stats.map(function(s) {
    const padding = useGrid ? '16px 18px' : '22px 28px';
    const fontSize = useGrid ? '32px' : '38px';
    return '<div style="background:' + palette.surface + ';border:1px solid ' + accent + '22;border-radius:14px;padding:' + padding + ';text-align:center;flex:1;min-width:0;overflow:hidden;"><div style="font-family:DejaVu Sans,Arial,sans-serif;font-size:' + fontSize + ';font-weight:700;color:' + accent + ';line-height:1;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + s.value + '</div><div style="font-family:DejaVu Sans,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:' + palette.muted + ';word-break:break-word;line-height:1.4;">' + s.label + '</div></div>';
  }).join('');
  if (useGrid) {
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;">' + cards + '</div>';
  }
  return '<div style="display:flex;gap:24px;width:100%;">' + cards + '</div>';
}

function renderElement(el, slide, palette, accent, layout) {
  switch (el) {
    case 'eyebrow':    return renderEyebrow(slide, accent);
    case 'title':      return renderTitle(slide, palette, layout === 'cover' ? '58px' : '38px');
    case 'subtitle':   return renderSubtitle(slide, palette);
    case 'divider':    return renderDivider(accent);
    case 'body':       return renderBody(slide, palette);
    case 'bullets':    return renderBullets(slide, palette, accent, layout === 'two_column_bullets');
    case 'stats':      return renderStats(slide, palette, accent);
    case 'quote_mark': return renderQuoteMark(accent);
    default:           return '';
  }
}

function renderDecor(d, accent, palette) {
  if (d === 'accent_line_left')  return '<div style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:4px;height:200px;border-radius:2px;z-index:3;background:linear-gradient(180deg,transparent,' + accent + ',transparent);"></div>';
  if (d === 'accent_line_right') return '<div style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:4px;height:200px;border-radius:2px;z-index:3;background:linear-gradient(180deg,transparent,' + accent + ',transparent);"></div>';
  if (d === 'corner_circle')     return '<div style="position:absolute;bottom:40px;right:72px;width:110px;height:110px;border:1px solid ' + accent + '44;border-radius:50%;z-index:3;"></div>';
  if (d === 'bottom_rule')       return '<div style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:72px;height:2px;background:' + palette.muted + ';z-index:3;opacity:0.4;"></div>';
  if (d === 'grid_dots') {
    const svg = '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\'><circle cx=\'2\' cy=\'2\' r=\'1.2\' fill=\'' + accent + '\' opacity=\'0.15\'/></svg>';
    const enc = Buffer.from(svg).toString('base64');
    return '<div style="position:absolute;inset:0;z-index:1;background-image:url(\'data:image/svg+xml;base64,' + enc + '\');background-size:24px 24px;pointer-events:none;"></div>';
  }
  return '';
}

// FIX 2: image жоқта overlay мәселесін түзету
function sanitizeComposition(imageType, overlayType, img) {
  let safeOverlay = overlayType;
  // Сурет жоқ болса overlay қажет емес
  if (!img) return 'none';
  if (imageType === 'full_background' && overlayType === 'none' && img) safeOverlay = 'dark_gradient_bottom';
  if ((imageType === 'right_half' || imageType === 'left_half') && (overlayType === 'dark_full' || overlayType === 'light_full')) safeOverlay = 'none';
  return safeOverlay;
}

function buildSplitFallbackSVG(accent, side, slideIndex) {
  const a  = accent || '#d4a843';
  const a2 = a + '55';
  const a3 = a + '22';
  const a4 = a + '11';
  const pos = side === 'right' ? 'right:0;' : 'left:0;';
  // FIX 3: slideIndex қауіпсіз есептеу
  const safeIndex = Math.max(0, Math.floor(Number(slideIndex) || 0));
  const v = safeIndex % 3;

  let svg = '';
  if (v === 0) {
    svg = '<svg width="580" height="720" viewBox="0 0 580 720" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="290" cy="360" r="280" fill="' + a4 + '"/>'
      + '<circle cx="290" cy="360" r="200" stroke="' + a3 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="290" cy="360" r="130" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="290" cy="360" r="70"  stroke="' + a2 + '" stroke-width="1.5" fill="' + a3 + '"/>'
      + '<circle cx="290" cy="360" r="28"  fill="' + a + '" opacity="0.7"/>'
      + '<line x1="290" y1="360" x2="120" y2="180" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="290" y1="360" x2="460" y2="170" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="290" y1="360" x2="490" y2="420" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="290" y1="360" x2="380" y2="570" stroke="' + a2 + '" stroke-width="1"/>'
      + '<line x1="290" y1="360" x2="100" y2="520" stroke="' + a2 + '" stroke-width="1"/>'
      + '<circle cx="120" cy="180" r="10" fill="' + a + '" opacity="0.7"/>'
      + '<circle cx="460" cy="170" r="8"  fill="' + a + '" opacity="0.6"/>'
      + '<circle cx="490" cy="420" r="12" fill="' + a + '" opacity="0.8"/>'
      + '<circle cx="380" cy="570" r="9"  fill="' + a + '" opacity="0.65"/>'
      + '<circle cx="100" cy="520" r="11" fill="' + a + '" opacity="0.7"/>'
      + '<circle cx="120" cy="180" r="22" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '<circle cx="490" cy="420" r="26" stroke="' + a2 + '" stroke-width="1" fill="none"/>'
      + '</svg>';
  } else if (v === 1) {
    svg = '<svg width="580" height="720" viewBox="0 0 580 720" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="290" cy="360" r="270" fill="' + a4 + '"/>'
      + '<polygon points="290,100 490,220 490,500 290,620 90,500 90,220" stroke="' + a2 + '" stroke-width="1.5" fill="' + a4 + '"/>'
      + '<polygon points="290,180 420,255 420,465 290,540 160,465 160,255" stroke="' + a3 + '" stroke-width="1" fill="' + a3 + '"/>'
      + '<polygon points="290,270 360,312 360,408 290,450 220,408 220,312" fill="' + a + '" opacity="0.4"/>'
      + '<circle cx="290" cy="100" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="490" cy="220" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="490" cy="500" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="290" cy="620" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="90"  cy="500" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="90"  cy="220" r="6" fill="' + a + '" opacity="0.9"/>'
      + '<circle cx="290" cy="360" r="30" fill="' + a + '" opacity="0.6"/>'
      + '<circle cx="290" cy="360" r="48" stroke="' + a2 + '" stroke-width="1.5" fill="none"/>'
      + '</svg>';
  } else {
    svg = '<svg width="580" height="720" viewBox="0 0 580 720" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<ellipse cx="290" cy="360" rx="250" ry="100" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(-20 290 360)"/>'
      + '<ellipse cx="290" cy="360" rx="250" ry="100" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(20 290 360)"/>'
      + '<ellipse cx="290" cy="360" rx="250" ry="100" stroke="' + a2 + '" stroke-width="1" fill="none" transform="rotate(80 290 360)"/>'
      + '<circle cx="290" cy="360" r="240" fill="' + a4 + '"/>'
      + '<circle cx="540" cy="360" r="9"  fill="' + a + '" opacity="0.8"/>'
      + '<circle cx="40"  cy="360" r="7"  fill="' + a + '" opacity="0.6"/>'
      + '<circle cx="420" cy="120" r="8"  fill="' + a + '" opacity="0.7"/>'
      + '<circle cx="160" cy="600" r="6"  fill="' + a + '" opacity="0.55"/>'
      + '<circle cx="420" cy="600" r="10" fill="' + a + '" opacity="0.75"/>'
      + '<circle cx="160" cy="120" r="7"  fill="' + a + '" opacity="0.6"/>'
      + '<circle cx="290" cy="360" r="45" fill="' + a + '" opacity="0.15"/>'
      + '<circle cx="290" cy="360" r="26" fill="' + a + '" opacity="0.8"/>'
      + '<circle cx="290" cy="360" r="62" stroke="' + a2 + '" stroke-width="1.5" fill="none"/>'
      + '<circle cx="290" cy="360" r="85" stroke="' + a3 + '" stroke-width="1" fill="none"/>'
      + '</svg>';
  }

  return '<div style="position:absolute;top:0;' + pos + 'width:52%;height:100%;z-index:1;display:flex;align-items:center;justify-content:center;overflow:hidden;">' + svg + '</div>';
}

function buildSlideHTML(slide, imageUrl, globalIndex) {
  const comp        = slide.composition || {};
  // bottom_strip және corner_accent жақсы көрінбейді — автоматты түзету
  let imageType = comp.image || 'none';
  if (imageType === 'bottom_strip') imageType = 'full_background';
  if (imageType === 'corner_accent') imageType = 'right_half';
  if (imageType === 'top_strip') imageType = 'full_background';
  let overlayType = comp.overlay || 'none';
  // full_background болса overlay міндетті
  if (imageType === 'full_background' && overlayType === 'none' && imageUrl) overlayType = 'dark_gradient_bottom';
  const textPos     = comp.textPosition || 'center_left';
  const layout      = comp.layout       || 'single_column';
  const mood        = comp.mood         || 'dark';
  const accent      = comp.accentColor  || '#d4a843';
  const elements    = comp.elements     || ['title'];
  const decorative  = comp.decorative   || [];

  // FIX 4: index-ті 3 жерден алу: slide.index, globalIndex, немесе 0
  const rawIndex = slide.index != null ? slide.index : (globalIndex != null ? globalIndex + 1 : 1);
  const idx = Math.max(0, Math.floor(Number(rawIndex) || 1) - 1);

  const palette    = MOOD[mood] || MOOD.dark;
  const hasStats = slide.stats && slide.stats.length > 0;
  const img = imageUrl || '';
  const safeOverlay = hasStats && img ? 'dark_full' : sanitizeComposition(imageType, overlayType, img);
  const { wrapperCSS } = imagePlacement(imageType, img);
  const hasOverlay = img && safeOverlay !== 'none';
  const textCSS    = textPositionCSS(textPos, imageType);

  const hasRichContent = (slide.stats && slide.stats.length > 0) || (slide.bullets && slide.bullets.length > 0);
  const showFallback   = !img && !hasRichContent;

  const isSplit = imageType === 'right_half' || imageType === 'left_half';
  const splitSide = imageType === 'right_half' ? 'right' : 'left';
  const splitFallbackSVG = !img && isSplit ? buildSplitFallbackSVG(accent, splitSide, idx) : '';

  const fallbackSVG = showFallback && !isSplit ? buildFallbackVisual(accent, mood, idx) : '';

  const bgLayer = wrapperCSS
    ? '<div style="' + wrapperCSS + '"></div>'
    : '<div style="position:absolute;inset:0;z-index:0;background:radial-gradient(circle at 80% 20%,' + accent + '22 0,transparent 32%),radial-gradient(circle at 15% 85%,' + accent + '18 0,transparent 35%),linear-gradient(135deg,' + palette.bg + ',#101820);"></div>'
      + '<div style="position:absolute;inset:0;z-index:0;opacity:.12;background-image:linear-gradient(' + accent + '33 1px,transparent 1px),linear-gradient(90deg,' + accent + '33 1px,transparent 1px);background-size:48px 48px;"></div>';

  const contentHTML = elements.map(function(el) { return renderElement(el, slide, palette, accent, layout); }).join('\n');
  const decorHTML   = decorative.map(function(d) { return renderDecor(d, accent, palette); }).join('\n');

  console.log('[HTML] slide idx=' + idx + ' image:', img ? 'YES' : ('NO (fallback:' + showFallback + ')'));

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{width:1280px;height:720px;overflow:hidden;}.slide{position:relative;width:1280px;height:720px;background:' + palette.bg + ';font-family:DejaVu Sans,Arial,sans-serif;}</style></head><body><div class="slide">'
    + bgLayer
    + fallbackSVG
    + splitFallbackSVG
    + (hasOverlay ? '<div style="position:absolute;inset:0;z-index:1;' + overlayCSS(safeOverlay, accent) + '"></div>' : '')
    + decorHTML
    + '<div style="' + textCSS + '">' + contentHTML + '</div>'
    + (LOGO_WHITE ? '<img src="' + LOGO_WHITE + '" style="position:absolute;bottom:24px;right:32px;height:36px;opacity:0.85;z-index:10;object-fit:contain;" />' : '')
    + '</div></body></html>';
}

module.exports = { buildSlideHTML };
