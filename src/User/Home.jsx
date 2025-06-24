import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../superbsae'
import './home.css'

export default function Home() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at')
    setCategories(data || [])
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Mahanubhav Panth Song</h1>
        <p>Explore devotional songs by category</p>
      </header>

      <div className="categories-grid">
        {categories.map(cat => (
          <Link to={`/category/${cat.id}`} className="category-card" key={cat.id}>
            <div className="card-content">
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
