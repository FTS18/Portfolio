import { useState, useEffect } from 'react'
import gsap from 'gsap'
import './Loader.css'

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Always show loader for minimum 0.8 seconds
    const minLoadTime = 800
    const startTime = Date.now()
    let hasCompleted = false
    
    // Smooth GSAP ticker for progress
    const progressObj = { value: 0 }
    
    // Animate to 90% relatively quickly (momentum ease out)
    const initialTween = gsap.to(progressObj, {
      value: 90,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => {
        setProgress(progressObj.value)
      }
    })

    // Check when page is actually loaded
    const completeLoader = () => {
      if (hasCompleted) return
      hasCompleted = true
      
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadTime - elapsedTime)
      
      // Stop initial tween and rush to 100%
      initialTween.kill()
      
      gsap.to(progressObj, {
        value: 100,
        duration: Math.max(0.3, remainingTime / 1000),
        ease: 'power2.inOut',
        onUpdate: () => {
          setProgress(progressObj.value)
        },
        onComplete: () => {
          setIsComplete(true)
          setTimeout(() => {
            onComplete?.()
          }, 800) // Match the 0.8s CSS transition duration
        }
      })
    }

    // Wait for page load or minimum time
    if (document.readyState === 'complete') {
      setTimeout(completeLoader, minLoadTime)
    } else {
      window.addEventListener('load', completeLoader)
      
      // Safety net: don't let the loader stay more than 3.5s 
      // even if external resources are still loading (prevents LCP issues)
      const safetyTimeout = setTimeout(completeLoader, 3500)
      
      return () => {
        initialTween.kill()
        clearTimeout(safetyTimeout)
        window.removeEventListener('load', completeLoader)
      }
    }

    return () => {
      initialTween.kill()
      window.removeEventListener('load', completeLoader)
    }
  }, [onComplete])

  return (
    <div 
      className={`loader-overlay ${isComplete ? 'fade-out' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading portfolio"
    >
      <div className="loader-content">
        <div className="progress-container">
          <span className="progress-counter" aria-hidden="true">{Math.round(progress)}</span>

        </div>
      </div>
    </div>
  )
}

export default Loader