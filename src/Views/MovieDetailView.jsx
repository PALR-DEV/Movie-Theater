import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MovieDetailView = () => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Mon, May 20');
    const [selectedTime, setSelectedTime] = useState(null);
    const [isloading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movie, setMovie] = useState(null);
    const [searchParams] = useSearchParams();
    const movieId = searchParams.get('movieId');

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
                
                
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        }

        if(movieId) {
            fetchMovieData();
            fetchScreenings();
        }
        else {
            setError('Movie ID is missing');
            setIsLoading(false);
        }


    },[movieId]);


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


    const dates = [
        { fullDate: 'Mon, May 20', day: 'Mon', date: 20, month: 'May' },
        { fullDate: 'Tue, May 21', day: 'Tue', date: 21, month: 'May' },
        { fullDate: 'Wed, May 22', day: 'Wed', date: 22, month: 'May' },
    ];

    const screenings = [
        {
            sala: 'Sala 1',
            timeSlotsByDay: {
                'Mon, May 20': ['10:00 AM', '1:00 PM', '4:00 PM'],
                'Tue, May 21': ['11:00 AM', '2:00 PM', '5:00 PM'],
                'Wed, May 22': ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM', '11:00 PM'],
            },
        },
    ];

    const openTrailer = () => setShowTrailer(true);
    const closeTrailer = () => setShowTrailer(false);
    const handleTimeSelect = (day, time) => {
        if (selectedDate === day && selectedTime === time) {
            setSelectedTime(null);
        } else {
            setSelectedDate(day);
            setSelectedTime(time);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-10 flex items-center gap-2 p-3 bg-black/40 backdrop-blur-lg rounded-full border border-white/10 text-white hover:bg-black/60 hover:border-white/20 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div className="md:flex md:min-h-screen">
                {/* Poster */}
                <div className="relative w-full md:w-2/5 h-[50vh] md:h-screen overflow-hidden">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:from-black md:via-black/30 md:to-transparent from-black/90 via-black/30 to-transparent" />
                </div>

                {/* Info */}
                <div className="relative md:w-3/5 flex items-start">
                    <div className="px-6 py-6 w-full max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">{movie.title}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={openTrailer}
                                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Trailer
                            </button>
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                {movie.duration}
                            </span>
                            {movie.categories.map((category, index) => (
                                <span key={index} className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                    {category}
                                </span>
                            ))}
                        </div>

                        {/* Date Selector */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-white">Select Date</h2>
                            <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
                                {dates.map((date, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date.fullDate)}
                                        className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition duration-300 flex flex-col items-center min-w-[90px] ${selectedDate === date.fullDate
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <span className="text-sm opacity-80">{date.day}</span>
                                        <span className="text-xl font-bold my-0.5">{date.date}</span>
                                        <span className="text-sm opacity-80">{date.month}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white">Available Times</h2>
                            {screenings.map((screening, idx) => (
                                <div key={idx} className="bg-zinc-900/50 backdrop-blur-xl rounded-xl p-4 mb-4">
                                    <h3 className="text-base font-medium text-white">{screening.sala}</h3>
                                    <div className="grid grid-cols-3 gap-3 mt-3">
                                        {screening.timeSlotsByDay[selectedDate]?.map((time, j) => (
                                            <button
                                                key={j}
                                                onClick={() => handleTimeSelect(selectedDate, time)}
                                                className={`
                                                    flex items-center justify-center gap-2 py-2 px-3 text-base font-semibold rounded-lg transition-transform duration-200
                                                    ${selectedTime === time ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'}
                                                `}
                                            >
                                                <span>{time}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Button */}
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/select-tickets', { state: { movie, selectedDate, selectedTime } })}
                                disabled={!selectedTime}
                                className={`w-full px-5 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${selectedTime ? 'bg-white text-black hover:bg-gray-400 hover:text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed' }`}
                            >
                                Next: Select Tickets
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl aspect-video">
                        <button onClick={closeTrailer} className="absolute top-0 right-0 text-white p-2">
                            &#10005;
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${movie.trailer_youtube_id}`}
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