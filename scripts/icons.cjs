// Renders PNG app icons from public/icon.svg. Run: node scripts/icons.cjs
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs'), path = require('path');
const svg = fs.readFileSync(path.join(__dirname, '../public/icon.svg'), 'utf8');
const maskable = svg.replace('rx="112"', 'rx="0"').replace('M290 64 136 288h104l-26 160 162-232H270z', 'M282 116 160 292h84l-20 124 128-182h-90z');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [name, size, s] of [['icon-192.png', 192, svg], ['icon-512.png', 512, svg], ['apple-touch-icon.png', 180, maskable], ['icon-512-maskable.png', 512, maskable]]) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<style>html,body{margin:0;background:transparent}</style>${s.replace('<svg ', `<svg width="${size}" height="${size}" `)}`);
    await p.screenshot({ path: path.join(__dirname, '../public', name), omitBackground: true });
  }
  await b.close();
})();
