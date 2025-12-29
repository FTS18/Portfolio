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
    { label: 'GitHub', url: 'https://github.com/FTS18' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/ananaydubey' },
    { label: 'YouTube', url: 'https://youtube.com/@spacify18' },
    { label: 'Instagram', url: 'https://instagram.com/ananay_dubey' },
    { label: 'Twitter', url: 'https://twitter.com/ananaydubey' },
  ]

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-left">
            <div className="footer-logo">
              <span className="logo-first">ANANAY</span>
              <span className="logo-second">Dubey</span>
            </div>
            <p className="footer-tagline">
              FULL-STACK DEVELOPER • REACT SPECIALIST<br/>
              BUILDING DIGITAL EXPERIENCES THAT MATTER
            </p>
          </div>

          <div className="footer-right">
            <div className="footer-info">
              <div className="info-item">
                <span className="label">Location:</span>
                <span className="value">INDIA</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value">AVAILABLE FOR WORK</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">DUBEYANANAY@GMAIL.COM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-socials">
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-left-bottom">
            <p className="footer-copyright">
              © {currentYear} ANANAY DUBEY. ALL RIGHTS RESERVED.
            </p>
            <p className="footer-tech">
              BUILT WITH REACT + VITE • HOSTED ON NETLIFY
            </p>
          </div>

          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-value">{views}</span>
              <span className="stat-label">VIEWS</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{lastUpdate}</span>
              <span className="stat-label">LAST UPDATED</span>
            </div>
            <div className="footer-theme-toggle">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
