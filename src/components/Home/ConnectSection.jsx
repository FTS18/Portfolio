import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ConnectSection.css'

gsap.registerPlugin(ScrollTrigger)

function ConnectSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    if (headerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        )
      })
      return () => ctx.revert()
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-run carousel
  useEffect(() => {
    if (!isMobile || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % services.length)
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMobile, isPaused])

  const services = [
    {
      number: '01',
      title: 'UI/UX Design',
      description: 'Designing modern, responsive interfaces with Figma, Tailwind CSS, and Framer Motion. Creating intuitive experiences with clean design systems and pixel-perfect implementations.',
      icon: 'fa-solid fa-palette'
    },
    {
      number: '02',
      title: 'Full Stack Development',
      description: 'Building scalable and high-performance web applications using Next.js, React, Node.js, and TypeScript, with robust backend architectures, secure RESTful APIs, and clean code practices.',
      icon: 'fa-solid fa-code'
    },
    {
      number: '03',
      title: 'API Architecture',
      description: 'Designing maintainable APIs with Prisma, and MongoDB. Focusing on optimization, security, best practices, and efficient data flow.',
      icon: 'fa-solid fa-network-wired'
    }
  ]

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX // Reset on new touch
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    if (distance > 50) {
      setCurrentSlide(prev => (prev + 1) % services.length)
    } else if (distance < -50) {
      setCurrentSlide(prev => (prev === 0 ? services.length - 1 : prev - 1))
    }
  }

  return (
    <section className="connect-section" id="about">
      <div className="connect-container">
        <div className="connect-header" ref={headerRef}>
          <h2 className="connect-title"><span className="fraunces-italic">What</span> I Do</h2>
          <p className="connect-subtitle">
            Specialized services for modern web development
            <span className="brutalist-symbol symbol-arrow-right" />
          </p>
        </div>

        {isMobile ? (
          <div 
            className="connect-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className="connect-carousel-track"
              ref={carouselRef}
              style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {services.map((service, index) => (
                <div key={index} className="connect-card carousel-card" data-number={service.number}>
                  <div className="connect-card-number">{service.number}</div>
                  <div className="connect-card-icon">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="connect-card-title">{service.title}</h3>
                  <p className="connect-card-description">{service.description}</p>
                </div>
              ))}
            </div>
            
            <div className="carousel-dots">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="connect-grid">
            {services.map((service, index) => (
              <div key={index} className="connect-card" data-number={service.number}>
                <div className="connect-card-number">{service.number}</div>
                <div className="connect-card-icon">
                  <i className={service.icon}></i>
                </div>
                <h3 className="connect-card-title">{service.title}</h3>
                <p className="connect-card-description">{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ConnectSection
