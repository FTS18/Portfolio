import './ConnectSection.css'

function ConnectSection() {
  const services = [
    {
      number: '01',
      title: 'UI/UX Design',
      description: 'Designing modern, responsive interfaces with Figma, Tailwind CSS, and Framer Motion. Creating intuitive experiences with clean design systems and pixel-perfect implementations.',
      icon: 'fa-solid fa-palette'
    },
    {
      number: '02',
      title: 'SaaS Development',
      description: 'Developing end-to-end SaaS solutions with subscription systems, Stripe billing, and multi-tenant management. Ensuring scalability and secure user management.',
      icon: 'fa-solid fa-cube'
    },
    {
      number: '03',
      title: 'API Architecture',
      description: 'Designing maintainable APIs with Prisma, and MongoDB. Focusing on optimization, security, best practices, and efficient data flow.',
      icon: 'fa-solid fa-network-wired'
    }
  ]

  return (
    <section className="connect-section">
      <div className="connect-container">
        <div className="connect-header">
          <h2 className="connect-title"><span className="fraunces-italic">What</span> I Do</h2>
          <p className="connect-subtitle">
            Specialized services for modern web development
            <span className="brutalist-symbol symbol-arrow-right" />
          </p>
        </div>

        <div className="connect-grid">
          {services.map((service, index) => (
            <div key={index} className="connect-card" data-number={service.number}>
              <div className="connect-card-number">{service.number}</div>
              <div className="connect-card-icon">
                <i className={service.icon}></i>
              </div>
              <h3 className="connect-card-title">{service.title}</h3>
              <p className="connect-card-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ConnectSection
