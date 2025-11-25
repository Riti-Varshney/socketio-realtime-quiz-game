
const Results = ({ winner }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-dark flex items-center justify-center px-4">
      {/* Background Lights */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* Winner Card */}
      <div className="relative z-10 text-center max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl animate-fadeIn">
        
        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-yellow-400 shadow-[0_0_30px_rgba(255,200,0,0.6)] flex items-center justify-center animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 21h8m-4-4v4m1-13h3m-7 0h3M6 3h12l-1.5 6h-9L6 3zm12 6h2a2 2 0 002-2V5h-4v4zM6 9H4a2 2 0 01-2-2V5h4v4z"
              />
            </svg>
          </div>
        </div>

        {/* Winner Name */}
        <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-yellow-400 to-white bg-clip-text text-transparent mb-8">
         <div className="h-25"> 🎉 Winner: <span >{winner} </span>🎉</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button
            onClick={() => { window.location.href = "/"; }}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-gray-200 font-semibold hover:bg-white/20 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
