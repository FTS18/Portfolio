import { useState } from 'react'
import { deduplicateRequest } from '../../utils/requestDeduplication'
import './YoutubeDownloader.css'

const YoutubeDownloader = () => {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [videoInfo, setVideoInfo] = useState(null)
    const [error, setError] = useState(null)
    const [selectedQuality, setSelectedQuality] = useState('highest')

    const fetchInfo = async () => {
        if (!url) return
        setLoading(true)
        setError(null)
        setVideoInfo(null)

        try {
            // Use request deduplication to prevent duplicate calls for the same URL
            const data = await deduplicateRequest(`video-${url}`, async () => {
                const response = await fetch(`/.netlify/functions/metainfo?url=${encodeURIComponent(url)}`)
                const json = await response.json()
                
                if (!response.ok) {
                    throw new Error(json.error || 'Failed to fetch video info')
                }
                
                return json
            })
            
            setVideoInfo(data)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to connect to backend functions.')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!url) return
        // Trigger download via Netlify Function
        window.location.href = `/.netlify/functions/download?url=${encodeURIComponent(url)}&quality=${selectedQuality}`
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setUrl(text)
            // Optional: Auto-fetch if it looks like a URL
            if (text.includes('youtube.com') || text.includes('youtu.be')) {
                // We'll let the user click fetch to be safe, or trigger it manually
            }
        } catch (err) {
            console.error('Failed to read clipboard', err)
        }
    }

    return (
        <section className="youtube-downloader-section">
            <div className="downloader-wrapper">
                <h1 className="downloader-title">
                    <span>YouTube</span> Downloader
                </h1>

                <div className="input-group">
                    <input 
                        type="text" 
                        className="url-input" 
                        placeholder="Paste YouTube Link (e.g. https://youtu.be/...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchInfo()}
                    />
                    <button 
                        className="paste-btn"
                        onClick={handlePaste}
                        title="Paste from Clipboard"
                    >
                        <i className="fa-regular fa-clipboard"></i>
                    </button>
                    <button 
                        className="fetch-btn" 
                        onClick={fetchInfo}
                        disabled={loading || !url}
                    >
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Fetch'}
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="fa-solid fa-triangle-exclamation"></i> {error}
                    </div>
                )}

                {videoInfo && (
                    <div className="video-info-card">
                        <img 
                            src={videoInfo.thumbnail} 
                            alt={videoInfo.title} 
                            className="video-thumbnail" 
                        />
                        <div className="video-details">
                            <h3 className="video-title">{videoInfo.title}</h3>
                            <div className="video-author">
                                <i className="fa-solid fa-user-circle"></i>
                                {videoInfo.author}
                            </div>
                            
                            <div className="download-actions">
                                <select 
                                    className="quality-select"
                                    value={selectedQuality}
                                    onChange={(e) => setSelectedQuality(e.target.value)}
                                >
                                    <option value="highest">Best Quality (Video + Audio)</option>
                                    <option value="lowest">Lowest Quality</option>
                                    <option value="highestaudio">Audio Only (MP3/M4A)</option>
                                </select>
                                
                                <button className="download-btn" onClick={handleDownload}>
                                    <i className="fa-solid fa-download"></i>
                                    Download Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default YoutubeDownloader
