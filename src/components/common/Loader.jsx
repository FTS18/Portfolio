import { useState, useEffect } from 'react'
import './Loader.css'

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Always show loader for minimum 0.8 seconds
    const minLoadTime = 800
    const startTime = Date.now()
    let hasCompleted = false
    
    // Fast progress simulation
    let currentProgress = 0
    const interval = setInterval(() => {
      if (hasCompleted) return
      
      // Random increment between 5-25%
      const increment = Math.random() * 20 + 5
      currentProgress += increment
      
      // Random pause point between 85-98%
      const pausePoint = 85 + Math.random() * 13
      if (currentProgress >= pausePoint) {
        currentProgress = pausePoint // Hold at random point until min time
      }
      setProgress(currentProgress)
    }, 150 + Math.random() * 200) // Random interval 150-350ms

    // Check when page is actually loaded
    const completeLoader = () => {
      if (hasCompleted) return
      hasCompleted = true
      
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadTime - elapsedTime)
      
      // Complete progress
      clearInterval(interval)
      setProgress(100)
      
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(() => {
          onComplete?.()
        }, 300)
      }, remainingTime)
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
        clearInterval(interval)
        clearTimeout(safetyTimeout)
        window.removeEventListener('load', completeLoader)
      }
    }

    return () => {
      clearInterval(interval)
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
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader