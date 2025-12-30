import { useState } from 'react'
import LazyImage from './LazyImage'
import './WebGPUGallery.css'

function WebGPUGallery({ images = [] }) {
  const [selectedEffect, setSelectedEffect] = useState('none')

  const effects = [
    { name: 'none', label: 'Original', effects: [] },
    { name: 'blur', label: 'Blur', effects: ['blur'] },
    { name: 'sharpen', label: 'Sharpen', effects: ['sharpen'] },
    { name: 'combo', label: 'Blur + Sharpen', effects: ['blur', 'sharpen'] }
  ]

  return (
    <div className="webgpu-gallery">
      <div className="effect-controls">
        {effects.map(effect => (
          <button
            key={effect.name}
            className={`effect-btn ${selectedEffect === effect.name ? 'active' : ''}`}
            onClick={() => setSelectedEffect(effect.name)}
          >
            {effect.label}
          </button>
        ))}
      </div>
      
      <div className="gallery-grid">
        {images.map((image, index) => (
          <LazyImage
            key={index}
            src={image.src}
            alt={image.alt}
            className="gallery-image"
            webgpuEffects={effects.find(e => e.name === selectedEffect)?.effects || []}
          />
        ))}
      </div>
    </div>
  )
}

export default WebGPUGallery