import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const execFileAsync = promisify(execFile)

const baseUrl = (process.env.LIGHTHOUSE_BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const outputDir = resolve('lighthouse-reports')
const runs = 3

mkdirSync(outputDir, { recursive: true })

const targets = [
  { name: 'home', path: '/' },
  { name: 'detail', path: '/nft/nft-1' },
]

const profiles = [
  { name: 'mobile', flags: [] },
  { name: 'desktop', flags: ['--preset=desktop'] },
]

const scores = ['performance', 'accessibility', 'best-practices', 'seo']
const metrics = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

async function runLighthouse(url, profile, outBase) {
  const args = [
    url,
    '--output=json',
    `--output-path=${outBase}.json`,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
    ...profile.flags,
    '--only-categories=performance,accessibility,best-practices,seo',
  ]

  if (process.platform === 'win32') {
    await execFileAsync('npx.cmd', ['lighthouse', ...args], { maxBuffer: 20 * 1024 * 1024 })
  } else {
    await execFileAsync('npx', ['lighthouse', ...args], { maxBuffer: 20 * 1024 * 1024 })
  }

  const report = JSON.parse(readFileSync(`${outBase}.json`, 'utf8'))
  const htmlOut = `${outBase}.html`

  const htmlArgs = [
    url,
    '--output=html',
    `--output-path=${htmlOut}`,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
    ...profile.flags,
    '--only-categories=performance,accessibility,best-practices,seo',
  ]

  if (process.platform === 'win32') {
    await execFileAsync('npx.cmd', ['lighthouse', ...htmlArgs], { maxBuffer: 20 * 1024 * 1024 })
  } else {
    await execFileAsync('npx', ['lighthouse', ...htmlArgs], { maxBuffer: 20 * 1024 * 1024 })
  }

  const values = {}
  for (const category of scores) {
    values[category] = Math.round((report.categories?.[category]?.score ?? 0) * 100)
  }

  for (const metric of metrics) {
    values[metric] = report.audits?.[metric]?.numericValue ?? null
  }

  return values
}

const allResults = []

for (const target of targets) {
  for (const profile of profiles) {
    for (let run = 1; run <= runs; run += 1) {
      const name = `${target.name}-${profile.name}-run-${run}`
      const outBase = join(outputDir, name)
      const url = `${baseUrl}${target.path}`
      console.log(`Lighthouse ${name}: ${url}`)
      const result = await runLighthouse(url, profile, outBase)
      allResults.push({ target: target.name, profile: profile.name, run, ...result })
    }
  }
}

const summaries = []
for (const target of targets) {
  for (const profile of profiles) {
    const group = allResults.filter((item) => item.target === target.name && item.profile === profile.name)
    const summary = { target: target.name, profile: profile.name }

    for (const key of [...scores, ...metrics]) {
      const values = group.map((item) => item[key]).filter((value) => typeof value === 'number')
      summary[key] = values.length ? median(values) : null
    }

    summaries.push(summary)
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  runs,
  results: allResults,
  medians: summaries,
}

writeFileSync(join(outputDir, 'summary.json'), JSON.stringify(output, null, 2))

const lines = [
  '# Lighthouse Summary',
  '',
  `Base URL: ${baseUrl}`,
  `Runs per page/profile: ${runs}`,
  '',
  '| Page | Profile | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |',
  '|---|---|---:|---:|---:|---:|---:|---:|---:|',
]

for (const item of summaries) {
  lines.push(`| ${item.target} | ${item.profile} | ${item.performance} | ${item.accessibility} | ${item['best-practices']} | ${item.seo} | ${item['largest-contentful-paint']?.toFixed?.(0) ?? '—'} | ${item['cumulative-layout-shift'] ?? '—'} | ${item['total-blocking-time']?.toFixed?.(0) ?? '—'} |`)
}

lines.push('', '## Raw runs', '')
for (const result of allResults) {
  lines.push(`- ${result.target}-${result.profile}-run-${result.run}`)
}

writeFileSync(join(outputDir, 'summary.md'), `${lines.join('\n')}\n`)

console.log(`\nSaved Lighthouse artifacts in ${outputDir}`)
