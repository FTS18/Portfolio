import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './styles/globals.css'

// Register service worker with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', registration.scope)
      
      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update()
      }, 60000)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        console.log('SW update found')
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW is ready, reload the page to use it
            console.log('New SW installed, refreshing...')
            window.location.reload()
          }
        })
      })
      
      // Listen for SW messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'SW_UPDATED') {
          console.log('SW updated to version:', event.data.version)
          // Optionally reload to get fresh content
          window.location.reload()
        }
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
