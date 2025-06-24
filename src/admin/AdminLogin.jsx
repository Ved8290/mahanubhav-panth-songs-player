// src/pages/AdminLogin.jsx
import { useState } from 'react'
import supabase from '../superbsae'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css' 

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('Login failed: ' + error.message)
    } else {
      navigate('/admin/home')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🙏 Welcome Admin</h1>
        <p className="login-subtitle">Please login to manage devotional songs</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  )
}
