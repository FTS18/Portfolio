import { usePageViews } from '../../hooks/useFirebase'
import './Footer.css'

function Footer() {
  const views = usePageViews()

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">Ananay Dubey</div>
        <p className="footer-tagline">
          Web Developer • React Specialist • Building modern web experiences with passion.
        </p>

        <div className="footer-socials">
          <a href="https://github.com/FTS18" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com/in/ananaydubey" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://youtube.com/@spacify18" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://instagram.com/ananay_dubey" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com/ananaydubey" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="mailto:dubeyananay@gmail.com" aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Ananay Dubey. All rights reserved.
          </p>
          <div className="footer-views">
            <i className="fas fa-eye"></i>
            <span>Total Views:</span>
            <strong>{views.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
