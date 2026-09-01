'use strict';

const LOGO_WHITE = 'data:image/png;base64,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
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

function buildFallbackVisual(accent, mood, index) {
  const a  = accent || '#d4a843';
  const a1 = a + 'cc';
  const a2 = a + '55';
  const a3 = a + '22';
  const a4 = a + '11';
  const v  = index % 3;

  if (v === 0) {
    // Neural network
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
    // Hexagon
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
    // Orbits
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
  return '<h1 style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:' + (big || '38px') + ';font-weight:700;line-height:1.15;color:' + palette.text + ';letter-spacing:-0.5px;margin:0;">' + slide.title + '</h1>';
}
function renderSubtitle(slide, palette) {
  if (!slide.subtitle) return '';
  return '<p style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:18px;font-weight:400;line-height:1.6;color:' + palette.muted + ';margin:0;">' + slide.subtitle + '</p>';
}
function renderBody(slide, palette) {
  if (!slide.body) return '';
  return '<p style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:16px;font-weight:400;line-height:1.85;color:' + palette.muted + ';margin:0;">' + slide.body + '</p>';
}
function renderEyebrow(slide, accent) {
  const label = slide.subtitle || slide.title || 'Overview';
  return '<div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:' + accent + ';margin-bottom:18px;">' + label + '</div>';
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
    return '<li style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;"><span style="color:' + accent + ';margin-top:3px;flex-shrink:0;font-size:13px;">▸</span><span style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:16px;line-height:1.55;color:' + palette.text + ';font-weight:400;">' + b + '</span></li>';
  }).join('');
  if (grid) {
    const gridItems = slide.bullets.map(function(b) {
      return '<div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:7px;height:7px;border-radius:50%;background:' + accent + ';flex-shrink:0;margin-top:5px;"></div><span style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:15px;line-height:1.55;color:' + palette.text + ';font-weight:400;">' + b + '</span></div>';
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
    const padding = useGrid ? '20px 24px' : '28px 36px';
    const fontSize = useGrid ? '38px' : '46px';
    return '<div style="background:' + palette.surface + ';border:1px solid ' + accent + '22;border-radius:14px;padding:' + padding + ';text-align:center;flex:1;min-width:0;"><div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:' + fontSize + ';font-weight:700;color:' + accent + ';line-height:1;margin-bottom:10px;">' + s.value + '</div><div style="font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:' + palette.muted + ';word-break:break-word;">' + s.label + '</div></div>';
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

function sanitizeComposition(imageType, overlayType, img) {
  let safeOverlay = overlayType;
  if (imageType === 'full_background' && overlayType === 'none' && img) safeOverlay = 'dark_gradient_bottom';
  if ((imageType === 'right_half' || imageType === 'left_half') && (overlayType === 'dark_full' || overlayType === 'light_full')) safeOverlay = 'none';
  return safeOverlay;
}

// right_half/left_half слайдтарда бос жақта SVG визуал шығару
function buildSplitFallbackSVG(accent, side, index) {
  const a  = accent || '#d4a843';
  const a2 = a + '55';
  const a3 = a + '22';
  const a4 = a + '11';
  const pos = side === 'right' ? 'right:0;' : 'left:0;';
  const v = index % 3;

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

function buildSlideHTML(slide, imageUrl) {
  const comp        = slide.composition || {};
  const imageType   = comp.image        || 'none';
  const overlayType = comp.overlay      || 'none';
  const textPos     = comp.textPosition || 'center_left';
  const layout      = comp.layout       || 'single_column';
  const mood        = comp.mood         || 'dark';
  const accent      = comp.accentColor  || '#d4a843';
  const elements    = comp.elements     || ['title'];
  const decorative  = comp.decorative   || [];
  const idx         = (slide.index || 1) - 1;

  const palette    = MOOD[mood] || MOOD.dark;
  // Stat cards бар слайдта сурет керек емес — cards + image = толып кетеді
  const hasStats = slide.stats && slide.stats.length > 0;
  const img = imageUrl || '';
  const safeOverlay = hasStats && img ? 'dark_full' : sanitizeComposition(imageType, overlayType, img);
  const { wrapperCSS } = imagePlacement(imageType, img);
  const hasOverlay = img && safeOverlay !== 'none';
  const textCSS    = textPositionCSS(textPos, imageType);

  const hasRichContent = (slide.stats && slide.stats.length > 0) || (slide.bullets && slide.bullets.length > 0);
  const showFallback   = !img && !hasRichContent;

  // right_half / left_half + сурет жоқ → бос жаққа SVG визуал
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

  console.log('[HTML] image:', img ? 'YES' : ('NO (fallback:' + showFallback + ')'));

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{width:1280px;height:720px;overflow:hidden;}.slide{position:relative;width:1280px;height:720px;background:' + palette.bg + ';font-family:Noto Sans CJK KR,DejaVu Sans,sans-serif;}</style></head><body><div class="slide">'
    + bgLayer
    + fallbackSVG
    + splitFallbackSVG
    + (hasOverlay ? '<div style="position:absolute;inset:0;z-index:1;' + overlayCSS(safeOverlay, accent) + '"></div>' : '')
    + decorHTML
    + '<div style="' + textCSS + '">' + contentHTML + '</div>'
    + '<img src="' + LOGO_WHITE + '" style="position:absolute;bottom:24px;right:32px;height:36px;opacity:0.85;z-index:10;object-fit:contain;" />'
    + '</div></body></html>';
}

module.exports = { buildSlideHTML };
