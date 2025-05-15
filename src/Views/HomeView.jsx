import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';


const HomeView = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    useEffect(() => {

        const fetchMovies = async () => {
            try {
                const response = await fetch('data/movies.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setMovies(data.movies);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to load movies');
                setLoading(false);

            }
        }
        fetchMovies();
    }, []);

    if(loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
        </div>;
    }

    return (
        <div className="bg-black min-h-[100dvh] overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-40 bg-black text-white shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-film text-2xl text-white" />
                        <span className="font-display text-2xl tracking-wider ml-2">LUMEN</span>
                    </div>
                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="nav-link text-white relative font-medium transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Home</a>
                        <a href="#now-showing" className="nav-link text-white relative font-medium transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Movies</a>
                        <a href="#" className="nav-link text-white relative font-medium transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Food & Drinks</a>
                        <a href="#" className="nav-link text-white relative font-medium transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Membership</a>
                    </div>
                    {/* Mobile Nav Toggle - always visible on mobile */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <button
                            className="p-2.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all duration-200 border border-white/20"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                    {/* Book Now button for desktop only */}
                    <div className="hidden md:flex items-center">
                        <button
                            className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                const el = document.getElementById('now-showing');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
                {/* Mobile Sidebar Panel */}
                <div className={`fixed top-0 right-0 h-full w-64 bg-black z-50 shadow-lg transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full p-8 space-y-8">
                        <div className="flex justify-end">
                            <button
                                className="p-2.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all duration-200 border border-white/20"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <a href="#" className="text-2xl font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>Home</a>
                        <a href="#now-showing" className="text-2xl font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>Movies</a>
                        <a href="#" className="text-2xl font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>Food & Drinks</a>
                        <a href="#" className="text-2xl font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>Membership</a>
                        <button
                            className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition mt-auto"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                const el = document.getElementById('now-showing');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
                {/* Overlay for sidebar */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative h-full min-h-[100dvh] w-full flex items-center justify-center">
                <img
                    src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Cinema Hero"
                    className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                <div className="relative z-20 flex flex-col items-center justify-center w-full">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg text-center">
                        Welcome to CINEMA
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-8 text-center max-w-2xl drop-shadow">
                        Immerse yourself in the magic of storytelling with our state-of-the-art projection and sound systems.
                    </p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('now-showing');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 bg-white text-black rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition"
                    >
                        Showtimes
                    </button>
                </div>
                {/* Animated Chevron Down */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                    <button
                        aria-label="Scroll down"
                        onClick={() => {
                            const el = document.getElementById('now-showing');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="focus:outline-none"
                    >
                        <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Movie Grid */}
            <section className="relative pt-6 px-2 sm:px-4 md:px-8" id="now-showing">
                <div className="max-w-[2000px] mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0 px-2">
                            Now Playing
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">

                        {movies.map((movie, index) => (
                            <div key={index} onClick={() => navigate(`/movie/${movie.id}`)} className="bg-zinc-900 rounded-lg overflow-hidden group active:scale-95 transition-all duration-300 touch-manipulation hover:ring-2 hover:ring-white cursor-pointer">
                                <div className="relative aspect-[2/3]">
                                    <img
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100">
                                        <div className="absolute top-2 right-2 flex gap-2 items-center">
                                            <span className="bg-white/10 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                                                {movie.duration}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 className="text-white font-bold line-clamp-1 mb-1">{movie.title}</h3>
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {movie.categories.map((category, idx) => (
                                                    <span key={idx} className="text-xs px-1.5 py-0.5 bg-white/10 backdrop-blur-sm rounded-sm text-white/90">
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-zinc-800 text-center text-white text-sm">
                © {currentYear} CINEMA. All rights reserved.
            </footer>
        </div>
    );
};

export default HomeView;