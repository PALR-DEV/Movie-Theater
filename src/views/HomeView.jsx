import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import movieService from '../Services/MovieServices';
import LoadingSpinner from '../components/LoadingSpinner';
import { doesHaveMenuItems } from '../Services/MenuItemsService';

const HomeView = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState('now-showing');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const startX = useRef(null);
    const currentX = useRef(null);
    const startY = useRef(null);
    const currentY = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [movies, setMovies] = useState([]);
    const [hasMenuItems, setHasMenuItems] = useState(false);

    useEffect(() => {
        const checkMenuItems = async () => {
            try {
                const result = await doesHaveMenuItems();
                setHasMenuItems(result);
            } catch (error) {
                console.error('Error checking menu items:', error);
                setHasMenuItems(false);
            }
        };
        checkMenuItems();
    }, []);

    useEffect(() => {
        const getMovies = async () => {
            await movieService.getMovies()
                .then((data) => {
                    const formatMovies = data.map((movie) => ({
                        ...movie,
                        categories: JSON.parse(movie.categories),
                    }));
                    console.log(formatMovies);
                    setMovies(formatMovies);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getMovies();
    }, []);

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

            {/* Enhanced Movie Grid for Mobile */}
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

            {/* Enhanced Mobile Footer */}
            <footer className="relative mt-8 py-6 px-4 border-t border-zinc-800">
                <div className="container mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-white text-sm mb-4">
                            © 2024 CINEMA. All rights reserved.
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.26-.149-4.771-1.699-4.919-4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeView;