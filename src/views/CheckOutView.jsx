import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QyWMfQIfffWksP334nTV1WPtzBjisMJX5RBzJow4rfNcg3iLwkKNCojMgxa72r0E5n7YSAplRCxhnkFOJW84iSC00ajWnaKpP');

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const { tickets, total, movieDetails } = location.state;
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [formData, setFormData] = useState({
        cardName: '',
        email: ''
    });



    useEffect(() => {
        if (!stripe) return;

        const pr = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
                label: 'Movie Tickets',
                amount: 100
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        pr.canMakePayment().then(result => {
            if (result) {
                setPaymentRequest(pr);
            }
        });

        pr.on('paymentmethod', async (e) => {
            setProcessing(true);
            try {
                console.log('PaymentMethod:', e.paymentMethod);
                setError(null);
                setProcessing(false);
                setStep('confirmation');
                e.complete('success');
            } catch (err) {
                setError('An error occurred while processing your payment');
                setProcessing(false);
                e.complete('fail');
            }
        });
    }, [stripe]);

    const elementStyles = {
        base: {
            color: 'white',
            fontFamily: 'inherit',
            fontSize: '16px',
            '::placeholder': {
                color: '#64748b'
            },
            backgroundColor: 'transparent',
            iconColor: 'white'
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444'
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        const cardElement = elements.getElement(CardNumberElement);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: formData.cardName,
                    // email: formData.email
                }
            });

            if (error) {
                setError(error.message);
                setProcessing(false);
            } else {
                console.log('PaymentMethod:', paymentMethod);
                setError(null);
                setProcessing(false);
                setStep('confirmation');
            }
        } catch (err) {
            setError('An error occurred while processing your payment');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="lg:col-span-3 lg:order-1 space-y-6">
            {paymentRequest && (
                <div className="mb-6">
                    <PaymentRequestButtonElement
                        options={{
                            paymentRequest,
                            style: {
                                paymentRequestButton: {
                                    type: 'default',
                                    theme: 'dark',
                                    height: '48px',
                                },
                            },
                        }}
                    />
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-zinc-400 bg-black">Or pay with card</span>
                        </div>
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
                        <CardNumberElement
                            id="card-number"
                            options={{
                                style: elementStyles,
                                placeholder: '1234 5678 9012 3456',
                                showIcon: true
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="card-expiry" className="block text-sm font-medium mb-2">Expiry Date</label>
                        <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-white/20 transition-colors">
                            <CardExpiryElement
                                id="card-expiry"
                                options={{ style: elementStyles }}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="card-cvc" className="block text-sm font-medium mb-2">CVV</label>
                        <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-white/20 transition-colors">
                            <CardCvcElement
                                id="card-cvc"
                                options={{ style: elementStyles }}
                            />
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

            {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${processing || !stripe ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'}`}
            >
                {processing ? 'Processing...' : `Pay $${(total * 1.115).toFixed(2)}`}
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

const CheckOutView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState('payment'); // 'payment' or 'confirmation'
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        // email: '',
    });

    const { tickets = { adult: 0, senior: 0, kid: 0 }, total = 0, movieDetails = {} } = location.state || {};

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
                className="fixed top-2 left-4 sm:left-8 z-50 text-white hover:text-zinc-300 transition-all duration-300 
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
                    <div className="lg:col-span-2 lg:order-2 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                            <div className="p-6 space-y-6">
                                <h3 className="text-2xl font-semibold">Order Summary</h3>
                                
                                {/* Movie Details */}
                                <div className="space-y-4 pb-6 border-b border-white/10">
                                    <h4 className="text-lg font-medium text-zinc-300">{movieDetails.title}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.day}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.time}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails.sala}</span>
                                    </div>
                                </div>
                        
                                {/* Tickets Breakdown */}
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
                        
                                {/* Total */}
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
                    
                        {/* Removing the Add Food & Drinks Button */}
                    </div>

                    {/* Payment Form */}
                    <Elements stripe={stripePromise}>
                        <PaymentForm />
                    </Elements>

                    {/* Removing the duplicate Order Summary section */}
                </div>
            </div>
        </div>
    );
};

export default CheckOutView;