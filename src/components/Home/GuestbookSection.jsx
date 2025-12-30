import { useState, useEffect, useCallback } from 'react'
import './GuestbookSection.css'

// Random username generator
const ADJECTIVES = [
  'Curious', 'Happy', 'Swift', 'Brave', 'Clever', 'Cool', 'Cosmic', 'Silent', 
  'Wise', 'Wild', 'Sneaky', 'Sparkly', 'Fuzzy', 'Mighty', 'Lucky', 'Chill',
  'Epic', 'Zen', 'Groovy', 'Pixel', 'Cyber', 'Neon', 'Retro', 'Turbo'
]

const NOUNS = [
  'Panda', 'Ninja', 'Phoenix', 'Dragon', 'Tiger', 'Falcon', 'Wolf', 'Fox',
  'Owl', 'Bear', 'Koala', 'Penguin', 'Dolphin', 'Eagle', 'Lion', 'Raccoon',
  'Sloth', 'Otter', 'Hawk', 'Raven', 'Shark', 'Panther', 'Lynx', 'Cobra'
]

function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 90) + 10 // 10-99
  return `${adj}${noun}${num}`
}

function getOrCreateUsername() {
  const stored = localStorage.getItem('guestbook_username')
  if (stored) return stored
  
  const newUsername = generateUsername()
  localStorage.setItem('guestbook_username', newUsername)
  return newUsername
}

// Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmj3xnETQcfY517hcE_WNI4FGUM8kSUyUE0MPXXjPFynVXE7Ofvg6F--x6WqPytwS6/exec'

function GuestbookSection() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const MAX_CHARS = 280

  // Initialize username
  useEffect(() => {
    setUsername(getOrCreateUsername())
  }, [])

  // Get local messages from localStorage
  const getLocalMessages = () => {
    try {
      const stored = localStorage.getItem('guestbook_messages')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Save message to localStorage
  const saveLocalMessage = (msg) => {
    try {
      const messages = getLocalMessages()
      messages.unshift(msg)
      localStorage.setItem('guestbook_messages', JSON.stringify(messages.slice(0, 50)))
    } catch {
      // Ignore storage errors
    }
  }

  // Fetch messages - try API first, fallback to localStorage
  const fetchMessages = useCallback(() => {
    setIsLoading(true)
    
    // Timeout for API request
    const timeout = setTimeout(() => {
      console.warn('API timeout, using local messages')
      setMessages(getLocalMessages())
      setIsLoading(false)
      setError(null)
    }, 5000)
    
    // Create unique callback name
    const callbackName = `guestbookCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create callback function
    window[callbackName] = (data) => {
      clearTimeout(timeout)
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages)
        // Also update localStorage with server messages
        localStorage.setItem('guestbook_messages', JSON.stringify(data.messages.slice(0, 50)))
      } else {
        setMessages(getLocalMessages())
      }
      setError(null)
      setIsLoading(false)
      // Cleanup
      delete window[callbackName]
      document.getElementById(callbackName)?.remove()
    }
    
    // Create script tag for JSONP
    const script = document.createElement('script')
    script.id = callbackName
    script.src = `${SCRIPT_URL}?action=get&callback=${callbackName}`
    script.onerror = () => {
      clearTimeout(timeout)
      console.warn('API failed, using local messages')
      setMessages(getLocalMessages())
      setError(null) // Don't show error, just use local
      setIsLoading(false)
      delete window[callbackName]
      script.remove()
    }
    
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Submit message using JSONP
  const handleSubmit = (e, messageText = message) => {
    e.preventDefault()
    
    if (!messageText.trim() || messageText.length > MAX_CHARS) return

    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds`)
      return
    }

    setIsSubmitting(true)
    
    // Create unique callback name
    const callbackName = `guestbookPost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create callback function
    window[callbackName] = (data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setMessage('')
        setModalMessage('')
        setError(null)
        // Start cooldown
        setCooldown(20)
        const cooldownInterval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(cooldownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        // Refetch after a short delay
        setTimeout(fetchMessages, 1500)
      }
      setIsSubmitting(false)
      // Cleanup
      delete window[callbackName]
      document.getElementById(callbackName)?.remove()
    }
    
    // Create script tag for JSONP POST
    const script = document.createElement('script')
    script.id = callbackName
    const encodedMessage = encodeURIComponent(messageText.trim())
    script.src = `${SCRIPT_URL}?action=post&username=${encodeURIComponent(username)}&message=${encodedMessage}&callback=${callbackName}`
    
    // Timeout - if API doesn't respond, save locally
    const submitTimeout = setTimeout(() => {
      const newMessage = {
        timestamp: new Date().toISOString(),
        username,
        message: messageText.trim()
      }
      saveLocalMessage(newMessage)
      setMessages(prev => [newMessage, ...prev])
      setMessage('')
      setModalMessage('')
      setError(null)
      setCooldown(20)
      const cooldownInterval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setIsSubmitting(false)
      delete window[callbackName]
      script.remove()
    }, 3000)
    
    // Override callback to clear timeout
    const originalCallback = window[callbackName]
    window[callbackName] = (data) => {
      clearTimeout(submitTimeout)
      originalCallback(data)
    }
    
    script.onerror = () => {
      clearTimeout(submitTimeout)
      // Save locally on error
      const newMessage = {
        timestamp: new Date().toISOString(),
        username,
        message: messageText.trim()
      }
      saveLocalMessage(newMessage)
      setMessages(prev => [newMessage, ...prev])
      setMessage('')
      setModalMessage('')
      setError(null)
      setCooldown(20)
      const cooldownInterval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setIsSubmitting(false)
      delete window[callbackName]
      script.remove()
    }
    
    document.body.appendChild(script)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const recentMessages = messages.slice(0, 3)

  return (
    <>
      <section className="guestbook-section" id="guestbook">
        <div className="guestbook-container">
          <div className="guestbook-header">
            <h2 className="guestbook-title">
              <span className="brutalist-symbol symbol-hash">#</span>
              <span className="fraunces-italic">Guest</span>book
            </h2>
            <p className="guestbook-subtitle">
              Leave an anonymous message! You are <span className="username-badge">{username}</span>
            </p>
          </div>

          {/* Message Input */}
          <form className="guestbook-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <textarea
                className="guestbook-input"
                placeholder="Say something nice... or weird. It's anonymous! 👀"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                rows={3}
                disabled={isSubmitting}
              />
              <div className="input-footer">
                <span className={`char-count ${message.length > MAX_CHARS - 20 ? 'warning' : ''}`}>
                  {message.length}/{MAX_CHARS}
                </span>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={!message.trim() || isSubmitting || cooldown > 0}
                >
                  {isSubmitting ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : cooldown > 0 ? (
                    <span>{cooldown}s</span>
                  ) : (
                    <>
                      <span>Send</span>
                      <i className="fa-solid fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Recent Messages (Last 3) */}
          <div className="guestbook-feed">
            {isLoading ? (
              <div className="loading-state">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading messages...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <i className="fa-solid fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button onClick={fetchMessages} className="retry-btn">Retry</button>
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-message"></i>
                <span>No messages yet. Be the first!</span>
              </div>
            ) : (
              <>
                {recentMessages.map((msg, index) => (
                  <div key={index} className="message-card">
                    <div className="message-header">
                      <span className="message-username">{msg.username}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="message-content">{msg.message}</p>
                  </div>
                ))}
                {messages.length > 3 && (
                  <button 
                    className="view-all-btn" 
                    onClick={() => setShowModal(true)}
                  >
                    View All Messages ({messages.length})
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="guestbook-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="guestbook-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All Messages ({messages.length})</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="modal-messages">
              {messages.map((msg, index) => (
                <div key={index} className="message-card">
                  <div className="message-header">
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="message-content">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <form className="modal-form" onSubmit={(e) => handleSubmit(e, modalMessage)}>
              <div className="modal-input-wrapper">
                <textarea
                  className="modal-input"
                  placeholder="Write a message..."
                  value={modalMessage}
                  onChange={(e) => setModalMessage(e.target.value.slice(0, MAX_CHARS))}
                  rows={2}
                  disabled={isSubmitting}
                />
                <div className="modal-input-footer">
                  <span className={`char-count ${modalMessage.length > MAX_CHARS - 20 ? 'warning' : ''}`}>
                    {modalMessage.length}/{MAX_CHARS}
                  </span>
                  <button 
                    type="submit" 
                    className="modal-submit-btn"
                    disabled={!modalMessage.trim() || isSubmitting || cooldown > 0}
                  >
                    {isSubmitting ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : cooldown > 0 ? (
                      <span>{cooldown}s</span>
                    ) : (
                      <i className="fa-solid fa-paper-plane"></i>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default GuestbookSection
