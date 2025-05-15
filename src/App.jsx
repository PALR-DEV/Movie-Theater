import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomeView from './Views/HomeView'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieDetailView from './Views/MovieDetailView'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        {/* Add more routes as needed */}
        <Route path="/movie" element={<MovieDetailView />} />
      </Routes>
    </Router>
  )
}

export default App
