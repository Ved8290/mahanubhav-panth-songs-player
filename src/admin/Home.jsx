// src/admin/AdminHome.jsx
import { useEffect, useState } from 'react'
import supabase from '../superbsae'
import './home.css'

export default function AdminHome() {
  const [categories, setCategories] = useState([])
  const [songs, setSongs] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [songFile, setSongFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [editingSongId, setEditingSongId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')

  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchCategories()
    fetchSongs()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at')
    setCategories(data || [])
  }

  const fetchSongs = async () => {
    const { data } = await supabase.from('songs').select('*').order('created_at')
    setSongs(data || [])
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategory) return
    await supabase.from('categories').insert([{ name: newCategory }])
    alert(`Category "${newCategory}" created successfully.`)
    setNewCategory('')
    fetchCategories()
  }

  const handleUploadSong = async (e) => {
    e.preventDefault()
    if (!songTitle || !selectedCategory || !songFile) return alert("All fields required")

    setUploading(true)
    setShowProgress(true)
    setProgress(10)

    const ext = songFile.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    setProgress(30)

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('songs')
      .upload(fileName, songFile)

    if (uploadErr) {
      alert("Upload error: " + uploadErr.message)
      setShowProgress(false)
      setUploading(false)
      return
    }

    setProgress(60)

    const url = `https://djasafplbfhidnvqrqda.supabase.co/storage/v1/object/public/songs/${fileName}`

    const { error: insertErr } = await supabase.from('songs').insert([{
      title: songTitle, 
      category_id: selectedCategory,
      audio_url: url
    }])

    setProgress(90)

    if (!insertErr) {
      alert(`Song "${songTitle}" uploaded successfully.`)
      setSongTitle('')
      setSongFile(null)
      fetchSongs()
    }

    setProgress(100)
    setTimeout(() => {
      setShowProgress(false)
      setProgress(0)
      setUploading(false)
    }, 1000)
  }

  const handleDeleteSong = async (id) => {
    if (!window.confirm('Delete this song?')) return
    await supabase.from('songs').delete().eq('id', id)
    alert('Song deleted successfully.')
    fetchSongs()
  }

  const startEditSong = (song) => {
    setEditingSongId(song.id)
    setEditTitle(song.title)
    setEditCategory(song.category_id)
  }

  const saveEditSong = async () => {
    await supabase.from('songs').update({
      title: editTitle,
      category_id: editCategory
    }).eq('id', editingSongId)

    alert('Song updated successfully.')
    setEditingSongId(null)
    fetchSongs()
  }

  return (
    <div className="admin-page">
      <h1>🎶 Admin Dashboard</h1>

      <div className="admin-forms">
        <form onSubmit={handleCreateCategory} className="card">
          <h3>➕ Create Category</h3>
          <input
            type="text"
            placeholder="e.g. Aarti"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <form onSubmit={handleUploadSong} className="card">
          <h3>⬆️ Upload Song</h3>
          <input
            type="text"
            placeholder="Song Title"
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="file"
            accept="audio/*"
            onChange={e => setSongFile(e.target.files[0])}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {showProgress && (
        <div className="upload-dialog">
          <div className="dialog-content">
            <p>Uploading song... {progress}%</p>
            <progress value={progress} max="100" style={{ width: '100%' }}></progress>
          </div>
        </div>
      )}

      <div className="songs-section">
        <h2>📃 All Songs</h2>
        {songs.map(song => (
          <div className="song-card" key={song.id}>
            {editingSongId === song.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="action-buttons">
                  <button onClick={saveEditSong}>💾 Save</button>
                  <button onClick={() => setEditingSongId(null)}>❌ Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{song.title}</strong></p>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>{song.audio_url.slice(-30)}</p>
                <div className="action-buttons">
                  <button onClick={() => startEditSong(song)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteSong(song.id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
