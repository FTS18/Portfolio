import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import PrismaticBurst from '../common/PrismaticBurst'
import FaultyTerminal from '../common/FaultyTerminal'
import './HeroSection.css'

function HeroSection() {
  const heroRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const [theme, setTheme] = useState('dark')

  // Get initial theme and listen for changes
  useEffect(() => {
    // Get initial theme
    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(getTheme())

    const observer = new MutationObserver(() => {
      setTheme(getTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline()

      tl.fromTo(
        firstNameRef.current,
        { opacity: 0, y: 100, skewY: 5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }
      )
      .fromTo(
        lastNameRef.current,
        { opacity: 0, y: 100, skewY: -5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' },
        '-=0.8'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="welcome-div" ref={heroRef}>
      {/* Background - PrismaticBurst for dark mode, FaultyTerminal for light mode */}
      <div className="prismatic-background" key={theme}>
        {theme === 'light' ? (
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0}
            tint="#0aff8d"
            backgroundColor="#ffffff"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        ) : (
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={24}
            mixBlendMode="lighten"
          />
        )}
      </div>

      <div className="hero-content">
        <h1 className="hero-name">
          <span className="hero-name-first" ref={firstNameRef}>Ananay</span>
          <span className="hero-name-last" ref={lastNameRef}>Dubey</span>
        </h1>
        
        <div className="hero-ctas">
          <a href="/resume.pdf" download className="hero-cta cta-resume">
            <i className="fa-solid fa-file-pdf"></i>
            Resume
          </a>
          <a href="#project-grid" className="hero-cta cta-projects">
            <i className="fa-solid fa-grid-2"></i>
            Projects
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
