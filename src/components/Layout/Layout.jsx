import StaggeredMenu from './StaggeredMenu'
import GradualBlur from '../common/GradualBlur'
import ClickSpark from '../common/ClickSpark'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import GlassSurface from '../common/GlassSurface'
import './Layout.css'
import { useState } from 'react'

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Projects', ariaLabel: 'View all projects', link: '/#project-grid' },
    { label: 'Skills', ariaLabel: 'View my skills', link: '/#skills' },
    { label: 'About', ariaLabel: 'Learn about me', link: '/#about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/#contact' }
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
    <ClickSpark
      sparkColor="#5227FF"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className={`layout ${isMenuOpen ? 'menu-open' : ''}`}>
        {/* Bottom Screen-Edge Blur Only */}
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

        {/* Mobile Fixed Bottom CTAs */}
        <div className="mobile-fixed-ctas">
          <a href="/resume.pdf" download className="mobile-cta-btn cta-resume">
            <i className="fa-solid fa-file-pdf"></i>
            Resume
          </a>
          <a href="#project-grid" className="mobile-cta-btn cta-projects">
            <i className="fa-solid fa-grid-2"></i>
            Projects
          </a>
        </div>

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
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
        
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
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </ClickSpark>
  )
}

export default Layout
