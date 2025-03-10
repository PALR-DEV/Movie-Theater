import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import movieService from '../Services/MovieServices';

const stripePromise = loadStripe('pk_test_51QyWMfQIfffWksP334nTV1WPtzBjisMJX5RBzJow4rfNcg3iLwkKNCojMgxa72r0E5n7YSAplRCxhnkFOJW84iSC00ajWnaKpP');
// const stripePromise = loadStripe('pk_live_51Q4Yh3GOdVFJ1feYPV1V1eV9OQijoiAQeP8EkSEvXJnCNLfLwnW0bvFUubusOkP28vkU3BnfGTGCVVxf0jBSF8Rv00hEawqZHO');


const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(null); // Store client secret
    const { tickets, total, movieDetails } = location.state || {};

    const [ticketId, setTicketId] = useState(null);
    const [formData, setFormData] = useState({
        cardName: '',
        email: ''
    });

    // Fetch client secret when component mounts
    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/payment/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        name:formData.cardName,
                        amount: Math.round(total * 1.115 + 1),
                        currency: 'usd',
                        movieDetails: movieDetails,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Payment server error: ${errorData}`);
                }
                const data = await response.json();
                console.log(data)
                if (!data.clientSecret) {
                    throw new Error('Invalid response from payment server');
                }
                setClientSecret(data.clientSecret);
                setError(null);
            } catch (error) {
                console.error('Error fetching client secret:', error);
                if (error.message.includes('Failed to fetch')) {
                    setError('Payment server is currently unavailable. Please try again later.');
                } else {
                    setError(error.message || 'Failed to initialize payment');
                }
            }
        };

        if (total > 0) {
            fetchClientSecret();
        }
    }, [total, movieDetails, formData.email]); // Dependencies to refetch if these change




    async function saveTickets(paymentData) {
        try {
            //calculate the total number of tickets 
            const totalTicketCount = Object.values(tickets).reduce((sum, count) => sum + count, 0);

            const ticket = {
                paymentId: paymentData.paymentId,
                name:formData.cardName,
                email: formData.email,
                amount: (total * 1.115 + 1).toFixed(2),
                movieDetails: movieDetails,
                scanned_count: 0,
                max_scans:totalTicketCount,
                tickets: tickets,
                status: 'active',
            };

            await movieService.storeMovieTickets(ticket);
        } catch (error) {
            console.error('Error saving tickets:', error);
            throw error;
        }
    }

    async function saveTransaction(paymentData) {
        try {
            const transaction = {
                paymentId: paymentData.id,
                email: formData.email,
                name:formData.cardName,
                amount: (total * 1.115 + 1).toFixed(2),
                tax: (total * 0.115).toFixed(2),
                movieId: movieDetails.movieId,
                movieName:movieDetails.title,
                tickets: tickets,
                status: 'completed',

            }
            await movieService.storeTransaction(transaction);

        } catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    }

    const elementStyles = {
        base: {
            color: 'white',
            fontFamily: 'inherit',
            fontSize: '16px',
            '::placeholder': { color: '#64748b' },
            backgroundColor: 'transparent',
            iconColor: 'white',
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setProcessing(true);
        const cardElement = elements.getElement(CardNumberElement);

        try {
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: formData.cardName,
                        email: formData.email,
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                //store tickets and transaction
                await saveTickets({ paymentId: paymentIntent.id });
                await saveTransaction({ paymentId: paymentIntent.id });

                setError(null);
                setProcessing(false);
                navigate('/purchase-complete', {
                    state: { 
                        tickets, 
                        total, 
                        movieDetails, 
                        paymentId: paymentIntent.id 
                    },
                });
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An error occurred while processing your payment');
            setProcessing(false);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="lg:col-span-3 lg:order-1 space-y-6 relative">
            {processing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-medium">Processing your payment...</p>
                    </div>
                </div>
            )}

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
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
                <div>
                    <label htmlFor="card-number" className="block text-sm font-medium mb-2">Card Number</label>
                    <div className="relative w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-white/20 transition-colors">
                        <CardNumberElement options={{ style: elementStyles, placeholder: '1234 5678 9012 3456', showIcon: true }} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="card-expiry" className="block text-sm font-medium mb-2">Expiry Date</label>
                        <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-white/20 transition-colors">
                            <CardExpiryElement options={{ style: elementStyles }} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="card-cvc" className="block text-sm font-medium mb-2">CVV</label>
                        <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-white/20 transition-colors">
                            <CardCvcElement options={{ style: elementStyles }} />
                        </div>
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
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing || !clientSecret}
                className={`w-full px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${processing || !stripe || !clientSecret ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'}`}
            >
                {processing ? 'Processing...' : `Pay $${(total * 1.115 + 1).toFixed(2)}`}
            </button>
            <p className="text-center text-sm text-zinc-400 mt-4">
                By completing this purchase, you agree to our{' '}
                <button type="button" className="text-white hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-white hover:underline">Cancellation Policy</button>
            </p>
        </form>
    );
};

// Wrap the CheckOutView with Elements (unchanged)
const CheckOutView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tickets = { adult: 0, senior: 0, kid: 0 }, total = 0, movieDetails = {} } = location.state || {};

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <button onClick={() => navigate(-1)} className="fixed top-2 left-4 sm:left-8 z-50 text-white hover:text-zinc-300 transition-all duration-300 flex items-center gap-2 group bg-black/40 hover:bg-black/60 backdrop-blur-lg rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
                    <p className="text-zinc-400">Please enter your payment details below</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 lg:order-2 space-y-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                            <div className="p-6 space-y-6">
                                <h3 className="text-2xl font-semibold">Order Summary</h3>
                                <div className="space-y-4 pb-6 border-b border-white/10">
                                    <h4 className="text-lg font-medium text-zinc-300">{movieDetails.title}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.day}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.time}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.sala}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pb-6 border-b border-white/10">
                                    {tickets.adult > 0 && (
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="font-medium">Adult Tickets</p>
                                                <p className="text-sm text-zinc-400">{tickets.adult} × $12.99</p>
                                            </div>
                                            <p className="font-medium">${(tickets.adult * 12.99).toFixed(2)}</p>
                                        </div>
                                    )}
                                    {tickets.senior > 0 && (
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="font-medium">Senior Tickets</p>
                                                <p className="text-sm text-zinc-400">{tickets.senior} × $8.99</p>
                                            </div>
                                            <p className="font-medium">${(tickets.senior * 8.99).toFixed(2)}</p>
                                        </div>
                                    )}
                                    {tickets.kid > 0 && (
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="font-medium">Kid Tickets</p>
                                                <p className="text-sm text-zinc-400">{tickets.kid} × $6.99</p>
                                            </div>
                                            <p className="font-medium">${(tickets.kid * 6.99).toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-zinc-400">
                                        <p>Subtotal</p>
                                        <p>${total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-zinc-400">
                                        <p>IVU (11.5%)</p>
                                        <p>${(total * 0.115).toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-zinc-400">
                                        <p>Service Fee</p>
                                        <p>$1.00</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <p className="text-lg font-semibold">Total</p>
                                        <p className="text-2xl font-bold">${(total * 1.115 + 1).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Elements stripe={stripePromise}>
                        <PaymentForm />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default CheckOutView;