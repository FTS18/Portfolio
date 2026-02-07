import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NotFound.css';

function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: -20,
          size: Math.random() * 5 + 2,
          duration: Math.random() * 3 + 2
        }
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="error-page">
      {/* Animated particles */}
      <div className="particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}
      </div>

      {/* Mouse follower */}
      <div 
        className="mouse-glow" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y 
        }} 
      />

      <div className="error-container">
        <div className="glitch-wrapper">
          <div className="glitch" data-text="404">404</div>
          <div className="glitch-subtext">ERROR</div>
        </div>
        
        <div className="error-divider"></div>
        
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="error-actions">
          <Link to="/" className="error-btn error-btn-primary">
            <span className="btn-bracket">&lt;</span>
            <span className="btn-text">HOME</span>
            <span className="btn-bracket">/&gt;</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="error-btn error-btn-secondary"
          >
            <span className="btn-bracket">{'<'}</span>
            <span className="btn-text">BACK</span>
            <span className="btn-bracket">{'>'}</span>
          </button>
        </div>
      </div>

      {/* Background grid */}
      <div className="bg-grid"></div>
    </div>
  );
}

export default NotFound;
