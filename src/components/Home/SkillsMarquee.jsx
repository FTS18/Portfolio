import './SkillsMarquee.css'

function SkillsMarquee() {
  const row1Skills = [
    { icon: 'fa-brands fa-python', name: 'Python' },
    { icon: 'fa-brands fa-react', name: 'React' },
    { icon: 'fa-brands fa-js', name: 'JavaScript' },
    { icon: 'fa-brands fa-html5', name: 'HTML5' },
    { icon: 'fa-brands fa-css3-alt', name: 'CSS3' },
    { icon: 'fa-solid fa-database', name: 'SQL' },
    { icon: 'fa-brands fa-git-alt', name: 'Git' },
    { icon: 'fa-solid fa-fire', name: 'Firebase' },
    { icon: 'fa-brands fa-node-js', name: 'Node.js' },
  ]

  const row2Skills = [
    { icon: 'fa-solid fa-code', name: 'C++' },
    { icon: 'fa-solid fa-brain', name: 'AI/ML' },
    { icon: 'fa-brands fa-github', name: 'GitHub' },
    { icon: 'fa-solid fa-bolt', name: 'FastAPI' },
    { icon: 'fa-solid fa-wind', name: 'Tailwind' },
    { icon: 'fa-brands fa-npm', name: 'NPM' },
    { icon: 'fa-solid fa-layer-group', name: 'Next.js' },
    { icon: 'fa-solid fa-gem', name: 'Gemini' },
    { icon: 'fa-solid fa-leaf', name: 'MongoDB' },
  ]

  const row3Skills = [
    { icon: 'fa-brands fa-figma', name: 'Figma' },
    { icon: 'fa-solid fa-server', name: 'Express' },
    { icon: 'fa-solid fa-microchip', name: 'Arduino' },
    { icon: 'fa-brands fa-bootstrap', name: 'Bootstrap' },
    { icon: 'fa-solid fa-robot', name: 'LangChain' },
    { icon: 'fa-solid fa-wand-magic-sparkles', name: 'OpenAI' },
    { icon: 'fa-solid fa-cube', name: 'TypeScript' },
    { icon: 'fa-solid fa-cloud', name: 'Netlify' },
  ]

  return (
    <section className="skills-section" id="skills">
      <div className="skills-header">
        <h2 className="skills-title">Built With</h2>
        <p className="skills-subtitle">The technologies I use to build amazing projects</p>
      </div>
      
      <div className="skills-marquee">
        {/* Row 1 - Scrolling Left */}
        <div className="marquee-row" data-direction="left">
          <div className="marquee-content">
            {row1Skills.map((skill, index) => (
              <div key={index} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {row1Skills.map((skill, index) => (
              <div key={`dup1-${index}`} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Scrolling Right */}
        <div className="marquee-row" data-direction="right">
          <div className="marquee-content">
            {row2Skills.map((skill, index) => (
              <div key={index} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {row2Skills.map((skill, index) => (
              <div key={`dup2-${index}`} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Scrolling Left (slower) */}
        <div className="marquee-row" data-direction="left" data-speed="slow">
          <div className="marquee-content">
            {row3Skills.map((skill, index) => (
              <div key={index} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {row3Skills.map((skill, index) => (
              <div key={`dup3-${index}`} className="skill-pill">
                <i className={skill.icon}></i>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkillsMarquee
