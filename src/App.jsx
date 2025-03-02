import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomeView from './views/HomeView'
import MoviesView from './views/MoviesView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* <nav>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
        </nav> */}

        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/movies" element={<MoviesView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
