import { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import SEO from '../components/common/SEO'
import './Calculator.css'

function Calculator() {
  const { canvasEnabled = true } = useOutletContext()
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [theme, setTheme] = useState('dark')

  // Get theme
  useEffect(() => {
    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(getTheme())

    const observer = new MutationObserver(() => {
      setTheme(getTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }, [])

  const performOperation = useCallback((nextOperator) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator) {
      const currentValue = previousValue || 0
      const newValue = {
        '/': (prev, next) => prev / next,
        '*': (prev, next) => prev * next,
        '+': (prev, next) => prev + next,
        '-': (prev, next) => prev - next,
        '=': (prev, next) => next
      }[operator](currentValue, inputValue)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }, [display, operator, previousValue])

  const handlePercentage = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }, [display])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(parseInt(e.key))
      } else if (e.key === '.') {
        inputDecimal()
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key)
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        performOperation('=')
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear()
      } else if (e.key === '%') {
        handlePercentage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [inputDigit, inputDecimal, performOperation, clear, handlePercentage])

  return (
    <>
      <SEO 
        title="Calculator | Ananay Dubey"
        description="A modern, theme-aware calculator with keyboard support"
        url="https://ananay.netlify.app/calculator"
      />
      <div className={`calculator-page ${!canvasEnabled ? 'static-bg' : ''}`}>
        <div className="calculator-container">
          <div className="calculator">
            <div className="calculator-display">
              <div className="display-value">{display}</div>
            </div>
            
            <div className="calculator-buttons">
              <button className="btn btn-function" onClick={clear}>C</button>
              <button className="btn btn-function" onClick={toggleSign}>±</button>
              <button className="btn btn-function" onClick={handlePercentage}>%</button>
              <button className="btn btn-operator" onClick={() => performOperation('/')}>÷</button>

              <button className="btn" onClick={() => inputDigit(7)}>7</button>
              <button className="btn" onClick={() => inputDigit(8)}>8</button>
              <button className="btn" onClick={() => inputDigit(9)}>9</button>
              <button className="btn btn-operator" onClick={() => performOperation('*')}>×</button>

              <button className="btn" onClick={() => inputDigit(4)}>4</button>
              <button className="btn" onClick={() => inputDigit(5)}>5</button>
              <button className="btn" onClick={() => inputDigit(6)}>6</button>
              <button className="btn btn-operator" onClick={() => performOperation('-')}>−</button>

              <button className="btn" onClick={() => inputDigit(1)}>1</button>
              <button className="btn" onClick={() => inputDigit(2)}>2</button>
              <button className="btn" onClick={() => inputDigit(3)}>3</button>
              <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>

              <button className="btn btn-zero" onClick={() => inputDigit(0)}>0</button>
              <button className="btn" onClick={inputDecimal}>.</button>
              <button className="btn btn-equals" onClick={() => performOperation('=')}>=</button>
            </div>
          </div>
          
          <div className="calculator-shortcuts">
            <p><kbd>0-9</kbd> Numbers</p>
            <p><kbd>+ - * /</kbd> Operations</p>
            <p><kbd>Enter</kbd> or <kbd>=</kbd> Calculate</p>
            <p><kbd>Esc</kbd> or <kbd>C</kbd> Clear</p>
            <p><kbd>%</kbd> Percentage</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Calculator
