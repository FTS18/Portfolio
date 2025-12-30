import { useState, useEffect, useRef } from 'react'
import './LensCursor.css'

function LensCursor() {
  const cursorRef = useRef(null)
  const [time, setTime] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`lens-cursor ${visible ? 'visible' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="lens-cursor-circle"></div>
      <span className="lens-cursor-label">ANANAY</span>
      <span className="lens-cursor-time">{time}</span>
    </div>
  )
}

export default LensCursor
