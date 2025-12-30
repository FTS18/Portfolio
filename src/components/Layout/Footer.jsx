import { useState, useEffect } from 'react'
import { usePageViews } from '../../hooks/useFirebase'
import ThemeToggle from '../common/ThemeToggle'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  const views = usePageViews()
  const [lastUpdate, setLastUpdate] = useState('Loading...')

  // Fetch last commit date from GitHub
  useEffect(() => {
    fetch('https://api.github.com/repos/FTS18/Portfolio/commits/main')
      .then(res => res.json())
      .then(data => {
        if (data.commit && data.commit.author && data.commit.author.date) {
          const date = new Date(data.commit.author.date)
          const options = { month: 'short', day: 'numeric', year: 'numeric' }
          setLastUpdate(date.toLocaleDateString('en-US', options))
        }
      })
      .catch(() => setLastUpdate('Recently'))
  }, [])

  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/FTS18', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/ananaydubey', icon: 'linkedin' },
    { label: 'YouTube', url: 'https://youtube.com/@spacify18', icon: 'youtube' },
    { label: 'Instagram', url: 'https://instagram.com/ananay_dubey', icon: 'instagram' },
    { label: 'Twitter', url: 'https://twitter.com/ananaydubey', icon: 'twitter' },
  ]

  const navLinks = [
    { label: 'HOME', url: '/#top' },
    { label: 'PROJECTS', url: '/#project-grid' },
    { label: 'ABOUT', url: '/#about' },
    { label: 'SKILLS', url: '/#skills' },
    { label: 'CONTACT', url: '/#contact' },
  ]

  return (
    <footer>
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-first">ANANAY</span>
            <span className="logo-second">Dubey</span>
          </div>
          <p className="footer-tagline">
            Full-Stack Developer & React Specialist building digital experiences that matter.
          </p>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <a href="mailto:dubeyananay@gmail.com" className="contact-item contact-link">
            <i className="fas fa-envelope"></i>
            <span>dubeyananay@gmail.com</span>
          </a>
          <a href="tel:+919580711960" className="contact-item contact-link">
            <i className="fas fa-phone"></i>
            <span>+91 9580711960</span>
          </a>
          <div className="footer-socials-row">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <i className={`fab fa-${link.icon}`}></i>
              </a>
            ))}
          </div>
          <a 
            href="/assets/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="resume-btn"
          >
            <i className="fas fa-file-alt"></i>
            RESUME
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          {navLinks.map((link, index) => (
            <a key={index} href={link.url} className="footer-nav-link">
              <span>{link.label}</span>
              <i className="fas fa-chevron-down"></i>
            </a>
          ))}
        </nav>

        {/* Stats Row */}
        <div className="footer-stats-row">
          <div className="stat-pill">
            <span className="stat-value">{views}</span>
            <span className="stat-label">views</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{lastUpdate}</span>
            <span className="stat-label">updated</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} ANANAY DUBEY
          </p>
          <p className="footer-tech">
            Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

