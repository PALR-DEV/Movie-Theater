import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import movieService from '../Services/MovieServices';

const MovieDetailView = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [movie, setMovie] = useState({});
  const [screenings, setScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const openTrailer = () => setShowTrailer(true);
  const closeTrailer = () => setShowTrailer(false);

  const parseShowDateTime = (day, time) => {
    // Split the day into parts
    const [dayName, monthAndDate] = day.split(', ');
    const [monthName, date] = monthAndDate.split(' ');

    // Parse the time components
    const [hour, minutePeriod] = time.split(':');
    const [minute, period] = minutePeriod.split(' ');
    
    const month = new Date(`${monthName} 1`).getMonth();
    const year = new Date().getFullYear(); // Current year
    const adjustedHour = period === 'PM' && hour !== '12' ? parseInt(hour) + 12 : (period === 'AM' && hour === '12' ? 0 : parseInt(hour));

    // Create the showDateTime in local timezone
    const showDateTime = new Date(year, month, parseInt(date), adjustedHour, parseInt(minute));
    
    // Adjust year if the parsed date is in the past and belongs to an earlier month
    if (showDateTime < currentDateTime && showDateTime.getMonth() < currentDateTime.getMonth()) {
        showDateTime.setFullYear(year + 1);
    }
    
    return showDateTime;
};

  const handleTimeSelect = (day, time, sala) => {
    const showDateTime = parseShowDateTime(day, time);
    const timeDifference = showDateTime - currentDateTime;
    const minutesDifference = timeDifference / (1000 * 60);

    // Check if showtime has passed or is too close
    if (timeDifference < 0) {
      console.log("This showing has already started");
      return; // Past showtime
    }

    if (minutesDifference < 30) {
      console.log("Less than 30 minutes until showtime");
      return; // Less than 30 minutes until showtime
    }

    if (selectedTime === time && selectedDay === day) {
      setSelectedTime(null);
      setSelectedDay(null);
    } else {
      setSelectedTime(time);
      setSelectedDay(day);
      navigate('/booking', { state: { day, time, sala, movieId: id } });
    }
  };

  const isTimeDisabled = (day, time) => {
    const showDateTime = parseShowDateTime(day, time);
    const timeDifference = showDateTime - currentDateTime;
    const minutesDifference = timeDifference / (1000 * 60);

    return timeDifference < 0 || minutesDifference < 30;
};

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movie = await movieService.getMoviebyID(id);
        const formattedMovie = {
          ...movie,
          categories: JSON.parse(movie.categories),
          screenings: movie.screenings.map(screening => {
            // Create an array to hold date objects and their formatted strings
            const dateObjects = screening.time_slots.map(slot => {
              const date = new Date(slot.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const monthName = date.toLocaleDateString('en-US', { month: 'short' });
              const dayDate = date.getDate();
              const formattedDate = `${dayName}, ${monthName} ${dayDate}`;
              return {
                dateObj: date,
                formattedDate,
                times: slot.times.sort((a, b) => {
                  // Sort times (e.g., "7:30 PM")
                  const [hourA, minutePeriodA] = a.split(':');
                  const [minuteA, periodA] = minutePeriodA.split(' ');
                  const [hourB, minutePeriodB] = b.split(':');
                  const [minuteB, periodB] = minutePeriodB.split(' ');
                  
                  // Convert to 24-hour format for comparison
                  const hourANum = parseInt(hourA);
                  const hourBNum = parseInt(hourB);
                  const hour24A = periodA === 'PM' && hourANum !== 12 ? hourANum + 12 : (periodA === 'AM' && hourANum === 12 ? 0 : hourANum);
                  const hour24B = periodB === 'PM' && hourBNum !== 12 ? hourBNum + 12 : (periodB === 'AM' && hourBNum === 12 ? 0 : hourBNum);
                  
                  if (hour24A !== hour24B) {
                    return hour24A - hour24B;
                  }
                  return parseInt(minuteA) - parseInt(minuteB);
                })
              };
            });
            
            // Sort the date objects chronologically
            dateObjects.sort((a, b) => a.dateObj - b.dateObj);
            
            // Convert back to the timeSlotsByDay format
            const formattedTimeSlots = dateObjects.reduce((acc, { formattedDate, times }) => {
              return {
                ...acc,
                [formattedDate]: times
              };
            }, {});
            
            return {
              sala: screening.sala,
              timeSlotsByDay: formattedTimeSlots
            };
          })
        };
        setScreenings(formattedMovie.screenings);
        setMovie(formattedMovie);
      } catch (error) {
        console.error("error fetching movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="md:flex md:min-h-screen">
          {/* Skeleton Poster */}
          <div className="relative w-full md:w-1/2 h-[80vh] md:h-screen overflow-hidden">
            <div className="w-full h-full bg-white/10 animate-pulse" />
          </div>

          {/* Skeleton Content */}
          <div className="relative -mt-40 md:mt-0 md:w-1/2 md:flex md:items-center">
            <div className="px-6 pb-12 md:px-16 md:py-0 w-full max-w-3xl mx-auto">
              <div className="space-y-8 md:space-y-10">
                {/* Title Skeleton */}
                <div className="h-16 bg-white/10 rounded-lg animate-pulse" />

                {/* Trailer Button Skeleton */}
                <div className="h-12 w-40 bg-white/10 rounded-full animate-pulse" />

                {/* Categories Skeleton */}
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-20 bg-white/10 rounded-full animate-pulse" />
                  ))}
                </div>

                {/* Showtimes Skeleton */}
                <div className="space-y-6">
                  <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
                  <div className="space-y-8">
                    {[1, 2].map((section) => (
                      <div key={section} className="space-y-6">
                        <div className="space-y-4">
                          <div className="h-6 w-24 bg-white/10 rounded-lg animate-pulse" />
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((time) => (
                              <div key={time} className="h-12 bg-white/10 rounded-xl animate-pulse" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            src={movie.poster_url} 
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent" />
        </div>

        {/* Movie Info */}
        <div className="relative -mt-40 md:mt-0 md:w-1/2 md:flex md:items-center">
          <div className="px-6 pb-32 md:px-16 md:py-0 md:pb-32 w-full max-w-3xl mx-auto">
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none animate-fade-in">
                  {movie.title}
                </h1>
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
                <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">{movie.duration}</span>
                {movie.categories && movie.categories.map((category, index) => (
                  <span key={index} className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors duration-300">{category}</span>
                ))}
              </div>


              {/* Showtimes Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Horarios</h2>
                <div className="space-y-8">
                  {screenings.map((screening, screeningIndex) => (
                    <div key={screeningIndex} className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-white">{screening.sala}</h3>
                        {Object.entries(screening.timeSlotsByDay).map(([day, times], dayIndex) => (
                          <div key={dayIndex} className="space-y-4">
                            <h4 className="text-base font-medium text-zinc-400">{day}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {times.map((time) => {
                                // Check if the time is disabled with the updated logic
                                const isDisabled = isTimeDisabled(day, time);
                                
                                return (
                                  <button
                                    key={time}
                                    onClick={() => !isDisabled && handleTimeSelect(day, time, screening.sala)}
                                    className={`py-3 px-4 backdrop-blur-xl text-white font-medium rounded-xl transition-all duration-500 transform focus:outline-none focus:ring-2 focus:ring-white/30 
                                      ${isDisabled 
                                        ? 'opacity-50 cursor-not-allowed bg-zinc-800 line-through' 
                                        : selectedTime === time && selectedDay === day 
                                          ? 'bg-white/30 border-2 border-white scale-[1.05] shadow-lg shadow-white/20 hover:scale-[1.02] active:scale-95' 
                                          : 'bg-white/10 hover:bg-white/20 border-2 border-transparent hover:scale-[1.02] active:scale-95'
                                      }`}
                                    disabled={isDisabled}
                                    title={isDisabled ? "This showtime is no longer available for booking" : ""}
                                  >
                                    {time}
                                  </button>
                                );
                            })}
                            </div>
                          </div>
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