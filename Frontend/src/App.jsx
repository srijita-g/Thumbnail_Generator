import { useState, useRef } from 'react'
import { uploadHeadshot, createJob, subscribeToJob } from './api'
import AuthPage from './AuthPage'
import './App.css'

function App() {
  const [headshotFile, setHeadshotFile] = useState(null)
  const [headshotPreview, setHeadshotPreview] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [numThumbnails, setNumThumbnails] = useState(1)
  const [loading, setLoading] = useState(false)
  const [thumbnails, setThumbnails] = useState([])
  const [status, setStatus] = useState('')
  const fileInputRef = useRef()
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHeadshotFile(file)
      setHeadshotPreview(URL.createObjectURL(file))
    }
  }

  const handleLogin = (newToken) => {
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <AuthPage onLogin={handleLogin} />
  }

  const handleGenerate = async () => {
    if (!headshotFile || !prompt) {
      alert('Please upload a headshot and enter a prompt')
      return
    }

    setLoading(true)
    setThumbnails([])
    setStatus('Uploading headshot...')

    try {
      const { url: headshotUrl } = await uploadHeadshot(headshotFile)
      setStatus('Creating job...')

      const { job_id } = await createJob(prompt, numThumbnails, headshotUrl)
      setStatus('Generating thumbnails...')

      await new Promise((resolve, reject) => {
        subscribeToJob(job_id, {
          onThumbnailReady: (data) => {
            setThumbnails(prev => [...prev, { ...data, status: 'ready' }])
          },
          onThumbnailFailed: (data) => {
            setThumbnails(prev => [...prev, { ...data, status: 'failed' }])
          },
          onJobComplete: () => {
            setStatus('Done')
            setLoading(false)
            resolve()
          },
          onError: (err) => {
            setStatus('Error occurred')
            setLoading(false)
            reject(err)
          }
        })
      })
    } catch (err) {
      setStatus('Error: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>AI Thumbnail Studio</h1>
        <p>Create stunning AI-powered YouTube thumbnails instantly</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <div className="form-section">
          <div className="form-row">
            <div className="upload-box" onClick={() => fileInputRef.current.click()}>
              {headshotPreview ? (
                <img src={headshotPreview} alt="Headshot preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>+</span>
                  <p>Headshot Photo *</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <textarea
              placeholder="Describe your thumbnail *"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
            />
          </div>

          <div className="style-selector">
            <p>Number of styles</p>
            <div className="style-buttons">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  className={numThumbnails === n ? 'active' : ''}
                  onClick={() => setNumThumbnails(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? status : 'Generate Thumbnails'}
          </button>
        </div>

        {thumbnails.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Generated Thumbnails</h2>
              {status === 'Done' && <span className="done-badge">Done</span>}
            </div>
            <div className="thumbnails-grid">
              {thumbnails.map((thumb) => (
                <div key={thumb.thumbnail_id} className="thumbnail-card">
                  <p className="style-label">{thumb.style_name?.replace('_', ' ').toUpperCase()}</p>
                  {thumb.status === 'ready' && thumb.imagekit_url ? (
                    <>
                      <img src={thumb.imagekit_url} alt={thumb.style_name} />
                      <div className="download-links">
                        {thumb.variants && Object.entries(thumb.variants).map(([key, url]) => (
                          <a key={key} href={url} target="_blank" rel="noreferrer">
                            {key} ({key === 'youtube' ? '1280x720' : key === 'shorts' ? '1080x1920' : '1080x1080'})
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="error-text">Failed to generate</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App