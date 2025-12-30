import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './styles/globals.css'

// Register service worker with aggressive auto-update
// Users never need to manually clear cache - it happens automatically!
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', registration.scope)
      
      // Immediately check for updates on page load
      registration.update()
      
      // Check for updates every 30 seconds (more aggressive)
      setInterval(() => {
        registration.update()
      }, 30000)
      
      // Handle updates - auto-refresh when new version is ready
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        console.log('SW update found, installing...')
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New SW is ready - tell it to skip waiting and take over
              newWorker.postMessage('SKIP_WAITING')
              console.log('New SW installed, refreshing to activate...')
              // Small delay to ensure SW activation completes
              setTimeout(() => window.location.reload(), 100)
            }
          }
        })
      })
      
      // Listen for SW activation messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'SW_UPDATED') {
          console.log('SW updated to version:', event.data.version)
        }
      })
      
      // When a new SW takes over, reload the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New SW controller, reloading for fresh content...')
        window.location.reload()
      })
      
    } catch (error) {
      console.log('SW registration failed:', error)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
