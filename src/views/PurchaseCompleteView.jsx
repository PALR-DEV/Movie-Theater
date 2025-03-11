import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import html2canvas from 'html2canvas';
import Lottie from 'lottie-react';
import confettiAnimation from '../assets/confeti.json';

const PurchaseCompleteView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ticketRef = useRef(null);
    const { tickets, total, movieDetails, paymentId } = location.state || {};
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative">
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <Lottie
                        animationData={confettiAnimation}
                        loop={false}
                        autoplay={true}
                        onComplete={() => setShowConfetti(false)}
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                    />
                </div>
            )}
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Success Message */}
                    <div className="mb-8 animate-fade-in">
                        <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Thank You for Your Purchase!</h2>
                        <p className="text-zinc-400 mb-4">Your tickets have been confirmed</p>
                        <p className="text-zinc-300 text-lg">
                            We've sent your tickets and receipt to your email.
                            <br />
                            Please check your inbox (and spam folder, just in case).
                        </p>
                    </div>

                    {/* Ticket Content */}
                    <div ref={ticketRef} data-ticket>
                        {/* QR Code Section */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 animate-fade-in-up">
                            <div className="max-w-xs mx-auto">
                                <div className="bg-white p-4 rounded-xl mb-4">
                                    <QRCode
                                        value={paymentId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="text-lg font-mono mb-2">{paymentId}</p>
                                <p className="text-sm text-zinc-400">Show this QR code at the theater entrance</p>
                            </div>
                        </div>

                        {/* Movie and Ticket Details */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 animate-fade-in-up">
                            <h3 className="text-xl font-semibold mb-4">{movieDetails?.title}</h3>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails?.day}</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">{movieDetails?.time}</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-400">Sala {movieDetails?.sala}</span>
                            </div>
                            <div className="space-y-2">
                                {tickets?.adult > 0 && (
                                    <p className="text-zinc-300">{tickets.adult} × Adult Ticket{tickets.adult > 1 ? 's' : ''}</p>
                                )}
                                {tickets?.senior > 0 && (
                                    <p className="text-zinc-300">{tickets.senior} × Senior Ticket{tickets.senior > 1 ? 's' : ''}</p>
                                )}
                                {tickets?.kid > 0 && (
                                    <p className="text-zinc-300">{tickets.kid} × Kid Ticket{tickets.kid > 1 ? 's' : ''}</p>
                                )}
                                <p className="text-lg font-semibold mt-4">Total Paid: ${(total * 1.115 + 1).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Home Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-zinc-200"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCompleteView;