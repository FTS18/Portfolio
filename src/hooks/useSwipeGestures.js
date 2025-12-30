import { useState, useEffect, useRef } from 'react'

function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventDefaultTouchmoveEvent = false,
  trackMouse = false
}) {
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const elementRef = useRef(null)
  
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleStart = (clientX, clientY) => {
      startPos.current = { x: clientX, y: clientY }
      currentPos.current = { x: clientX, y: clientY }
      setIsSwiping(true)
      setSwipeDirection(null)
    }

    const handleMove = (clientX, clientY) => {
      if (!isSwiping) return
      
      currentPos.current = { x: clientX, y: clientY }
      
      const deltaX = clientX - startPos.current.x
      const deltaY = clientY - startPos.current.y
      
      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left')
      } else {
        setSwipeDirection(deltaY > 0 ? 'down' : 'up')
      }
    }

    const handleEnd = () => {
      if (!isSwiping) return
      
      const deltaX = currentPos.current.x - startPos.current.x
      const deltaY = currentPos.current.y - startPos.current.y
      
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      
      if (absX > threshold || absY > threshold) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.(deltaX)
          } else {
            onSwipeLeft?.(Math.abs(deltaX))
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.(deltaY)
          } else {
            onSwipeUp?.(Math.abs(deltaY))
          }
        }
      }
      
      setIsSwiping(false)
      setSwipeDirection(null)
    }

    // Touch events
    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = () => {
      handleEnd()
    }

    // Mouse events (optional)
    const handleMouseDown = (e) => {
      if (!trackMouse) return
      handleStart(e.clientX, e.clientY)
    }

    const handleMouseMove = (e) => {
      if (!trackMouse || !isSwiping) return
      handleMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      if (!trackMouse) return
      handleEnd()
    }

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    if (trackMouse) {
      element.addEventListener('mousedown', handleMouseDown)
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseup', handleMouseUp)
      element.addEventListener('mouseleave', handleMouseUp)
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      
      if (trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown)
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseup', handleMouseUp)
        element.removeEventListener('mouseleave', handleMouseUp)
      }
    }
  }, [isSwiping, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefaultTouchmoveEvent, trackMouse])

  return {
    ref: elementRef,
    isSwiping,
    swipeDirection
  }
}

export default useSwipeGestures