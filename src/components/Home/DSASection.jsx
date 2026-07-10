import { useState, useEffect, useRef } from 'react'
import './DSASection.css'
import gsap from 'gsap'

const DSASection = () => {
  const [stats, setStats] = useState({ leetcode: null, codeforces: null })
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour revalidation cache
      const LC_CACHE_KEY = 'leetcode_stats_v5'
      const CF_CACHE_KEY = 'cf_stats_v5'

      let initialLC = null
      let initialCF = null
      let isLcExpired = true
      let isCfExpired = true

      // Try reading LeetCode cache
      try {
        const cached = localStorage.getItem(LC_CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          initialLC = data
          if (Date.now() - timestamp < CACHE_DURATION) {
            isLcExpired = false
          }
        }
      } catch (e) {}

      // Try reading Codeforces cache
      try {
        const cached = localStorage.getItem(CF_CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          initialCF = data
          if (Date.now() - timestamp < CACHE_DURATION) {
            isCfExpired = false
          }
        }
      } catch (e) {}

      // SWR: Render cached data immediately if available to skip loading state
      if (initialLC || initialCF) {
        setStats({ leetcode: initialLC, codeforces: initialCF })
        setLoading(false)
      }

      // Revalidate LeetCode if expired or missing
      let leetcodeData = initialLC
      if (isLcExpired || !initialLC) {
        try {
          const username = 'ananaydubey'
          const [solvedRes, profileRes] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
            fetch(`https://alfa-leetcode-api.onrender.com/${username}`)
          ])
          if (solvedRes.ok && profileRes.ok) {
            const solvedData = await solvedRes.json()
            const profileData = await profileRes.json()
            if (!solvedData.errors && !profileData.errors) {
              leetcodeData = { solved: solvedData, profile: profileData }
              localStorage.setItem(LC_CACHE_KEY, JSON.stringify({
                data: leetcodeData,
                timestamp: Date.now()
              }))
            }
          }
        } catch (err) {
          console.error('LeetCode fetch error:', err)
        }
      }

      // Revalidate Codeforces if expired or missing
      let codeforcesData = initialCF
      if (isCfExpired || !initialCF) {
        let cfInfo = null
        let cfRatings = null

        try {
          const cfRes = await fetch('https://codeforces.com/api/user.info?handles=ananaydubey')
          if (cfRes.ok) {
            const cfData = await cfRes.json()
            if (cfData.status === 'OK' && cfData.result && cfData.result[0]) {
              cfInfo = cfData.result[0]
            }
          }
        } catch (err) {
          console.error('Codeforces info fetch error:', err)
        }

        // Delay 250ms specifically to prevent Codeforces API rate limit blocks
        await new Promise(resolve => setTimeout(resolve, 250))

        try {
          const cfStatusRes = await fetch('https://codeforces.com/api/user.status?handle=ananaydubey')
          if (cfStatusRes.ok) {
            const cfStatusData = await cfStatusRes.json()
            if (cfStatusData.status === 'OK') {
              const solvedProblems = new Set()
              const ratingsCount = {}
              cfStatusData.result.forEach(submission => {
                if (submission.verdict === 'OK' && submission.problem && submission.problem.rating) {
                  const problemId = `${submission.problem.contestId}-${submission.problem.index}`
                  if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId)
                    const rating = submission.problem.rating
                    ratingsCount[rating] = (ratingsCount[rating] || 0) + 1
                  }
                }
              })
              cfRatings = ratingsCount
            }
          }
        } catch (err) {
          console.error('Codeforces status fetch error:', err)
        }

        if (cfInfo) {
          codeforcesData = {
            info: cfInfo,
            ratings: cfRatings || {}
          }
          localStorage.setItem(CF_CACHE_KEY, JSON.stringify({
            data: codeforcesData,
            timestamp: Date.now()
          }))
        }
      }

      // Final fallbacks (use expired caches if both fetches failed and we have no valid cache)
      if (!leetcodeData) {
        try {
          const cached = localStorage.getItem(LC_CACHE_KEY)
          if (cached) leetcodeData = JSON.parse(cached).data
        } catch (e) {}
      }
      if (!codeforcesData) {
        try {
          const cached = localStorage.getItem(CF_CACHE_KEY)
          if (cached) codeforcesData = JSON.parse(cached).data
        } catch (e) {}
      }

      setStats({ leetcode: leetcodeData, codeforces: codeforcesData })
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!loading && (stats.leetcode || stats.codeforces) && sectionRef.current) {
      // Animate title
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8
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
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1
        }
      )
    }
  }, [loading, stats])

  if (loading) {
    return (
      <section className="dsa-section" ref={sectionRef}>
        <div className="dsa-loader">
          <div className="spinner"></div>
          <p>FETCHING DSA STATS...</p>
        </div>
      </section>
    )
  }

  // If we have no stats at all, don't show the section
  if (!stats.leetcode && !stats.codeforces) {
     return null 
  }

  const { leetcode, codeforces } = stats

  // LeetCode mapping
  const totalSolved = leetcode?.solved?.solvedProblem || '-'
  const easySolved = leetcode?.solved?.easySolved || '-'
  const mediumSolved = leetcode?.solved?.mediumSolved || '-'
  const hardSolved = leetcode?.solved?.hardSolved || '-'
  const ranking = leetcode?.profile?.ranking || '-'

  const totalSolvedNum = Number(leetcode?.solved?.solvedProblem) || 0
  const easySolvedNum = Number(leetcode?.solved?.easySolved) || 0
  const mediumSolvedNum = Number(leetcode?.solved?.mediumSolved) || 0
  const hardSolvedNum = Number(leetcode?.solved?.hardSolved) || 0
  
  // Codeforces mapping
  const cfInfo = codeforces?.info
  const cfRating = cfInfo?.rating || 0
  const cfRank = cfInfo?.rank || 'Unrated'
  const cfMaxRating = cfInfo?.maxRating || 0
  const cfMaxRank = cfInfo?.maxRank || 'Unrated'
  const cfRatings = codeforces?.ratings || {}

  // Codeforces Rank Color Logic
  const getCfColor = (rating) => {
    const val = Number(rating) || 0;
    if (val === 0) return 'var(--text-muted)';
    if (val < 1200) return '#9ca3af'; // Grey (Newbie)
    if (val < 1400) return '#10b981'; // Green (Pupil)
    if (val < 1600) return '#06b6d4'; // Cyan (Specialist)
    if (val < 1900) return '#3b82f6'; // Blue (Expert)
    if (val < 2100) return '#8b5cf6'; // Purple (Candidate Master)
    if (val < 2300) return '#f59e0b'; // Orange (Master)
    return '#ef4444'; // Red (Grandmaster+)
  };

  // Codeforces Division Progress
  const getCfProgress = (rating) => {
    const val = Number(rating) || 0;
    if (val === 0) return { min: 0, max: 1200, next: 'Pupil', percent: 0 };
    if (val < 1200) return { min: 0, max: 1200, next: 'Pupil', percent: (val / 1200) * 100 };
    if (val < 1400) return { min: 1200, max: 1400, next: 'Specialist', percent: ((val - 1200) / 200) * 100 };
    if (val < 1600) return { min: 1400, max: 1600, next: 'Expert', percent: ((val - 1400) / 200) * 100 };
    if (val < 1900) return { min: 1600, max: 1900, next: 'Candidate Master', percent: ((val - 1600) / 300) * 100 };
    if (val < 2100) return { min: 1900, max: 2100, next: 'Master', percent: ((val - 1900) / 200) * 100 };
    if (val < 2300) return { min: 2100, max: 2300, next: 'Grandmaster', percent: ((val - 2100) / 200) * 100 };
    return { min: 2300, max: 3000, next: 'Legendary Grandmaster', percent: Math.min(((val - 2300) / 700) * 100, 100) };
  };

  const cfColor = getCfColor(cfRating);
  const cfProgress = getCfProgress(cfRating);
  const cfMaxColor = getCfColor(cfMaxRating);

  return (
    <section className="dsa-section" ref={sectionRef}>
      <div className="dsa-header">
        <h2 className="dsa-title" ref={titleRef}>
          <span className="fraunces-italic">Problem</span> SOLVING
        </h2>
      </div>

      <div className="dsa-grid-compact" ref={cardsRef}>
        {/* LeetCode Bento Dashboard */}
        <div className="dsa-bento-card">
          <div className="bento-header">
            <div className="bento-title-group">
              <i className="fa-solid fa-code"></i>
              <h3>LeetCode</h3>
            </div>
            <span className="bento-username">@ananaydubey</span>
          </div>

          <div className="bento-stats-row">
            <div className="bento-stat">
              <span className="stat-val">{totalSolved}</span>
              <span className="stat-lbl">LeetCode Solved</span>
            </div>
            <div className="bento-stat">
              <span className="stat-val">{typeof ranking === 'number' ? ranking.toLocaleString() : ranking}</span>
              <span className="stat-lbl">LeetCode Rank</span>
            </div>
          </div>

          <div className="bento-progress-list">
            <div className="bento-progress-item">
              <div className="progress-info">
                <span>Easy</span>
                <span>{easySolved}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill easy" style={{ width: `${totalSolvedNum ? (easySolvedNum / totalSolvedNum) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="bento-progress-item">
              <div className="progress-info">
                <span>Medium</span>
                <span>{mediumSolved}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill medium" style={{ width: `${totalSolvedNum ? (mediumSolvedNum / totalSolvedNum) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="bento-progress-item">
              <div className="progress-info">
                <span>Hard</span>
                <span>{hardSolved}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill hard" style={{ width: `${totalSolvedNum ? (hardSolvedNum / totalSolvedNum) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Codeforces Bento Dashboard */}
        <div className="dsa-bento-card">
          <div className="bento-header">
            <div className="bento-title-group">
              <i className="fa-solid fa-chart-simple"></i>
              <h3>Codeforces</h3>
            </div>
            <span className="bento-username">@ananaydubey</span>
          </div>

          <div className="bento-stats-row">
            <div className="bento-stat">
              <span className="stat-val" style={{ color: cfColor }}>{cfRating || 'Unrated'}</span>
              <span className="stat-lbl">CF Rating</span>
            </div>
            <div className="bento-stat">
              <span className="stat-val" style={{ color: cfColor, textTransform: 'capitalize' }}>{cfRank}</span>
              <span className="stat-lbl">CF Rank</span>
            </div>
          </div>

          <div className="bento-progress-list">
            <div className="bento-progress-item">
              <div className="progress-info">
                <span>Progress to {cfProgress.next}</span>
                <span>{cfRating} / {cfProgress.max}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${cfProgress.percent}%`, background: cfColor }}></div>
              </div>
            </div>

            <div className="bento-progress-item">
              <div className="progress-info">
                <span>Max Rating ({cfMaxRank})</span>
                <span>{cfMaxRating || '-'}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '100%', background: cfMaxColor }}></div>
              </div>
            </div>

            {/* Solved by Rating Brackets */}
            {Object.keys(cfRatings).length > 0 && (
              <div className="cf-ratings-section">
                <span className="cf-ratings-title">Solved by Rating:</span>
                <div className="cf-ratings-badges">
                  {Object.entries(cfRatings)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([rating, count]) => {
                      const ratingNum = Number(rating);
                      const badgeColor = getCfColor(ratingNum);
                      return (
                        <div key={rating} className="cf-rating-badge" style={{ borderColor: badgeColor, color: badgeColor }}>
                          <span className="cf-badge-rating">{rating}</span>
                          <span className="cf-badge-count">{count}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LeetCode Link */}
        <a href="https://leetcode.com/ananaydubey" target="_blank" rel="noopener noreferrer" className="profile-link-card">
           <div className="link-content">
               <span>View LeetCode</span>
               <i className="fa-solid fa-arrow-right"></i>
           </div>
        </a>

        {/* Codeforces Link */}
        <a href="https://codeforces.com/profile/ananaydubey" target="_blank" rel="noopener noreferrer" className="profile-link-card">
           <div className="link-content">
               <span>View Codeforces</span>
               <i className="fa-solid fa-arrow-right"></i>
           </div>
        </a>
      </div>
    </section>
  )
}

export default DSASection
