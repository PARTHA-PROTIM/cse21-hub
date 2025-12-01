require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Message = require('./models/Message');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/registration-requests', require('./routes/registrationRequests'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/bus', require('./routes/bus'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/news', require('./routes/news'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isApproved) {
      return next(new Error('User not authorized'));
    }
    
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name}`);
  
  // Join the general chat room
  socket.join('general-chat');
  
  // Broadcast user joined
  socket.to('general-chat').emit('user-joined', {
    userName: socket.user.name,
    userRole: socket.user.role
  });
  
  // Listen for new messages
  socket.on('send-message', async (data) => {
    try {
      // Save message to database
      const message = await Message.create({
        user: socket.user._id,
        userName: socket.user.name,
        userRole: socket.user.role,
        message: data.message,
      });
      
      const populatedMessage = await Message.findById(message._id)
        .populate('user', 'name regNo role');
      
      // Broadcast to all users in the room
      io.to('general-chat').emit('new-message', {
        _id: populatedMessage._id,
        userName: populatedMessage.userName,
        userRole: populatedMessage.userRole,
        message: populatedMessage.message,
        userId: populatedMessage.user._id,
        createdAt: populatedMessage.createdAt
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  
  // Listen for typing indicator
  socket.on('typing', () => {
    socket.to('general-chat').emit('user-typing', {
      userName: socket.user.name
    });
  });
  
  socket.on('stop-typing', () => {
    socket.to('general-chat').emit('user-stop-typing', {
      userName: socket.user.name
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name}`);
    socket.to('general-chat').emit('user-left', {
      userName: socket.user.name
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});