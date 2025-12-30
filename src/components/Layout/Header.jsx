import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/#projects?search=${encodeURIComponent(searchQuery)}`
      setShowSearch(false)
    }
  }

  return (
    <div className="header-wrapper">
      <nav className="header-nav">
        <label 
          htmlFor="show-menu" 
          className="menu-icon"
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? "Close navigation menu" : "Open navigation menu"}
        >
          <i className={showMenu ? "fas fa-times" : "fas fa-bars"}></i>
        </label>
        
        <div className="header-content">
          <div className="header-logo">
            <Link to="/">Ananay</Link>
          </div>
          
          <ul className={`header-links ${showMenu ? 'show' : ''}`}>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <a href="#" className="desktop-link">Explore</a>
              <label>Explore</label>
              <ul>
                <li><a href="https://finixx.netlify.app" target="_blank" rel="noopener noreferrer">Finixx</a></li>
                <li><a href="https://radioo.netlify.app" target="_blank" rel="noopener noreferrer">Musify</a></li>
                <li><a href="https://dynwave.onrender.com" target="_blank" rel="noopener noreferrer">DynWave</a></li>
              </ul>
            </li>
            <li>
              <a href="#" className="desktop-link">Connect</a>
              <label>Connect</label>
              <ul>
                <li><a href="mailto:dubeyananay@gmail.com?Subject=Feedback">Mail Us</a></li>
                <li><a href="https://wa.me/9580711960" target="_blank" rel="noopener noreferrer">Chat</a></li>
                <li>
                  <a href="#" className="desktop-link">Social</a>
                  <label>Social</label>
                  <ul>
                    <li><a href="https://youtube.com/c/spacify18" target="_blank" rel="noopener noreferrer">Youtube</a></li>
                    <li><a href="https://instagram.com/ananay_dubey" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><a href="https://github.com/FTS18/" target="_blank" rel="noopener noreferrer">Github</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="#feedback">Feedback</a></li>
            <li><Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link></li>
          </ul>
        </div>
        
        <label 
          htmlFor="show-search" 
          className="search-icon"
          onClick={() => setShowSearch(!showSearch)}
          aria-label={showSearch ? "Close search bar" : "Open search bar"}
        >
          <i className={showSearch ? "fas fa-times" : "fas fa-search"}></i>
        </label>
        
        <div className={`search-box ${showSearch ? 'show' : ''}`}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Type Something to Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
              aria-label="Search projects"
              title="Search projects"
            />
            <button type="submit" className="go-icon" aria-label="Search">
              <i className="fas fa-long-arrow-alt-right"></i>
            </button>
          </form>
        </div>
      </nav>
    </div>
  )
}

export default Header
