const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = {}; // userId -> { id, username, status, busy }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user-online', (userData) => {
    users[socket.id] = {
      id: socket.id,
      username: userData.username || `Stranger_${socket.id.substring(0, 5)}`,
      status: 'online',
      busy: false,
    };
    io.emit('online-users', Object.values(users));
  });

  socket.on('call-user', ({ userToCall, signalData, from, name }) => {
    if (users[userToCall]) {
      io.to(userToCall).emit('incoming-call', { signal: signalData, from, name });
    }
  });

  socket.on('answer-call', (data) => {
    if (users[data.to]) {
      users[socket.id].busy = true;
      users[data.to].busy = true;
      io.emit('online-users', Object.values(users));
      io.to(data.to).emit('call-accepted', data.signal);
    }
  });

  socket.on('end-call', ({ to }) => {
    if (users[socket.id]) users[socket.id].busy = false;
    if (users[to]) users[to].busy = false;
    io.emit('online-users', Object.values(users));
    io.to(to).emit('end-call');
  });

  socket.on('send-message', ({ to, message, from }) => {
    io.to(to).emit('receive-message', {
      from,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('typing', ({ to, from }) => {
    io.to(to).emit('typing', { from });
  });

  socket.on('stop-typing', ({ to, from }) => {
    io.to(to).emit('stop-typing', { from });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (users[socket.id]) {
      delete users[socket.id];
      io.emit('online-users', Object.values(users));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
