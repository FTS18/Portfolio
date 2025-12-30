import './ContactFormSection.css'

function ContactFormSection() {
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
          <form className="brutalist-contact-form" name="contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="form-row">
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="YOUR NAME" 
                  required 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="YOUR EMAIL" 
                  required 
                  className="form-input" 
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
              />
            </div>
            
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder="TELL ME ABOUT YOUR PROJECT..." 
                required 
                className="form-textarea" 
                rows="6"
              ></textarea>
            </div>
            
            <button type="submit" className="form-submit-btn">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactFormSection