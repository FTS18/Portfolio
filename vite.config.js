import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Ananay Dubey | Full-Stack Developer',
                short_name: 'Ananay',
                description: 'Full-Stack Web Developer specializing in React, TypeScript, Next.js, and AI-powered applications.',
                theme_color: '#5227FF',
                icons: [
                    {
                        src: '/assets/images/favicon/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/assets/images/favicon/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/assets/images/favicon/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,svg,woff2,json}'], // Include json to ensure projects.json updates
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.pathname.endsWith('.json'),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'data-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            },
                        }
                    }
                ]
            }
        }),
        // Gzip compression for production
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 1024, // Only compress files > 1KB
        }),
        // Brotli compression (better than gzip)
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
        }),
    ],
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
                    // Core React libraries - most critical
                    vendor: ['react', 'react-dom', 'react-router-dom'],

                    // Firebase split by service for better caching
                    'firebase-core': ['firebase/app'],
                    'firebase-db': ['firebase/database', 'firebase/firestore'],
                    'firebase-auth': ['firebase/auth'],

                    // 3D libraries - large and optional
                    three: ['three', '@react-three/fiber', '@react-three/drei'],

                    // Animation libraries
                    animations: ['gsap', 'motion'],

                    // Utilities - only if they exist
                    ...((() => {
                        try {
                            return { utils: ['maath', 'debug', 'ogl'] };
                        } catch {
                            return {};
                        }
                    })())
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
