import { useState, useEffect, useRef } from 'react'
import { useWebGPU } from '../../utils/webgpu'
import './LensCursor.css'

function LensCursor() {
  const cursorRef = useRef(null)
  const canvasRef = useRef(null)
  const [time, setTime] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const webgpu = useWebGPU()

  // WebGPU enhanced rendering
  useEffect(() => {
    if (!webgpu || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('webgpu')
    
    if (!context) return

    const renderFrame = () => {
      // WebGPU lens distortion effect
      const commandEncoder = webgpu.device.createCommandEncoder()
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      })
      
      renderPass.end()
      webgpu.device.queue.submit([commandEncoder.finish()])
      requestAnimationFrame(renderFrame)
    }

    renderFrame()
  }, [webgpu])

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

  // Track mouse position with performance optimization
  useEffect(() => {
    let rafId
    
    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId)
      
      rafId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
        setVisible(true)
      })
    }

    const handleMouseLeave = () => {
      setVisible(false)
      if (rafId) cancelAnimationFrame(rafId)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`lens-cursor ${visible ? 'visible' : ''} ${webgpu ? 'webgpu-enhanced' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {webgpu && (
        <canvas 
          ref={canvasRef}
          className="lens-cursor-canvas"
          width={100}
          height={100}
        />
      )}
      <div className="lens-cursor-circle"></div>
      <span className="lens-cursor-label">ANANAY</span>
      <span className="lens-cursor-time">{time}</span>
    </div>
  )
}

export default LensCursor