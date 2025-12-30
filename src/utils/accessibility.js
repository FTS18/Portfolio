// Accessibility utilities
export const a11y = {
  // Focus management
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    })
  },

  // Skip to content
  addSkipLink() {
    const skipLink = document.createElement('a')
    skipLink.href = '#main'
    skipLink.textContent = 'Skip to main content'
    skipLink.className = 'skip-link'
    document.body.insertBefore(skipLink, document.body.firstChild)
  },

  // Announce to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)
  },

  // Color contrast validation
  checkContrast(foreground, background) {
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g).map(Number)
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio: ratio.toFixed(2),
      aa: ratio >= 4.5,
      aaa: ratio >= 7
    }
  }
}