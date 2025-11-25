import React, { useState, useEffect } from "react";
import { Timer, Trophy, User } from "lucide-react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const socket = io("ws://localhost:5000");
import Results from "./Results.jsx";

const PlayGround = ({ room, name, info }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState([]);
  const [seconds, setSeconds] = useState(0);

  //----timer-----
  useEffect(() => {
    if (seconds === 0) { return; }
    const timerInterval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000)
    return () => {
      clearInterval(timerInterval);
    }
  }, [seconds])
  //--------------

  //socket logic-----
  useEffect(() => {
    if (name) {
      socket.emit('joinRoom', room, name); 
    }
  }, [info])
  useEffect(() => {
    socket.on('message', (message) => {
      toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    })
    return () => { socket.off('message') };
  }, [])

  //---q/a/w,handling-------
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      setSeconds(data.timer);
      setAnswered(false);
      setSelectAnswerIndex();
    })
    socket.on('answerResult',(data)=>{
      if(data.isCorrect){
        toast.success(`${data.playerName} answered correctly!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
      setScores(data.scores);
    })
    socket.on('gameOver',(data)=>{
      setWinner(data.winner);
    })
    return()=>{
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
    }
  },[])
  // ----------------

  //Handleing Ans------------
  const [selectAnswerIndex, setSelectAnswerIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const handleAnswer = (answerIndex) => {

    if (!answered) {
      setSelectAnswerIndex(answerIndex);
      socket.emit('submitAnswer', room, answerIndex);
      setAnswered(true);
    }
  }
  //--------


  if(winner){
    return (
     <Results winner={winner}/>
    )
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-dark">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-quiz bg-clip-text text-transparent mb-2">
                  Quiz Battle
                </h1>
                <p className="text-gray-400">
                  Room ID: <span className="text-blue-400">{room}</span>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-200">{name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{seconds}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        {/* Question Area */}
        {question ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Question */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Question
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 leading-relaxed">
                    {question}
                  </h2>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.map((answer, index) => (
                    <button key={index} className={` relative h-24 rounded-xl transition-all duration-300 overflow-hidden
                                                    ${selectAnswerIndex === index ? "bg-blue-500/20 border-blue-500 scale-[1.02]" : "bg-blue-500/30 border border-gray-700 hover:border-blue-400 hover:bg-black/60"}`} onClick={() => handleAnswer(index)} disabled={answered}>
                      <div className="absolute inset-0 bg-gradient-quiz opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="relative h-full flex items-center justify-center px-6">
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-quiz flex items-center justify-center text-white font-bold shadow-lg">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors text-left">
                            {answer}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 shadow-xl sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                </div>

                <div className="space-y-3">
                  {scores.length > 0 ? (
                    scores.map((player, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-xl transition-all ${index === 0 ? "bg-gradient-quiz/20 border border-blue-400/30" : "bg-black/40 border border-gray-700"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${index === 0 ? "bg-gray-700 text-white" : "bg-gray-700 text-gray-300"}`}>
                            {index + 1}
                          </div>
                          <span className={`font-medium ${player.name === name ? "text-blue-400" : "text-gray-200"}`}>
                            {player.name}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {player.score}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Waiting for players...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Loader UI
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-12 shadow-xl text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-quiz rounded-2xl quiz-glow animate-pulse-glow flex items-center justify-center">
                <Timer className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Get Ready!
              </h2>
              <p className="text-gray-400 text-lg">
                Loading next question...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGround;
