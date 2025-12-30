import critical from 'critical'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

async function generateCriticalCSS() {
  try {
    const { css } = await critical.generate({
      base: 'dist/',
      src: 'index.html',
      target: {
        css: 'critical.css',
        html: 'index.html'
      },
      width: 1300,
      height: 900,
      inline: true,
      minify: true,
      extract: true,
      ignore: {
        atrule: ['@font-face'],
        rule: [/\.swiper/]
      }
    })
    
    console.log('✅ Critical CSS generated successfully!')
    return css
  } catch (error) {
    console.error('❌ Critical CSS generation failed:', error)
  }
}

export default generateCriticalCSS