import { useState, useEffect, useCallback } from 'react'
import './ThemeToggle.css'

function ThemeToggle({ className = '', showLabel = true }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  const toggleTheme = useCallback(() => {
    const themes = ['dark', 'light', 'bw']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const newTheme = themes[nextIndex]
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'
      case 'bw': return '◐'
      default: return '🌙'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light'
      case 'bw': return 'B&W'
      default: return 'Dark'
    }
  }

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      type="button"
    >
      <span className="theme-icon">{getThemeIcon()}</span>
      {showLabel && <span className="theme-label">{getThemeLabel()}</span>}
    </button>
  )
}

export default ThemeToggle