import { build } from 'esbuild'
import path from 'node:path'
import fs from 'node:fs'

const distElectron = path.resolve(import.meta.dirname, '../dist-electron')
fs.mkdirSync(distElectron, { recursive: true })

async function buildElectron() {
  console.log('Compiling Electron main and preload processes...')

  await build({
    entryPoints: [path.resolve(import.meta.dirname, '../electron/main.ts')],
    outfile: path.join(distElectron, 'main.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    external: ['electron', 'electron-updater']
  })

  await build({
    entryPoints: [path.resolve(import.meta.dirname, '../electron/preload.ts')],
    outfile: path.join(distElectron, 'preload.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    external: ['electron']
  })

  console.log('Electron compilation complete in dist-electron/')
}

buildElectron().catch((err) => {
  console.error(err)
  process.exit(1)
})
