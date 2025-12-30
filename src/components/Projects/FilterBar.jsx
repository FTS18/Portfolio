import { useState } from 'react'
import './FilterBar.css'

function FilterBar({ tags, selectedTags, onTagToggle }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="filter-wrapper">
      {/* Mobile toggle button */}
      <button 
        className="filter-toggle-mobile"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="filter-toggle-label">FILTER</span>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        {selectedTags.length > 0 && (
          <span className="filter-badge">{selectedTags.length}</span>
        )}
      </button>

      {/* Filter bar */}
      <div className={`projects-filter-bar ${isOpen ? 'open' : ''}`}>
        <div className="filter-label">FILTER:</div>
        {tags.map(tag => (
          <button
            key={tag}
            className={`radio-button ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => onTagToggle(tag)}
            aria-pressed={selectedTags.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
