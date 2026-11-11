/* NOMĒ occasion bands: 10 designs, personalised with a name line and a message line.
   All drawing is SVG in millimetres. Full band = 528 x 40 mm trim + 3 mm bleed (534 x 46).
   Panels from the trim's left edge: glue 15 | front 210 | end 45 | base 210 | end 48. */
(function () {
  const BLEED = 3, L = 528, H = 40, W = L + 2 * BLEED, HH = H + 2 * BLEED;
  const FX0 = BLEED + 15, FX1 = BLEED + 225;          // front panel in svg coords
  const CX = (FX0 + FX1) / 2, CY = BLEED + H / 2;     // 123, 23
  const BASE0 = BLEED + 270;
  const FOLDS = [15, 225, 270, 480];                  // from trim left
  const GOLD = '#C9A45C', GOLDI = '#D8B672';

  const FONTS = [
    { family: 'NSD', weight: 300, style: 'normal', file: 'nsd-300.woff2' },
    { family: 'NSD', weight: 300, style: 'normal', file: 'nsd-300-ext.woff2', ext: 1 },
    { family: 'NSD', weight: 400, style: 'normal', file: 'nsd-400.woff2' },
    { family: 'NSD', weight: 400, style: 'normal', file: 'nsd-400-ext.woff2', ext: 1 },
    { family: 'NSD', weight: 300, style: 'italic', file: 'nsd-300i.woff2' },
    { family: 'NSD', weight: 300, style: 'italic', file: 'nsd-300i-ext.woff2', ext: 1 },
    { family: 'NSD', weight: 400, style: 'italic', file: 'nsd-400i.woff2' },
    { family: 'NSD', weight: 400, style: 'italic', file: 'nsd-400i-ext.woff2', ext: 1 },
    { family: 'OS', weight: 400, style: 'normal', file: 'os-400.woff2' },
    { family: 'OS', weight: 400, style: 'normal', file: 'os-400-ext.woff2', ext: 1 },
    { family: 'OS', weight: 600, style: 'normal', file: 'os-600.woff2' },
    { family: 'OS', weight: 600, style: 'normal', file: 'os-600-ext.woff2', ext: 1 },
    { family: 'ARQ', weight: 700, style: 'normal', file: 'ruqaa-700.woff2' }
  ];
  const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
  const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
  function fontCSS(base, dataMap) {
    return FONTS.map(f => {
      const src = dataMap ? dataMap[f.file] : base + f.file;
      const range = f.family === 'ARQ' ? '' : `unicode-range:${f.ext ? LATIN_EXT : LATIN};`;
      return `@font-face{font-family:'${f.family}';font-weight:${f.weight};font-style:${f.style};src:url(${src}) format('woff2');${range}font-display:block}`;
    }).join('\n');
  }

  // ---------- small helpers ----------
  const f2 = n => Math.round(n * 100) / 100;
  let uid = 0;
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function star(cx, cy, R, n = 8, ratio = 0.765, rot = 0) {
    let d = ''; for (let i = 0; i < 2 * n; i++) { const r = i % 2 ? R * ratio : R, a = rot + Math.PI * i / n - Math.PI / 2; d += (i ? 'L' : 'M') + f2(cx + r * Math.cos(a)) + ' ' + f2(cy + r * Math.sin(a)); } return d + 'Z';
  }
  function heart(cx, cy, s) {
    const p = (x, y) => f2(cx + x * s) + ' ' + f2(cy + y * s);
    return `M${p(0, .42)}C${p(-.5, .02)} ${p(-.55, -.42)} ${p(-.27, -.42)}C${p(-.12, -.42)} ${p(0, -.32)} ${p(0, -.22)}C${p(0, -.32)} ${p(.12, -.42)} ${p(.27, -.42)}C${p(.55, -.42)} ${p(.5, .02)} ${p(0, .42)}Z`;
  }
  const circ = (cx, cy, r) => `M${f2(cx - r)} ${f2(cy)}a${f2(r)} ${f2(r)} 0 1 0 ${f2(2 * r)} 0a${f2(r)} ${f2(r)} 0 1 0 ${f2(-2 * r)} 0Z`;
  const rect = (x, y, w, h) => `M${f2(x)} ${f2(y)}h${f2(w)}v${f2(h)}h${f2(-w)}Z`;
  const path = (d, fill, extra = '') => d ? `<path d="${d}" fill="${fill}" ${extra}/>` : '';
  function hexPts(cx, cy, w, h) { const t = h * 0.42, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2; return [[x0, cy], [x0 + t, y0], [x1 - t, y0], [x1, cy], [x1 - t, y1], [x0 + t, y1]].map(p => p.map(f2).join(',')).join(' '); }

  // patterns: region y 7.5..38.5, whole length
  function tile(fn, sx, sy, y0 = 8, y1 = 38) { let d = '', row = 0; for (let y = y0 + sy / 2; y < y1; y += sy, row++) for (let x = (row % 2 ? sx / 2 : 0); x < W + sx; x += sx) d += fn(x, y); return d; }
  function scatter(fn, n, zones, seed, y0 = 9, y1 = 37) { const r = rng(seed); let d = ''; for (let i = 0; i < n; i++) { const z = zones[Math.floor(r() * zones.length)]; d += fn(r, z[0] + r() * (z[1] - z[0]), y0 + r() * (y1 - y0)); } return d; }
  function borders(c) { return path(rect(0, BLEED + 2.35, W, .5) + rect(0, BLEED + 3.62, W, .16) + rect(0, BLEED + H - 2.85, W, .5) + rect(0, BLEED + H - 3.78, W, .16), c); }
  function lantern(cx, top, drop, h, c) {
    const w = h * .52, y = top + drop, cap = y + 1.1, b0 = cap + h * .22, b1 = cap + h * .78, m = (b0 + b1) / 2;
    const poly = pts => 'M' + pts.map(p => f2(p[0]) + ' ' + f2(p[1])).join('L') + 'Z';
    return path(rect(cx - .1, top, .2, drop) + circ(cx, y + .5, .55), c) +
      path(poly([[cx, cap], [cx + w * .42, cap + h * .2], [cx - w * .42, cap + h * .2]]), c) +
      path(poly([[cx - w * .36, b0], [cx + w * .36, b0], [cx + w / 2, m], [cx + w * .36, b1], [cx - w * .36, b1], [cx - w / 2, m]]) +
        poly([[cx - w * .2, b0 + .7], [cx + w * .2, b0 + .7], [cx + w * .3, m], [cx + w * .2, b1 - .7], [cx - w * .2, b1 - .7], [cx - w * .3, m]]), c, 'fill-rule="evenodd"') +
      path(rect(cx - .12, b0 + .7, .24, b1 - b0 - 1.4), c) +
      path(poly([[cx - w * .32, b1 + .15], [cx + w * .32, b1 + .15], [cx, cap + h]]), c);
  }
  function crescent(cx, cy, r, c) { return path(circ(cx, cy, r) + circ(cx + r * .42, cy - r * .18, r * .82), c, 'fill-rule="evenodd"'); }

  // ---------- the 10 designs ----------
  const AR = "'ARQ', serif", SERIF = "'NSD', serif", SANS = "'OS', sans-serif";
  const DESIGNS = [
    { id: 'eid', name: 'Eid Mubarak', bg: '#1F4A38', ink: GOLDI, line: GOLD, title: 'عيد مبارك', tf: AR, sub: 'EID MUBARAK', end: 'star',
      pattern: () => path(tile((x, y) => star(x, y, 2.3), 8, 7), '#183C2D') },
    { id: 'ramadan', name: 'Ramadan Kareem', bg: '#15214A', ink: GOLDI, line: GOLD, title: 'رمضان كريم', tf: AR, sub: 'RAMADAN KAREEM', end: 'none', tip: 0,
      pattern: (x0, x1) => path(scatter((r, x, y) => star(x, y, .35 + r() * .55, 4, .3), 520, [[0, x0 - 2], [x1 + 2, W]], 7), '#3A4C8A') +
        path(scatter((r, x, y) => star(x, y, .35 + r() * .5, 4, .3), 46, [[FX0 + 2, x0 - 34], [x1 + 34, FX1 - 2]], 8), GOLD),
      extra: (x0, x1) => crescent(x0 - 4, CY, 2.2, GOLD) + crescent(x1 + 5.5, CY, 2.2, GOLD) + lantern(x0 - 12, BLEED + 3.8, 2, 14, GOLD) + lantern(x0 - 24, BLEED + 3.8, 6.5, 11, GOLD) + lantern(x1 + 12, BLEED + 3.8, 2, 14, GOLD) + lantern(x1 + 24, BLEED + 3.8, 6.5, 11, GOLD) },
    { id: 'national', name: 'UAE National Day', bg: '#FFFFFF', ink: '#121214', line: '#B8924A', title: 'عيد الاتحاد', tf: AR, sub: 'UAE NATIONAL DAY', end: 'star', flag: true, cx: CX + 11, cw: 122, ch: 25 },
    { id: 'birthday', name: 'Happy Birthday', bg: '#F3ECDD', ink: '#1A1A1C', line: '#B8924A', title: 'Happy Birthday', tf: SERIF, ts: 'italic', sub: '', end: 'sparkle',
      pattern: (x0, x1) => {
        const conf = (r, x, y) => { const t = r(), s = .6 + r() * .7, a = r() * Math.PI; if (t < .4) return circ(x, y, s * .55); if (t < .75) { const c = Math.cos(a), sn = Math.sin(a); const p = [[-s, -.3], [s, -.3], [s, .3], [-s, .3]].map(([dx, dy]) => [x + dx * c - dy * sn, y + dx * sn + dy * c]); return 'M' + p.map(q => f2(q[0]) + ' ' + f2(q[1])).join('L') + 'Z'; } return star(x, y, s, 4, .25); };
        const front = [[FX0 + 1, x0 - 3], [x1 + 3, FX1 - 1]], rest = [[0, FX0], [FX1, W]];
        return path(scatter(conf, 150, front, 11), GOLD) + path(scatter(conf, 45, front, 12), '#2A2A2C') + path(scatter(conf, 260, rest, 13), GOLD) + path(scatter(conf, 80, rest, 14), '#2A2A2C');
      } },
    { id: 'love', name: 'With Love', bg: '#561531', ink: GOLDI, line: GOLD, title: 'With Love', tf: SERIF, ts: 'italic', sub: '', end: 'heart',
      pattern: () => path(tile((x, y) => heart(x, y, 2.6), 8, 7), '#45102A') },
    { id: 'seasons', name: 'Season’s Greetings', bg: '#8C1424', ink: GOLDI, line: GOLD, title: 'Season’s Greetings', tf: SERIF, ts: 'italic', sub: '', end: 'sparkle',
      pattern: (x0, x1) => path(tile((x, y) => star(x, y, 1.6, 4, .28), 9, 7.6), '#72101D') + path(scatter((r, x, y) => star(x, y, .5 + r() * .8, 4, .25), 26, [[x0 - 30, x0 - 4], [x1 + 4, x1 + 30]], 3), GOLD) },
    { id: 'congrats', name: 'Congratulations', bg: '#18181B', ink: GOLDI, line: GOLD, title: 'Congratulations', tf: SERIF, ts: 'italic', sub: 'مبروك', sf: AR, end: 'diamond',
      pattern: () => { let d = ''; for (let x = -HH; x < W + HH; x += 3.2) d += `M${f2(x)} ${HH}L${f2(x + HH)} 0`; return `<path d="${d}" stroke="#26262B" stroke-width=".35" fill="none"/>`; } },
    { id: 'thanks', name: 'Thank You', bg: '#D8C6A4', ink: '#2B2116', line: '#8A6A3A', title: 'Thank You', tf: SERIF, ts: 'italic', sub: 'شكراً', sf: AR, end: 'diamond',
      pattern: () => path(tile((x, y) => star(x, y, .9, 4, .4, Math.PI / 4), 5, 5), '#CDB993') },
    { id: 'mabrook', name: 'Mabrook (Wedding)', bg: '#FAF7F0', ink: '#8E6D33', line: '#B8924A', title: 'ألف مبروك', tf: AR, sub: 'ALF MABROOK', end: 'star',
      pattern: () => path(tile((x, y) => circ(x, y, .38), 5, 5), '#E9DDC3') },
    { id: 'dad', name: 'For Dad', bg: '#2B2E33', ink: '#D2D4D9', line: '#A9ACB3', title: 'For Dad', tf: SERIF, ts: 'italic', sub: '', end: 'diamond',
      pattern: () => { let d = ''; for (let x = -HH; x < W + HH; x += 2.4) d += `M${f2(x)} 0L${f2(x + HH)} ${HH}`; return `<path d="${d}" stroke="#33373D" stroke-width=".3" fill="none"/>`; } }
  ];
  const BY_ID = Object.fromEntries(DESIGNS.map(d => [d.id, d]));
  const HAS_AR = s => /[؀-ۿ]/.test(s || '');
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function ornament(kind, x, y, s, c) {
    if (kind === 'star') return path(star(x + 2 * s, y, 1.9), c);
    if (kind === 'heart') return path(heart(x + 1.8 * s, y + .1, 3.1), c);
    if (kind === 'sparkle') return path(star(x + 2.2 * s, y, 2.3, 4, .22), c);
    if (kind === 'diamond') return path(`M${f2(x)} ${y}L${f2(x + s * 2.2)} ${y - 1.3}L${f2(x + s * 4.4)} ${y}L${f2(x + s * 2.2)} ${y + 1.3}Z`, c);
    if (kind === 'crescent') return crescent(x + s * 2.6, y, 2.2, c) ;
    return '';
  }

  // ---------- one band (full 534 x 46) ----------
  function bandInner(id, line1, line2) {
    const d = BY_ID[id] || DESIGNS[0];
    const cx = d.cx || CX, cw = d.cw || 132, ch = d.ch || 28;
    const x0 = cx - cw / 2, x1 = cx + cw / 2;
    const clip = 'nb' + (++uid);
    let s = `<defs><clipPath id="${clip}"><rect x="0" y="0" width="${W}" height="${HH}"/></clipPath></defs><g clip-path="url(#${clip})">`;
    s += `<rect x="0" y="0" width="${W}" height="${HH}" fill="${d.bg}"/>`;
    if (d.flag) {
      s += path(rect(0, 0, W, 12.2), '#0B7A3B') + path(rect(0, HH - 12.2, W, 12.2), '#121214');
      s += path(rect(FX0, 0, 22, HH) + rect(BASE0, 0, 22, HH), '#D52B30');
      s += path(rect(FX0 + 22, 0, .5, HH) + rect(BASE0 + 22, 0, .5, HH) + rect(FX0 + 22.5, 12, W, .35) + rect(FX0 + 22.5, HH - 12.35, W, .35) + rect(0, 12, FX0, .35) + rect(0, HH - 12.35, FX0, .35), d.line);
    } else {
      if (d.pattern) s += d.pattern(x0, x1);
      s += borders(d.line);
    }
    // cartouche
    s += `<polygon points="${hexPts(cx, CY, cw, ch)}" fill="${d.flag ? '#FFFFFF' : d.bg}" stroke="${d.line}" stroke-width=".4"/>`;
    s += `<polygon points="${hexPts(cx, CY, cw - 3.4, ch - 2.4)}" fill="none" stroke="${d.line}" stroke-width=".16"/>`;
    // tip rules + ornaments
    const len = d.tip === 0 ? 0 : 14;
    if (len) s += path(rect(x0 - 1.2 - len, CY - .15, len, .3) + rect(x1 + 1.2, CY - .15, len, .3), d.line);
    s += ornament(d.end, x0 - 1.2 - len, CY, -1, d.line) + ornament(d.end, x1 + 1.2 + len, CY, 1, d.line);
    if (d.extra) s += d.extra(x0, x1);
    // text block, vertically centred
    const k = d.flag ? .86 : 1;
    const lines = [];
    const arTitle = d.tf === AR;
    lines.push({ t: d.title, size: (arTitle ? 8.4 : 6.6) * k, font: d.tf, style: d.ts || 'normal', w: arTitle ? 700 : 300, fill: d.ink, h: (arTitle ? 7.4 : 6.2) * k, asc: (arTitle ? 5.2 : 4.9) * k, max: 100 });
    if (d.sub) lines.push({ t: d.sub, size: (d.sf ? 3.8 : 1.55) * k, font: d.sf || SANS, style: 'normal', w: d.sf ? 700 : 600, ls: d.sf ? 0 : .5, fill: d.ink, h: (d.sf ? 3.6 : 1.6) * k, asc: (d.sf ? 2.6 : 1.15) * k, max: 90 });
    if (line1) { const ar = HAS_AR(line1); lines.push({ t: line1, size: (ar ? 4.6 : 4.1) * k, font: ar ? "'ARQ','NSD',serif" : "'NSD','ARQ',serif", style: ar ? 'normal' : 'italic', w: ar ? 700 : 400, fill: d.ink, h: 4.4 * k, asc: 3.1 * k, max: 92, user: 1 }); }
    if (line2) { const ar = HAS_AR(line2); lines.push({ t: ar ? line2 : line2.toUpperCase(), size: (ar ? 2.9 : 1.8) * k, font: ar ? "'ARQ','OS',sans-serif" : "'OS','ARQ',sans-serif", style: 'normal', w: ar ? 700 : 400, ls: ar ? 0 : .38, fill: d.ink, h: (ar ? 2.9 : 1.9) * k, asc: (ar ? 2.1 : 1.32) * k, max: 92, user: 1 }); }
    const gap = 1.25 * k;
    const total = lines.reduce((a, l) => a + l.h, 0) + gap * (lines.length - 1);
    let top = CY - total / 2;
    for (const l of lines) {
      const base = top + l.asc;
      s += `<text x="${f2(cx)}" y="${f2(base)}" text-anchor="middle" font-family="${l.font.replace(/"/g, "'")}" font-size="${f2(l.size)}" font-style="${l.style}" font-weight="${l.w}" fill="${l.fill}"${l.ls ? ` letter-spacing="${l.ls}"` : ''} data-max="${l.max}" direction="${HAS_AR(l.t) ? 'rtl' : 'ltr'}">${esc(l.t)}</text>`;
      top += l.h + gap;
    }
    s += `</g>`;
    s += `<rect x="0" y="0" width="${f2(FX0)}" height="${HH}" fill="#FFFFFF"/>`;   // glue flap: unprinted
    return s;
  }

  function bandSVG(id, line1, line2, mode) {
    // mode 'front' = front panel only (trim), 'full' = whole band with bleed
    const vb = mode === 'front' ? `${FX0} ${BLEED} 210 ${H}` : (mode && mode.startsWith('vb:')) ? mode.slice(3) : `0 0 ${W} ${HH}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc((BY_ID[id] || DESIGNS[0]).name)} band">${bandInner(id, line1, line2)}</svg>`;
  }

  // print sheet: 10 mm slug around the bleed, crop marks + fold marks + job label
  const SLUG = 10, SW = W + 2 * SLUG, SH = HH + 2 * SLUG;
  function sheetSVG(id, line1, line2, label, fontStyle) {
    const t0x = SLUG + BLEED, t0y = SLUG + BLEED, t1x = t0x + L, t1y = t0y + H;
    let m = '';
    const ln = (a, b, c, d2) => `<line x1="${f2(a)}" y1="${f2(b)}" x2="${f2(c)}" y2="${f2(d2)}" stroke="#000" stroke-width=".2"/>`;
    for (const [x, y, dx, dy] of [[t0x, t0y, -1, -1], [t1x, t0y, 1, -1], [t0x, t1y, -1, 1], [t1x, t1y, 1, 1]]) {
      m += ln(x, y + dy * 4, x, y + dy * 9) + ln(x + dx * 4, y, x + dx * 9, y);
    }
    for (const f of FOLDS) { const x = t0x + f; m += `<line x1="${x}" y1="${t0y - 9}" x2="${x}" y2="${t0y - 4}" stroke="#000" stroke-width=".2" stroke-dasharray="1 .6"/><line x1="${x}" y1="${t1y + 4}" x2="${x}" y2="${t1y + 9}" stroke="#000" stroke-width=".2" stroke-dasharray="1 .6"/>`; }
    m += `<text x="${t0x + 30}" y="${SLUG - 4.5}" font-family="'OS', sans-serif" font-size="2.6" fill="#000">${esc(label)}</text>`;
    m += `<text x="${t1x - 2}" y="${SLUG - 4.5}" text-anchor="end" font-family="'OS', sans-serif" font-size="2.2" fill="#000">528 × 40 mm trim · 3 mm bleed · 300 gsm · matte lamination · dashed marks = fold/score · white flap = glue</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SW}mm" height="${SH}mm" viewBox="0 0 ${SW} ${SH}">${fontStyle ? `<style>${fontStyle}</style>` : ''}<rect width="${SW}" height="${SH}" fill="#fff"/><svg x="${SLUG}" y="${SLUG}" width="${W}" height="${HH}" viewBox="0 0 ${W} ${HH}">${bandInner(id, line1, line2)}</svg>${m}</svg>`;
  }


  /* ---------- message card (A6 landscape 148 x 105 mm, lies on top of the bottles, reads with the lid) ---------- */
  const CW = 148, CH = 105, CWB = CW + 2 * BLEED, CHB = CH + 2 * BLEED, CSW = CWB + 2 * SLUG, CSH = CHB + 2 * SLUG;
  let mctx;
  function measure(text, font) { mctx = mctx || document.createElement('canvas').getContext('2d'); mctx.font = font; return mctx.measureText(text).width; }
  function wrap(text, size, maxW) {
    const font = `italic 300 ${size * 10}px NSD, ARQ, serif`, out = [];
    String(text || '').split(/\r?\n/).forEach(par => {
      let line = '';
      par.split(/\s+/).filter(Boolean).forEach(w => {
        const t = line ? line + ' ' + w : w;
        if (!line || measure(t, font) / 10 <= maxW) line = t; else { out.push(line); line = w; }
      });
      out.push(line);
    });
    while (out.length && !out[out.length - 1]) out.pop();
    return out;
  }
  const CARD_THEMES = {
    white: { bg: '#FFFFFF', ink: '#141416', soft: '#3A3A40', frame: '#B4B4BA' },
    black: { bg: '#121215', ink: '#F2F2F4', soft: '#D3D5DA', frame: '#6E6E76' }
  };
  const isArabic = t => /[؀-ۿ]/.test(t || '');
  function greeting(name) {
    const n = String(name || '').trim().replace(/^for\s+/i, '');
    if (!n) return '';
    return isArabic(n) ? n + '،' : 'Dear ' + n + ',';
  }
  function signLines(sign) {
    const t = String(sign || '').trim(); if (!t) return [];
    if (t.includes('\n')) return t.split(/\r?\n/).map(x => x.trim()).filter(Boolean).slice(0, 2);
    const i = t.indexOf(','); return i > 0 && i < t.length - 1 ? [t.slice(0, i + 1), t.slice(i + 1).trim()] : [t];
  }
  function cardInner(name, message, theme, sign) {
    const T = CARD_THEMES[theme] || CARD_THEMES.white, cx = CWB / 2, B = BLEED;
    const it = (y, txt, size, fill, max) => `<text x="${cx}" y="${f2(y)}"${max ? ` data-max="${max}"` : ''} text-anchor="middle" font-family="'NSD', 'ARQ', serif" font-style="italic" font-weight="300" font-size="${f2(size)}" fill="${fill}" dir="auto">${esc(txt)}</text>`;
    let s = `<rect width="${CWB}" height="${CHB}" fill="${T.bg}"/>`;
    s += `<rect x="${B + 5}" y="${B + 5}" width="${CW - 10}" height="${CH - 10}" fill="none" stroke="${T.frame}" stroke-width=".3"/>`;
    // waves, bottom right
    const wx = B + CW - 5, wy = B + CH - 5;
    for (let k = 0; k < 3; k++) { const o = k * 3.2; s += `<path d="M${f2(wx - 34 - o)} ${f2(wy)} C ${f2(wx - 20 - o)} ${f2(wy - 4 - o)}, ${f2(wx - 15)} ${f2(wy - 13 - o)}, ${f2(wx)} ${f2(wy - 22 - o)}" fill="none" stroke="${T.frame}" stroke-width=".22"/>`; }
    s += `<text x="${cx}" y="${B + 17}" text-anchor="middle" font-family="'NSD', serif" font-weight="300" font-size="7" letter-spacing="1.5" fill="${T.ink}">NOMĒ</text>`;
    s += `<line x1="${cx - 4.5}" y1="${B + 23}" x2="${cx + 4.5}" y2="${B + 23}" stroke="${T.ink}" stroke-width=".3"/>`;
    const g = greeting(name), sl = signLines(sign);
    const areaTop = B + 28, areaBot = B + CH - 10;
    let size = 5, lines, total;
    const measureBlock = () => { lines = wrap(message, size, 112); const lh = size * 1.4; total = (g ? 5.2 + 6 : 0) + lines.length * lh + (sl.length ? 5 + 7 + sl.length * 6.2 : 0); };
    measureBlock();
    while (size > 3.2 && total > areaBot - areaTop) { size -= .2; measureBlock(); }
    const lh = size * 1.4;
    let y = areaTop + Math.max(0, (areaBot - areaTop - total) / 2);
    if (g) { s += it(y + 5.2 * .8, g, 5.2, T.ink, 120); y += 5.2 + 6; }
    lines.forEach((l, i) => { s += it(y + size * .8 + i * lh, l, size, T.ink); });
    y += lines.length * lh;
    if (sl.length) {
      y += 4; s += `<line x1="${cx - 4.5}" y1="${f2(y)}" x2="${cx + 4.5}" y2="${f2(y)}" stroke="${T.ink}" stroke-width=".3"/>`; y += 7;
      sl.forEach((l, i) => { s += it(y + 4.8 * .8 + i * 6.2, l, 4.8, T.ink, 120); });
    }
    return s;
  }
  function cardSVG(name, message, mode, theme, sign) {
    const vb = mode === 'full' ? `0 0 ${CWB} ${CHB}` : `${BLEED} ${BLEED} ${CW} ${CH}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${cardInner(name, message, theme, sign)}</svg>`;
  }
  function cardSheetSVG(name, message, label, fontStyle, theme, sign) {
    const t0x = SLUG + BLEED, t0y = SLUG + BLEED, t1x = t0x + CW, t1y = t0y + CH;
    let m = '';
    const ln = (a, b, c, d2) => `<line x1="${f2(a)}" y1="${f2(b)}" x2="${f2(c)}" y2="${f2(d2)}" stroke="#000" stroke-width=".2"/>`;
    for (const [x, y, dx, dy] of [[t0x, t0y, -1, -1], [t1x, t0y, 1, -1], [t0x, t1y, -1, 1], [t1x, t1y, 1, 1]]) m += ln(x, y + dy * 4, x, y + dy * 9) + ln(x + dx * 4, y, x + dx * 9, y);
    m += `<text x="${t0x}" y="${SLUG - 4.5}" font-family="'OS', sans-serif" font-size="2.2" fill="#000">${esc(label)}</text>`;
    m += `<text x="${t1x}" y="${CSH - 3}" text-anchor="end" font-family="'OS', sans-serif" font-size="1.9" fill="#000">Message card · 148 × 105 mm (A6 landscape) trim · 3 mm bleed · 350 gsm white · matte</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${CSW}mm" height="${CSH}mm" viewBox="0 0 ${CSW} ${CSH}">${fontStyle ? `<style>${fontStyle}</style>` : ''}<rect width="${CSW}" height="${CSH}" fill="#fff"/><svg x="${SLUG}" y="${SLUG}" width="${CWB}" height="${CHB}" viewBox="0 0 ${CWB} ${CHB}">${cardInner(name, message, theme, sign)}</svg>${m}</svg>`;
  }

  // shrink any line that is wider than its limit (needs the svg in the DOM)
  function fit(root) {
    (root || document).querySelectorAll('text[data-max]').forEach(t => {
      t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust');
      const max = +t.dataset.max; let w = 0; try { w = t.getComputedTextLength(); } catch (e) {}
      if (w > max) { t.setAttribute('textLength', max); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
  }

  // ---------- PDF export (raster 500 dpi, exact page size) ----------
  let fontData = null;
  async function embedFonts(base) {
    if (fontData) return fontData;
    const map = {};
    await Promise.all(FONTS.map(async f => {
      const b = await (await fetch(base + f.file)).blob();
      map[f.file] = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });
    }));
    fontData = fontCSS('', map); return fontData;
  }
  async function sheetToCanvas(svgEl, dpi, w, h) {
    w = w || SW; h = h || SH;
    const pxPerMm = dpi / 25.4, cw = Math.round(w * pxPerMm), chh = Math.round(h * pxPerMm);
    const xml = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml); });
    await new Promise(r => setTimeout(r, 150));
    const c = document.createElement('canvas'); c.width = cw; c.height = chh;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cw, chh); g.drawImage(img, 0, 0, cw, chh);
    return c;
  }
  async function exportPDF(orders, opts) {
    opts = opts || {};
    const base = opts.fontBase || 'fonts/', dpi = opts.dpi || 500;
    const css = await embedFonts(base);
    const holder = document.createElement('div'); holder.style.cssText = 'position:fixed;left:-99999px;top:0;width:2000px';
    document.body.appendChild(holder);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [SW, SH], compress: true });
    let page = 0;
    for (const o of orders) {
      for (let q = 0; q < (o.qty || 1); q++) {
        holder.innerHTML = sheetSVG(o.design, o.line1, o.line2, o.label || '', css);
        const el = holder.firstElementChild; fit(el);
        const canvas = await sheetToCanvas(el, dpi);
        if (page++) pdf.addPage([SW, SH], 'landscape');
        pdf.addImage(canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, SW, SH, undefined, 'FAST');
        if (opts.onProgress) opts.onProgress(page);
        if (o.card) {
          holder.innerHTML = cardSheetSVG(o.cardName || '', o.card, (o.label || '') + ' · message card', css, o.cardTheme || opts.cardTheme, o.cardSign || '');
          const ce = holder.firstElementChild; fit(ce);
          const cc = await sheetToCanvas(ce, Math.min(dpi, 400), CSW, CSH);
          pdf.addPage([CSW, CSH], 'landscape');
          pdf.addImage(cc.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, CSW, CSH, undefined, 'FAST'); page++;
        }
      }
    }
    holder.remove();
    return pdf;
  }

  window.NOME_BANDS = { DESIGNS, BY_ID, bandSVG, sheetSVG, cardSVG, fit, fontCSS, exportPDF, SHEET_MM: [SW, SH], CARD_MM: [CW, CH], greeting };
})();
