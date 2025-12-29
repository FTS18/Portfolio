import { useState, useEffect } from 'react'
import './Loader.css'

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Always show loader for minimum 2.5 seconds
    const minLoadTime = 2500
    const startTime = Date.now()
    let hasCompleted = false
    
    // Fast progress simulation
    let currentProgress = 0
    const interval = setInterval(() => {
      if (hasCompleted) return
      
      currentProgress += Math.random() * 20 + 10 // 10-30% increments
      if (currentProgress >= 95) {
        currentProgress = 95 // Hold at 95% until min time
      }
      setProgress(currentProgress)
    }, 200)

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
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('load', completeLoader)
    }
  }, [onComplete])

  return (
    <div className={`loader-overlay ${isComplete ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}

export default Loader