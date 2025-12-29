import './LinkedInPost.css'

function LinkedInPost() {
  return (
    <section className="linkedin-post-section">
      <div className="linkedin-container">
        <div className="linkedin-header">
          <h2 className="linkedin-title">Latest Update</h2>
          <p className="linkedin-subtitle">My recent achievement at Smart India Hackathon</p>
        </div>
        
        <div className="linkedin-content">
          <div className="linkedin-embed">
            <iframe 
              src="https://www.linkedin.com/feed/update/urn:li:activity:7401538130941804544/" 
              width="500" 
              height="700" 
              frameBorder="0" 
              scrolling="yes"
              title="LinkedIn Post"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LinkedInPost