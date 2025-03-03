import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckOutView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState('payment'); // 'payment' or 'confirmation'
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically process the payment
        setStep('confirmation');
    };

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    };

    if (step === 'confirmation') {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Thank You for Your Purchase!</h2>
                            <p className="text-zinc-400">Your tickets have been confirmed</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold mb-2">Movie Details</h3>
                                    <p className="text-zinc-400">Dune Part Two</p>
                                    <p className="text-zinc-400">Thursday, March 28 at 7:00 PM</p>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold mb-2">Ticket Summary</h3>
                                    <p className="text-zinc-400">2 Adult Tickets</p>
                                    <p className="text-zinc-400">1 Senior Ticket</p>
                                    <p className="text-zinc-400">Total: $34.97</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-zinc-200"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-4 sm:left-8 z-50 text-white hover:text-zinc-300 transition-all duration-300 
          flex items-center gap-2 group bg-black/40 hover:bg-black/60 backdrop-blur-lg 
          rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg"
                style={{ position: 'fixed' }}
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

            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
                    <p className="text-zinc-400">Please enter your payment details below</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Order Summary - Moved above payment form */}
                    <div className="lg:col-span-2 lg:order-2">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sticky top-6">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">2 Adult Tickets</span>
                                    <span>$25.98</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">1 Senior Ticket</span>
                                    <span>$8.99</span>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>$34.97</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="font-semibold mb-2">Dune Part Two</h3>
                                <p className="text-zinc-400">Thursday, March 28</p>
                                <p className="text-zinc-400">7:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 lg:order-1 space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formatCardNumber(formData.cardNumber)}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium mb-2">Cardholder Name</label>
                                <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium mb-2">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength="3"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email for Receipt</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-zinc-200"
                        >
                            Pay $34.97
                        </button>

                        <p className="text-center text-sm text-zinc-400 mt-4">
                            By completing this purchase, you agree to our{' '}
                            <button type="button" className="text-white hover:underline">Terms of Service</button>
                            {' '}and{' '}
                            <button type="button" className="text-white hover:underline">Cancellation Policy</button>
                        </p>
                    </form>

                    {/* Removing the duplicate Order Summary section */}
                </div>
            </div>
        </div>
    );
};

export default CheckOutView;