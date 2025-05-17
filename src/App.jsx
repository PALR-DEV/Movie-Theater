import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomeView from './Views/HomeView'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieDetailView from './Views/MovieDetailView'
import TicketSelectionView from './Views/TicketSelectionView'
import CheckOutView from './Views/CheckOutView'

function App() {

  return (
    <Router basename='/Movie-Theater'>  
      <Routes>
        <Route path="/" element={<HomeView />} />
        {/* Add more routes as needed */}
        <Route path="/movie" element={<MovieDetailView />} />
        <Route path="/select-tickets" element={<TicketSelectionView />} />
        <Route path="/checkout" element={<CheckOutView />} />
      </Routes>
    </Router>
  )
}

export default App
