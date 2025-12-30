import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DOMAIN = 'https://ananay.netlify.app'

// Read projects from JSON
const projectsPath = resolve(__dirname, '../public/assets/projects.json')
const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))

// Define all routes
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/#projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/#about', priority: '0.8', changefreq: 'monthly' },
  { path: '/#contact', priority: '0.7', changefreq: 'monthly' },
]

// Add project routes (if you have individual project pages)
// projects.forEach(p => {
//   const slug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
//   ROUTES.push({ path: `/project/${slug}`, priority: '0.6', changefreq: 'monthly' })
// })

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync(resolve(__dirname, '../public/sitemap.xml'), sitemap)
  console.log('✅ Sitemap generated successfully!')
  console.log(`   Routes: ${ROUTES.length}`)
  console.log(`   Projects found: ${projects.length}`)
}

// Run if called directly
generateSitemap()

export default generateSitemap