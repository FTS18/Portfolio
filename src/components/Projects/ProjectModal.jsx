import { useEffect, useCallback, useRef, useState } from 'react'
import './ProjectModal.css'

const languageColors = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'React': '#61dafb',
  'Python': '#3776ab',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Sass': '#cc6699',
  'Node.js': '#339933',
  'GraphQL': '#e10098',
  'Firebase': '#ffca28',
  'MongoDB': '#47a248',
  'PostgreSQL': '#336791',
  'Docker': '#2496ed',
  'AWS': '#ff9900',
  'Vite': '#646cff',
  'Next.js': '#000000',
  'Tailwind CSS': '#06b6d4',
  'Chrome Extension': '#4285f4'
}

function ProjectModal({ project, projects, currentIndex, onClose, onNavigate }) {
  const modalRef = useRef(null)
  const imgRef = useRef(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [repoStats, setRepoStats] = useState(null)
  const [languages, setLanguages] = useState(null)
  const [activity, setActivity] = useState(null)

  // Helper: Fetch with LocalStorage Cache
  const fetchWithCache = async (url) => {
    const cacheKey = `gh_cache_${url}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24h cache
         return data
      }
    }
    const res = await fetch(url)
    const data = await res.json()
    if (!data.message) { // Only cache successful responses
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }))
    }
    return data
  }

  const [loading, setLoading] = useState(false)

  // Fetch GitHub data
  useEffect(() => {
    // Reset states first
    setLastUpdated(null) 
    setRepoStats(null)
    setLanguages(null)
    setActivity(null)
    
    if (project.github && project.github.includes('github.com')) {
      const repoPath = project.github.split('github.com/')[1]
      if (repoPath && !repoPath.includes('/pages/')) {
        setLoading(true)
        
        Promise.allSettled([
            // Fetch Repo Info
            fetchWithCache(`https://api.github.com/repos/${repoPath}`)
            .then(data => {
                if (data.message) throw new Error(data.message)
                if (data.updated_at) {
                    const date = new Date(data.updated_at)
                    setLastUpdated(date.toLocaleDateString())
                }
                setRepoStats({
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                    watchers: data.watchers_count
                })
            }),

            // Fetch Languages
            fetchWithCache(`https://api.github.com/repos/${repoPath}/languages`)
            .then(data => {
                if (data.message || Object.keys(data).length === 0) throw new Error('No langs')
                const total = Object.values(data).reduce((a, b) => a + b, 0)
                const langEntries = Object.entries(data).map(([name, size]) => ({
                    name,
                    percent: Math.round((size / total) * 100),
                    color: languageColors[name] || `hsl(${name.length * 40 % 360}, 70%, 60%)`
                }))
                setLanguages(langEntries.sort((a, b) => b.percent - a.percent).slice(0, 5))
            }),

            // Fetch Activity
            fetchWithCache(`https://api.github.com/repos/${repoPath}/stats/participation`)
            .then(data => {
                if (data.all && data.all.length > 0) {
                    const recent = data.all.slice(-12)
                    const total = recent.reduce((a, b) => a + b, 0)
                    if (total > 0) setActivity(recent)
                }
            })
        ]).finally(() => {
            setLoading(false)
        })
      }
    }
  }, [project.github])

  // Extract accent color from image - THEME AWARE
  const handleImageLoad = () => {
    if (!imgRef.current) return
    
    const currentTheme = document.documentElement.getAttribute('data-theme')
    
    // Default fallback values
    let r = 60, g = 80, b = 100, l = 0.5, h = 0.6, s = 0.5
    
    if (currentTheme === 'bw') {
      if (modalRef.current) {
        modalRef.current.style.setProperty('--modal-accent-bg', '#111')
        modalRef.current.style.setProperty('--modal-accent', '#888')
        modalRef.current.style.setProperty('--modal-accent-light', 'rgba(255,255,255,0.08)')
        modalRef.current.style.setProperty('--modal-accent-text', '#ffffff')
        modalRef.current.style.setProperty('--modal-contrast-strong', 'rgba(255,255,255,0.95)')
        modalRef.current.style.setProperty('--modal-contrast-muted', 'rgba(255,255,255,0.6)')
      }
      return
    }
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = imgRef.current
      
      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let maxScore = -1
      
      for (let i = 0; i < imageData.length; i += 16) { // Sample more to be faster
        const currR = imageData[i]
        const currG = imageData[i+1]
        const currB = imageData[i+2]
        
        const maxVal = Math.max(currR, currG, currB) / 255
        const minVal = Math.min(currR, currG, currB) / 255
        const currL = (maxVal + minVal) / 2
        const d = maxVal - minVal
        const currS = maxVal === minVal ? 0 : currL > 0.5 ? d / (2 - maxVal - minVal) : d / (maxVal + minVal)
        
        let currH = 0
        if (d !== 0) {
          switch (maxVal) {
            case currR / 255: currH = ((currG / 255 - currB / 255) / d + (currG < currB ? 6 : 0)) / 6; break
            case currG / 255: currH = ((currB / 255 - currR / 255) / d + 2) / 6; break
            case currB / 255: currH = ((currR / 255 - currG / 255) / d + 4) / 6; break
          }
        }
        
        // Priority to colors with higher saturation and medium lightness
        const score = currS * (currL > 0.2 && currL < 0.8 ? 1.5 : 0.5)
        
        if (score > maxScore) {
          maxScore = score
          r = currR; g = currG; b = currB; l = currL; h = currH; s = currS
        }
      }
      
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      if (modalRef.current) {
        if (currentTheme === 'light') {
          // Light Theme: Subtle tint
          const targetL = 0.95
          const targetS = 0.3
          const q = targetL < 0.5 ? targetL * (1 + targetS) : targetL + targetS - targetL * targetS
          const p = 2 * targetL - q
          const bgr = Math.floor(hue2rgb(p, q, h + 1/3) * 255)
          const bgg = Math.floor(hue2rgb(p, q, h) * 255)
          const bgb = Math.floor(hue2rgb(p, q, h - 1/3) * 255)
          
          modalRef.current.style.setProperty('--modal-accent-bg', `rgba(${r}, ${g}, ${b}, 0.1)`)
          modalRef.current.style.setProperty('--modal-accent', `rgb(${Math.max(0, r-40)}, ${Math.max(0, g-40)}, ${Math.max(0, b-40)})`)
          modalRef.current.style.setProperty('--modal-accent-light', `rgba(${r}, ${g}, ${b}, 0.08)`)
          modalRef.current.style.setProperty('--modal-bg-base', `rgb(${bgr}, ${bgg}, ${bgb})`)
          
          modalRef.current.style.setProperty('--modal-accent-text', '#000000')
          modalRef.current.style.setProperty('--modal-contrast-strong', 'rgba(0,0,0,0.9)')
          modalRef.current.style.setProperty('--modal-contrast-muted', 'rgba(0,0,0,0.6)')
          modalRef.current.style.setProperty('--modal-border', 'rgba(0,0,0,0.1)')
        } else {
          // Dark Mode: Deep base with vibrant accents
          modalRef.current.style.setProperty('--modal-accent-bg', `rgba(${r}, ${g}, ${b}, 0.15)`)
          modalRef.current.style.setProperty('--modal-accent', `rgb(${r}, ${g}, ${b})`)
          modalRef.current.style.setProperty('--modal-accent-light', `rgba(${r}, ${g}, ${b}, 0.08)`)
          modalRef.current.style.setProperty('--modal-bg-base', '#0c0c14')
          
          modalRef.current.style.setProperty('--modal-accent-text', '#ffffff')
          modalRef.current.style.setProperty('--modal-contrast-strong', 'rgba(255,255,255,0.95)')
          modalRef.current.style.setProperty('--modal-contrast-muted', 'rgba(255,255,255,0.6)')
          modalRef.current.style.setProperty('--modal-border', 'rgba(255,255,255,0.15)')
        }
      }
    } catch (e) {
      console.warn('Vibrant color extraction failed:', e)
    }
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1)
    if (e.key === 'ArrowRight' && currentIndex < projects.length - 1) onNavigate(currentIndex + 1)
  }, [currentIndex, projects.length, onClose, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  // ARIA Focus Trap - keeps focus within modal for accessibility
  useEffect(() => {
    if (!modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    
    // Focus first element on mount
    firstFocusable?.focus()

    return () => document.removeEventListener('keydown', handleTabKey)
  }, [project]) // Re-run when project changes

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: project.link
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(project.link)
      alert('Link copied!')
    }
  }

  const tags = project.tags || []
  const isHackathon = project.hackathon || project.pptLink
  const hasGithub = project.github && project.github !== 'Private'

  return (
    <div className="project-modal-overlay" onClick={onClose} role="presentation">
      <div 
        className="project-modal" 
        ref={modalRef} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* FIXED HEADER - Counter + Nav + Close */}
        <div className="modal-fixed-header">
          <div className="modal-counter">
            <span className="counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="counter-divider">/</span>
            <span className="counter-total">{String(projects.length).padStart(2, '0')}</span>
          </div>
          
            <div className="modal-header-nav">
            <button 
              className="header-nav-btn"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="View previous project"
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button 
              className="header-nav-btn"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === projects.length - 1}
              aria-label="View next project"
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
            
            {/* Mobile: Share + Close on top right */}
            <div className="mobile-top-actions">
              <button onClick={handleShare} className="mobile-top-btn" aria-label="Share this project">
                <i className="fas fa-share-nodes" aria-hidden="true"></i>
              </button>
              <button className="modal-close" onClick={onClose} aria-label="Close project details">
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            
            {/* Desktop: Share + Close */}
            <button className="modal-share-btn desktop-only" onClick={handleShare} aria-label="Share project">
              <i className="fas fa-share-nodes" aria-hidden="true"></i>
            </button>
            <button className="modal-close desktop-only" onClick={onClose} aria-label="Close project details">
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="modal-content">
          {/* Image */}
          <div className="modal-image-section">
            <img 
              ref={imgRef}
              src={`/${project.image}`} 
              alt={project.title}
              width={800}
              height={450}
              className="modal-image"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
            />
            <div className="modal-image-overlay"></div>
          </div>

          {/* Project Info */}
          <div className="modal-body">
            <div className="modal-title-section">
              <h2 id="modal-title" className="modal-title">{project.title}</h2>
              {isHackathon && (
                <span className="modal-badge">
                  <i className="fas fa-trophy"></i>
                  {project.hackathon || 'Hackathon'}
                </span>
              )}
            </div>

            <div className="modal-meta">
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{project.date}</span>
              </div>
              {lastUpdated && (
                <div className="meta-item">
                  <i className="fas fa-sync"></i>
                  <span>Updated {lastUpdated}</span>
                </div>
              )}
            </div>

            <p className="modal-description">{project.longDesc || project.shortDesc || project.description}</p>

            <div className="modal-tags">
              {tags.slice(0, 12).map((tag, i) => (
                <span key={i} className="modal-tag">{tag}</span>
              ))}
            </div>

            {/* Repo Stats Section */}
            {hasGithub && (
              <div className="modal-repo-info">
                <div className="refer-header">
                   <h4 className="repo-info-title">INSIDER VIEW</h4>
                   {activity && (
                     <div className="activity-graph" title="Commits in last 12 weeks">
                       {activity.map((count, i) => (
                         <div 
                           key={i} 
                           className="act-bar"
                           style={{ 
                             height: `${Math.max(15, (count / (Math.max(...activity) || 1)) * 100)}%`,
                             opacity: count === 0 ? 0.3 : 1
                           }}
                           title={`${count} commits`}
                         />
                       ))}
                     </div>
                   )}
                </div>

                {loading ? (
                    <div className="repo-loading">
                        <i className="fas fa-circle-notch fa-spin"></i>
                        <span>Fetching metrics...</span>
                    </div>
                ) : (!repoStats && !languages && !activity) ? (
                    <div className="repo-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>GitHub statistics unavailable (Rate Limit)</span>
                    </div>
                ) : (
                    <div className="repo-grid">
                      {languages && (
                        <div className="repo-languages">
                          <div className="lang-bar">
                            {languages.map((lang, i) => (
                              <div 
                                key={i} 
                                className="lang-segment" 
                                style={{ 
                                  width: `${lang.percent}%`, 
                                  backgroundColor: lang.color 
                                }}
                                title={`${lang.name}: ${lang.percent}%`}
                              />
                            ))}
                          </div>
                          <div className="lang-labels">
                            {languages.map((lang, i) => (
                              <div key={i} className="lang-label">
                                <span className="lang-dot" style={{ backgroundColor: lang.color }} />
                                <span className="lang-name">{lang.name}</span>
                                <span className="lang-percent">{lang.percent}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Show metrics only if non-zero values exist */}
                      {(repoStats && (repoStats.stars > 0 || repoStats.forks > 0 || repoStats.watchers > 0)) && (
                        <div className="repo-metrics">
                            <div className="metric-item">
                                <i className="fas fa-star"></i>
                                <span>{repoStats.stars} Stars</span>
                            </div>
                            <div className="metric-item">
                                <i className="fas fa-code-fork"></i>
                                <span>{repoStats.forks} Forks</span>
                            </div>
                            <div className="metric-item">
                                <i className="fas fa-eye"></i>
                                <span>{repoStats.watchers} Watchers</span>
                            </div>
                        </div>
                      )}
                    </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FIXED FOOTER - Actions */}
        <div className="modal-fixed-footer">
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-btn footer-btn-primary"
          >
            <span>Visit Site</span>
            <i className="fas fa-external-link-alt"></i>
          </a>
          
          {hasGithub && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-btn"
            >
              <i className="fab fa-github"></i>
              <span className="btn-text-desktop">GitHub</span>
            </a>
          )}
          
          {project.pptLink && (
            <a 
              href={project.pptLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-btn footer-btn-accent"
            >
              <i className="fas fa-file-powerpoint"></i>
              <span className="btn-text-desktop">PPT</span>
            </a>
          )}
        </div>


      </div>
    </div>
  )
}

export default ProjectModal
