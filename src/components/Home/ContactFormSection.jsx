import { useState } from 'react'
import './ContactFormSection.css'

function ContactFormSection() {
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.target
    const formData = new FormData(form)

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setStatus('error')
    }
  }

  return (
    <section className="contact-form-section" id="contact">
      <div className="contact-form-container">
        <div className="contact-form-header">
          <h2 className="contact-form-title">
            <span className="fraunces-italic">Let's</span> Work Together
          </h2>
          <p className="contact-form-subtitle">
            Ready to build something amazing? Drop me a message!
          </p>
        </div>

        <div className="contact-form-wrapper">
          <form 
            className="brutalist-contact-form" 
            name="contact" 
            method="POST" 
            data-netlify="true"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="form-row">
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="YOUR NAME" 
                  required 
                  className="form-input" 
                  disabled={status === 'sending'}
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="YOUR EMAIL" 
                  required 
                  className="form-input" 
                  disabled={status === 'sending'}
                />
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="subject" 
                placeholder="PROJECT SUBJECT" 
                required 
                className="form-input" 
                disabled={status === 'sending'}
              />
            </div>
            
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder="TELL ME ABOUT YOUR PROJECT..." 
                required 
                className="form-textarea" 
                rows="6"
                disabled={status === 'sending'}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`form-submit-btn ${status === 'success' ? 'btn-success' : ''} ${status === 'error' ? 'btn-error' : ''}`}
              disabled={status === 'sending' || status === 'success'}
            >
              {status === 'sending' && 'SENDING MESSAGE...'}
              {status === 'success' && 'MESSAGE SENT! ✅'}
              {status === 'error' && 'TRY AGAIN (ERROR)'}
              {!status && 'SEND MESSAGE'}
            </button>

            {status === 'success' && (
              <p className="form-status-msg msg-success">
                Thank you! Your message was submitted successfully. I'll get back to you shortly.
              </p>
            )}

            {status === 'error' && (
              <p className="form-status-msg msg-error">
                Oops! Something went wrong while sending your message. Please try again or email me directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactFormSection