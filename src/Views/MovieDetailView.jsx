/**
 * MovieDetailView.jsx
 * -------------------
 * This view displays detailed information about a selected movie, including its poster,
 * title, categories, duration, and available showtimes. It allows users to watch the trailer,
 * select a date and screening time, and proceed to ticket selection.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MovieDetailView = () => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isloading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movie, setMovie] = useState(null);
    const [screenings, setScreenings] = useState([]);
    const [searchParams] = useSearchParams();
    const movieId = searchParams.get('movieId');

    // Helper function to format time from "HH:MM" to "h:MM AM/PM"
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12; // Convert to 12-hour format
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    /**
     * useEffect: Fetch movie details and screening showtimes when the movieId changes.
     * - Fetches movie data from movies.json and sets the movie state.
     * - Fetches showtimes from showtimes.json, groups by sala, and sets screenings state.
     * - Sets loading and error states accordingly.
     */
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch(`data/movies.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const movie = data.movies.find((movie) => movie.id === movieId)
                if (!movie) {
                    throw new Error('Movie not found');
                }
                setMovie(movie);
                setIsLoading(false);
            }
            catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        const fetchScreenings = async () => {
            try {
                const response = await fetch('data/showtimes.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Get all screenings for this movie
                const movieScreenings = data.filter((showtime) => showtime.movie_id === movieId);

                if (movieScreenings.length === 0) {
                    throw new Error('Showtimes not found for this movie');
                }

                // Format screenings by dates
                const formattedScreenings = {
                    sala: movieScreenings[0].sala,
                    dates: movieScreenings.reduce((dates, screening) => {
                        dates[screening.date] = screening.times;
                        return dates;
                    }, {})
                };

                setScreenings([formattedScreenings]);
                
                // Set initial selected date to the earliest available date
                const availableDates = [...new Set(movieScreenings.map(s => s.date))].sort();
                if (availableDates.length > 0) {
                    setSelectedDate(availableDates[0]);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load screenings:", error);
                setScreenings([]);
                setIsLoading(false);
            }
        };

        if (movieId) {
            fetchMovieData();
            fetchScreenings();
        }
        else {
            setError('Movie ID is missing');
            setIsLoading(false);
        }
    }, [movieId]);

    if (isloading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-white">Loading...</p>
        </div>;
    }

    if (error) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>;
    }

    // Handlers for trailer modal and time selection
    const openTrailer = () => setShowTrailer(true);
    const closeTrailer = () => setShowTrailer(false);
    const handleTimeSelect = (day, time) => {
        if (selectedTime === time) {
            setSelectedTime(null);
        } else {
            setSelectedTime(time);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* --- Back Button: Returns to the previous page --- */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-10 flex items-center gap-2 p-3 bg-black/40 backdrop-blur-lg rounded-full border border-white/10 text-white hover:bg-black/60 hover:border-white/20 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div className="md:flex md:min-h-screen">
                {/* --- Movie Poster and Mobile Trailer Button --- */}
                <div className="relative w-full md:w-2/5 h-[50vh] md:h-screen overflow-hidden">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:from-black md:via-black/30 md:to-transparent from-black/90 via-black/30 to-transparent" />

                    {/* --- Watch Trailer Button (Mobile Only) --- */}
                    <button
                        onClick={openTrailer}
                        className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Trailer
                    </button>
                </div>

                {/* --- Movie Info, Trailer Button (Desktop), and Screenings Selector --- */}
                <div className="relative md:w-3/5 flex items-start">
                    <div className="px-6 py-6 w-full max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">{movie.title}</h1>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                    {movie.duration}
                                </span>
                                {movie.categories.map((category, index) => (
                                    <span key={index} className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                        {category}
                                    </span>
                                ))}
                            </div>
                            {/* --- Watch Trailer Button (Desktop Only) --- */}
                            <button
                                onClick={openTrailer}
                                className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg w-fit"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Trailer
                            </button>
                        </div>

                        {/* --- Screenings Selector: Date and Time --- */}
                        {screenings.length > 0 ? (
                            <>
                                {/* --- Date Selector --- */}
                                <div className="space-y-3">
                                    <h2 className="text-xl font-semibold text-white">Select Date</h2>
                                    <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
                                        {Object.keys(screenings[0].dates).map((date, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition duration-300 flex flex-col items-center min-w-[90px] ${selectedDate === date
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                            >
                                                <span className="text-sm opacity-80">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                <span className="text-xl font-bold my-0.5">{new Date(date).getDate()}</span>
                                                <span className="text-sm opacity-80">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white">Available Times</h2>
                                    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl p-6">
                                        <h3 className="text-lg font-medium text-white mb-4">{screenings[0].sala}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {screenings[0].dates[selectedDate]?.map((time, j) => (
                                                <button
                                                    key={j}
                                                    onClick={() => handleTimeSelect(selectedDate, time)}
                                                    className={`
                                                    flex items-center justify-center gap-2 py-4 px-6 
                                                    text-lg font-semibold rounded-xl
                                                    transition-all duration-300 ease-out
                                                    hover:scale-105 active:scale-95
                                                    ${selectedTime === time
                                                            ? 'bg-white text-black shadow-xl ring-2 ring-white/50 ring-offset-2 ring-offset-black'
                                                            : 'bg-white/10 text-white hover:bg-white/20'
                                                        }
                                                `}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6.41V4a1 1 0 10-2 0v6c0 .28.11.53.29.71l4 4a1 1 0 001.42-1.42L11 9.59z" />
                                                    </svg>
                                                    <span>{formatTime(time)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* --- Next Button: Proceed to Select Tickets --- */}
                                <div className="mt-6">
                                    <button
                                        onClick={() => navigate('/select-tickets', { state: { movie, selectedTime, selectedDate } })}
                                        disabled={!selectedTime}
                                        className={`
                                            w-full px-5 py-3 text-lg font-semibold rounded-lg transition-colors duration-200
                                            ${selectedTime
                                                ? 'bg-white text-black hover:bg-gray-900 hover:text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        Next: Select Tickets
                                    </button>
                                </div>
                            </>
                        ) : (
                            // --- No Showtimes Available Message ---
                            <div className="flex flex-col items-center justify-center py-12 px-4 bg-zinc-900/50 backdrop-blur-xl rounded-xl text-center">
                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-white mb-2">No Showtimes Available</h3>
                                <p className="text-gray-400">There are currently no scheduled showtimes for this movie. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Trailer Modal: Shows YouTube trailer in a modal overlay --- */}
            {showTrailer && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl aspect-video">
                        <button onClick={closeTrailer} className="absolute top-0 right-0 text-white p-2">
                            &#10005;
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${movie.youtube_trailer_id}`}
                            title={movie.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetailView;