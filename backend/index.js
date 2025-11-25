const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;
const questions = [
  {
    question: "In JavaScript, which of the following is NOT a valid way to create an object?",
    answers: [
      { text: "Object.create(null)", correct: false },
      { text: "{ name: 'Riti' }", correct: false },
      { text: "new Object()", correct: false },
      { text: "Object.assign()", correct: true },
    ],
  },
  {
    question: "Which country is the only one in the world that is both a continent and a country?",
    answers: [
      { text: "Australia", correct: true },
      { text: "Greenland", correct: false },
      { text: "Antarctica", correct: false },
      { text: "Iceland", correct: false },
    ],
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: [
      { text: "Mercury", correct: false },
      { text: "Venus", correct: false },
      { text: "Mars", correct: false },
      { text: "Jupiter", correct: true },
    ],
  },
  {
    question: "What is the chemical symbol for iron?",
    answers: [
      { text: "Fe", correct: true },
      { text: "Ag", correct: false },
      { text: "Au", correct: false },
      { text: "Cu", correct: false },
    ],
  },
  {
    question: "Which famous scientist is known for the theory of evolution?",
    answers: [
      { text: "Galileo Galilei", correct: false },
      { text: "Isaac Newton", correct: false },
      { text: "Charles Darwin", correct: true },
      { text: "Marie Curie", correct: false },
    ],
  },
  {
    question: "In which country was the game of chess invented?",
    answers: [
      { text: "China", correct: false },
      { text: "India", correct: true },
      { text: "Greece", correct: false },
      { text: "Egypt", correct: false },
    ],
  },

  {
    question: "Which gas is responsible for the Earth's ozone layer?",
    answers: [
      { text: "Oxygen", correct: false },
      { text: "Carbon Dioxide", correct: false },
      { text: "Nitrogen", correct: false },
      { text: "Ozone", correct: true },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Mars", correct: true },
      { text: "Venus", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "Which gas do plants use for photosynthesis?",
    answers: [
      { text: "Oxygen", correct: false },
      { text: "Carbon Dioxide", correct: true },
      { text: "Nitrogen", correct: false },
      { text: "Helium", correct: false },
    ],
  },

  {
    question: "What is the capital of Japan?",
    answers: [
      { text: "Beijing", correct: false },
      { text: "Tokyo", correct: true },
      { text: "Seoul", correct: false },
      { text: "Bangkok", correct: false },
    ],
  },
  {
    question:
      "Which famous scientist developed the theory of general relativity?",
    answers: [
      { text: "Isaac Newton", correct: false },
      { text: "Albert Einstein", correct: true },
      { text: "Nikola Tesla", correct: false },
      { text: "Marie Curie", correct: false },
    ],
  },
  {
    question: "Which country is known as the 'Land of the Rising Sun'?",
    answers: [
      { text: "China", correct: false },
      { text: "Japan", correct: true },
      { text: "India", correct: false },
      { text: "Egypt", correct: false },
    ],
  },

  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Ag", correct: false },
      { text: "Au", correct: true },
      { text: "Fe", correct: false },
      { text: "Hg", correct: false },
    ],
  },
  {
    question: "Which planet is known as the 'Morning Star' or 'Evening Star'?",
    answers: [
      { text: "Mars", correct: false },
      { text: "Venus", correct: true },
      { text: "Mercury", correct: false },
      { text: "Neptune", correct: false },
    ],
  },

  {
    question: "What is the smallest prime number?",
    answers: [
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "3", correct: false },
      { text: "5", correct: false },
    ],
  },
  {
    question: "Which of the following countries has 'NO' official capital city?",
    answers: [
      { text: "Switzerland", correct: false },
      { text: "Australia", correct: false },
      { text: "South Africa", correct: false },
      { text: "Nauru", correct: true },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which element has the chemical symbol 'K'?",
    answers: [
      { text: "Krypton", correct: false },
      { text: "Potassium", correct: true },
      { text: "Kryptonite", correct: false },
      { text: "Kallium", correct: false },
    ],
  },
  {
    question: "What is the capital city of India?",
    answers: [
      { text: "Mumbai", correct: false },
      { text: "New Delhi", correct: true },
      { text: "Bangalore", correct: false },
      { text: "Kolkata", correct: false },
    ],
  },
];

const rooms = {}

// socket logic------------------
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('joinRoom', (room, name) => {
    socket.join(room);
    // console.log(`${name} joined room ${room}`);
    io.to(room).emit('message', `${name} has joined the Game.`)  //by this server sends msg to only users of that rum

    //questions object--------------------
    if (!rooms[room]) {
      //when rum created 1st tym
      rooms[room] = {
        players: [],
        currentQuestion: null,
        correctAnswer: null,
        questionTimeout: null,
        shouldAskNewQuestion: true,
      }
    }
    rooms[room].players.push({ id: socket.id, name: name });
    console.log(rooms);
    if (!rooms[room].currentQuestion) {
      //for the first person who entered in the rum bcoz it will be first so ,there is askNewQuestion instead of currentQuestion
      askNewQuestion(room)
    }
    //-----------------------------------
  })
  socket.on('submitAnswer', (room, answerIndex) => {
    const currentPlayer = rooms[room].players.find((player) => player.id === socket.id);
    if (currentPlayer) {
      const correctAnswer = rooms[room].correctAnswer;
      const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
      currentPlayer.score = isCorrect ? (currentPlayer.score || 0) + 1 : (currentPlayer.score || 0) - 1;
      clearTimeout(rooms[room].questionTimeout);
      io.to(room).emit('answerResult', {
        playerName: currentPlayer.name,
        isCorrect,
        correctAnswer,
        scores: rooms[room].players.map((player) => ({ name: player.name, score: player.score || 0 }))
      })
      const winningThreshold = 5; // min. winning pnts
      const winner = rooms[room].players.find(
        (player) => (player.score || 0) >= winningThreshold
      );

      if (winner) {
        io.to(room).emit('gameOver', { winner: winner.name });
        delete rooms[room];
      }
      else {
        askNewQuestion(room);
      }
    };

  })
  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter((player) => player.id !== socket.id); //dscnnctd plyr will be rmvd from the rum
    }
    console.log('a user disconnected');
  })
})
//-------------------------------


// questionPart--------------------------
function askNewQuestion(room) {
  if (rooms[room].players.length === 0) {
    //when no player is in particular rum then that rum will be dltd
    clearTimeout(rooms[room].questionTimeout);
    delete rooms[room];
    return;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  // console.log(randomIndex);
  const question = questions[randomIndex];
  rooms[room].currentQuestion = question;
  console.log(rooms)
  const correctAnswerIndex = question.answers.findIndex((ans) => ans.correct);
  // console.log(correctAnswerIndex)
  rooms[room].correctAnswer = correctAnswerIndex;
  io.to(room).emit('newQuestion', {
    question: question.question,
    answers: question.answers.map((ans) => ans.text),
    timer: 15,
  })
  rooms[room].questionTimeout = setTimeout(() => {
    io.to(room).emit('answerResult', {
      playerName: null,
      isCorrect: false,
      correctAnswer: rooms[room].correctAnswer,
      scores: rooms[room].players.map((player) => ({
        name: player.name,
        score: player.score || 0
      }))
    })
    askNewQuestion(room);
  }, 15000);
  // console.log(question.question, question.answers.map((ans) => ans.text))
}
// ---------------------------------

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


