import { useEffect, useRef } from 'react'

// Intersection Observer hook for animations
export function useIntersectionObserver(options = {}) {
  const elementRef = useRef(null)
  const isIntersecting = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting
      
      if (entry.isIntersecting) {
        element.classList.add('animate-in')
        element.classList.remove('animate-out')
      } else if (options.animateOut) {
        element.classList.add('animate-out')
        element.classList.remove('animate-in')
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '50px'
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.animateOut])

  return elementRef
}

// Stagger animation utility
export function useStaggerAnimation(delay = 100) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = container.children
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        Array.from(children).forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-in')
          }, index * delay)
        })
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    observer.observe(container)
    return () => observer.disconnect()
  }, [delay])

  return containerRef
}

// Performance-optimized scroll animations
export function useScrollAnimation() {
  useEffect(() => {
    let ticking = false

    const updateAnimations = () => {
      const elements = document.querySelectorAll('[data-scroll]')
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const elementHeight = rect.height
        
        const progress = Math.max(0, Math.min(1, 
          (scrollY + windowHeight - elementTop) / (windowHeight + elementHeight)
        ))

        element.style.setProperty('--scroll-progress', progress)
      })

      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimations)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}