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
  // New prop: load thumbnail for cards (smaller, faster)
  thumbnail = false,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  
  // Process image with WebGPU if effects are specified
  const processedSrc = useWebGPUImage(src, webgpuEffects)

  // Generate optimized image URL
  // For cards (thumbnail mode), use compressed thumbnails from /thumbs/ folder
  const getOptimizedSrc = (imageSrc) => {
    if (!imageSrc) return imageSrc
    
    // If it's already a data URL or external URL, return as-is
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('http')) {
      return imageSrc
    }
    
    // For thumbnail mode, try to use compressed version from thumbs folder
    if (thumbnail && imageSrc.includes('assets/images/')) {
      // Handle both "assets/images/..." and "/assets/images/..." formats
      // Split on 'assets/images/' to get the path after it
      const parts = imageSrc.split('assets/images/')
      if (parts.length === 2) {
        const subPath = parts[1] // e.g., "screenshots/gs.webp" or "1.webp"
        // Change extension to .webp for thumbnails (smaller)
        const thumbPath = subPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
        return `/assets/images/thumbs/${thumbPath}`
      }
    }
    
    return imageSrc
  }

  // Generate blur placeholder if not provided
  const defaultPlaceholder = blurDataURL || 
    `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#1a1a1a"/>
        <rect x="25" y="40" width="50" height="20" rx="2" fill="#333"/>
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
        // Larger margin for thumbnails to preload earlier
        rootMargin: thumbnail ? '400px' : '200px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [priority, isInView, thumbnail])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = (e) => {
    // If thumbnail failed, try original source
    if (thumbnail && e.target.src !== processedSrc) {
      console.log('[LazyImage] Thumbnail not found, using original:', processedSrc)
      e.target.src = processedSrc
      return
    }
    setError(true)
  }

  const optimizedSrc = getOptimizedSrc(processedSrc)

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
          src={optimizedSrc}
          width={width}
          height={height}
          sizes={sizes || (thumbnail ? '(max-width: 768px) 50vw, 25vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          // Use native decoding for better performance
          decoding="async"
          // Fetch priority hint
          fetchpriority={priority ? 'high' : 'low'}
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