import fs from 'node:fs'
import path from 'node:path'
import { BotEngine } from '../src/bot/engine.ts'
import { RAYON } from '../src/bot/repere.ts'
import { SHAPE_BY_ID } from '../src/bot/skins.ts'
import { EXPRESSION_BY_ID } from '../src/bot/expressions.ts'

const cloudShape = SHAPE_BY_ID.get('nuage').radii
const neutralExp = EXPRESSION_BY_ID.get('neutre')
const engine = new BotEngine(RAYON, 'idle', cloudShape, neutralExp)

const frame = engine.sample(1)
console.log('Body path:', frame.bodyPath)
console.log('Eyes:', frame.eyes)

// Generate favicon.svg with cloud in #ffffff and dark eyes (holes/inverted)
const svg = `<!-- bobby cloud avatar favicon -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230">
  <defs>
    <mask id="eyes">
      <path d="${frame.bodyPath}" fill="#ffffff" />
      <path
        d="M-9.3 -11.3A9.3 9.3 0 0 1 0 -20.6L0 -20.6A9.3 9.3 0 0 1 9.3 -11.3L9.3 11.3A9.3 9.3 0 0 1 0 20.6L0 20.6A9.3 9.3 0 0 1 -9.3 11.3Z"
        transform="${frame.eyes[0].matrix}"
        fill="#000000"
      />
      <path
        d="M-9.3 -11.3A9.3 9.3 0 0 1 0 -20.6L0 -20.6A9.3 9.3 0 0 1 9.3 -11.3L9.3 11.3A9.3 9.3 0 0 1 0 20.6L0 20.6A9.3 9.3 0 0 1 -9.3 11.3Z"
        transform="${frame.eyes[1].matrix}"
        fill="#000000"
      />
    </mask>
  </defs>
  <!-- Background circle/shape for visibility on light/dark backgrounds -->
  <rect x="-115" y="-115" width="230" height="230" rx="46" fill="#0a0a0c" />
  <path d="${frame.bodyPath}" fill="#ffffff" mask="url(#eyes)" />
</svg>
`

const publicDir = path.resolve(import.meta.dirname, '../public')
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svg, 'utf8')
console.log('Wrote favicon.svg')
