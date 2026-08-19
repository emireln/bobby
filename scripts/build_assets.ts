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

// Ultra-Minimalist Clean Modern Banner HTML (1200x630)
const bannerHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background-color: #09090b;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }
  .avatar {
    width: 190px;
    height: 190px;
    margin-bottom: 32px;
  }
  .avatar svg {
    width: 100%;
    height: 100%;
  }
  h1 {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    color: #f4f4f5;
    margin-bottom: 14px;
  }
  p.subtitle {
    font-size: 20px;
    font-weight: 400;
    color: #71717a;
    letter-spacing: -0.01em;
  }
</style>
</head>
<body>
  <div class="avatar">
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
  <h1>bobby</h1>
  <p class="subtitle">Pure SVG animated avatar & timeline studio</p>
</body>
</html>`

const applePath = path.join(tmpDir, 'apple.html')
const bannerPath = path.join(tmpDir, 'banner.html')

fs.writeFileSync(applePath, appleIconHtml, 'utf8')
fs.writeFileSync(bannerPath, bannerHtml, 'utf8')

const edgeBin = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

function capture(htmlFile: string, outFile: string, width: number, height: number) {
  const fileUrl = `file:///${htmlFile.replace(/\\/g, '/')}`
  const out = outFile.replace(/\\/g, '/')
  const cmd = `"${edgeBin}" --headless=new --disable-gpu --virtual-time-budget=2000 --force-device-scale-factor=1 --hide-scrollbars --window-size=${width},${height} --screenshot="${out}" "${fileUrl}"`
  console.log(`Rendering ${path.basename(outFile)} (${width}x${height})...`)
  execSync(cmd, { stdio: 'inherit' })
}

capture(applePath, path.join(publicDir, 'apple-touch-icon.png'), 180, 180)
capture(bannerPath, path.join(publicDir, 'banner.png'), 1200, 630)

console.log('Raster rendering complete.')
