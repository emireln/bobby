import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { BotEngine } from '../src/bot/engine.ts'
import { RAYON } from '../src/bot/repere.ts'
import { SHAPE_BY_ID } from '../src/bot/skins.ts'
import { EXPRESSION_BY_ID } from '../src/bot/expressions.ts'

const cloudShape = SHAPE_BY_ID.get('nuage')!.radii
const neutralExp = EXPRESSION_BY_ID.get('neutre')!
const engine = new BotEngine(RAYON, 'idle', cloudShape, neutralExp)
const frame = engine.sample(1)

const publicDir = path.resolve(import.meta.dirname, '../public')
const tmpDir = path.resolve(import.meta.dirname, '../scripts/tmp_render')
fs.mkdirSync(tmpDir, { recursive: true })

// 1. Clean minimalist Favicon SVG with #ffffff cloud
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-118 -118 236 236">
  <defs>
    <mask id="eyes">
      <rect x="-118" y="-118" width="236" height="236" fill="#fff" />
      <path
        d="${frame.eyes[0].d}"
        transform="${frame.eyes[0].matrix}"
        fill="#000"
      />
      <path
        d="${frame.eyes[1].d}"
        transform="${frame.eyes[1].matrix}"
        fill="#000"
      />
    </mask>
  </defs>
  <rect x="-118" y="-118" width="236" height="236" rx="52" fill="#09090b" />
  <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
</svg>
`

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8')
console.log('Saved public/favicon.svg')

// 2. HTML templates for rendering pixel-perfect raster images with headless browser

// Apple Touch Icon HTML (180x180)
const appleIconHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 180px;
    height: 180px;
    background: #09090b;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  svg {
    width: 140px;
    height: 140px;
  }
</style>
</head>
<body>
  <svg viewBox="-110 -110 220 220">
    <defs>
      <mask id="eyes">
        <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
        <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
        <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
      </mask>
    </defs>
    <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
  </svg>
</body>
</html>`

// Favicon 48x48 HTML
const fav48Html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 48px;
    height: 48px;
    background: #09090b;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  svg {
    width: 38px;
    height: 38px;
  }
</style>
</head>
<body>
  <svg viewBox="-110 -110 220 220">
    <defs>
      <mask id="eyes">
        <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
        <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
        <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
      </mask>
    </defs>
    <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
  </svg>
</body>
</html>`

// Minimalist Modern Banner HTML (1200x630)
const bannerHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background-color: #09090b;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 100px;
    overflow: hidden;
    position: relative;
  }
  .glow {
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 560px;
    z-index: 1;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 6px 14px;
    border-radius: 9999px;
    background: #18181b;
    border: 1px solid #27272a;
    font-size: 13px;
    font-weight: 500;
    color: #a1a1aa;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  h1 {
    font-size: 80px;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.95;
    color: #f4f4f5;
  }
  p.subtitle {
    font-size: 24px;
    line-height: 1.45;
    font-weight: 400;
    color: #a1a1aa;
  }
  .repo {
    margin-top: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #71717a;
    letter-spacing: 0.01em;
  }
  .avatar-wrap {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-wrap svg {
    width: 320px;
    height: 320px;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6));
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="content">
    <div class="badge">SVG Avatar</div>
    <h1>bobby</h1>
    <p class="subtitle">Animated avatar with 16 customizable shapes, 24 expressions & timeline studio.</p>
    <div class="repo">github.com/emireln/bobby</div>
  </div>
  <div class="avatar-wrap">
    <svg viewBox="-110 -110 220 220">
      <defs>
        <mask id="eyes">
          <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
          <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
          <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
        </mask>
      </defs>
      <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
    </svg>
  </div>
</body>
</html>`

const applePath = path.join(tmpDir, 'apple.html')
const fav48Path = path.join(tmpDir, 'fav48.html')
const bannerPath = path.join(tmpDir, 'banner.html')

fs.writeFileSync(applePath, appleIconHtml, 'utf8')
fs.writeFileSync(fav48Path, fav48Html, 'utf8')
fs.writeFileSync(bannerPath, bannerHtml, 'utf8')

const edgeBin = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

function capture(htmlFile: string, outFile: string, width: number, height: number) {
  const fileUrl = `file:///${htmlFile.replace(/\\/g, '/')}`
  const out = outFile.replace(/\\/g, '/')
  const cmd = `"${edgeBin}" --headless=new --disable-gpu --force-device-scale-factor=1 --hide-scrollbars --window-size=${width},${height} --screenshot="${out}" "${fileUrl}"`
  console.log(`Rendering ${path.basename(outFile)} (${width}x${height})...`)
  execSync(cmd, { stdio: 'inherit' })
}

capture(applePath, path.join(publicDir, 'apple-touch-icon.png'), 180, 180)
capture(fav48Path, path.join(tmpDir, 'fav48.png'), 48, 48)
capture(bannerPath, path.join(publicDir, 'banner.png'), 1200, 630)

console.log('Raster rendering complete.')
