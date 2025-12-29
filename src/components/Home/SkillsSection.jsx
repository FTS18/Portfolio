import './SkillsSection.css'

function SkillsSection() {
  const skillRows = [
    [
      { name: 'React Query', icon: 'reactquery/FF4154' },
      { name: 'React', icon: 'react/61DAFB' },
      { name: 'Vite', icon: 'vite/646CFF' },
      { name: 'TypeScript', icon: 'typescript/3178C6' },
      { name: 'TailwindCSS', icon: 'tailwindcss/06B6D4' },
      { name: 'Framer', icon: 'framer/FF0066' },
      { name: 'ShadCN', icon: 'shadcnui/ffffff' },
      { name: 'Zod', icon: 'zod/3E67B1' }
    ],
    [
      { name: 'PostgreSQL', icon: 'postgresql/4169E1' },
      { name: 'Supabase', icon: 'supabase/3FCF8E' },
      { name: 'Drizzle', icon: 'drizzle/C5F74F' },
      { name: 'Redis', icon: 'redis/DC382D' },
      { name: 'Python', icon: 'python/3776AB' },
      { name: 'FastAPI', icon: 'fastapi/009688' },
      { name: 'Node.js', icon: 'nodedotjs/339933' },
      { name: 'Express', icon: 'express/ffffff' }
    ],
    [
      { name: 'OpenAI', icon: 'openai/00A67E' },
      { name: 'CrewAI', icon: 'crewai/FF6B35' },
      { name: 'Hugging Face', icon: 'huggingface/FFD21E' },
      { name: 'Google Gemini', icon: 'googlegemini/8E75B2' },
      { name: 'LangChain', icon: 'langchain/1C3C3C' }
    ]
  ]

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
              <div className={`skills-marquee-track ${rowIndex === 1 ? 'reverse' : rowIndex === 2 ? 'slow' : ''}`}>
                {/* Triple for seamless loop */}
                {[...row, ...row, ...row].map((skill, index) => (
                  <div key={index} className="skill-marquee-badge">
                    <img 
                      src={`https://cdn.simpleicons.org/${skill.icon}`} 
                      alt={skill.name}
                      className="skill-marquee-icon"
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
