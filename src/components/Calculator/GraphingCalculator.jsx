import { useEffect, useRef, useState } from 'react'
import functionPlot from 'function-plot'
import './GraphingCalculator.css'

const GraphingCalculator = () => {
  const rootRef = useRef(null)
  const [expression, setExpression] = useState('x^2')
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight * 0.8)

  useEffect(() => {
    const handleResize = () => {
      // Update dimensions based on container or window
      if (rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect()
        setWidth(rect.width)
        setHeight(rect.height)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    try {
      if (rootRef.current) {
        // Clear previous graph
        rootRef.current.innerHTML = ''
        
        functionPlot({
          target: rootRef.current,
          width: width,
          height: height,
          yAxis: { domain: [-10, 10] },
          xAxis: { domain: [-10, 10] },
          grid: true,
          data: [
            {
              fn: expression,
              color: 'var(--accent-color)' // Verify if function-plot supports var(), otherwise fallback to hex
            }
          ],
          
          style: {
            fontSize: 12
            // cannot directly style axis colors here easily without CSS overrides, which we did in CSS
          }
        })
      }
    } catch (e) {
      console.error("Graphing error:", e)
      // Optional: Visual error feedback could be added here
    }
  }, [expression, width, height])

  return (
    <div className="graphing-calculator-container">
      <div className="graphing-controls">
        <h2 className="graphing-title">Graphing Console</h2>
        <div className="function-input-group">
          <span className="function-label">f(x) =</span>
          <input 
            type="text" 
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="function-input"
            placeholder="e.g. x^2, sin(x)"
          />
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          <p>Try: <code style={{ color: 'var(--accent-color)' }}>sin(x)</code>, <code style={{ color: 'var(--accent-color)' }}>x^3 - x</code>, <code style={{ color: 'var(--accent-color)' }}>sqrt(x)</code></p>
        </div>
      </div>
      <div className="graph-container" ref={rootRef} id="graph-root"></div>
    </div>
  )
}

export default GraphingCalculator
