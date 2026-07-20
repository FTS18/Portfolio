import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import ProjectCard from './ProjectCard'
const ProjectModal = lazy(() => import('./ProjectModal'))
import FilterBar from './FilterBar'
import { useAllProjectViews } from '../../hooks/useFirebase'
import { getProjectsCache, getProjectsPromise } from '../../App'
import StructuredData from '../common/StructuredData'
import './ProjectsSection.css'

function ProjectsSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const controlsRef = useRef(null)
  const gridRef = useRef(null)

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null)
  const projectViews = useAllProjectViews()
  const [stats, setStats] = useState({
    total: 0,
    technologies: 0,
    totalViews: 0,
    featured: 0,
    growth: 0
  })

  useEffect(() => {
    // Try to use cached data first
    const cachedData = getProjectsCache()
    if (cachedData) {
      processProjectsData(cachedData)
    } else {
      // If not cached yet, wait for the promise
      const promise = getProjectsPromise()
      if (promise) {
        promise.then(data => processProjectsData(data))
      } else {
        // Fallback: fetch directly (shouldn't happen normally)
        fetch('/assets/projects.json?v=1.5.0')
          .then(response => response.json())
          .then(data => processProjectsData(data))
          .catch(error => console.error('Error fetching projects:', error))
      }
    }
  }, [])

  const processProjectsData = (rawData) => {
    // Filter out hidden projects (commented out in JSON via _title or hidden: true)
    const data = rawData.filter(p => !p.hidden && !p.title?.startsWith('_'))

    setProjects(data)
    setFilteredProjects(data)
    
    // Calculate stats
    const uniqueTechs = new Set()
    const currentYear = new Date().getFullYear().toString()
    const projectsThisYear = data.filter(p => p.date && p.date.includes(currentYear)).length
    
    data.forEach(project => {
      project.tags?.forEach(tag => uniqueTechs.add(tag))
    })
    
    setStats({
      total: data.length,
      technologies: uniqueTechs.size,
      totalViews: 0,
      featured: data.filter(p => p.featured).length,
      growth: projectsThisYear || Math.floor(data.length * 0.3)
    })
    
    const techStackTags = ['React', 'TypeScript', 'Tailwind', 'AI', 'NLP', 'FastAPI', 'Python', 'Langchain', 'ML', 'Next.js', 'SSR', 'MongoDB', 'Firebase', 'HTML', 'CSS', 'Javascript', 'WebRTC', 'MySQL', 'Fest', 'TechFest', 'YouthZest', 'PEC Fest', 'Chrome Extension', 'GraphQL']
    let tags = []
    data.forEach(project => {
      tags = tags.concat(project.tags)
    })
    const filteredTags = [...new Set(tags.filter(tag => techStackTags.includes(tag)))]
    setAllTags(filteredTags)
  }

  useEffect(() => {
    let filtered = projects

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag =>
          project.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
      )
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      } else if (sortBy === 'name') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'views') {
        // Sort by actual Firebase views
        const getViews = (project) => {
          const projectId = project.title.replace(/\s/g, '')
          return projectViews[projectId] || 0
        }
        return getViews(b) - getViews(a)
      }
      return 0
    })

    // If there are existing cards in the grid, animate them out before updating state
    if (gridRef.current && filteredProjects.length > 0) {
      const cards = gridRef.current.querySelectorAll('.column')
      if (cards.length > 0) {
        gsap.to(cards, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.3,
          stagger: 0.02,
          ease: 'power2.in',
          onComplete: () => setFilteredProjects(filtered)
        })
        return
      }
    }

    setFilteredProjects(filtered)
  }, [selectedTags, projects, searchQuery, sortBy, projectViews])

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Handle opening project modal
  const handleOpenModal = (projectIndex) => {
    setSelectedProjectIndex(projectIndex)
  }

  // Handle modal navigation
  const handleModalNavigate = (newIndex) => {
    if (newIndex >= 0 && newIndex < filteredProjects.length) {
      setSelectedProjectIndex(newIndex)
    }
  }

  // GSAP Entrance Animations (run immediately on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      )

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            onComplete: () => {
              if (statsRef.current) statsRef.current.classList.add('ready')
            },
            onStart: function() {
              // Number counter animation
              const statValues = statsRef.current.querySelectorAll('.stat-value')
              statValues.forEach(el => {
                const target = parseInt(el.innerText, 10)
                if (!isNaN(target)) {
                  const counter = { val: 0 }
                  gsap.to(counter, {
                    val: target,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                      el.innerText = Math.round(counter.val)
                    }
                  })
                }
              })
            }
          }
        )
      }

      if (controlsRef.current) {
        gsap.fromTo(
          controlsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: controlsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            onComplete: () => {
              if (controlsRef.current) controlsRef.current.classList.add('ready')
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Project cards brick-by-brick animation
  useEffect(() => {
    if (!gridRef.current || filteredProjects.length === 0) return

    const cards = gridRef.current.querySelectorAll('.column')
    if (!cards.length) return

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(cards, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        rotateX: 10,
      })

      // Animate cards on scroll
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        ease: 'back.out(1.4)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      })
    }, gridRef)

    return () => ctx.revert()
  }, [filteredProjects])

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <StructuredData type="ItemList" data={{ items: projects.slice(0, 10) }} />
      <div className="projects-header" ref={headerRef}>
        <h2 className="projects-title"><span className="fraunces-italic">Projects</span></h2>
        <p className="projects-subtitle">A collection of my work</p>
      </div>

      {/* Stats Cards */}
      <div className="projects-stats" ref={statsRef}>
        <div className="stat-card stat-card-1">
          <div className="stat-number">01</div>
          <div className="stat-icon">
            <i className="fa-solid fa-folder"></i>
          </div>
          <div className="stat-title">Total Projects</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-desc">Built with passion</div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-number">02</div>
          <div className="stat-icon">
            <i className="fa-solid fa-code"></i>
          </div>
          <div className="stat-title">Technologies</div>
          <div className="stat-value">{stats.technologies}</div>
          <div className="stat-desc">Tools & frameworks</div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-number">03</div>
          <div className="stat-icon">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="stat-title">Featured</div>
          <div className="stat-value">{stats.featured}</div>
          <div className="stat-desc">Highlighted work</div>
        </div>

        <div className="stat-card stat-card-4">
          <div className="stat-number">04</div>
          <div className="stat-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="stat-title">Growth</div>
          <div className="stat-value">+{stats.growth}</div>
          <div className="stat-desc">Projects this year</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="projects-controls" ref={controlsRef}>
        <div className="search-wrapper">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search projects by title, description or tag"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
          aria-label="Sort projects by date, name or views"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="views">Sort by Views</option>
        </select>
      </div>

      <FilterBar
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />

      <div className="project-div" id="project-grid" ref={gridRef}>
        <div className="row" id="project-row">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              onOpenModal={() => handleOpenModal(index)}
              priority={index < 4}
            />
          ))}
        </div>
      </div>

      {selectedProjectIndex !== null && (
        <Suspense fallback={null}>
          <ProjectModal
            project={filteredProjects[selectedProjectIndex]}
            projects={filteredProjects}
            currentIndex={selectedProjectIndex}
            onClose={() => setSelectedProjectIndex(null)}
            onNavigate={handleModalNavigate}
          />
        </Suspense>
      )}
    </section>
  )
}

export default ProjectsSection
