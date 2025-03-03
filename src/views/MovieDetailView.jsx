import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieDetailView = () => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const openTrailer = () => setShowTrailer(true);
  const closeTrailer = () => setShowTrailer(false);

  const handleTimeSelect = (day, time) => {
    if (selectedTime === time && selectedDay === day) {
      setSelectedTime(null);
      setSelectedDay(null);
    } else {
      setSelectedTime(time);
      setSelectedDay(day);
      navigate('/booking', { state: { day, time, movieId: '12121212' } });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showtimes = [
    {
      day: "Jueves 27",
      times: ["4:50 PM", "7:00 PM", "9:40 PM"]
    },
    {
      day: "Viernes 28",
      times: ["4:50 PM", "7:00 PM", "9:40 PM"]
    },
    {
      day: "Sabado 1, Domingo 2",
      times: ["1:40 PM", "4:20 PM", "7:00 PM", "9:40 PM"]
    },
    {
      day: "Lunes 3, Martes 4, Miercoles 5",
      times: ["4:50 PM", "7:00 PM", "9:40 PM"]
    }
  ];


  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-10 text-white hover:text-zinc-300 transition-all duration-300 
          flex items-center gap-2 group bg-black/40 hover:bg-black/60 backdrop-blur-lg 
          rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Main content container */}
      <div className="md:flex md:min-h-screen">
        {/* Movie Poster */}
        <div className="relative w-full md:w-1/2 h-[80vh] md:h-screen overflow-hidden">
          <img 
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105" 
            src="https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" 
            alt="Dune Part Two" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent" />
        </div>

        {/* Movie Info */}
        <div className="relative -mt-40 md:mt-0 md:w-1/2 md:flex md:items-center">
          <div className="px-6 pb-12 md:px-16 md:py-0 w-full max-w-3xl mx-auto">
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none animate-fade-in">
                  Dune Part Two
                </h1>
                <p className="text-zinc-400 text-xl md:text-2xl font-medium">Denis Villeneuve</p>
                <button 
                  onClick={openTrailer}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-black/20 mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Trailer
                </button>
              </div>
              
              {/* Movie Details */}
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">2h 46m</span>
                <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">Sci-Fi</span>
                <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">PG-13</span>
                <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">IMAX</span>
              </div>

              {/* Showtimes Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Horarios</h2>
                <div className="space-y-6">
                  {showtimes.map((schedule, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-medium text-zinc-400">{schedule.day}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {schedule.times.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(schedule.day, time)}
                            className={`py-3 px-4 backdrop-blur-xl text-white font-medium rounded-xl transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 ${selectedTime === time && selectedDay === schedule.day ? 'bg-white/30 border-2 border-white scale-[1.05] shadow-lg shadow-white/20' : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <button
              onClick={closeTrailer}
              className="absolute -top-12 right-0 text-white hover:text-zinc-300 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Way9Dexny3w"
              title="Dune: Part Two Trailer"
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

