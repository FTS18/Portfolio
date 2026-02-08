import { useProjectViews } from '../../hooks/useFirebase'
import { useEffect, useRef } from 'react'
import LazyImage from '../common/LazyImage'
import './ProjectCard.css'

function ProjectCard({ project, onOpenModal, priority = false }) {
  const projectId = project.title.replace(/\s/g, '')
  const [views, incrementViews] = useProjectViews(projectId)
  const cardRef = useRef(null)
  const imgRef = useRef(null)

  const handleImageLoad = () => {
    if (!imgRef.current) return;
    
    // Skip dynamic colors in B&W mode
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'bw') return;

    const extractColors = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        
        // Small size for faster processing, but further reduced for performance
        canvas.width = 50; 
        canvas.height = 50;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let topVibrantPixel = { r: 255, g: 255, b: 255, score: -1 };
        
        // Sample every 4th pixel to reduce computation by 75%
        for (let i = 0; i < imageData.length; i += 32) {
          const r = imageData[i];
          const g = imageData[i+1];
          const b = imageData[i+2];
          
          const max = Math.max(r, g, b) / 255;
          const min = Math.min(r, g, b) / 255;
          let l = (max + min) / 2;
          const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
          
          const score = s * (l > 0.1 && l < 0.9 ? 1 : 0.2);
          
          if (score > topVibrantPixel.score) {
            topVibrantPixel = { r, g, b, score, l };
          }
        }
        
        let { r, g, b, l } = topVibrantPixel.score > 0.05 ? topVibrantPixel : { r: 82, g: 39, b: 255, l: 0.5 };

        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const d = max - min;
        let h, s;
        if (max === min) h = 0;
        else {
          switch (max) {
            case r / 255: h = (g / 255 - b / 255) / d + (g < b ? 6 : 0); break;
            case g / 255: h = (b / 255 - r / 255) / d + 2; break;
            case b / 255: h = (r / 255 - g / 255) / d + 4; break;
          }
          h /= 6;
        }
        
        s = 0.85; 
        l = Math.max(0.4, Math.min(0.6, l));

        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const finalR = Math.floor(hue2rgb(p, q, h + 1/3) * 255);
        const finalG = Math.floor(hue2rgb(p, q, h) * 255);
        const finalB = Math.floor(hue2rgb(p, q, h - 1/3) * 255);

        const darkL = 0.18;
        const darkQ = darkL < 0.5 ? darkL * (1 + s) : darkL + s - darkL * s;
        const darkP = 2 * darkL - darkQ;
        const dr = Math.floor(hue2rgb(darkP, darkQ, h + 1/3) * 255);
        const dg = Math.floor(hue2rgb(darkP, darkQ, h) * 255);
        const db = Math.floor(hue2rgb(darkP, darkQ, h - 1/3) * 255);

        const textL = 0.35;
        const textQ = textL < 0.5 ? textL * (1 + s) : textL + s - textL * s;
        const textP = 2 * textL - textQ;
        const tr = Math.floor(hue2rgb(textP, textQ, h + 1/3) * 255);
        const tg = Math.floor(hue2rgb(textP, textQ, h) * 255);
        const tb = Math.floor(hue2rgb(textP, textQ, h - 1/3) * 255);

        if (cardRef.current) {
          cardRef.current.style.setProperty('--card-accent', `rgb(${finalR}, ${finalG}, ${finalB})`);
          cardRef.current.style.setProperty('--card-accent-bg', `rgba(${finalR}, ${finalG}, ${finalB}, 0.95)`);
          cardRef.current.style.setProperty('--card-accent-dark', `rgb(${dr}, ${dg}, ${db})`);
          cardRef.current.style.setProperty('--card-accent-text', `rgb(${tr}, ${tg}, ${tb})`);
          
          const brightness = (finalR * 299 + finalG * 587 + finalB * 114) / 1000;
          const contrastText = brightness > 155 ? '#000000' : '#FFFFFF';
          cardRef.current.style.setProperty('--card-accent-contrast', contrastText);
        }
      } catch (e) {
        console.warn('Could not extract vibrant color:', e);
      }
    };

    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(extractColors, { timeout: 2000 });
    } else {
      setTimeout(extractColors, 100);
    }
  }

  const handleClick = () => {
    incrementViews()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || 'Check out this project!',
          url: project.link
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(project.link)
      alert('Link copied to clipboard!')
    }
  }

  // Mobile scroll effect only
  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const column = entry.target.closest('.column')
            if (entry.isIntersecting) {
              column.classList.add('in-focus')
            } else {
              column.classList.remove('in-focus')
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '-45% 0px -45% 0px'
        }
      )

      if (cardRef.current) {
        observer.observe(cardRef.current)
      }

      return () => {
        if (cardRef.current) {
          observer.unobserve(cardRef.current)
        }
      }
    }
  }, [])

  const tags = project.tags || ['Web', 'Design', 'Development']
  const tagString = tags.map(tag => `${tag} ✦`).join(' ')
  
  // Dynamic button text based on github field
  const getGithubButtonText = () => {
    if (project.github && project.github.includes('youtube.com')) return 'YouTube'
    if (project.github === 'Private') return 'Private'
    return 'GitHub'
  }

  return (
    <div className="column">
      <div className="card" data-aos="fade-up" ref={cardRef}>
        {project.featured && (
          <div className="featured-badge">
            <i className="fa-solid fa-star"></i>
            <span>Featured</span>
          </div>
        )}
        <div className="card-image-wrapper" onClick={onOpenModal} style={{ cursor: 'pointer' }}>
          <LazyImage
            innerRef={imgRef}
            src={project.image}
            alt={project.title}
            onLoad={handleImageLoad}
            width={400}
            height={225}
            placeholder="/assets/images/placeholder.webp"
            priority={priority}
            thumbnail={true}
            crossOrigin="anonymous"
          />
        </div>
        
        <div className="card-marquee">
          <div className="marquee-content" aria-hidden="true">
            <span>{tagString} {tagString} {tagString}</span>
          </div>
        </div>
        
        <div className="card-content">
          <h3 className="p-title">{project.title}</h3>
          <div className="p-description">{project.shortDesc || project.description || 'A web development project showcasing modern design and functionality.'}</div>
          
          <div className="p-meta">
            <div className="p-date">{project.date}</div>
            <span className="p-views" aria-label={`${views} views`}>
              <i className="fa-solid fa-eye"></i> {views}
            </span>
          </div>
          
          <div className="card-actions">
            <a
              onClick={handleClick}
              target="_blank"
              rel="noopener noreferrer"
              href={project.link}
              className="p-btn"
              aria-label={`Open ${project.title}`}
            >
              <span>Open</span>
              <i className="fa-solid fa-arrow-up"></i>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={project.github === 'Private' ? '#' : project.github || '#'}
              className={`p-btn p-btn-secondary ${project.github === 'Private' ? 'disabled' : ''}`}
              onClick={project.github === 'Private' ? (e) => e.preventDefault() : undefined}
              aria-label={`View source for ${project.title} on ${getGithubButtonText()}`}
            >
              <span>{getGithubButtonText()}</span>
              <i className="fa-solid fa-arrow-up"></i>
            </a>
            <button
              onClick={onOpenModal}
              className="p-btn p-btn-secondary p-btn-icon"
              title="View Details"
              aria-label={`View details for ${project.title}`}
            >
              <i className="fa-solid fa-expand"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
