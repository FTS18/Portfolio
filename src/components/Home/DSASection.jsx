import { useState, useEffect, useRef } from 'react'
import './DSASection.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DSASection = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      const CACHE_KEY = 'leetcode_stats'
      const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

      // 1. Try to load from cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStats(data)
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.warn('Cache read error', e)
      }

      // 2. Fetch fresh data
      try {
        const username = 'ananaydubey'
        const [solvedRes, profileRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}`)
        ])

        if (!solvedRes.ok || !profileRes.ok) {
           throw new Error(`API Error: ${solvedRes.status} / ${profileRes.status}`)
        }

        const solvedData = await solvedRes.json()
        const profileData = await profileRes.json()
        const newData = { solved: solvedData, profile: profileData }

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }))

        setStats(newData)
      } catch (err) {
        console.error('LeetCode fetch error:', err)
        
        // 3. Fallback: Try Cache (offline/rate limited but real data)
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          setStats(JSON.parse(cached).data)
          // Optional: You could show a small 'Offline' badge if you wanted
        } else {
             // Verification: User said "if not possible dont shw"
             // So we do NOT load dummy data. We leave stats as null.
             // This will cause the component to return null below.
             setStats(null) 
        }
        setError('Failed to load real data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeetCodeData()
  }, [])

  useEffect(() => {
    if (!loading && stats && sectionRef.current) {
      // Animate title
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )

      // Animate cards
      const cards = cardsRef.current.children
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          }
        }
      )
    }
  }, [loading, stats])

  if (loading) {
    return (
      <section className="dsa-section" ref={sectionRef}>
        <div className="dsa-loader">
          <div className="spinner"></div>
          <p>FETCHING LEETCODE DATA...</p>
        </div>
      </section>
    )
  }

  // If we have stats, show them even if there was an error (e.g. rate limit using cache)
  if (!stats) {
     return null 
  }

  const { solved, profile } = stats

  // Data mapping
  const totalSolved = solved.solvedProblem
  const easySolved = solved.easySolved
  const mediumSolved = solved.mediumSolved
  const hardSolved = solved.hardSolved
  
  // Profile specific
  const ranking = profile.ranking
  // Calculate acceptance rate if provided, or fallback (sometimes api returns 'acceptanceRate' in profile or we calc from solved/totalSubmission)
  // The 'solved' endpoint doesn't give acceptance rate directly usually.
  // The 'profile' endpoint matches https://alfa-leetcode-api.onrender.com/ananaydubey 
  // Let's assume acceptance rate might be in profile or we display N/A if missing.
  // Actually, let's look for it in profileData. Usually 'reputation', 'ranking', etc.
  // If not available, we skip it or calculate if we had submissions.
  // For now, let's check if profile has it. If not, we might need another endpoint or just show what we have.
  // Edit: We can calculate it roughly if we had total submissions, but solved endpoint only gives solved counts.
  // Let's assume we can display what we have.
  
  // Acceptance Rate calculation (if available in profile, else hidden)
  // Some versions of the API return `acceptanceRate` in the profile.
  
  return (
    <section className="dsa-section" ref={sectionRef}>
      <div className="dsa-header">
        <h2 className="dsa-title" ref={titleRef}>
          <span className="fraunces-italic">Keep</span> GRINDING
        </h2>
      </div>

      <div className="dsa-grid" ref={cardsRef}>
        {/* Total Solved */}
        <div className="dsa-card total-card">
          <div className="dsa-icon">
            <i className="fa-solid fa-code"></i>
          </div>
          <div className="dsa-info">
            <span className="dsa-value">{totalSolved}</span>
            <span className="dsa-label">Total Solved</span>
          </div>
        </div>

        {/* Global Rank */}
        <div className="dsa-card rank-card">
          <div className="dsa-icon">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div className="dsa-info">
            <span className="dsa-value">{ranking?.toLocaleString()}</span>
            <span className="dsa-label">Global Rank</span>
          </div>
        </div>

        {/* Easy */}
        <div className="dsa-card easy-card">
          <div className="dsa-info">
            <span className="dsa-value">{easySolved}</span>
            <span className="dsa-label">Easy</span>
          </div>
          <div className="dsa-progress">
             <div className="progress-bar" style={{ width: `${(easySolved / totalSolved) * 100}%`, background: '#00b8a3' }}></div>
          </div>
        </div>

        {/* Medium */}
        <div className="dsa-card medium-card">
          <div className="dsa-info">
            <span className="dsa-value">{mediumSolved}</span>
            <span className="dsa-label">Medium</span>
          </div>
          <div className="dsa-progress">
             <div className="progress-bar" style={{ width: `${(mediumSolved / totalSolved) * 100}%`, background: '#ffc01e' }}></div>
          </div>
        </div>

        {/* Hard */}
        <div className="dsa-card hard-card">
          <div className="dsa-info">
            <span className="dsa-value">{hardSolved}</span>
            <span className="dsa-label">Hard</span>
          </div>
          <div className="dsa-progress">
             <div className="progress-bar" style={{ width: `${(hardSolved / totalSolved) * 100}%`, background: '#ef4743' }}></div>
          </div>
        </div>
        
         {/* Link to Profile */}
         <a href="https://leetcode.com/ananaydubey" target="_blank" rel="noopener noreferrer" className="dsa-card profile-link-card">
            <div className="link-content">
                <span>View LeetCode</span>
                <i className="fa-solid fa-arrow-right"></i>
            </div>
         </a>

      </div>
    </section>
  )
}

export default DSASection
