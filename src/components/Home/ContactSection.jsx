import './ContactSection.css'

function ContactSection() {
  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://youtube.com/c/spacify18',
      icon: 'fa-brands fa-youtube',
      color: '#FF0000'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/ananay_dubey',
      icon: 'fa-brands fa-instagram',
      color: '#E4405F'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/FTS18',
      icon: 'fa-brands fa-github',
      color: '#ffffff'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ananaydubey',
      icon: 'fa-brands fa-linkedin',
      color: '#0077B5'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919580711960',
      icon: 'fa-brands fa-whatsapp',
      color: '#25D366'
    },
    {
      name: 'Email',
      url: 'mailto:dubeyananay@gmail.com',
      icon: 'fa-solid fa-envelope',
      color: '#917dff'
    }
  ]

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Let's Connect</h2>
          <p className="contact-subtitle">Find me on these platforms</p>
        </div>

        <div className="contact-grid">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              style={{ '--hover-color': social.color }}
            >
              <div className="contact-icon">
                <i className={social.icon}></i>
              </div>
              <span className="contact-name">{social.name}</span>
              <i className="fas fa-arrow-right contact-arrow"></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
