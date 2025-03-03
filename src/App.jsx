import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeView from './views/HomeView'
import MovieDetails from './views/MovieDetailView'
import BookingView from './views/BookingView';
import PurchaseCompleteView from './views/PurchaseCompleteView';
import './App.css'
import CheckOutView from './views/CheckOutView';

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
          <Route path='/booking' element={<BookingView />} />
          <Route path='/checkout' element={<CheckOutView />} />
          <Route path='/purchase-complete' element={<PurchaseCompleteView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
