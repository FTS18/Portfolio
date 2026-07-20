import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FilterBar.css'

function FilterBar({ tags, selectedTags, onTagToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && tags.length > 0) {
      const tagElements = containerRef.current.querySelectorAll('.radio-button')
      gsap.fromTo(
        tagElements,
        { opacity: 0, scale: 0.5, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          delay: 0.3 // wait for parent section to slide in
        }
      )
    }
  }, [tags])

  return (
    <div className="filter-wrapper" ref={containerRef}>
      {/* Mobile toggle button */}
      <button 
        className="filter-toggle-mobile"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Close' : 'Open'} technology filters`}
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
            aria-label={`Filter by ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
