import React from 'react'
import './BottomMarquee.css'

function BottomMarquee() {
  const links = [
    { label: 'GitHub', url: 'https://github.com/FTS18' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/ananaydubey' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/ananaydubey' },
    { label: 'Codeforces', url: 'https://codeforces.com/profile/ananaydubey' },
    { label: 'YouTube', url: 'https://youtube.com/@spacify18' },
    { label: 'Twitter', url: 'https://twitter.com/ananaydubey' },
    { label: 'Instagram', url: 'https://instagram.com/ananay_dubey' },
    { label: 'Email', url: 'mailto:dubeyananay@gmail.com' },
    { label: 'Phone', url: 'tel:+917719767324' }
  ]

  // Repeat the links sequence to fill the width for seamless scrolling
  const marqueeItems = [...links, ...links, ...links, ...links]

  return (
    <div className="bottom-marquee-bar">
      <div className="bottom-marquee-track">
        <div className="bottom-marquee-content">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bottom-marquee-link"
              >
                {item.label}
              </a>
              <img 
                src="/assets/20x/Y2k shape (65).png" 
                alt="✦" 
                className="bottom-marquee-star-separator" 
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BottomMarquee
