import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeView = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState('now-showing');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const startX = useRef(null);
    const currentX = useRef(null);
    // New refs for vertical movement
    const startY = useRef(null);
    const currentY = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const nowShowing = [
        {
            title: "The Dark Knight",
            tagline: "Why So Serious?",
            duration: "2h 32min",
            rating: "PG-13",
            genre: "Action, Drama, Crime",
            image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Inception",
            tagline: "Your mind is the scene of the crime",
            duration: "2h 28min",
            rating: "PG-13",
            genre: "Sci-Fi, Action",
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop"
        },
        {
            title: "Interstellar",
            tagline: "Mankind was born on Earth. It was never meant to die here.",
            duration: "2h 49min",
            rating: "PG-13",
            genre: "Sci-Fi, Adventure",
            image: "https://images.unsplash.com/photo-1506355683710-bd071c0a5828?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const handleStart = (e) => {
        const touch = e.touches[0];
        startX.current = touch.clientX;
        currentX.current = touch.clientX;
        startY.current = touch.clientY;
        currentY.current = touch.clientY;
        setIsDragging(true);
    };

    const handleMove = (e) => {
        if (!startX.current) return;
        const touch = e.touches[0];
        currentX.current = touch.clientX;
        currentY.current = touch.clientY;
        // No default prevention so that vertical scroll is allowed
    };

    const handleEnd = () => {
        if (!startX.current || !currentX.current) return;
        // Check if vertical movement is significant (e.g. more than 30px)
        const verticalDiff = Math.abs(currentY.current - startY.current);
        if (verticalDiff > 30) {
            // Do nothing if user scrolls vertically
            startX.current = null;
            currentX.current = null;
            startY.current = null;
            currentY.current = null;
            setIsDragging(false);
            return;
        }

        const swipeDistance = currentX.current - startX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe right
                setCurrentSlide((prev) => (prev === 0 ? nowShowing.length - 1 : prev - 1));
            } else {
                // Swipe left
                setCurrentSlide((prev) => (prev + 1) % nowShowing.length);
            }
        }
        startX.current = null;
        currentX.current = null;
        startY.current = null;
        currentY.current = null;
        setIsDragging(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % nowShowing.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black min-h-[100dvh] overflow-x-hidden">
            {/* Header */}
            <header className="fixed w-full z-50 bg-gradient-to-b from-black via-black/90 to-transparent">
                <div className="container mx-auto px-6 sm:px-8 md:px-12 py-3">
                    <div className="flex justify-between items-center">
                        <a href="#" className="relative z-10">
                            <div className="text-xl font-bold tracking-tight text-white">
                                CINEMA
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">
                                Experience Movies
                            </div>
                        </a>

                        {/* Mobile Menu Button with better touch target */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden relative z-10 p-2 touch-manipulation"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-6 relative flex flex-col justify-center gap-1.5">
                                <span className={`h-0.5 w-full bg-white transform transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`h-0.5 w-full bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`h-0.5 w-full bg-white transform transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <div className="group relative">
                                <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    Movies
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="group relative">
                                <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    Menu
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Enhanced Mobile Menu */}
                    <div className={`md:hidden fixed inset-0 bg-black/98 backdrop-blur-sm transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}>
                        <div className={`flex flex-col items-center justify-center h-[100dvh] space-y-12 p-8 transform transition-all duration-300 ${
                            mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            <div className="flex flex-col items-center space-y-8 w-full">
                                <button 
                                    className="w-full px-8 py-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-2xl text-white hover:bg-white/10 active:bg-white/20 transition-all duration-300 touch-manipulation"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Movies
                                </button>
                                <button 
                                    className="w-full px-8 py-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-2xl text-white hover:bg-white/10 active:bg-white/20 transition-all duration-300 touch-manipulation"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Movie Slider for Mobile */}
            <div className="relative h-[100dvh] overflow-hidden">
                {/* Movie Slides */}
                <div 
                    className={`relative h-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                >
                    {nowShowing.map((movie, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {/* Movie Background */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Enhanced Mobile Movie Info */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-8 md:p-16">
                                <div className="container mx-auto">
                                    <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-2 md:mb-4">{movie.title}</h1>
                                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 md:mb-6 line-clamp-2">{movie.tagline}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-6">
                                        <span>{movie.duration}</span>
                                        <span className="px-2 py-1 bg-white text-black rounded text-xs font-medium">{movie.rating}</span>
                                        <span className="line-clamp-1">{movie.genre}</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/movie/${index + 1}`)}
                                        className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                                    >
                                        Get Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modified Slider Controls - removed play/pause */}
                <div className="absolute bottom-32 right-8 md:right-16 z-30 flex flex-col items-end space-y-4">
                    <div className="flex space-x-2">
                        {nowShowing.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-16 h-1 rounded-full transition-all duration-300 ${
                                    currentSlide === index ? 'bg-white' : 'bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Movie Grid for Mobile */}
            <section className="relative pt-6 px-2 sm:px-4 md:px-8" id="now-showing">
                <div className="max-w-[2000px] mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0 px-2">
                            Now Playing
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
                        {nowShowing.map((movie, index) => (
                            <div 
                                key={index} 
                                onClick={() => navigate(`/movie/${index + 1}`)}
                                className="bg-zinc-900 rounded-lg overflow-hidden group active:scale-95 transition-all duration-300 touch-manipulation hover:ring-2 hover:ring-white cursor-pointer"
                            >
                                <div className="relative aspect-[2/3]">
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100">
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium">
                                                {movie.rating}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 className="text-white font-bold line-clamp-1 mb-1">{movie.title}</h3>
                                            <p className="text-gray-300 text-xs line-clamp-1">{movie.genre}</p>
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