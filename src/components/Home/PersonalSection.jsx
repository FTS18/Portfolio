import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import './PersonalSection.css'

function PersonalSection() {
  const [age, setAge] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [showGithubModal, setShowGithubModal] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const currentYear = new Date().getFullYear()
  const githubUser = "FTS18" // Central source of truth for GitHub identity
  
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const calculateAge = (birthDate) => {
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    }

    setAge(calculateAge('2006-03-13'))

    const timer = setTimeout(() => {
      fetch('/assets/projects.json')
        .then(res => res.json())
        .then(data => setProjectCount(data.length))
        .catch(() => setProjectCount(20))
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Brick-by-brick animation on scroll
  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          const tiles = gridRef.current?.querySelectorAll('.bento-tile')
          if (!tiles) return

          // Set initial state - smooth scale + slide (no blur for mobile perf)
          gsap.set(tiles, {
            opacity: 0,
            y: 40,
            scale: 0.97,
          })

          // Smooth reveal animation - GPU-accelerated only
          gsap.to(tiles, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: {
              amount: 0.6,
              from: 'start',
              grid: [3, 7],
              axis: 'x',
            },
          })
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <section className="personal-modern" id="top" ref={sectionRef}>
      <div className="personal-modern-container">
        {/* Clean Bento Grid */}
        <div className="personal-bento-grid" ref={gridRef}>
          {/* Main Info */}
          <div className="bento-tile bento-info b-s1">
            <span className="bento-label">Portfolio {currentYear}</span>
            <h2 className="personal-name">Ananay<br/>Dubey</h2>
            <p className="personal-role">Web Developer</p>
          </div>

          {/* Status */}
          <div className="bento-tile bento-status b-s2">
            <div className="status-content">
              <div className="status-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className="status-text">
                <span className="bento-value">AVAILABLE NOW!</span>
                <span className="bento-label">Open for projects & roles</span>
              </div>
            </div>
          </div>

          {/* Age & Badge Rank */}
          <div className="bento-tile bento-age b-s3">
            <div className="bento-age-inner">
              <span className="bento-value">{age}</span>
              <span className="bento-label">Years Old</span>
            </div>
          </div>

          <div className="bento-tile bento-badge b-s4">
            <span className="bento-label">B.Tech Student</span>
            <span className="bento-value">VLSI</span>
          </div>

          {/* Location & Experience */}
          <div className="bento-tile bento-location-small b-s5">
            <span className="bento-label">BASE</span>
            <div className="location-scroll">
              {/* Desktop: Full names with double arrow */}
              <span className="bento-value-small location-full">KANPUR</span>
              <i className="fas fa-arrows-left-right location-full"></i>
              <span className="bento-value-small location-full">CHANDIGARH</span>
              {/* Mobile: Short names with single arrow */}
              <span className="bento-value-small location-compact">KNP</span>
              <i className="fas fa-arrow-right location-compact"></i>
              <span className="bento-value-small location-compact">CHD</span>
            </div>
          </div>

          <div className="bento-tile bento-stat-card b-s6">
            <span className="bento-value">5+</span>
            <span className="bento-label">Years of Exp</span>
          </div>

          {/* Focal Image */}
          <div className="bento-tile bento-image-focal">
            <div className="personal-image-wrapper">
              <picture>
                <source media="(max-width: 768px)" srcSet="/assets/images/me2.webp" />
                <img src="/assets/images/me.webp" alt="Ananay Dubey" className="personal-image" width={400} height={400} loading="lazy" />
              </picture>
            </div>
          </div>

          {/* Stats & Education */}
          <div className="bento-tile bento-stat-card b-s7">
             <span className="bento-value">{projectCount}+</span>
             <span className="bento-label">Projects</span>
          </div>

          <div className="bento-tile bento-college-square b-s8">
            <span className="bento-label">EDUCATION</span>
            <span className="bento-value">PEC</span>
          </div>

          <div className="bento-tile bento-quote-wide b-s9">
             <div className="quote-header">
              <div className="dot-group">
                <span></span><span></span><span></span>
              </div>
            </div>
            <p className="quote-text">Building digital experiences that blend creativity with functionality.</p>
          </div>

          {/* Full-width Dashboard Row */}
          <div 
            className="bento-tile bento-github-dashboard b-s10" 
            onClick={() => setShowGithubModal(true)}
          >
            <div className="dashboard-header">
              <span className="bento-label">DASHBOARD</span>
              <i className="fa-brands fa-github"></i>
            </div>
            <div className="github-chart-container">
               <img 
                src={`https://ghchart.rshah.org/00ffac/${githubUser}`} 
                alt="GitHub Activity" 
                className="theme-filtered-chart"
                width={663}
                height={104}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub History Modal */}
      {showGithubModal && (
        <div className="github-modal-overlay" onClick={() => setShowGithubModal(false)}>
          <div className="github-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowGithubModal(false)} aria-label="Close GitHub history">
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-header">
              <i className="fa-brands fa-github"></i>
              <h2>GitHub Activity</h2>
              <p>@{githubUser} — Coding since 2020</p>
            </div>
            <div className="history-scroll-area">
              <div className="stats-summary-grid">
                <div className="summary-card">
                  <span className="summary-value">120+</span>
                  <span className="summary-label">Repos</span>
                </div>
                <div className="summary-card">
                  <span className="summary-value">1.5k+</span>
                  <span className="summary-label">Commits</span>
                </div>
                <div className="summary-card">
                  <span className="summary-value">50+</span>
                  <span className="summary-label">Stars</span>
                </div>
                <div className="summary-card">
                  <span className="summary-value">2020</span>
                  <span className="summary-label">Joined</span>
                </div>
              </div>
              <div className="modal-charts-grid">
                {[2024, 2023].map(year => (
                  <div key={year} className="history-year-block">
                    <h3 className="year-title">{year === 2024 ? "Current Year" : "Previous Year"}</h3>
                    <div className="modal-chart-wrapper">
                      <img 
                        src={`https://ghchart.rshah.org/00ffac/${githubUser}?year=${year}&t=${Date.now()}`} 
                        alt={`GitHub Contributions ${year}`} 
                        className="theme-filtered-chart"
                        width={663}
                        height={104}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PersonalSection
