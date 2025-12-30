// Font loading error handler
function handleFontLoading() {
  // Check if fonts are loaded
  if ('fonts' in document) {
    // Use Font Loading API if available
    Promise.all([
      document.fonts.load('400 16px "Monument Extended"'),
      document.fonts.load('900 16px "Monument Extended"')
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded')
    }).catch(() => {
      // Fallback to system fonts
      document.documentElement.classList.add('fonts-failed')
      console.warn('Custom fonts failed to load, using fallback fonts')
    })
  } else {
    // Fallback for browsers without Font Loading API
    const testElement = document.createElement('div')
    testElement.style.fontFamily = 'Monument Extended'
    testElement.style.position = 'absolute'
    testElement.style.visibility = 'hidden'
    testElement.textContent = 'Test'
    document.body.appendChild(testElement)
    
    setTimeout(() => {
      document.documentElement.classList.add('fonts-loaded')
      document.body.removeChild(testElement)
    }, 3000)
  }
}

// Run font loading check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleFontLoading)
} else {
  handleFontLoading()
}