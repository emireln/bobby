import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { BotEngine } from '../src/bot/engine.ts'
import { RAYON } from '../src/bot/repere.ts'
import { SHAPE_BY_ID } from '../src/bot/skins.ts'
import { EXPRESSION_BY_ID } from '../src/bot/expressions.ts'

const cloudShape = SHAPE_BY_ID.get('nuage')!.radii
const neutralExp = EXPRESSION_BY_ID.get('neutre')!
const engine = new BotEngine(RAYON, 'idle', cloudShape, neutralExp)
const frame = engine.sample(1)

const publicDir = path.resolve(import.meta.dirname, '../public')
const buildDir = path.resolve(import.meta.dirname, '../build')
fs.mkdirSync(publicDir, { recursive: true })
fs.mkdirSync(buildDir, { recursive: true })

// 1. Transparent Cloud SVG (Pure vector silhouette with eyes cut out)
const cloudTransparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="512" height="512">
  <defs>
    <mask id="eyes">
      <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
      <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
      <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
    </mask>
  </defs>
  <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
</svg>`

// 2. Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-118 -118 236 236">
  <defs>
    <mask id="eyes">
      <rect x="-118" y="-118" width="236" height="236" fill="#fff" />
      <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
      <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
    </mask>
  </defs>
  <rect x="-118" y="-118" width="236" height="236" rx="52" fill="#09090b" />
  <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
</svg>`
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8')

// 3. Ultra-Minimalist Banner SVG (1200x630)
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#09090b" />
  <g transform="translate(600, 240) scale(0.9)">
    <defs>
      <mask id="banner-eyes">
        <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
        <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
        <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
      </mask>
    </defs>
    <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#banner-eyes)" />
  </g>
  <text x="600" y="440" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="700" fill="#f4f4f5" letter-spacing="-2">bobby</text>
  <text x="600" y="485" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#71717a" letter-spacing="-0.5">Pure SVG animated avatar &amp; timeline studio</text>
</svg>`

// 4. NSIS Sidebar SVG (164x314) - Matte dark background with centered white cloud, no text
const nsisSidebarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 314" width="164" height="314">
  <rect width="164" height="314" fill="#09090b" />
  <g transform="translate(82, 157) scale(0.55)">
    <defs>
      <mask id="nsis-eyes">
        <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
        <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
        <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
      </mask>
    </defs>
    <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#nsis-eyes)" />
  </g>
</svg>`

// 5. NSIS Header SVG (150x57)
const nsisHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 57" width="150" height="57">
  <rect width="150" height="57" fill="#09090b" />
  <g transform="translate(115, 28.5) scale(0.24)">
    <defs>
      <mask id="header-eyes">
        <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
        <path d="${frame.eyes[0].d}" transform="${frame.eyes[0].matrix}" fill="#000" />
        <path d="${frame.eyes[1].d}" transform="${frame.eyes[1].matrix}" fill="#000" />
      </mask>
    </defs>
    <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#header-eyes)" />
  </g>
</svg>`

// Helper to encode raw 24-bit uncompressed Windows BMP
function rawRgbTo24BitBmp(rgbBuffer: Buffer, width: number, height: number): Buffer {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4
  const pixelArraySize = rowSize * height
  const fileSize = 54 + pixelArraySize

  const bmp = Buffer.alloc(fileSize)
  // File Header (14 bytes)
  bmp.write('BM', 0)
  bmp.writeUInt32LE(fileSize, 2)
  bmp.writeUInt32LE(0, 6)
  bmp.writeUInt32LE(54, 10)

  // DIB Header (40 bytes)
  bmp.writeUInt32LE(40, 14)
  bmp.writeInt32LE(width, 18)
  bmp.writeInt32LE(height, 22)
  bmp.writeUInt16LE(1, 26) // 1 plane
  bmp.writeUInt16LE(24, 28) // 24 bits
  bmp.writeUInt32LE(0, 30) // BI_RGB
  bmp.writeUInt32LE(pixelArraySize, 34)
  bmp.writeInt32LE(2835, 38)
  bmp.writeInt32LE(2835, 42)
  bmp.writeUInt32LE(0, 46)
  bmp.writeUInt32LE(0, 50)

  // Write rows bottom to top in BGR format
  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y
    const dstRowOffset = 54 + y * rowSize
    for (let x = 0; x < width; x++) {
      const srcOffset = (srcY * width + x) * 3
      const dstOffset = dstRowOffset + x * 3
      const r = rgbBuffer[srcOffset]!
      const g = rgbBuffer[srcOffset + 1]!
      const b = rgbBuffer[srcOffset + 2]!
      bmp[dstOffset] = b
      bmp[dstOffset + 1] = g
      bmp[dstOffset + 2] = r
    }
  }

  return bmp
}

// Helper to assemble standard multi-size Windows ICO with PNG payloads
function createIco(pngBuffers: { size: number; buffer: Buffer }[]): Buffer {
  const count = pngBuffers.length
  const headerSize = 6
  const dirEntrySize = 16
  const dirSize = headerSize + count * dirEntrySize

  let totalSize = dirSize
  for (const item of pngBuffers) {
    totalSize += item.buffer.length
  }

  const out = Buffer.alloc(totalSize)
  out.writeUInt16LE(0, 0)
  out.writeUInt16LE(1, 2)
  out.writeUInt16LE(count, 4)

  let currentOffset = dirSize
  for (let i = 0; i < count; i++) {
    const item = pngBuffers[i]!
    const entryOffset = headerSize + i * dirEntrySize
    const w = item.size >= 256 ? 0 : item.size
    const h = item.size >= 256 ? 0 : item.size

    out.writeUInt8(w, entryOffset)
    out.writeUInt8(h, entryOffset + 1)
    out.writeUInt8(0, entryOffset + 2)
    out.writeUInt8(0, entryOffset + 3)
    out.writeUInt16LE(1, entryOffset + 4)
    out.writeUInt16LE(32, entryOffset + 6)
    out.writeUInt32LE(item.buffer.length, entryOffset + 8)
    out.writeUInt32LE(currentOffset, entryOffset + 12)

    item.buffer.copy(out, currentOffset)
    currentOffset += item.buffer.length
  }

  return out
}

async function main() {
  console.log('Building visual assets with sharp...')

  // 1. Apple touch icon (180x180)
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  // 2. Banner PNG (1200x630)
  await sharp(Buffer.from(bannerSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'banner.png'))

  // 3. Desktop App Logo (512x512 transparent PNG)
  const icon512Png = await sharp(Buffer.from(cloudTransparentSvg))
    .resize(512, 512)
    .png()
    .toBuffer()
  fs.writeFileSync(path.join(buildDir, 'icon.png'), icon512Png)

  // 4. Multi-resolution ICOs (256, 48, 32, 16) with transparent background
  const icon256Png = await sharp(Buffer.from(cloudTransparentSvg)).resize(256, 256).png().toBuffer()
  const icon48Png = await sharp(Buffer.from(cloudTransparentSvg)).resize(48, 48).png().toBuffer()
  const icon32Png = await sharp(Buffer.from(cloudTransparentSvg)).resize(32, 32).png().toBuffer()
  const icon16Png = await sharp(Buffer.from(cloudTransparentSvg)).resize(16, 16).png().toBuffer()

  const fullIco = createIco([
    { size: 256, buffer: icon256Png },
    { size: 48, buffer: icon48Png },
    { size: 32, buffer: icon32Png },
    { size: 16, buffer: icon16Png }
  ])

  fs.writeFileSync(path.join(buildDir, 'icon.ico'), fullIco)
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fullIco)

  // 5. NSIS Installer Bitmaps (24-bit BMP)
  const sidebarRgb = await sharp(Buffer.from(nsisSidebarSvg))
    .resize(164, 314)
    .removeAlpha()
    .raw()
    .toBuffer()
  const sidebarBmp = rawRgbTo24BitBmp(sidebarRgb, 164, 314)
  fs.writeFileSync(path.join(buildDir, 'installerSidebar.bmp'), sidebarBmp)

  const headerRgb = await sharp(Buffer.from(nsisHeaderSvg))
    .resize(150, 57)
    .removeAlpha()
    .raw()
    .toBuffer()
  const headerBmp = rawRgbTo24BitBmp(headerRgb, 150, 57)
  fs.writeFileSync(path.join(buildDir, 'installerHeader.bmp'), headerBmp)

  console.log('Successfully generated:')
  console.log(' - public/favicon.svg')
  console.log(' - public/favicon.ico (transparent tray/web icon)')
  console.log(' - public/apple-touch-icon.png')
  console.log(' - public/banner.png')
  console.log(' - build/icon.png (512x512 transparent app icon)')
  console.log(' - build/icon.ico (transparent multi-size app icon)')
  console.log(' - build/installerSidebar.bmp (164x314 NSIS banner with logo, no text)')
  console.log(' - build/installerHeader.bmp (150x57 NSIS header)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
