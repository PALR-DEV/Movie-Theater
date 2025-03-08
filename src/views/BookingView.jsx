import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import movieService from '../Services/MovieServices';

const BookingView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Hardcoded values for development
    // const day = "Thursday, March 28";
    // const time = "7:00 PM";
    // const movieId = "12345";
    const { day, time, sala, movieId } = location.state;
    const [movie, setMovie] = useState();

    useEffect(() => {
        const fetchMovie = async() => {
            const getMovie = await movieService.getMoviebyID(movieId);
            // console.log(getMovie)
            setMovie(getMovie);
        }
        fetchMovie();
    }, [])

    const [tickets, setTickets] = useState({
        adult: 0,
        senior: 0,
        kid: 0
    });

    const [total, setTotal] = useState(0);
    const PRICES = {
        adult: 12.99,
        senior: 8.99,
        kid: 6.99
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Comment out the navigation to home for now
        // if (!location.state) {
        //   navigate('/');
        //   return;
        // }

        const adultTickets = tickets.adult;
        const seniorTickets = tickets.senior;
        const kidTickets = tickets.kid;

        // Calculate total - kids are free when there are adult tickets
        const newTotal = (adultTickets * PRICES.adult) + 
                        (seniorTickets * PRICES.senior) + 
                        (adultTickets > 0 ? 0 : kidTickets * PRICES.kid);
        setTotal(newTotal);
    }, [tickets, location.state, navigate]);

    const handleTicketChange = (type, operation) => {
        setTickets(prev => {
            const newValue = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            return { ...prev, [type]: newValue };
        });
    };

    const handleCheckout = () => {
        if (total === 0) return;
        navigate('/checkout', { 
            state: { 
                tickets,
                total,
                movieDetails: {
                    title: movie?.title,
                    sala: movie?.screenings[0].sala,
                    day,
                    time
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
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
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* Movie Info Section */}
            <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
                <img
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                    src={movie?.poster_url}
                    alt={movie?.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent md:bg-gradient-to-t md:from-black md:via-black/50 md:to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 max-w-4xl mx-auto leading-tight">Dune Part Two</h1>
                    <p className="text-zinc-300 text-xl md:text-2xl">{day} at {time}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative z-10">
                {/* Booking Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Select Your Tickets</h2>
                </div>

                {/* Ticket Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
                    {/* Adult Tickets */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 transition-all duration-300 hover:bg-white/15">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">Adult</h3>
                                <p className="text-zinc-400">${PRICES.adult.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleTicketChange('adult', 'subtract')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                    disabled={tickets.adult === 0}
                                >
                                    <span className="text-xl md:text-2xl font-light">-</span>
                                </button>
                                <span className="w-6 md:w-8 text-center text-lg md:text-xl">{tickets.adult}</span>
                                <button
                                    onClick={() => handleTicketChange('adult', 'add')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                >
                                    <span className="text-xl md:text-2xl font-light">+</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Senior Tickets */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 transition-all duration-300 hover:bg-white/15">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">Senior</h3>
                                <p className="text-zinc-400">${PRICES.senior.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleTicketChange('senior', 'subtract')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                    disabled={tickets.senior === 0}
                                >
                                    <span className="text-xl md:text-2xl font-light">-</span>
                                </button>
                                <span className="w-6 md:w-8 text-center text-lg md:text-xl">{tickets.senior}</span>
                                <button
                                    onClick={() => handleTicketChange('senior', 'add')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                >
                                    <span className="text-xl md:text-2xl font-light">+</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kid Tickets */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 transition-all duration-300 hover:bg-white/15">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">Kid</h3>
                                <p className="text-zinc-400">${PRICES.kid.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleTicketChange('kid', 'subtract')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                    disabled={tickets.kid === 0}
                                >
                                    <span className="text-xl md:text-2xl font-light">-</span>
                                </button>
                                <span className="w-6 md:w-8 text-center text-lg md:text-xl">{tickets.kid}</span>
                                <button
                                    onClick={() => handleTicketChange('kid', 'add')}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                                >
                                    <span className="text-xl md:text-2xl font-light">+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 p-6 md:p-8 z-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                                <p className="text-zinc-400">Total Amount</p>
                                <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={total === 0}
                                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${total === 0 ? 'bg-white/20 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}`}
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingView;