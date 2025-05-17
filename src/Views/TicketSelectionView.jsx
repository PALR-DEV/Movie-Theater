import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import formatTime from '../../Utils/FormatTime';
import formatDate from '../../Utils/FormatDate';

const TicketSelectionView = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [movieData, setMovieData] = useState({});
    const [ticketTime, setTime] = useState(null);
    const [TicketDate, setDate] = useState(null);
    const [ticketCounts, setTicketCounts] = useState({ Adult: 0, Senior: 0, Kid: 0 });
    const [ticketPrices] = useState({ Adult: 12.99, Senior: 10.99, Kid: 8.99 });
    const [sala, setSala] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    //helper function to get the total number of tickets
    const getTotalTickets = (counts) => {
        return Object.values(counts).reduce((sum, count) => sum + count, 0);
    };

    //helper function to calculate the total price
    const calculateTotalPrice = () => {
        return Object.entries(ticketCounts).reduce((total, [type, count]) => {
            return total + ticketPrices[type] * count;
        }, 0).toFixed(2);
    }




    const handleIncrement = (type) => {
        setTicketCounts((prev) => ({
            ...prev,
            [type]: prev[type] + 1
        }));
    };

    const handleDecrement = (type) => {
        setTicketCounts((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] - 1)
        }));
    };


    useEffect(() => {
        if (!location.state) {
            navigate(-1);
            return;
        }

        const { movie, selectedTime, selectedDate, sala } = location.state;

        if (movie && selectedTime && selectedDate && sala) {
            setMovieData(movie);
            setTime(formatTime(selectedTime));
            // Format the date using our utility function
            const formattedDate = formatDate(selectedDate);
            const fullWeekday = formattedDate.weekday
                .replace('Mon', 'Monday')
                .replace('Tue', 'Tuesday')
                .replace('Wed', 'Wednesday')
                .replace('Thu', 'Thursday')
                .replace('Fri', 'Friday')
                .replace('Sat', 'Saturday')
                .replace('Sun', 'Sunday');

            setDate(`${fullWeekday}, ${formattedDate.month} ${formattedDate.day}`);
            setSala(sala);
        }



    }, [location, navigate])

    return (
        <div className="min-h-screen bg-black text-white">
            <button onClick={() => {
                navigate(-1);
            }} className="fixed top-6 left-6 z-10 text-white hover:text-zinc-300 transition-all duration-300 
                flex items-center gap-2 group bg-black/40 hover:bg-white/10 backdrop-blur-lg 
                rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div className="container mx-auto px-4 pt-24 pb-32 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 ">
                        <div className="relative h-72 md:h-96 overflow-hidden">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                            <img
                                className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                src={movieData.poster_url}
                                alt={movieData.title}
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{movieData.title}</h1>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6.41V4a1 1 0 10-2 0v6c0 .28.11.53.29.71l4 4a1 1 0 001.42-1.42L11 9.59z" />
                                        </svg>
                                        <span className="text-xs sm:text-sm md:text-base">{ticketTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                                        </svg>
                                        <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">{TicketDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 3a1 1 0 012 0v1h2V3a1 1 0 112 0v1h2a2 2 0 012 2v2H3V6a2 2 0 012-2h2V3zM3 9h18v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        </svg>
                                        <span className="text-xs sm:text-sm md:text-base">Room {sala}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold mb-2">Screening Room Details</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                                            </svg>
                                            <span className="font-medium">Room {sala}</span>
                                        </div>
                                        <div className="text-xs px-3 py-1 bg-white/10 rounded-full text-zinc-300">
                                            Premium Seating
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl transform transition-all duration-500 ">
                        <h2 className="text-2xl font-bold mb-8">Select Your Tickets</h2>
                        <div className="space-y-4 mb-8">
                            {["Adult", "Senior", "Kid"].map((type) => (
                                <div key={type} className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold capitalize group-hover:text-white transition-colors duration-300">
                                            {type}
                                        </h3>
                                        <p className="text-zinc-400 text-sm">{ticketPrices[type]}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/20 rounded-xl p-1">
                                        <button className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300" onClick={() => handleDecrement(type)}>
                                            <span className="text-2xl sm:text-xl font-light">-</span>
                                        </button>
                                        <span className="w-10 text-center text-xl font-medium">{ticketCounts[type]}</span>
                                        <button className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300" onClick={() => handleIncrement(type)}>
                                            <span className="text-2xl sm:text-xl font-light">+</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-baseline">
                                    <div className="flex flex-col">
                                        <p className="text-zinc-400 text-sm">Total Amount</p>
                                        <p className="text-3xl font-bold">${calculateTotalPrice()}</p>
                                    </div>
                                    <div className="text-sm text-zinc-400">{getTotalTickets(ticketCounts)} tickets</div>
                                </div>
                                
                                <button
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-500 transform  ${getTotalTickets(ticketCounts) > 0 ? 'bg-white text-black hover:bg-gray-950 hover:text-white hover:translate-y-[-2px]' : 'bg-white/5 text-zinc-500 cursor-not-allowed'}`}
                                    disabled={getTotalTickets(ticketCounts) === 0}
                                    onClick={() => {
                                        // Add your checkout logic here
                                        console.log('Proceeding to checkout...');
                                        navigate('/checkout', {
                                            state: {
                                                movieData,
                                                ticketTime,
                                                TicketDate: location.state.selectedDate,
                                                sala,
                                                ticketCounts,
                                                totalPrice: calculateTotalPrice(),
                                                totalTickets: getTotalTickets(ticketCounts)
                                            }
                                        });

                                    }}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketSelectionView;