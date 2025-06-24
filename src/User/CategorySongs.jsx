import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../superbsae'
import './CategorySongs.css'

export default function CategorySongs() {
  const { id } = useParams()
  const [songs, setSongs] = useState([])
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    fetchCategory()
    fetchSongs()
  }, [id])

  const fetchCategory = async () => {
    const { data } = await supabase.from('categories').select('name').eq('id', id).single()
    if (data) setCategoryName(data.name)
  }

  const fetchSongs = async () => {
    const { data } = await supabase
      .from('songs')
      .select('id, title')
      .eq('category_id', id)
      .order('created_at', { ascending: false })
    setSongs(data || [])
  }

  return (
    <div className="category-page">
      <header className="category-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1 className="category-title">{categoryName}</h1>
        <p className="category-subtitle">{songs.length} devotional {songs.length === 1 ? 'song' : 'songs'}</p>
      </header>

      <div className="songs-list">
        {songs.map(song => (
          <Link key={song.id} to={`/song/${song.id}`} className="song-link">
            <center>
            <p className='sl'>🎵 {song.title}</p>
            </center>
          </Link>
        ))}

        {songs.length === 0 && (
          <p className="no-songs">No songs found in this category yet.</p>
        )}
      </div>
    </div>
  )
}
