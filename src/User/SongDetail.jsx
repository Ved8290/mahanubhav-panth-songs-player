import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../superbsae'
import './SongDetail.css'

export default function SongDetail() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchSong()
  }, [id])

  const fetchSong = async () => {
    const { data } = await supabase.from('songs').select('*').eq('id', id).single()
    setSong(data)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  if (!song) return <p>Loading...</p>

  return (
    <div className="song-detail-page">
      <header className="detail-header">
        <Link to="/" className="back-btn">← Home</Link>
        <h2>{song.title}</h2>
      </header>

      <div className="player-section">
        <audio
          ref={audioRef}
          src={song.audio_url}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onTimeUpdate={handleTimeUpdate}
        />

        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button onClick={() => audioRef.current.play()}>▶️ Play</button>
          <button onClick={() => audioRef.current.pause()}>⏸️ Pause</button>
        </div>
      </div>
    </div>
  )
}
