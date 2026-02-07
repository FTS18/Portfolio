import { useState, lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Loader from '../common/Loader'
import './Layout.css'

// Lazy load non-critical components
const StaggeredMenu = lazy(() => import('./StaggeredMenu'))
const GradualBlur = lazy(() => import('../common/GradualBlur'))
const ClickSpark = lazy(() => import('../common/ClickSpark'))
const Footer = lazy(() => import('./Footer'))
const BackToTop = lazy(() => import('../common/BackToTop'))
const GlassSurface = lazy(() => import('../common/GlassSurface'))

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [canvasEnabled, setCanvasEnabled] = useState(() => {
    const saved = localStorage.getItem('canvasEnabled')
    return saved === 'true' // Default: false (Images enabled, Canvas disabled)
  })
  // Theme state with device-based default
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    // Default to dark on mobile, light on desktop if no preference saved
    return window.innerWidth <= 768 ? 'dark' : 'light'
  })

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'bw']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const newTheme = themes[nextIndex]
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleCanvas = () => {
    setCanvasEnabled(prev => {
      const newValue = !prev
      localStorage.setItem('canvasEnabled', String(newValue))
      return newValue
    })
  }

  const handleCanvasToggle = () => {
    if (!canvasEnabled) {
      // Trying to enable canvas
      const hasAccepted = localStorage.getItem('canvasWarningAccepted')
      if (!hasAccepted) {
        setShowWarning(true)
        return
      }
    }
    toggleCanvas()
  }

  const confirmEnableCanvas = () => {
    localStorage.setItem('canvasWarningAccepted', 'true')
    setShowWarning(false)
    toggleCanvas()
  }

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/#top' },
    { label: 'Projects', ariaLabel: 'View all projects', link: '/#project-grid' },
    { label: 'Skills', ariaLabel: 'View my skills', link: '/#skills' },
    { label: 'About', ariaLabel: 'Learn about me', link: '/#about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/#contact' },
    { label: 'Ananay V1', ariaLabel: 'View old portfolio', link: 'https://ananay1.netlify.app', external: true }
  ]

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/FTS18' },
    { label: 'LinkedIn', link: 'https://linkedin.com/in/ananaydubey' },
    { label: 'YouTube', link: 'https://youtube.com/@spacify18' },
    { label: 'Instagram', link: 'https://instagram.com/ananay_dubey' },
    { label: 'Twitter', link: 'https://twitter.com/ananaydubey' },
    { label: 'Email', link: 'mailto:dubeyananay@gmail.com' }
  ]

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      
      <Suspense fallback={null}>
        <ClickSpark>
          <div className={`layout ${isMenuOpen ? 'menu-open' : ''} ${!canvasEnabled ? 'canvas-disabled' : ''}`}>
          
          {/* Top Right Controls Container */}
          <div className="layout-controls">
            {/* Theme Toggle Button */}
            <button 
              className="app-theme-btn control-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={`Current theme: ${theme}`}
            >
              <i className={`fas ${theme === 'dark' ? 'fa-moon' : theme === 'light' ? 'fa-sun' : 'fa-adjust'}`}></i>
            </button>

            {/* Canvas Toggle Button */}
            <button
              className="app-canvas-btn control-btn"
              onClick={handleCanvasToggle}
              aria-label={canvasEnabled ? "Disable animated background" : "Enable animated background"}
              title={canvasEnabled ? "Switch to static background" : "Switch to animated background"}
            >
              <i className={canvasEnabled ? "fas fa-wand-magic-sparkles" : "fas fa-image"}></i>
            </button>
          </div>
          
          {/* Bottom Screen-Edge Blur Only */}
          <Suspense fallback={null}>
            <GradualBlur
              target="page"
              position="bottom"
              height="7rem"
              strength={2}
              divCount={6}
              curve="bezier"
              exponential={true}
              opacity={1}
              zIndex={500}
            />
          </Suspense>

          {/* Mobile Fixed Bottom CTAs */}
          <div className="mobile-fixed-ctas">
            <a href="/assets/resume.pdf" download className="mobile-cta-btn cta-resume">
              <i className="fa-solid fa-file-pdf"></i>
              Resume
            </a>
            <a href="#project-grid" className="mobile-cta-btn cta-projects">
              <i className="fa-solid fa-grid-2"></i>
              Projects
            </a>
          </div>

          <Suspense fallback={null}>
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              menuButtonColor="#fff"
              openMenuButtonColor="#000"
              changeMenuColorOnOpen={true}
              colors={['#B19EEF', '#5227FF']}
              logoUrl="/assets/images/favicon/android-chrome-384x384.png"
              accentColor="#5227FF"
              isFixed={true}
              closeOnClickAway={false}
              onMenuOpen={() => setTimeout(() => setIsMenuOpen(true), 100)}
              onMenuClose={() => setIsMenuOpen(false)}
              canvasEnabled={canvasEnabled}
              onToggleCanvas={handleCanvasToggle}
            />
          </Suspense>
          
          {/* SVG Filters for squiggly effect */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="squiggly-0">
                <feTurbulence
                  id="turbulence"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                  seed="0"
                />
                <feDisplacementMap
                  id="displacement"
                  in="SourceGraphic"
                  in2="noise"
                  scale="6"
                />
              </filter>
              <filter id="squiggly-1">
                <feTurbulence
                  id="turbulence"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                  seed="1"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
              </filter>
              <filter id="squiggly-2">
                <feTurbulence
                  id="turbulence"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                  seed="2"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
              </filter>
              <filter id="squiggly-3">
                <feTurbulence
                  id="turbulence"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                  seed="3"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
              </filter>
              <filter id="squiggly-4">
                <feTurbulence
                  id="turbulence"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                  seed="4"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
              </filter>
            </defs>
          </svg>
          
          <main>
            <Outlet context={{ isLoaderComplete: !isLoading, canvasEnabled }} />
          </main>
          
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          
          <Suspense fallback={null}>
            <BackToTop />
          </Suspense>
          

        </div>

        {/* Performance Warning Modal */}
        {showWarning && (
            <div className="canvas-warning-overlay">
              <div className="canvas-warning-modal">
                <h3>High Performance Mode</h3>
                <p>Enabling the animated canvas background may cause lag on some devices. Are you sure you want to proceed?</p>
                <div className="warning-actions">
                  <button onClick={() => setShowWarning(false)} className="warning-btn cancel">Cancel</button>
                  <button onClick={confirmEnableCanvas} className="warning-btn confirm">Enable Anyway</button>
                </div>
              </div>
            </div>
        )}
      </ClickSpark>
    </Suspense>
    </>
  )
}

export default Layout
