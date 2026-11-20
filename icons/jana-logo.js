// ICC NEXIS mark: three linked rings (I · C · N) with circuit nodes.
// node gen3.js <outDir>  → logo.svg (colour), logo-putih.svg (for dark backgrounds), logo-ikon.svg (app icon tile)
const fs = require('fs'), path = require('path');
const out = process.argv[2] || __dirname; // jalankan dari folder icons: node jana-logo.js
const rad = d => d * Math.PI / 180;
const P = (c, r, d) => [c[0] + r * Math.cos(rad(d)), c[1] + r * Math.sin(rad(d))];
const f = n => +n.toFixed(2);
const pt = p => `${f(p[0])} ${f(p[1])}`;
function arc(c, r, a0, a1, dir) {
  const span = ((dir > 0 ? a1 - a0 : a0 - a1) % 360 + 360) % 360;
  return `M${pt(P(c, r, a0))}A${r} ${r} 0 ${span > 180 ? 1 : 0} ${dir > 0 ? 1 : 0} ${pt(P(c, r, a1))}`;
}

const R = 66.5, W = 22, GAP = 5;
const c1 = [287, 270], c2 = [370, 270], c3 = [479, 270];
const ring1 = arc(c1, R, -45, 62, -1);
const ring2Bottom = arc(c2, R, 128, 0, -1);
const ring2Top = arc(c2, R, -32, 142, -1);
const a = 426, b = 514, s = 22, yt = 232, yb = 310;
const N = `M${a} ${yb}V${yt}H${a + s}L${b - s} ${yb - 46}V${yt}H${b}V${yb}H${b - s}L${a + s} ${yt + 46}V${yb}Z`;
const topLink = `M${pt(P(c1, R, -45))}L368 255`;
const botLink = `M355 293L${pt(P(c2, R, 100))}`;
const greenLink = `M${pt(P(c2, R, -32))}L396 287`;

// Shapes only (no <svg> wrapper), translated so the mark sits at 0,0 → 358×164
function mark(navy, green, id) {
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="200" y="180" width="370" height="180">
<rect x="200" y="180" width="370" height="180" fill="#fff"/>
<path d="${ring2Bottom}" fill="none" stroke="#000" stroke-width="${W + 2 * GAP}"/></mask></defs>
<g transform="translate(-204 -188)">
<g fill="none" stroke-width="${W}">
<circle cx="${c3[0]}" cy="${c3[1]}" r="${R}" stroke="${green}" mask="url(#${id})"/>
<path d="${ring1}" stroke="${navy}"/>
<path d="${ring2Bottom}" stroke="${navy}"/>
<path d="${ring2Top}" stroke="${green}" stroke-linecap="round"/>
<path d="${topLink}" stroke="${navy}" stroke-linecap="round"/>
<path d="${botLink}" stroke="${navy}"/>
<path d="${greenLink}" stroke="${green}" stroke-linecap="round"/>
<path d="M269 232V304" stroke="${navy}" stroke-width="20"/>
</g>
<path d="${N}" fill="${navy}"/>
<circle cx="368" cy="255" r="15" fill="${navy}"/>
<circle cx="355" cy="293" r="14" fill="${navy}"/>
<circle cx="396" cy="287" r="14.5" fill="${green}"/>
</g>`;
}
const NAVY = '#14355f', GREEN = '#169b83';
const head = (vb) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="ICC NEXIS">`;

fs.writeFileSync(path.join(out, 'logo.svg'), head('0 0 358 164') + mark(NAVY, GREEN, 'k1') + '</svg>\n');
fs.writeFileSync(path.join(out, 'logo-putih.svg'), head('0 0 358 164') + mark('#ffffff', '#2fc4a5', 'k2') + '</svg>\n');
// App icon: white rounded tile, mark centred inside the maskable safe zone (80%)
const S = 512, scale = (S * 0.72) / 358;
const tile = (rx) => head(`0 0 ${S} ${S}`) + `<rect width="${S}" height="${S}" rx="${rx}" fill="#ffffff"/>` +
  `<g transform="translate(${f((S - 358 * scale) / 2)} ${f((S - 164 * scale) / 2)}) scale(${f(scale)})">` + mark(NAVY, GREEN, 'k3') + '</g></svg>\n';
fs.writeFileSync(path.join(out, 'logo-ikon.svg'), tile(112));
fs.writeFileSync(path.join(out, 'logo-ikon-maskable.svg'), tile(0));
console.log('written to', out);
