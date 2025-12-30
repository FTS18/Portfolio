import { useState, useRef, useEffect } from 'react'
import { useWebGPUImage } from '../../utils/webgpu'
import './LazyImage.css'

function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  blurDataURL,
  quality = 75,
  sizes,
  priority = false,
  webgpuEffects = [],
  onLoad,
  innerRef,
  width,
  height,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  
  // Process image with WebGPU if effects are specified
  const processedSrc = useWebGPUImage(src, webgpuEffects)

  // Generate blur placeholder if not provided
  const defaultPlaceholder = blurDataURL || 
    `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#f0f0f0"/>
        <rect x="25" y="40" width="50" height="20" rx="2" fill="#e0e0e0"/>
      </svg>
    `)}`

  useEffect(() => {
    if (priority || isInView) return

    // Quick check on mount - helps if the element is already in view
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect()
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        setIsInView(true)
        return
      }
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      { 
        rootMargin: '200px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
  }

  // No automatic srcSet generation since files aren't available
  // Instead, just use the base src

  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-wrapper ${className} ${isLoaded ? 'loaded' : ''} ${isInView ? 'in-view' : ''}`} 
      {...props}
    >
      {/* Blur placeholder */}
      <img
        src={placeholder || defaultPlaceholder}
        alt=""
        width={width}
        height={height}
        className={`lazy-image-placeholder ${isLoaded ? 'loaded' : ''}`}
        aria-hidden="true"
      />
      
      {/* Main image */}
      {(isInView || priority) && !error && (
        <img
          ref={innerRef}
          src={processedSrc}
          width={width}
          height={height}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="lazy-image-error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  )
}

export default LazyImage