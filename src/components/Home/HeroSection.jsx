import { useEffect, useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import PrismaticBurst from '../common/PrismaticBurst'
import FaultyTerminal from '../common/FaultyTerminal'
import './HeroSection.css'

function HeroSection({ isLoaderComplete = false }) {
  const heroRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const [theme, setTheme] = useState('dark')
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
  }, [])

  // Intersection Observer for performance (only after initial animation)
  useEffect(() => {
    if (!hasAnimated) return // Don't observe until initial animation is done

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  // Get initial theme and listen for changes
  useEffect(() => {
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

  // Trigger animation when loader completes
  useEffect(() => {
    if (!isLoaderComplete || hasAnimated || reducedMotion) return

    // Small delay to ensure DOM is ready after loader fades out
    const timer = setTimeout(() => {
      setIsVisible(true)
      
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => setHasAnimated(true)
        })

        tl.fromTo(
          firstNameRef.current,
          { opacity: 0, y: 100, skewY: 5, filter: 'blur(20px)' },
          { opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
        )
        .fromTo(
          lastNameRef.current,
          { opacity: 0, y: 100, skewY: -5, filter: 'blur(20px)' },
          { opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' },
          '-=0.8'
        )
        .fromTo(
          '.hero-ctas',
          { opacity: 0, y: 50, filter: 'blur(15px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
          '-=0.4'
        )
      }, heroRef)

      return () => ctx.revert()
    }, 300)

    return () => clearTimeout(timer)
  }, [isLoaderComplete, hasAnimated, reducedMotion])

  // Memoize background components for better performance
  const backgroundComponent = useMemo(() => {
    if (!isVisible && !reducedMotion) return null

    const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    return theme === 'light' ? (
      <FaultyTerminal
        scale={1.2}
        gridMul={[1.5, 1]}
        digitSize={1}
        timeScale={0.8}
        pause={false}
        scanlineIntensity={0.8}
        glitchAmount={0.8}
        flickerAmount={0.8}
        noiseAmp={0.8}
        chromaticAberration={0}
        dither={0}
        curvature={0}
        tint="#0aff8d"
        backgroundColor="#ffffff"
        mouseReact={!isMobileDevice}
        mouseStrength={isMobileDevice ? 0 : 0.5}
        pageLoadAnimation={false}
        brightness={0.9}
      />
    ) : (
      <PrismaticBurst
        animationType="rotate3d"
        intensity={1.5}
        speed={0.3}
        distort={0.8}
        paused={!isVisible}
        offset={{ x: 0, y: 0 }}
        hoverDampness={0.4}
        rayCount={18}
        mixBlendMode="lighten"
      />
    )
  }, [theme, isVisible, reducedMotion])

  return (
    <section className="welcome-div" ref={heroRef}>
      <div className="prismatic-background">
        {backgroundComponent}
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
