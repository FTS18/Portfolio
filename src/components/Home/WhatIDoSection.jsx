import { useState } from 'react'
import LensCursor from '../common/LensCursor'
import './WhatIDoSection.css'

function WhatIDoSection() {
  const [showLens, setShowLens] = useState(false)
  
  const services = [
    {
      number: '01',
      title: 'UI/UX Design',
      description: 'Designing modern, responsive interfaces with Figma, Tailwind CSS, and Framer Motion. Creating intuitive experiences with clean design systems and pixel-perfect implementations.'
    },
    {
      number: '02', 
      title: 'SaaS Development',
      description: 'Developing end-to-end SaaS solutions with subscription systems, Stripe billing, and multi-tenant management. Ensuring scalability and secure user management.'
    },
    {
      number: '03',
      title: 'API Architecture', 
      description: 'Designing maintainable APIs with Prisma, and MongoDB. Focusing on optimization, security, best practices, and efficient section.'
    }
  ]

  return (
    <section className="what-i-do" id="about">
      {showLens && <LensCursor />}
      
      <div className="what-i-do-container">
        <div className="what-i-do-header">
          <h2 className="what-i-do-title">What I Do</h2>
          <p className="what-i-do-subtitle">
            Specialized services for modern web development
          </p>
        </div>

        <div 
          className="services-grid"
          onMouseEnter={() => setShowLens(true)}
          onMouseLeave={() => setShowLens(false)}
        >
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-number">{service.number}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatIDoSection
