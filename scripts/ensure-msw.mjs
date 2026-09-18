import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

if (!existsSync('public/mockServiceWorker.js')) {
  execSync('npx msw init public --save', {
    stdio: 'inherit',
    shell: true,
  })
}
