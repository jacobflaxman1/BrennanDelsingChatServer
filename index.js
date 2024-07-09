// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {connectDB} = require('./mongodb.js');
const cors = require('cors');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins (for specific origins, replace '*' with an array of allowed origins)
      methods: ['GET', 'POST']
    }
  });
// Connect to MongoDB and store the database connection
let db, messagesCollection;

app.use(cors());

const getRecentMessages = async (room) => {
    try {
      const messages = await messagesCollection
        .find({ room })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(100) // Limit to 100 messages
        .toArray(); // Convert the result to an array
      return messages;
    } catch (err) {
      console.error('Error fetching recent messages:', err);
      return [];
    }
  };


connectDB().then((connection) => {
  db = connection.db;
  messagesCollection = connection.messagesCollection;

  io.on('connection', (socket) => {
    console.log('New connection established.');

    socket.on('joinRoom', async (room) => {
        socket.join(room);
        console.log(`Socket joined room: ${room}`);
  
        const recentMessages = await getRecentMessages(room);
        console.log(recentMessages)
        socket.emit('recentMessages', recentMessages);
      });

    socket.on('chatMessage', async ({ room, message }) => {
      try {
        // Insert the message into the messages collection
        await messagesCollection.insertOne({ room, message, createdAt: new Date() });
        
        // Emit the message to the room
        io.to(room).emit('chatMessage', message);
        console.log(`Message saved and sent to room ${room}: ${message}`);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });
  });

  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.error('Failed to start server due to database connection error:', err);
});
