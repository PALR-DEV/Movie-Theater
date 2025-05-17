import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import formatDate from "../../Utils/FormatDate";

export default function CheckOutView() {
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [serviceFee] = useState(1.50);
    const [ivuRate] = useState(0.115); // 11.5%
    const location = useLocation();
    const { state } = location;

    useEffect(() => {
      console.log(state)
    })

    // Mock data for UI demonstration
    const mockData = {
        movie: {
            title: "Inception",
            poster_url: "https://images.fandango.com/ImageRenderer/0/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/239973/starwarsepisodeiii-rerelease-posterart.jpg"
        },
        selectedDate: "May 18, 2025",
        selectedTime: "7:30 PM",
        ticketCounts: {
            Adult: 2,
            Senior: 1,
            Kid: 1
        },
        totalAmount: "45.96"
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry date
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
        }
        return v;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add payment processing logic here
        console.log('Processing payment...');
    };

    // Using mock data instead of location state
    const { movie, selectedTime, selectedDate, ticketCounts, totalAmount } = mockData;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-10 text-white hover:text-zinc-300 transition-all duration-300 
                    flex items-center gap-2 group bg-black/40 hover:bg-white/10 backdrop-blur-lg 
                    rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div className="container mx-auto px-4 pt-24 pb-32 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl h-fit border border-white/10">
                        {/* Movie Poster Header */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={location.state.movieData.poster_url}
                                alt={location.state.movieData.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h2 className="text-2xl font-bold text-white">{location.state.movieData.title}</h2>
                            </div>
                        </div>
                        
                        {/* Summary Content */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center">
                                    <span className="text-sm text-zinc-400">Date</span>
                                    <span className="text-lg font-semibold mt-1">{location.state.TicketDate}</span>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center">
                                    <span className="text-sm text-zinc-400">Time</span>
                                    <span className="text-lg font-semibold mt-1">{location.state.ticketTime}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Your Tickets</h3>
                                    <div className="px-3 py-1 bg-white/10 rounded-full">
                                        <span className="text-sm text-zinc-300">
                                            {Object.values(location.state.ticketCounts).reduce((a, b) => a + b, 0)} tickets
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {Object.entries(location.state.ticketCounts).map(([type, count]) => count > 0 && (
                                        <div key={type} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                                                    {count}
                                                </span>
                                                <span className="text-base text-zinc-200">{type}</span>
                                            </div>
                                            <span className="font-semibold">${(count * (type === 'Adult' ? 12.99 : type === 'Senior' ? 10.99 : 8.99)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-zinc-400">Subtotal</span>
                                        <span className="font-medium">${Number(location.state.totalPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-zinc-400">Service Fee</span>
                                        <span className="font-medium">${serviceFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-zinc-400">IVU ({(ivuRate * 100).toFixed(1)}%)</span>
                                        <span className="font-medium">${(Number(location.state.totalPrice) * ivuRate).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-white/10"></div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <span className="text-sm text-zinc-400">Total Amount</span>
                                            <div className="text-3xl font-bold mt-1">${(Number(location.state.totalPrice) + serviceFee + Number(location.state.totalPrice) * ivuRate).toFixed(2)}</div>
                                        </div>
                                        <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                                        placeholder="Cardholder Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                                            placeholder="123"
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg transition-all duration-500 transform hover:bg-gray-900 hover:text-white hover:translate-y-[-2px]"
                            >
                                Pay ${(Number(location.state.totalPrice) + serviceFee + Number(location.state.totalPrice) * ivuRate).toFixed(2)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}