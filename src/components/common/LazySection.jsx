import { useState, useEffect, useRef } from 'react'

/**
 * LazySection - A component that only renders its children when in viewport
 * This reduces initial load by deferring render of off-screen content
 */
function LazySection({ children, rootMargin = '200px', threshold = 0, placeholder = null }) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasLoaded(true)
          // Once loaded, stop observing
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  // Once loaded, always show (no flickering on scroll back up)
  if (hasLoaded) {
    return <>{children}</>
  }

  return (
    <div ref={ref} style={{ minHeight: placeholder ? 'auto' : '100px' }}>
      {isVisible ? children : placeholder}
    </div>
  )
}

export default LazySection
