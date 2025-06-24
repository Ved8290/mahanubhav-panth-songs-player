import React from 'react'

import AdminLogin from './admin/AdminLogin'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminHome from './admin/Home'
import Home from './User/Home'
import CategorySongs from './User/CategorySongs'
import SongDetail from './User/SongDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} /> 
         <Route path="/category/:id" element={<CategorySongs />} />
         <Route path="/song/:id" element={<SongDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
