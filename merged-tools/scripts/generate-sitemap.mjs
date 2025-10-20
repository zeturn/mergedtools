import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(process.cwd())
const registryPath = path.join(root, 'src/tools/registry.ts')

// naive parse to import TS file via Vite transpile is complex; instead, read meta via glob hints in files
// We will scan src/tools/*/index.tsx for 'meta' export by static regex and extract ids
import { readdir } from 'node:fs/promises'

async function getToolIds() {
  const toolsDir = path.join(root, 'src/tools')
  const entries = await readdir(toolsDir, { withFileTypes: true })
  const ids = []
  for (const d of entries) {
    if (!d.isDirectory()) continue
    // assume folder name is id
    ids.push(d.name)
  }
  return ids.sort()
}

const base = '' // root-relative URLs; if you deploy under subpath, replace here or make it an env

function xml(links) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${links.join('\n')}\n</urlset>\n`
}

function url(loc, changefreq = 'weekly', priority = '0.6') {
  return `  <url>\n    <loc>${base}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const staticRoutes = [
  url('/','weekly','0.9'),
  url('/menu','weekly','0.8'),
  url('/shortcuts','monthly','0.5'),
]

const ids = await getToolIds()
const toolRoutes = ids.map(id => url(`/${id}`,'monthly','0.7'))

const out = xml([...staticRoutes, ...toolRoutes])
await writeFile(path.join(root, 'public/sitemap.xml'), out)
console.log(`Generated sitemap with ${toolRoutes.length + staticRoutes.length} routes.`)
