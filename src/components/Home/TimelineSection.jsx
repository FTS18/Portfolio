import { useEffect, useRef, useState } from 'react'
import './TimelineSection.css'

function TimelineSection() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const timelineData = [
    {
      year: '2021',
      month: 'January',
      title: 'First Website',
      description: 'Created first website, discovered web development passion',
      icon: '🌐',
      color: '#00D9FF',
      gradient: 'linear-gradient(135deg, #00D9FF 0%, #00FFB2 100%)'
    },
    {
      year: '2021',
      month: 'October',
      title: 'Open Source',
      description: 'Contributed to Hacktoberfest & open source projects',
      icon: '🎯',
      tags: ['Git', 'GitHub', 'JavaScript'],
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'
    },
    {
      year: '2023',
      month: 'March',
      title: 'Team Lead',
      description: 'Led web development for TechnoFair & YouthZest, won 3 gold medals',
      icon: '🏆',
      tags: ['JavaScript', 'Node.js', 'CSS'],
      color: '#A855F7',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'
    },
    {
      year: '2024',
      month: 'August',
      title: 'B.Tech VLSI',
      description: 'Pursuing Bachelor of Technology in VLSI Design at PEC Chandigarh',
      icon: '🎓',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
    },
    {
      year: '2025',
      month: 'January',
      title: 'Saksham AI',
      description: 'Led AI internship platform for Smart India Hackathon',
      icon: '🤖',
      tags: ['React', 'Node.js', 'Firebase', 'NLP'],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    {
      year: '2025',
      month: 'February',
      title: 'PECFEST',
      description: 'Built official festival website with Next.js & TypeScript',
      icon: '🚀',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return

      const section = sectionRef.current
      const container = containerRef.current
      const sectionRect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const viewportHeight = window.innerHeight

      const scrollStart = -sectionRect.top
      const scrollEnd = sectionHeight - viewportHeight
      const rawProgress = scrollStart / scrollEnd
      const progress = Math.max(0, Math.min(1, rawProgress * 1.5))

      setScrollProgress(Math.min(rawProgress, 1))

      const maxScroll = container.scrollWidth - container.offsetWidth
      container.scrollLeft = progress * maxScroll
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="timeline-section" ref={sectionRef}>
      <div className="timeline-sticky-wrapper">
        {/* Animated background elements */}
        <div className="timeline-bg-elements">
          <div className="timeline-bg-circle circle-1"></div>
          <div className="timeline-bg-circle circle-2"></div>
          <div className="timeline-bg-circle circle-3"></div>
        </div>

        <div className="timeline-header">
          <span className="timeline-label">MY JOURNEY</span>
          <h2 className="timeline-title">
            <span className="title-gradient">Timeline</span>
          </h2>
          <p className="timeline-subtitle">From first line of code to building impactful projects</p>
        </div>

        <div className="timeline-scroll-container" ref={containerRef}>
          <div className="timeline-horizontal-content">
            {/* Timeline track */}
            <div className="timeline-track">
              <div 
                className="timeline-track-fill" 
                style={{ width: `${scrollProgress * 100}%` }}
              ></div>
            </div>

            {/* Events */}
            <div className="timeline-events">
              {timelineData.map((item, index) => (
                <div key={index} className="timeline-event-group">
                  {/* Connection dot */}
                  <div 
                    className="timeline-dot"
                    style={{ 
                      background: item.gradient,
                      boxShadow: `0 0 20px ${item.color}80`
                    }}
                  >
                    <span className="dot-year">{item.year}</span>
                  </div>

                  {/* Event card */}
                  <div 
                    className="timeline-event-card"
                    style={{ '--accent-color': item.color, '--accent-gradient': item.gradient }}
                  >
                    <div className="card-glow"></div>
                    
                    <div className="card-header">
                      <div className="event-icon" style={{ background: item.gradient }}>
                        {item.icon}
                      </div>
                      <div className="event-date">
                        <span className="event-month">{item.month}</span>
                        <span className="event-year">{item.year}</span>
                      </div>
                    </div>

                    <h3 className="event-title">{item.title}</h3>
                    <p className="event-description">{item.description}</p>
                    
                    {item.tags && (
                      <div className="event-tags">
                        {item.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="event-tag"
                            style={{ borderColor: item.color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="card-accent" style={{ background: item.gradient }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="timeline-progress">
          <div className="progress-text">
            <span>Scroll to explore</span>
            <span className="progress-percentage">{Math.round(scrollProgress * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(90deg, #00D9FF, #A855F7, #FF6B6B)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection