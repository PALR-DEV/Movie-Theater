import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieDetailView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Smaller back button */}
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:text-zinc-300 transition-all duration-200 
            flex items-center gap-2 group bg-white/10 hover:bg-white/20 backdrop-blur-md 
            rounded-lg p-2 border border-white/10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium pr-1">Back</span>
        </button>

        {/* Movie Content Container */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Movie Poster */}
            <div className="relative overflow-hidden">
              <img 
                className="w-full h-[600px] object-cover object-center hover:scale-105 transition-transform duration-500" 
                src="https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" 
                alt="Dune Part Two" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Movie Info */}
            <div className="p-8 flex flex-col justify-center">
              <span className="text-zinc-400 font-medium tracking-wider text-sm">NOW SHOWING</span>
              <h1 className="mt-2 text-4xl font-bold text-white tracking-tight">Dune Part Two</h1>
              
              <div className="mt-4 flex items-center space-x-4">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">2h 46m</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">PG-13</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">Sci-Fi</span>
              </div>

              <p className="mt-6 text-zinc-400 leading-relaxed">
                Experience the epic continuation of the saga as Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.
              </p>

              <div className="mt-8 space-y-4">
                <button className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors duration-200">
                  Buy Ticket
                </button>
                <button className="w-full py-4 border border-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors duration-200">
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailView;

