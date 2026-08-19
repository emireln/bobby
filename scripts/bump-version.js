import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const pkgPath = path.join(root, 'package.json')
const lockPath = path.join(root, 'package-lock.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const [major, minor, patch] = pkg.version.split('.').map(Number)
const nextVersion = `${major}.${minor}.${patch + 1}`

pkg.version = nextVersion
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')

if (fs.existsSync(lockPath)) {
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'))
    lock.version = nextVersion
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = nextVersion
    }
    fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8')
  } catch {
    // Ignore lockfile parse issues
  }
}

try {
  execSync('git add package.json package-lock.json', { cwd: root, stdio: 'ignore' })
} catch {
  // Ignore if not in git context yet
}

console.log(`[bump-version] bumped version to ${nextVersion}`)
