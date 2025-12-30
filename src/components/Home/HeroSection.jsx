import { lazy, Suspense, useEffect, useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { useWebGPU } from '../../utils/webgpu'
import './HeroSection.css'

const PrismaticBurst = lazy(() => import('../common/PrismaticBurst'))
const FaultyTerminal = lazy(() => import('../common/FaultyTerminal'))

function HeroSection({ isLoaderComplete = false }) {
  const heroRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const webgpuCanvasRef = useRef(null)
  const [theme, setTheme] = useState('dark')
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const webgpu = useWebGPU()

  // WebGPU background rendering
  useEffect(() => {
    if (!webgpu || !webgpuCanvasRef.current || !isVisible) return

    const canvas = webgpuCanvasRef.current
    const context = canvas.getContext('webgpu')
    
    if (!context) return

    // Configure the context
    context.configure({
      device: webgpu.device,
      format: 'bgra8unorm',
      alphaMode: 'premultiplied'
    })

    let animationId
    const renderLoop = () => {
      try {
        // WebGPU particle system for hero background
        const commandEncoder = webgpu.device.createCommandEncoder()
        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0.1 },
            loadOp: 'clear',
            storeOp: 'store'
          }]
        })
        
        renderPass.end()
        webgpu.device.queue.submit([commandEncoder.finish()])
      } catch (error) {
        console.log('WebGPU render error:', error)
        return
      }
      animationId = requestAnimationFrame(renderLoop)
    }

    renderLoop()
    return () => cancelAnimationFrame(animationId)
  }, [webgpu, isVisible])

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

        // GPU-accelerated animations only (no blur for mobile perf)
        tl.fromTo(
          firstNameRef.current,
          { opacity: 0, y: 60, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(
          lastNameRef.current,
          { opacity: 0, y: 60, skewY: -3 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.hero-ctas',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        )
      }, heroRef)

      return () => ctx.revert()
    }, 50)

    return () => clearTimeout(timer)
  }, [isLoaderComplete, hasAnimated, reducedMotion])

  // Memoize background components for better performance
  const backgroundComponent = useMemo(() => {
    if (!isVisible && !reducedMotion) return null

    const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    return (
      <Suspense fallback={null}>
        {theme === 'light' ? (
          <FaultyTerminal
            scale={1.2}
            gridMul={[1.5, 1]}
            digitSize={1}
            timeScale={isMobileDevice ? 0.4 : 0.8}
            pause={false}
            scanlineIntensity={isMobileDevice ? 0.3 : 0.8}
            glitchAmount={isMobileDevice ? 0.2 : 0.8}
            flickerAmount={isMobileDevice ? 0.3 : 0.8}
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
            intensity={isMobileDevice ? 0.8 : 1.5}
            speed={isMobileDevice ? 0.15 : 0.3}
            distort={isMobileDevice ? 0.4 : 0.8}
            paused={!isVisible}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.4}
            rayCount={isMobileDevice ? 10 : 18}
            mixBlendMode="lighten"
          />
        )}
      </Suspense>
    )
  }, [theme, isVisible, reducedMotion])

  return (
    <section className="welcome-div" ref={heroRef}>
      <div className="prismatic-background">
        {webgpu && (
          <canvas 
            ref={webgpuCanvasRef}
            className="webgpu-background"
            width={Math.min(window.innerWidth, 1920)}
            height={Math.min(window.innerHeight, 1080)}
          />
        )}
        {backgroundComponent}
      </div>

      <div className="hero-content">
        <h1 className="hero-name">
          <span className="hero-name-first" ref={firstNameRef}>Ananay</span>
          <span className="hero-name-last" ref={lastNameRef}>Dubey</span>
        </h1>
        
        <div className="hero-ctas">
          <a href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer" className="hero-cta cta-resume">
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
