import { useState, useEffect } from 'react'

// WebGPU detection and fallback
export class WebGPURenderer {
  constructor() {
    this.device = null
    this.supported = false
  }

  async init() {
    if (!navigator.gpu) {
      console.log('WebGPU not supported, falling back to WebGL')
      return false
    }

    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) return false

      this.device = await adapter.requestDevice()
      this.supported = true
      console.log('WebGPU initialized successfully')
      return true
    } catch (error) {
      console.log('WebGPU failed to initialize:', error)
      return false
    }
  }

  // Image processing shaders
  createImageEffectShader() {
    if (!this.supported) return null

    return {
      blur: `
        @fragment
        fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
          let texelSize = 1.0 / 512.0;
          var color = vec4<f32>(0.0);
          for (var x = -2; x <= 2; x++) {
            for (var y = -2; y <= 2; y++) {
              let offset = vec2<f32>(f32(x), f32(y)) * texelSize;
              color += textureSample(inputTexture, inputSampler, uv + offset);
            }
          }
          return color / 25.0;
        }
      `,
      sharpen: `
        @fragment
        fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
          let texelSize = 1.0 / 512.0;
          let center = textureSample(inputTexture, inputSampler, uv);
          let blur = (textureSample(inputTexture, inputSampler, uv + vec2<f32>(-texelSize, 0.0)) +
                     textureSample(inputTexture, inputSampler, uv + vec2<f32>(texelSize, 0.0)) +
                     textureSample(inputTexture, inputSampler, uv + vec2<f32>(0.0, -texelSize)) +
                     textureSample(inputTexture, inputSampler, uv + vec2<f32>(0.0, texelSize))) * 0.25;
          return center + (center - blur) * 0.5;
        }
      `
    }
  }

  async processImage(imageData, effect = 'blur') {
    if (!this.supported) return imageData

    try {
      const shaders = this.createImageEffectShader()
      if (!shaders || !shaders[effect]) return imageData

      // Create texture from image data
      const texture = this.device.createTexture({
        size: [imageData.width, imageData.height],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      })

      // Write image data to texture
      this.device.queue.writeTexture(
        { texture },
        imageData.data,
        { bytesPerRow: imageData.width * 4 },
        [imageData.width, imageData.height]
      )

      return imageData // Simplified - full implementation would render to output texture
    } catch (error) {
      console.log('WebGPU image processing error:', error)
      return imageData
    }
  }
}

// Enhanced LazyImage with WebGPU processing
export function useWebGPUImage(src, effects = []) {
  const [processedSrc, setProcessedSrc] = useState(src)
  const webgpu = useWebGPU()

  useEffect(() => {
    if (!webgpu || !effects.length) {
      setProcessedSrc(src)
      return
    }

    const processImage = async () => {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          
          // Apply WebGPU effects
          let processed = imageData
          for (const effect of effects) {
            processed = await webgpu.processImage(processed, effect)
          }
          
          ctx.putImageData(processed, 0, 0)
          setProcessedSrc(canvas.toDataURL())
        }
        img.src = src
      } catch (error) {
        console.log('WebGPU image processing failed:', error)
        setProcessedSrc(src)
      }
    }

    processImage()
  }, [src, effects, webgpu])

  return processedSrc
}
// Usage in Three.js components
export function useWebGPU() {
  const [renderer, setRenderer] = useState(null)
  
  useEffect(() => {
    const gpu = new WebGPURenderer()
    gpu.init().then(success => {
      if (success) setRenderer(gpu)
    })
  }, [])

  return renderer
}