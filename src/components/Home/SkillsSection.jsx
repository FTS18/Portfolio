import { useState, useEffect, useMemo } from 'react'
import './SkillsSection.css'

function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const section = document.querySelector('.skills-section-marquee')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const skillRows = useMemo(() => [
    [
      { name: 'React', icon: 'react/61DAFB' },
      { name: 'Next.js', icon: 'nextdotjs/000000' },
      { name: 'TypeScript', icon: 'typescript/3178C6' },
      { name: 'JavaScript', icon: 'javascript/F7DF1E' },
      { name: 'HTML5', icon: 'html5/E34F26' },
      { name: 'CSS3', icon: 'css3/1572B6' },
      { name: 'TailwindCSS', icon: 'tailwindcss/06B6D4' },
      { name: 'Bootstrap', icon: 'bootstrap/7952B3' },
      { name: 'Vite', icon: 'vite/646CFF' },
      { name: 'Framer Motion', icon: 'framer/FF0066' }
    ],
    [
      { name: 'Node.js', icon: 'nodedotjs/339933' },
      { name: 'Python', icon: 'python/3776AB' },
      { name: 'FastAPI', icon: 'fastapi/009688' },
      { name: 'Express', icon: 'express/ffffff' },
      { name: 'MongoDB', icon: 'mongodb/47A248' },
      { name: 'MySQL', icon: 'mysql/4479A1' },
      { name: 'Firebase', icon: 'firebase/FFCA28' },
      { name: 'Prisma', icon: 'prisma/2D3748' },
      { name: 'Socket.io', icon: 'socketdotio/010101' },
      { name: 'WebRTC', icon: 'webrtc/333333' }
    ],
    [
      { name: 'OpenAI', icon: 'openai/00A67E' },
      { name: 'Google Gemini', icon: 'googlegemini/8E75B2' },
      { name: 'LangChain', icon: 'langchain/1C3C3C' },
      { name: 'LangGraph', icon: 'langchain/1C3C3C' },
      { name: 'Chart.js', icon: 'chartdotjs/FF6384' },
      { name: 'GSAP', icon: 'greensock/88CE02' },
      { name: 'jQuery', icon: 'jquery/0769AD' },
      { name: 'Git', icon: 'git/F05032' },
      { name: 'GitHub', icon: 'github/181717' },
      { name: 'Netlify', icon: 'netlify/00C7B7' }
    ]
  ], [])

  return (
    <section className="skills-section-marquee">
      <div className="skills-marquee-container">
        <div className="skills-marquee-header">
          <h2 className="skills-marquee-title">
            <span className="brutalist-symbol symbol-square" />
            <span className="fraunces-italic">Tech</span> Stack
          </h2>
          <p className="skills-marquee-subtitle">Tools & technologies powering this portfolio</p>
        </div>

        <div className="skills-marquee-rows">
          {skillRows.map((row, rowIndex) => (
            <div key={rowIndex} className="skills-marquee-row">
              <div 
                className={`skills-marquee-track ${
                  reducedMotion ? '' : 
                  rowIndex === 1 ? 'reverse' : 
                  rowIndex === 2 ? 'slow' : ''
                }`}
                style={{
                  animationPlayState: isVisible && !reducedMotion ? 'running' : 'paused'
                }}
              >
                {/* Only double for better performance */}
                {[...row, ...row].map((skill, index) => (
                  <div key={`${skill.name}-${index}`} className="skill-marquee-badge">
                    <img 
                      src={`https://cdn.simpleicons.org/${skill.icon}`} 
                      alt={skill.name}
                      className="skill-marquee-icon"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="skill-marquee-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
