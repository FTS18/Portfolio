import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const ProjectModal = lazy(() => import('../Projects/ProjectModal'))
import './ExperienceSection.css'

gsap.registerPlugin(ScrollTrigger)

const isColorLight = (hexColor) => {
  if (!hexColor) return false
  const hex = hexColor.replace('#', '')
  if (hex.length < 6) return false
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 140
}

function ExperienceSection() {
  const [activeTab, setActiveTab] = useState('hackathons')
  const [showAll, setShowAll] = useState({
    hackathons: false,
    achievements: false
  })
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null)
  const [theme, setTheme] = useState('dark')
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const tabsRef = useRef(null)
  const contentRef = useRef(null)

  // Track theme changes dynamically
  useEffect(() => {
    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(getTheme())

    const observer = new MutationObserver(() => {
      setTheme(getTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  // Load projects.json
  useEffect(() => {
    fetch('/assets/projects.json?v=1.5.0')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error loading projects:', error))
  }, [])

  const hackathons = [
    {
      id: 9,
      title: "Bharatiya Antariksh Hackathon 2026",
      organization: 'ISRO & Hack2Skill',
      date: 'Jun, 2026',
      achievement: 'Result Awaited',
      description: "Developing Mirr—an India Climate Digital Twin platform for ISRO Problem Statement 5. Assimilates INSAT-3D/3DR geostationary satellite imagery and ground observations (IMD) to generate 2D spatiotemporal climate forecasts using a hybrid 5-layer pipeline (PyTorch ConvLSTM, NOAA CPC analogs, and Mean Bias Correction). Includes a conversational RAG copilot grounded on ICAR-CRIDA district contingency plans.",
      tags: ['Python', 'PyTorch', 'Streamlit', 'FastAPI', 'GIS', 'RAG'],
      image: '/assets/images/screenshots/isro.webp',
      link: 'https://github.com/Shikharyadav25/ISRO--Climate-Visuals',
      github: 'https://github.com/Shikharyadav25/ISRO--Climate-Visuals',
      color: '#ff6f00', // ISRO Orange
      textColor: 'light'
    },
    {
      id: 7,
      title: "SESI Energy Summit Case-Based Hackathon '26",
      organization: 'Punjab Engineering College',
      date: 'Apr, 2026',
      achievement: '1st Place - ₹2,500',
      description: "Pitched Arasaka—a smart campus sustainability blueprint reducing Phantom Waste. Balanced Triple Bottom Line (People, Planet, Profit) using occupancy data, solar parking canopies, EV optimization, and circular credit loops.",
      tags: ['Ideation', 'Systems Thinking', 'Next.js', 'Firebase', 'IoT', 'CleanTech'],
      image: '/assets/images/pec.png',
      link: 'https://arasaka-sesi.netlify.app/',
      github: 'https://github.com/FTS18/SESI-26',
      color: '#00ff88', // Green
      textColor: 'dark'
    },
    {
      id: 8,
      title: "Synapse.AI DTU Hackathon",
      organization: 'Delhi Technological University',
      date: 'Mar, 2026',
      achievement: 'Top 6 Finalist',
      description: "Pitched and built Matcha-AI—an AI-powered sports video analysis and automated broadcasting platform. Combines computer vision (YOLOv8 + ByteTrack) with Google Gemini LLMs and Kokoro TTS to generate tactical heatmaps, track peak ball speeds, and produce high-quality audio commentary.",
      tags: ['Next.js', 'NestJS', 'FastAPI', 'YOLOv8', 'Gemini AI', 'TTS', 'Computer Vision'],
      image: '/assets/images/dtu.png',
      link: 'https://github.com/FTS18/Matcha-AI-DTU',
      github: 'https://github.com/FTS18/Matcha-AI-DTU',
      color: '#1b4d3e' // Matcha Green
    },
    {
      id: 1,
      title: 'Ideathon 5.0',
      organization: 'Punjab Engineering College',
      date: 'Feb, 2026',
      achievement: 'Special Mention',
      description: 'Built OmniFlow - Universal College ERP Platform designed to streamline institutional operations and enhance academic management',
      tags: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS', 'Redux', 'ERP'],
      image: '/assets/images/pec.png',
      link: 'https://omnifloww.netlify.app/',
      github: 'https://github.com/FTS18/omnifow',
      color: '#FFA500', // Orange
      textColor: 'dark'
    },
    {
      id: 2,
      title: 'Thapar AI Summit Hackathon',
      organization: 'Thapar Institute of Engineering & Technology',
      date: 'Jan, 2026',
      achievement: '2nd Place - ₹25,000',
      description: 'Built Gramin Saathi - AI-powered rural financial literacy platform helping farmers access government schemes and weather data',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Gemini AI', 'Firebase', 'AI', 'NLP', 'PWA'],
      image: '/assets/images/thapar.png',
      link: 'https://graminsaathi.netlify.app',
      github: 'https://github.com/FTS18/gramin-saathi',
      color: '#DC2626' // Red
    },
    {
      id: 3,
      title: 'EY Techathon 6.0',
      organization: 'Ernst & Young',
      date: 'Dec, 2025',
      achievement: 'Round 2',
      description: 'Built Project Orion - Advanced AI agent system for automated loan processing using LangGraph and multi-agent workflows',
      tags: ['React', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'LangChain', 'Gemini AI', 'AI', 'NLP'],
      image: '/assets/images/ey.png',
      link: 'https://porion.netlify.app',
      github: 'https://github.com/FTS18/project-orion',
      color: '#868686ff' // Grey
    },
    {
      id: 5,
      title: 'Smart India Hackathon 2025',
      organization: 'Government of India',
      date: 'Nov, 2025',
      achievement: 'Round 2',
      description: 'Built Saksham AI - An EdTech platform with AI-powered internship finder using NLP for matching students with relevant opportunities',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Gemini AI', 'NLP', 'AI'],
      image: '/assets/images/sih.png',
      link: 'https://hexaforces.netlify.app',
      github: 'https://github.com/FTS18/saksham-pathfinder',
      color: '#6366F1' // Indigo
    },
    {
      id: 4,
      title: 'PECathon',
      organization: 'Punjab Engineering College',
      date: 'Oct, 2025',
      description: 'Built Conduit - A comprehensive full-stack blogging platform with bookmarking, user mentions, notifications, and real-time interactions',
      tags: ['React', 'Redux', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
      image: '/assets/images/pec.png',
      link: 'https://pecathon.vercel.app',
      github: 'https://github.com/FTS18/conduit_frontend',
      githubBackend: 'https://github.com/FTS18/conduit_backend',
      color: '#FBBF24', // Yellow
      textColor: 'dark'
    },
    {
      id: 6,
      title: 'TechnoFair & YouthZest 23',
      organization: 'Interschool Tech Fests',
      date: 'Aug 2023 - Oct 2023',
      achievement: '3 Golds',
      description: 'Led web development team across 2 interschool tech fests. Won a total of 3 gold medals in the second event',
      tags: ['Leadership', 'Front-End Development', 'HTML', 'Node.js', 'Web Design'],
      image: '/assets/images/yz.png',
      color: '#48ec56ff', // Pink/Green
      textColor: 'dark'
    }
  ]

  const certifications = [
    // Add certifications here
  ]

  const achievements = [
    {
      id: 1,
      title: 'Frontend Web Developer',
      organization: "PECFEST'25",
      date: 'Oct 2025 - Nov 2025',
      description: 'Part-time role developing and maintaining the official PECFEST website and web applications',
      tags: ['React', 'Frontend', 'Web Development'],
      image: '/assets/images/pecfest.png'
    },
    {
      id: 2,
      title: 'Web Development Team Lead',
      organization: 'TechnoFair & YouthZest 23',
      date: 'Aug 2023 - Oct 2023',
      achievement: '3 Gold Medals',
      description: 'Led web development team across 2 interschool tech fests. Won a total of 3 gold medals in the second event',
      tags: ['Leadership', 'Front-End Development', 'HTML', 'Node.js', 'Web Design'],
      image: '/assets/images/yz.png'
    },
    {
      id: 3,
      title: 'Contributor',
      organization: 'Hacktoberfest',
      date: 'Oct 2021',
      description: 'Participated in the global open-source contribution event. Won swags and certificate of accomplishment',
      tags: ['Open Source', 'Git', 'Collaboration'],
      image: '/assets/images/hf.png'
    }
  ]

  const data = {
    hackathons,
    achievements
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )

      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tabsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      const items = contentRef.current.querySelectorAll('.exp-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )
    }
  }, [activeTab])

  // Scroll-based cascading animation
  useEffect(() => {
    if (!contentRef.current) return
    
    const items = contentRef.current.querySelectorAll('.exp-item')
    const totalItems = data[activeTab].length
    
    // Only apply cascading if showing exactly 3 items (not expanded, and has more than 3 total)
    const shouldCascade = !showAll[activeTab] && totalItems > 3 && items.length === 3

    const handleScroll = () => {
      items.forEach((item) => {
        if (shouldCascade) {
          const rect = item.getBoundingClientRect()
          const itemCenter = rect.top + rect.height / 2
          const viewportCenter = window.innerHeight / 2
          const distanceFromCenter = Math.abs(itemCenter - viewportCenter)
          
          // Calculate width based on distance from center
          const maxWidth = 100
          const minWidth = 80
          const step = 5
          const widthReduction = Math.min(distanceFromCenter / 200, 4) * step
          const targetWidth = Math.max(minWidth, maxWidth - widthReduction)
          
          item.style.width = `${targetWidth}%`
          item.style.transition = 'width 0.3s ease-out'
        } else {
          // Reset to full width when not cascading
          item.style.width = '100%'
          item.style.transition = 'width 0.3s ease-out'
        }
      })
    }

    // Initial call
    handleScroll()

    // Add scroll listener only if cascading
    if (shouldCascade) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [activeTab, showAll, data])

  const handleItemClick = (item) => {
    // Map hackathon descriptions to project titles in projects.json
    const projectTitleMap = {
      'Mirr': 'Mirr',
      'Arasaka': 'Arasaka Energy OS',
      'Matcha': 'Matcha-AI',
      'Saksham AI': 'Saksham AI',
      'Project Orion': 'Project Orion',
      'OmniFlow': 'OmniFlow',
      'Gramin Saathi': 'Gramin Saathi',
      'Conduit': 'Conduit',
      "L'Amigo": "L'Amigo"
    }

    // Extract project name from description
    let projectTitle = null
    for (const [key, value] of Object.entries(projectTitleMap)) {
      if (item.description && item.description.includes(key)) {
        projectTitle = value
        break
      }
    }

    if (projectTitle && projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.title === projectTitle)
      if (projectIndex !== -1) {
        setSelectedProject(projects[projectIndex])
        setSelectedProjectIndex(projectIndex)
        return
      }
    }

    // Fallback: If no project modal to open, check for direct links
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer')
    } else if (item.github) {
      window.open(item.github, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
    setSelectedProjectIndex(null)
  }

  const handleNavigateModal = (newIndex) => {
    if (newIndex >= 0 && newIndex < projects.length) {
      setSelectedProject(projects[newIndex])
      setSelectedProjectIndex(newIndex)
    }
  }

  return (
    <section className="experience" id="experience" ref={sectionRef}>
      <div className="experience-header" ref={headerRef}>
        <h2 className="experience-title"><span className="fraunces-italic">Experience</span></h2>
        <p className="experience-subtitle">Hackathons, Work Experience & Contributions</p>
      </div>

      <div className="experience-tabs" ref={tabsRef}>
        <button
          className={`exp-tab ${activeTab === 'hackathons' ? 'active' : ''}`}
          onClick={() => setActiveTab('hackathons')}
        >
          <i className="fa-solid fa-code"></i>
          <span>Hackathons</span>
        </button>
        <button
          className={`exp-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <i className="fa-solid fa-briefcase"></i>
          <span>Experience</span>
        </button>
      </div>

      <div className="experience-content" ref={contentRef}>
        {(showAll[activeTab] ? data[activeTab] : data[activeTab].slice(0, 3)).map((item) => {
          const isBw = theme === 'bw'
          const hasCustomBg = activeTab === 'hackathons' && item.color && !isBw
          const isLight = hasCustomBg && isColorLight(item.color)

          return (
            <div 
              key={item.id} 
              className={`exp-item ${isLight ? 'light-bg' : ''}`}
              style={hasCustomBg ? { backgroundColor: item.color, borderColor: item.color, cursor: 'pointer' } : { cursor: 'pointer' }}
              onClick={() => handleItemClick(item)}
            >
            <div className="exp-icon">
              {item.image ? (
                <img src={item.image} alt={item.organization} className="exp-logo" loading="lazy" />
              ) : (
                <i className={`fa-solid ${item.icon}`}></i>
              )}
            </div>
            <div className="exp-details">
              <div className="exp-header-row">
                <h3 className="exp-title">{item.title}</h3>
                {item.achievement && (
                  <span className="exp-badge">{item.achievement}</span>
                )}
              </div>
              <div className="exp-meta">
                <span className="exp-org">
                  <i className="fa-solid fa-building"></i>
                  {item.organization}
                </span>
                <span className="exp-date">
                  <i className="fa-solid fa-calendar"></i>
                  {item.date}
                </span>
              </div>
              <p className="exp-description">{item.description}</p>
              {item.tags && (
                <div className="exp-tags">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="exp-tag">{tag}</span>
                  ))}
                </div>
              )}
              {(item.link || item.github || item.linkedin || item.githubBackend) && (
                <div className="exp-links">
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="exp-link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      View Project
                    </a>
                  )}
                  {item.linkedin && (
                    <a 
                      href={item.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="exp-link-btn exp-link-linkedin"
                      style={{ backgroundColor: '#0a66c2', color: '#ffffff' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-brands fa-linkedin"></i>
                      LinkedIn Post
                    </a>
                  )}
                  {item.github && (
                    <a 
                      href={item.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="exp-link-btn exp-link-github"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-brands fa-github"></i>
                      {item.githubBackend ? 'Frontend' : 'GitHub'}
                    </a>
                  )}
                  {item.githubBackend && (
                    <a 
                      href={item.githubBackend} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="exp-link-btn exp-link-github"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-brands fa-github"></i>
                      Backend
                    </a>
                  )}
                </div>
              )}
              {item.credential && (
                <div className="exp-credential">
                  <i className="fa-solid fa-link"></i>
                  Credential ID: {item.credential}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>

      {data[activeTab].length > 3 && (
        <div className="exp-view-all-container">
          <button 
            className="exp-view-all-btn"
            onClick={() => setShowAll(prev => ({ ...prev, [activeTab]: !prev[activeTab] }))}
          >
            {showAll[activeTab] ? (
              <>
                <i className="fa-solid fa-chevron-up"></i>
                Show Less
              </>
            ) : (
              <>
                View All ({data[activeTab].length})
                <i className="fa-solid fa-chevron-down"></i>
              </>
            )}
          </button>
        </div>
      )}

      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectModal
            project={selectedProject}
            projects={projects}
            currentIndex={selectedProjectIndex}
            onClose={handleCloseModal}
            onNavigate={handleNavigateModal}
          />
        </Suspense>
      )}
    </section>
  )
}

export default ExperienceSection
