import { useEffect, useCallback, useRef, useState } from 'react'
import './ProjectModal.css'

function ProjectModal({ project, projects, currentIndex, onClose, onNavigate }) {
  const modalRef = useRef(null)
  const imgRef = useRef(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch GitHub last updated
  useEffect(() => {
    if (project.github && project.github.includes('github.com')) {
      const repoPath = project.github.split('github.com/')[1]
      if (repoPath && !repoPath.includes('/pages/')) {
        fetch(`https://api.github.com/repos/${repoPath}`)
          .then(res => res.json())
          .then(data => {
            if (data.updated_at) {
              const date = new Date(data.updated_at)
              setLastUpdated(date.toLocaleDateString())
            }
          })
          .catch(() => setLastUpdated(null))
      }
    }
  }, [project.github])

  // Extract accent color from image - THEME AWARE
  const handleImageLoad = () => {
    if (!imgRef.current) return
    
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (currentTheme === 'bw') {
      if (modalRef.current) {
        modalRef.current.style.setProperty('--modal-accent-bg', '#111')
        modalRef.current.style.setProperty('--modal-accent', '#888')
        modalRef.current.style.setProperty('--modal-accent-light', 'rgba(255,255,255,0.08)')
        modalRef.current.style.setProperty('--modal-accent-text', '#fff')
      }
      return
    }
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = imgRef.current
      
      canvas.width = 100
      canvas.height = 100
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let topVibrant = { r: 60, g: 80, b: 100, score: -1, h: 0 }
      
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i+1]
        const b = imageData[i+2]
        
        const max = Math.max(r, g, b) / 255
        const min = Math.min(r, g, b) / 255
        const l = (max + min) / 2
        const d = max - min
        const s = max === min ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        let h = 0
        if (d !== 0) {
          switch (max) {
            case r / 255: h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) / 6; break
            case g / 255: h = ((b / 255 - r / 255) / d + 2) / 6; break
            case b / 255: h = ((r / 255 - g / 255) / d + 4) / 6; break
          }
        }
        
        const score = s * (l > 0.15 && l < 0.85 ? 1 : 0.2)
        
        if (score > topVibrant.score) {
          topVibrant = { r, g, b, score, l, h, s }
        }
      }
      
      let { r, g, b, h, s } = topVibrant.score > 0.05 ? topVibrant : { r: 80, g: 120, b: 180, h: 0.6, s: 0.5 }
      s = Math.min(0.9, s * 1.3)
      
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
          const lightL = 0.55
          const q = lightL < 0.5 ? lightL * (1 + s) : lightL + s - lightL * s
          const p = 2 * lightL - q
          const vr = Math.floor(hue2rgb(p, q, h + 1/3) * 255)
          const vg = Math.floor(hue2rgb(p, q, h) * 255)
          const vb = Math.floor(hue2rgb(p, q, h - 1/3) * 255)
          
          const bgL = 0.96
          const bgQ = bgL < 0.5 ? bgL * (1 + s * 0.25) : bgL + s * 0.25 - bgL * s * 0.25
          const bgP = 2 * bgL - bgQ
          const bgr = Math.floor(hue2rgb(bgP, bgQ, h + 1/3) * 255)
          const bgg = Math.floor(hue2rgb(bgP, bgQ, h) * 255)
          const bgb = Math.floor(hue2rgb(bgP, bgQ, h - 1/3) * 255)
          
          modalRef.current.style.setProperty('--modal-accent-bg', `rgb(${bgr}, ${bgg}, ${bgb})`)
          modalRef.current.style.setProperty('--modal-accent', `rgb(${vr}, ${vg}, ${vb})`)
          modalRef.current.style.setProperty('--modal-accent-light', `rgba(${vr}, ${vg}, ${vb}, 0.1)`)
          modalRef.current.style.setProperty('--modal-accent-text', '#1a1a1a')
          modalRef.current.style.setProperty('--modal-border', `rgba(${vr}, ${vg}, ${vb}, 0.25)`)
        } else {
          const darkL = 0.08
          const q = darkL < 0.5 ? darkL * (1 + s) : darkL + s - darkL * s
          const p = 2 * darkL - q
          const dr = Math.floor(hue2rgb(p, q, h + 1/3) * 255)
          const dg = Math.floor(hue2rgb(p, q, h) * 255)
          const db = Math.floor(hue2rgb(p, q, h - 1/3) * 255)
          
          modalRef.current.style.setProperty('--modal-accent-bg', `rgb(${dr}, ${dg}, ${db})`)
          modalRef.current.style.setProperty('--modal-accent', `rgb(${r}, ${g}, ${b})`)
          modalRef.current.style.setProperty('--modal-accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`)
          modalRef.current.style.setProperty('--modal-accent-text', '#fff')
          modalRef.current.style.setProperty('--modal-border', 'rgba(255, 255, 255, 0.15)')
        }
      }
    } catch (e) {
      console.warn('Could not extract color:', e)
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
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        
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
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="header-nav-btn"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === projects.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            
            {/* Mobile: Share + Close on top right */}
            <div className="mobile-top-actions">
              <button onClick={handleShare} className="mobile-top-btn">
                <i className="fas fa-share-nodes"></i>
              </button>
              <button className="modal-close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Desktop: Just close */}
            <button className="modal-close desktop-only" onClick={onClose}>
              <i className="fas fa-times"></i>
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
              className="modal-image"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
            />
            <div className="modal-image-overlay"></div>
          </div>

          {/* Project Info */}
          <div className="modal-body">
            <div className="modal-title-section">
              <h2 className="modal-title">{project.title}</h2>
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

        {/* MOBILE: Fixed Bottom Nav - ◄ | Visit(50%) GH Share | ► */}
        <div className="modal-mobile-nav">
          <button 
            className="mobile-nav-arrow"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="mobile-nav-actions">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-btn-visit"
            >
              <span>Visit Site</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
            
            {hasGithub && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-btn-icon"
              >
                <i className="fab fa-github"></i>
              </a>
            )}
          </div>
          
          <button 
            className="mobile-nav-arrow"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={currentIndex === projects.length - 1}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
