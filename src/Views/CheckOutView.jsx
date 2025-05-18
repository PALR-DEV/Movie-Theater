import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import formatDate from "../../Utils/FormatDate";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RO2teR59D7wgJK5Y75O2bBVM4AWCBaMQLt5W9YWGAc35ig5kvdecK9yRL5IT9n3J2QETcyx5vnGLjq3icuzSamk00dNqnEtsL');




function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceFee] = useState(1.50);
  const [ivuRate] = useState(0.115);
  const totalAmount = Number(location.state.totalPrice) + serviceFee + Number(location.state.totalPrice) * ivuRate;

  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:8080/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
            currency: 'usd',
          }),
        });
        if (!response.ok) throw new Error('Failed to create payment intent.');
        const data = await response.json();
        setClientSecret(data.clientSecret);
        // Apple Pay/PaymentRequest initialization
        if (stripe && data.clientSecret) {
          const pr = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: { label: 'Movie Tickets', amount: Math.round(totalAmount * 100) },
            requestPayerName: true,
            requestPayerEmail: true,
          });
          pr.canMakePayment().then(result => {
            if (result) setPaymentRequest(pr);
          });
          pr.on('paymentmethod', async e => {
            setLoading(true);
            const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret, {
              payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: { name, email },
              },
            });
            if (confirmError) {
              setError(confirmError.message);
              setLoading(false);
            } else {
              navigate('/success', { state: { paymentIntent: { id: e.paymentMethod.id } } });
            }
          });
        }
      } catch (err) {
        setError("Error creating payment intent.");
      }
    };
    // createPaymentIntent();
  }, [totalAmount, stripe, elements, name, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name,
            email,
          },
        },
      });
      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }
      // Payment succeeded, save ticket and send email
      // Stubbed: movieService.saveTicket(...) and emailService.sendConfirmation(...)
      // await movieService.saveTicket(...);
      // await emailService.sendConfirmation(...);
      navigate("/success", { state: { paymentIntent } });
    } catch (err) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentRequest && (
        <div className="mb-4">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'applePay',
                  theme: 'dark',
                  height: '44px',
                },
              },
            }}
          />
        </div>
      )}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-200 mb-1">
            Name on Card
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-200 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-1">
            Card Number
          </label>
          <div className="w-full h-12 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    color: "#fff",
                    fontSize: "16px",
                    "::placeholder": { color: "#a1a1aa" },
                  },
                  invalid: { color: "#ff4444" },
                },
                showIcon: true,
                iconStyle: 'solid',
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Expiry
            </label>
            <div className="w-full h-12 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      color: "#fff",
                      fontSize: "16px",
                      '::placeholder': { color: "#a1a1aa" },
                    },
                    invalid: { color: "#ff4444" },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              CVC
            </label>
            <div className="w-full h-12 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      color: "#fff",
                      fontSize: "16px",
                      '::placeholder': { color: "#a1a1aa" },
                    },
                    invalid: { color: "#ff4444" },
                  },
                }}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg transition-all duration-500 transform hover:bg-gray-900 hover:text-white hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

export default function CheckOutView() {
  const navigate = useNavigate();
  const [serviceFee] = useState(1.50);
  const [ivuRate] = useState(0.115);
  const location = useLocation();

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
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>

            {/* Security and Payment Methods Section */}
            <div className="mt-8 space-y-6">
              {/* Secure Payment Message */}
              <div className="flex items-center justify-center gap-2 text-zinc-400 bg-white/5 rounded-xl p-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Secure, encrypted payment processing</span>
              </div>

            

              {/* Additional Information */}
              <div className="text-center space-y-2">
                <p className="text-xs text-zinc-500">
                  By completing this purchase you agree to our{' '}
                  <a href="/terms" className="text-white hover:text-zinc-300 underline transition-colors">
                    Terms of Service
                  </a>
                </p>
                <div className="flex justify-center items-center gap-2 group cursor-pointer hover:text-zinc-300 transition-colors">
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <a href="/support" className="text-xs text-zinc-400 group-hover:text-zinc-300">Need help? Contact support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}