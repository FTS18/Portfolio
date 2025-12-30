import { useState, useEffect, useMemo } from 'react'
import './SkillsSection.css'

// Icon mapping for common technologies (SimpleIcons format: name/color)
const iconMap = {
  'React': 'react/61DAFB',
  'Next.js': 'nextdotjs/000000',
  'TypeScript': 'typescript/3178C6',
  'JavaScript': 'javascript/F7DF1E',
  'HTML5': 'html5/E34F26',
  'CSS3': 'css3/1572B6',
  'Tailwind CSS': 'tailwindcss/06B6D4',
  'Bootstrap': 'bootstrap/7952B3',
  'Vite': 'vite/646CFF',
  'Framer Motion': 'framer/FF0066',
  'Node.js': 'nodedotjs/339933',
  'Python': 'python/3776AB',
  'FastAPI': 'fastapi/009688',
  'Express.js': 'express/ffffff',
  'MongoDB': 'mongodb/47A248',
  'MySQL': 'mysql/4479A1',
  'Firebase': 'firebase/FFCA28',
  'Firestore': 'firebase/FFCA28',
  'Prisma': 'prisma/2D3748',
  'Socket.io': 'socketdotio/010101',
  'WebRTC': 'webrtc/333333',
  'Gemini AI': 'googlegemini/8E75B2',
  'LangChain': 'langchain/1C3C3C',
  'LangGraph': 'langchain/1C3C3C',
  'Chart.js': 'chartdotjs/FF6384',
  'jQuery': 'jquery/0769AD',
  'Git': 'git/F05032',
  'GitHub': 'github/181717',
  'GitHub Pages': 'github/181717',
  'Netlify': 'netlify/00C7B7',
  'REST API': 'postman/FF6C37',
  'PWA': 'pwa/5A0FC8',
  'i18n': 'i18next/26A69A',
  'Pydantic': 'pydantic/E92063',
  'NumPy': 'numpy/013243',
  'SQLite3': 'sqlite/003B57',
  'Web Audio API': 'webcomponentsdotorg/29ABE2',
  'Math.js': 'javascript/F7DF1E',
  'Peer.js': 'webrtc/333333',
  'SSR': 'nextdotjs/000000',
  'LocalStorage': 'javascript/F7DF1E',
  'YouTube API': 'youtube/FF0000',
  'JS Canvas': 'javascript/F7DF1E',
  'Blob': 'javascript/F7DF1E'
}

// Tags to filter out (non-tech tags)
const excludeTags = [
  'AI', 'NLP', 'Hackathon', 'Thapar', 'TIET', 'EY', 'SIH', 'PEC',
  'Multi-agent', 'Real-time', 'Responsive', 'Streaming', 'Graphing',
  'JEE', 'College Predictor', 'Game Dev', 'Animations', 'CRUD',
  'Database', 'CLI', 'SEO', 'Cart System', 'Filters', 'E-commerce',
  'Utility', 'Class 12', 'Class 10', 'Data Structures', 'File I/O'
]

function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [projectTechs, setProjectTechs] = useState([])

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

  // Fetch technologies from projects.json
  useEffect(() => {
    fetch('/assets/projects.json')
      .then(res => res.json())
      .then(projects => {
        // Extract all unique tags from projects
        const allTags = new Set()
        projects.forEach(project => {
          project.tags?.forEach(tag => {
            if (!excludeTags.includes(tag) && iconMap[tag]) {
              allTags.add(tag)
            }
          })
        })
        setProjectTechs(Array.from(allTags))
      })
      .catch(() => {
        // Fallback to default skills
        setProjectTechs([])
      })
  }, [])

  // Default skills as fallback
  const defaultSkillRows = useMemo(() => [
    [
      { name: 'React', icon: 'react/61DAFB' },
      { name: 'Next.js', icon: 'nextdotjs/000000' },
      { name: 'TypeScript', icon: 'typescript/3178C6' },
      { name: 'JavaScript', icon: 'javascript/F7DF1E' },
      { name: 'HTML5', icon: 'html5/E34F26' },
      { name: 'CSS3', icon: 'css3/1572B6' },
      { name: 'Tailwind CSS', icon: 'tailwindcss/06B6D4' },
      { name: 'Bootstrap', icon: 'bootstrap/7952B3' },
      { name: 'Vite', icon: 'vite/646CFF' },
      { name: 'Framer Motion', icon: 'framer/FF0066' }
    ],
    [
      { name: 'Node.js', icon: 'nodedotjs/339933' },
      { name: 'Python', icon: 'python/3776AB' },
      { name: 'FastAPI', icon: 'fastapi/009688' },
      { name: 'Express.js', icon: 'express/ffffff' },
      { name: 'MongoDB', icon: 'mongodb/47A248' },
      { name: 'MySQL', icon: 'mysql/4479A1' },
      { name: 'Firebase', icon: 'firebase/FFCA28' },
      { name: 'Prisma', icon: 'prisma/2D3748' },
      { name: 'Socket.io', icon: 'socketdotio/010101' },
      { name: 'WebRTC', icon: 'webrtc/333333' }
    ],
    [
      { name: 'Gemini AI', icon: 'googlegemini/8E75B2' },
      { name: 'LangChain', icon: 'langchain/1C3C3C' },
      { name: 'Chart.js', icon: 'chartdotjs/FF6384' },
      { name: 'jQuery', icon: 'jquery/0769AD' },
      { name: 'Git', icon: 'git/F05032' },
      { name: 'GitHub', icon: 'github/181717' },
      { name: 'Netlify', icon: 'netlify/00C7B7' },
      { name: 'REST API', icon: 'postman/FF6C37' },
      { name: 'PWA', icon: 'pwa/5A0FC8' }
    ]
  ], [])

  // Build skill rows from project techs or use default
  const skillRows = useMemo(() => {
    if (projectTechs.length === 0) return defaultSkillRows

    const skills = projectTechs.map(tech => ({
      name: tech,
      icon: iconMap[tech]
    })).filter(s => s.icon)

    // Split into 3 rows
    const rowSize = Math.ceil(skills.length / 3)
    return [
      skills.slice(0, rowSize),
      skills.slice(rowSize, rowSize * 2),
      skills.slice(rowSize * 2)
    ]
  }, [projectTechs, defaultSkillRows])

  return (
    <section className="skills-section-marquee" id="skills">
      <div className="skills-marquee-container">
        <div className="skills-marquee-header">
          <h2 className="skills-marquee-title">
            <span className="brutalist-symbol symbol-square" />
            <span className="fraunces-italic">Tech</span> Stack
          </h2>
          <p className="skills-marquee-subtitle">Technologies used across all my projects</p>
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
