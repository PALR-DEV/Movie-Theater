import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieDetailView = () => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Mon, May 20');
    const [selectedTime, setSelectedTime] = useState(null);

    const movie = {
        title: 'Dune: Part Two',
        poster_url: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        duration: '2h 46m',
        categories: ['Adventure', 'Sci-Fi', 'Drama'],
        trailer_youtube_id: 'XXXXXXXXXXX',
    };

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
                <div className="relative w-full md:w-1/2 h-[80vh] md:h-screen overflow-hidden">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                {/* Info */}
                <div className="relative md:w-1/2 flex items-center">
                    <div className="px-6 py-10 w-full max-w-3xl mx-auto space-y-8">
                        <h1 className="text-5xl sm:text-6xl font-bold text-white">{movie.title}</h1>
                        <button
                            onClick={openTrailer}
                            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch Trailer
                        </button>

                        <div className="flex flex-wrap items-center gap-4">
                            <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                {movie.duration}
                            </span>
                            {movie.categories.map((category, index) => (
                                <span key={index} className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full">
                                    {category}
                                </span>
                            ))}
                        </div>

                        {/* Date Selector */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white">Select Date</h2>
                            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                                {dates.map((date, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date.fullDate)}
                                        className={`flex-shrink-0 px-6 py-4 rounded-2xl font-medium transition duration-300 flex flex-col items-center min-w-[100px] ${selectedDate === date.fullDate
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <span className="text-sm opacity-80">{date.day}</span>
                                        <span className="text-2xl font-bold my-1">{date.date}</span>
                                        <span className="text-sm opacity-80">{date.month}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white">Available Times</h2>
                            {screenings.map((screening, idx) => (
                                <div key={idx} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 mb-6">
                                    <h3 className="text-lg font-medium text-white">{screening.sala}</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        {screening.timeSlotsByDay[selectedDate]?.map((time, j) => (
                                            <button
                                                key={j}
                                                onClick={() => handleTimeSelect(selectedDate, time)}
                                                className={`
                                                    flex items-center justify-center gap-2 py-3 px-5 text-lg font-semibold rounded-lg transition-transform duration-200
                                                    ${selectedTime === time ? 'bg-white text-black scale-110 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'}
                                                `}
                                            >
                                                <i className="fas fa-clock text-xs opacity-80"></i>
                                                <span>{time}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Next Button */}
                        {/* <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/select-tickets', { state: { movie, selectedDate, selectedTime } })}
                                disabled={!selectedTime}
                                className={`
                                    px-6 py-3 text-lg font-semibold rounded-full transition-colors duration-200
                                    ${selectedTime
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                Next: Select Tickets
                            </button>
                        </div> */}
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