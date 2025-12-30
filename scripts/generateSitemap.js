import { writeFileSync } from 'fs'
import { resolve } from 'path'

const DOMAIN = 'https://ananaydubey.com'
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/graphing', priority: '0.8', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'yearly' }
]

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync(resolve('public/sitemap.xml'), sitemap)
  console.log('✅ Sitemap generated successfully!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap()
}

export default generateSitemap