import React, { useState} from "react";
import { Gamepad2, Users } from "lucide-react";
import quizBg from "../assets/bg.png";
import "../App.css";
import PlayGround from "./PlayGround.jsx";
const Page1 = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [info, setInfo] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) {
      setInfo(true);
    }
    console.log("Joining room:", { name, room });
  };


  return (
    <div>
      {!info ?
        <div className="relative min-h-screen overflow-hidden bg-gradient-dark">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${quizBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />

          {/* Floating background lights */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />

          {/* Main Content */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
              {/* Title / Logo */}
              <div className="text-center mb-8 animate-float">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl mb-4 shadow-[0_0_20px_rgba(0,200,255,0.5)]">
                  <Gamepad2 className="w-10 h-10 text-black" />
                </div>

                <h1 className="text-6xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  QuizGame
                </h1>

                <p className="text-gray-400 text-lg">
                  Challenge your knowledge, compete with friends
                </p>
              </div>

              {/* Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Join a Room</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-12 w-full px-4 rounded-lg bg-black/40 border border-gray-700 focus:border-blue-400 focus:outline-none text-gray-200"
                    />
                  </div>

                  {/* Room ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Room ID
                    </label>
                    <input
                      type="text"
                      required
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="Enter room ID"
                      className="h-12 w-full px-4 rounded-lg bg-black/40 border border-gray-700 focus:border-blue-400 focus:outline-none text-gray-200"
                    />
                  </div>

                  {/* Join Room Button */}
                  <button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-br from-blue-400 to-cyan-400 text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:opacity-90 transition"
                  >
                    Join Room
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div> :
        <PlayGround room={room} name={name} info={info} />
      }
    </div>
  );
};

export default Page1;
