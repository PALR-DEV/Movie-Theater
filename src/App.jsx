import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeView from './views/HomeView'
import MovieDetails from './views/MovieDetailView'
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
          <Route path="/movie/:id" element={< MovieDetails/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
