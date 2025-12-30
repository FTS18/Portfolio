import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false, // Disable sourcemaps for production to reduce size
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    firebase: ['firebase/app', 'firebase/database', 'firebase/auth', 'firebase/firestore'],
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                    animations: ['gsap', 'motion'],
                    ui: ['swiper'],
                    utils: ['mathjs', 'maath', 'debug']
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.')
                    const ext = info[info.length - 1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `assets/images/[name]-[hash][extname]`
                    }
                    if (/css/i.test(ext)) {
                        return `assets/css/[name]-[hash][extname]`
                    }
                    return `assets/[name]-[hash][extname]`
                }
            }
        },
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.info', 'console.debug']
            },
            format: {
                comments: false
            }
        },
        reportCompressedSize: false, // Faster builds
        cssCodeSplit: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/components'),
            '@pages': resolve(__dirname, 'src/pages'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@hooks': resolve(__dirname, 'src/hooks'),
            '@styles': resolve(__dirname, 'src/styles')
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'gsap', 'three']
    }
})
