import { spawn } from 'node:child_process'
import http from 'node:http'
import path from 'node:path'
import { build } from 'esbuild'

const distElectron = path.resolve(import.meta.dirname, '../dist-electron')

async function waitForServer(url: string, timeout = 30000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) resolve()
          else reject()
        })
        req.on('error', reject)
        req.end()
      })
      return
    } catch {
      await new Promise((r) => setTimeout(r, 400))
    }
  }
  throw new Error(`Timeout waiting for dev server at ${url}`)
}

async function start() {
  console.log('Building Electron main & preload for dev...')
  await build({
    entryPoints: [path.resolve(import.meta.dirname, '../electron/main.ts')],
    outfile: path.join(distElectron, 'main.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    external: ['electron']
  })

  await build({
    entryPoints: [path.resolve(import.meta.dirname, '../electron/preload.ts')],
    outfile: path.join(distElectron, 'preload.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    external: ['electron']
  })

  console.log('Waiting for Vite server on http://localhost:5190...')
  await waitForServer('http://localhost:5190')

  console.log('Launching Electron desktop application...')
  const electronBin = (await import('electron')).default as unknown as string
  const child = spawn(electronBin, ['.'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development', VITE_DEV_SERVER_URL: 'http://localhost:5190' }
  })

  child.on('close', (code) => {
    process.exit(code ?? 0)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
