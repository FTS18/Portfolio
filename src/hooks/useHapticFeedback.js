import { useCallback } from 'react'

function useHapticFeedback() {
  const isSupported = useCallback(() => {
    return 'vibrate' in navigator || 'hapticFeedback' in navigator
  }, [])

  const vibrate = useCallback((pattern = 10) => {
    if (!isSupported()) return false

    try {
      // Standard vibration API
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern)
        return true
      }
      
      // iOS haptic feedback (if available)
      if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
        // Light haptic feedback for iOS
        if (window.navigator.vibrate) {
          window.navigator.vibrate(pattern)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
      return false
    }
  }, [isSupported])

  const light = useCallback(() => vibrate(10), [vibrate])
  const medium = useCallback(() => vibrate(20), [vibrate])
  const heavy = useCallback(() => vibrate(50), [vibrate])
  
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate])
  const warning = useCallback(() => vibrate([50, 50, 50]), [vibrate])
  const error = useCallback(() => vibrate([100, 50, 100, 50, 100]), [vibrate])
  
  const selection = useCallback(() => vibrate(5), [vibrate])
  const impact = useCallback(() => vibrate(15), [vibrate])

  return {
    isSupported: isSupported(),
    vibrate,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    impact
  }
}

export default useHapticFeedback