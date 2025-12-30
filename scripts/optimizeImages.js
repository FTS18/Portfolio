import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import imageminAvif from 'imagemin-avif'
import { glob } from 'glob'
import { resolve, dirname, basename, extname } from 'path'
import { mkdirSync, existsSync } from 'fs'

async function optimizeImages() {
  const imageFiles = await glob('public/assets/images/**/*.{jpg,jpeg,png}')
  
  for (const file of imageFiles) {
    const dir = dirname(file)
    const name = basename(file, extname(file))
    
    // Generate WebP
    await imagemin([file], {
      destination: dir,
      plugins: [
        imageminWebp({
          quality: 80,
          method: 6
        })
      ]
    })
    
    // Generate AVIF
    await imagemin([file], {
      destination: dir,
      plugins: [
        imageminAvif({
          quality: 70,
          speed: 2
        })
      ]
    })
    
    console.log(`✅ Optimized: ${name}`)
  }
  
  console.log('🎉 All images optimized!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages()
}

export default optimizeImages