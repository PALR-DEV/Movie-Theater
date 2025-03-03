import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import html2canvas from 'html2canvas';

const PurchaseCompleteView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ticketRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Generate a more secure and unique ticket ID
    const generateTicketId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 15);
        const uniqueId = `${timestamp}-${randomStr}`.toUpperCase();
        return uniqueId;
    };

    const ticketId = generateTicketId();

    const saveTicket = async () => {
        if (ticketRef.current) {
            try {
                const canvas = await html2canvas(ticketRef.current, {
                    backgroundColor: '#000000',
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    allowTaint: true,
                    foreignObjectRendering: true,
                    removeContainer: false,
                    imageTimeout: 15000,
                    onclone: (clonedDoc) => {
                        const element = clonedDoc.querySelector('[data-ticket]');
                        if (element) {
                            element.style.transform = 'none';
                            element.style.borderRadius = '0';
                            element.style.backdropFilter = 'none';
                            element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }
                    }
                });
                
                const link = document.createElement('a');
                link.download = `movie-ticket-${ticketId}.png`;
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error saving ticket:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mb-8 animate-fade-in">
                        <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Thank You for Your Purchase!</h2>
                        <p className="text-zinc-400">Your tickets have been confirmed</p>
                    </div>

                    {/* Ticket Content to be Saved */}
                    <div ref={ticketRef} data-ticket>
                        {/* QR Code Section */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 animate-fade-in-up">
                            <div className="max-w-xs mx-auto">
                                <div className="bg-white p-4 rounded-xl mb-4">
                                    <QRCode
                                        value={ticketId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="text-lg font-mono mb-2">{ticketId}</p>
                                <p className="text-sm text-zinc-400">Show this QR code at the theater entrance</p>
                            </div>
                        </div>

                        {/* Movie Details */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold mb-2">Movie Details</h3>
                                    <p className="text-zinc-400">Dune Part Two</p>
                                    <p className="text-zinc-400">Thursday, March 28 at 7:00 PM</p>
                                    <p className="text-zinc-400">IMAX Experience</p>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold mb-2">Ticket Summary</h3>
                                    <p className="text-zinc-400">2 Adult Tickets</p>
                                    <p className="text-zinc-400">1 Senior Ticket</p>
                                    <p className="text-zinc-400 mt-2">Total: $34.97</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={saveTicket}
                            className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/20 border border-white/10 hover:border-white/20"
                        >
                            Save Ticket to Device
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-zinc-200"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCompleteView;