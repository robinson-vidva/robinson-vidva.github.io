// Regenerate Robinson_Vidva_CV.pdf from cv_source.html
//
//   npm i playwright     # once (installs headless Chromium)
//   node build.js        # writes Robinson_Vidva_CV.pdf into this folder
//
// Then copy the result onto the published site (on the `main` branch):
//   cp Robinson_Vidva_CV.pdf ../documents/Robinson_Vidva_CV.pdf
//
// Playwright preserves <a href> tags as clickable link annotations, and
// preferCSSPageSize honours the @page size/margins set in cv_source.html.
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const src = 'file://' + path.join(__dirname, 'cv_source.html');
  const out = path.join(__dirname, 'Robinson_Vidva_CV.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('Wrote ' + out);
})();
