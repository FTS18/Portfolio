import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SEO from '../components/common/SEO'
import './CalculatorSuite.css'

function CalculatorSuite() {
  const { canvasEnabled = true } = useOutletContext()
  const [currentCategory, setCurrentCategory] = useState('financial')
  const [currentCalc, setCurrentCalc] = useState('universal_loan')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState({
    financial: true,
    health: false,
    math: false,
    physics: false
  })

  // Category Color Map
  const categoryColors = {
    financial: '#FFEB3B', // Yellow
    health: '#FF80AB',    // Pink
    math: '#40C4FF',      // Cyan
    physics: '#FF9100'    // Orange
  }

  // Calculator Metadata Map
  const calculatorData = {
    // Financial
    universal_loan: { title: "Universal Loan Calculator", desc: "Calculate Mortgage, Auto, or Personal Loans in one place." },
    sip: { title: "SIP Calculator", desc: "Calculate returns on your Systematic Investment Plan." },
    investment_suite: { title: "Investment Growth", desc: "Track how your money grows over time." },
    retirement: { title: "Retirement Planner", desc: "Plan your financial freedom." },
    payment: { title: "Payment / Debt Payoff", desc: "Optimize your debt payments." },
    income_tax: { title: "Income Tax Estimator", desc: "Estimate your yearly tax liability." },
    amortization: { title: "Amortization Schedule", desc: "See your loan breakdown over time." },
    inflation: { title: "Inflation Calculator", desc: "Calculate future purchasing power." },
    compound_interest: { title: "Compound Interest", desc: "The power of compounding explained." },
    salary: { title: "Salary Converter", desc: "Convert hourly to annual and vice versa." },

    // Health
    bmi: { title: "BMI Calculator", desc: "Calculate Body Mass Index." },
    calorie: { title: "Calorie (TDEE) Calculator", desc: "Total Daily Energy Expenditure estimator." },
    body_fat: { title: "Body Fat Percentage", desc: "Estimate body composition." },
    bmr: { title: "Basal Metabolic Rate", desc: "Calories burned at rest." },
    ideal_weight: { title: "Ideal Weight Calculator", desc: "Find your healthy weight range." },
    pace: { title: "Pace Calculator", desc: "Calculate speed for running or cycling." },

    // Math
    scientific: { title: "Scientific Calculator", desc: "Advanced mathematical operations." },
    percentage: { title: "Percentage Calculator", desc: "Calculate increases, decreases, and parts." },
    fraction: { title: "Fraction Adder", desc: "Add, subtract, multiply fractions." },
    triangle: { title: "Hypotenuse Calculator", desc: "Solve right-angled triangles." },
    rng: { title: "Random Number Generator", desc: "Generate random integers." },
    std_dev: { title: "Standard Deviation", desc: "Statistical analysis tool." },

    // Physics
    force: { title: "Force Calculator", desc: "Calculate Force using Newton's Second Law." }
  }

  const [activeColor, setActiveColor] = useState(categoryColors.financial)
  const [currentCalcInfo, setCurrentCalcInfo] = useState(calculatorData.universal_loan)
  const scriptLoadedRef = useRef(false)

  // Hide global canvas toggle on this page
  useEffect(() => {
    document.body.classList.add('calculator-page')
    return () => document.body.classList.remove('calculator-page')
  }, [])

  // Listen for calculator changes from core script (if it emits events) or manual clicks
  // We'll update the active color when user clicks a link
  const handleLinkClick = (category, id) => {
    setActiveColor(categoryColors[category] || '#FFF')
    if (calculatorData[id]) {
        setCurrentCalcInfo(calculatorData[id])
    }
    if (window.innerWidth <= 768) setSidebarOpen(false)
  }

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }))
  }

  const getCategoryIcon = () => {
    if (activeColor === categoryColors.financial) return 'fa-sack-dollar'
    if (activeColor === categoryColors.health) return 'fa-heart-pulse'
    if (activeColor === categoryColors.math) return 'fa-square-root-variable'
    if (activeColor === categoryColors.physics) return 'fa-atom'
    return 'fa-calculator'
  }

  // Load external scripts once
  useEffect(() => {
    if (scriptLoadedRef.current) return
    
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    // Load Chart.js, formulas, and core in sequence
    const loadAll = async () => {
      try {
        // Load Chart.js from CDN
        await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        
        // Load calculator files
        await loadScript('/assets/js/calculator-formulas.js')
        await loadScript('/assets/js/calculator-core.js')
        
        scriptLoadedRef.current = true
        
        // Trigger DOMContentLoaded event manually for calculator-core.js
        setTimeout(() => {
          const event = new Event('DOMContentLoaded')
          document.dispatchEvent(event)
        }, 100)
        
        console.log('Calculator suite loaded successfully')
      } catch (error) {
        console.error('Failed to load calculator scripts:', error)
      }
    }

    loadAll()
  }, [])

  return (
    <>
      <SEO 
        title="Calculator Suite | Ananay Dubey"
        description="Comprehensive calculator suite with 60+ calculators including Financial, Health, Math, and Physics tools"
        url="https://ananay.netlify.app/calculator"
      />
      
      <div className={`calc-container ${!canvasEnabled ? 'static-bg' : ''}`}>
        {/* Mobile FAB */}
        <button 
          id="mobile-menu-fab" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Calculator Menu"
        >
          <i className="fas fa-calculator"></i>
        </button>

        <div className="calc-layout">
          {/* Sidebar */}
          <aside className={`calc-sidebar ${sidebarOpen ? 'open' : ''}`}>
            {/* Financial Category */}
            <div className={`calc-category ${expandedCategories.financial ? 'expanded' : ''}`}>
              <div className="category-title" onClick={() => toggleCategory('financial')}>FINANCIAL</div>
              <a className="calc-link active" data-category="financial" data-id="universal_loan" onClick={() => handleLinkClick('financial', 'universal_loan')}>
                <i className="fas fa-money-bill-wave"></i> Universal Loan
              </a>
              <a className="calc-link" data-category="financial" data-id="sip" onClick={() => handleLinkClick('financial', 'sip')}>
                <i className="fas fa-chart-line"></i> SIP Calculator
              </a>
              <a className="calc-link" data-category="financial" data-id="investment_suite" onClick={() => handleLinkClick('financial', 'investment_suite')}>
                <i className="fas fa-piggy-bank"></i> Investment Growth
              </a>
              <a className="calc-link" data-category="financial" data-id="retirement" onClick={() => handleLinkClick('financial', 'retirement')}>
                <i className="fas fa-umbrella-beach"></i> Retirement
              </a>
              <a className="calc-link" data-category="financial" data-id="payment" onClick={() => handleLinkClick('financial', 'payment')}>
                <i className="fas fa-credit-card"></i> Payment / Debt
              </a>
              <a className="calc-link" data-category="financial" data-id="income_tax" onClick={() => handleLinkClick('financial', 'income_tax')}>
                <i className="fas fa-file-invoice-dollar"></i> Income Tax
              </a>
              <a className="calc-link" data-category="financial" data-id="amortization" onClick={() => handleLinkClick('financial', 'amortization')}>
                <i className="fas fa-percentage"></i> Amortization
              </a>
              <a className="calc-link" data-category="financial" data-id="inflation" onClick={() => handleLinkClick('financial', 'inflation')}>
                <i className="fas fa-arrow-trend-up"></i> Inflation
              </a>
              <a className="calc-link" data-category="financial" data-id="compound_interest" onClick={() => handleLinkClick('financial', 'compound_interest')}>
                <i className="fas fa-coins"></i> Compound Interest
              </a>
              <a className="calc-link" data-category="financial" data-id="salary" onClick={() => handleLinkClick('financial', 'salary')}>
                <i className="fas fa-wallet"></i> Salary Converter
              </a>
            </div>

            {/* Health Category */}
            <div className={`calc-category ${expandedCategories.health ? 'expanded' : ''}`}>
              <div className="category-title" onClick={() => toggleCategory('health')}>HEALTH & FITNESS</div>
              <a className="calc-link" data-category="health" data-id="bmi" onClick={() => handleLinkClick('health', 'bmi')}>
                <i className="fas fa-weight-scale"></i> BMI Calculator
              </a>
              <a className="calc-link" data-category="health" data-id="calorie" onClick={() => handleLinkClick('health', 'calorie')}>
                <i className="fas fa-fire"></i> Calorie (TDEE)
              </a>
              <a className="calc-link" data-category="health" data-id="body_fat" onClick={() => handleLinkClick('health', 'body_fat')}>
                <i className="fas fa-percent"></i> Body Fat %
              </a>
              <a className="calc-link" data-category="health" data-id="bmr" onClick={() => handleLinkClick('health', 'bmr')}>
                <i className="fas fa-heartbeat"></i> BMR
              </a>
              <a className="calc-link" data-category="health" data-id="ideal_weight" onClick={() => handleLinkClick('health', 'ideal_weight')}>
                <i className="fas fa-balance-scale"></i> Ideal Weight
              </a>
              <a className="calc-link" data-category="health" data-id="pace" onClick={() => handleLinkClick('health', 'pace')}>
                <i className="fas fa-running"></i> Pace Calculator
              </a>
            </div>

            {/* Math Category */}
            <div className={`calc-category ${expandedCategories.math ? 'expanded' : ''}`}>
              <div className="category-title" onClick={() => toggleCategory('math')}>MATHEMATICS</div>
              <a className="calc-link" data-category="math" data-id="scientific" onClick={() => handleLinkClick('math', 'scientific')}>
                <i className="fas fa-calculator"></i> Scientific Calculator
              </a>
              <a className="calc-link" data-category="math" data-id="percentage" onClick={() => handleLinkClick('math', 'percentage')}>
                <i className="fas fa-percent"></i> Percentage
              </a>
              <a className="calc-link" data-category="math" data-id="fraction" onClick={() => handleLinkClick('math', 'fraction')}>
                <i className="fas fa-divide"></i> Fraction Adder
              </a>
              <a className="calc-link" data-category="math" data-id="triangle" onClick={() => handleLinkClick('math', 'triangle')}>
                <i className="fas fa-draw-polygon"></i> Hypotenuse
              </a>
              <a className="calc-link" data-category="math" data-id="rng" onClick={() => handleLinkClick('math', 'rng')}>
                <i className="fas fa-dice"></i> Random Number
              </a>
              <a className="calc-link" data-category="math" data-id="std_dev" onClick={() => handleLinkClick('math', 'std_dev')}>
                <i className="fas fa-chart-bar"></i> Standard Deviation
              </a>
            </div>

            {/* Physics Category */}
            <div className={`calc-category ${expandedCategories.physics ? 'expanded' : ''}`}>
              <div className="category-title" onClick={() => toggleCategory('physics')}>PHYSICS</div>
               <a className="calc-link" data-category="physics" data-id="force" onClick={() => handleLinkClick('physics', 'force')}>
                <i className="fas fa-bolt"></i> Force (F=ma)
              </a>
            </div>
          </aside>

          {/* Main Content Area */}
          {/* Main Content Area */}
          <main className="calc-main">
            <div className="calculator-card" style={{ background: activeColor, borderColor: '#000' }}>
              
               {/* Y2K Decorations */}
              <div className="deco-grid-overlay"></div>
              <div className="deco-scanlines"></div>
              <div className="deco-corner deco-top-left"></div>
              <div className="deco-corner deco-bottom-right"></div>
              
              <i className={`card-decoration deco-icon-big fas ${getCategoryIcon()}`}></i>
              <div className="y2k-sticker" style={{ top: '20px', right: '20px', transform: 'rotate(5deg)' }}>
                 VERIFIED
              </div>

              <div className="calc-header-area">
                <h1 id="category-title" style={{ color: '#000' }}>{currentCalcInfo?.title || 'Calculator'}</h1>
                <p className="calc-description" style={{ color: '#222' }}>{currentCalcInfo?.desc || ''}</p>
              </div>

              {/* Generic Calculator Container */}
              <div id="generic-calculator">
                <div id="calc-inputs"></div>
                
                <div className="action-area">
                  <button id="calc-action-btn">
                    <i className="fas fa-calculator"></i> Calculate
                  </button>
                  <button id="calc-export-btn" className="secondary-action-btn" style={{display: 'none'}}>
                    <i className="fas fa-file-pdf"></i> Export PDF
                  </button>
                </div>

                <div id="calc-results">
                  <div className="placeholder-result">Result will appear here</div>
                </div>

                {/* Chart Wrapper */}
                <div id="chart-wrapper" style={{display: 'none', marginTop: '30px'}}>
                  <canvas id="resultChart" style={{maxHeight: '400px'}}></canvas>
                </div>
              </div>

              {/* Scientific Calculator Container */}
              <div id="scientific-calculator" style={{display: 'none'}}>
                <div className="scientific-wrapper">
                  <div id="sci-display" style={{
                    background: 'var(--glass-bg)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '2rem',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    minHeight: '60px'
                  }}>0</div>
                  
                  <div className="sci-buttons-grid" id="sci-keypad">
                    {/* Scientific Calculator Buttons - Will be populated by calc.js */}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default CalculatorSuite
