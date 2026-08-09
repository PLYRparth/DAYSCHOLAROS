require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');

// Model and Handler imports
const CommuteRequest = require('./models/CommuteRequest');
const { setupCommuteHandlers, armRoomTimer } = require('./sockets/commuteHandlers');

// Route imports
const authRoutes = require('./routes/authRoutes');
const housingReviewRoutes = require('./routes/housingReviewRoutes');
const tiffinVendorRoutes = require('./routes/tiffinVendorRoutes');
const tiffinReviewRoutes = require('./routes/tiffinReviewRoutes');
const marketplaceItemRoutes = require('./routes/marketplaceItemRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commuteRoutes = require('./routes/commuteRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // To be configured properly in production
    methods: ['GET', 'POST']
  }
});

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/housing-reviews', housingReviewRoutes);
app.use('/api/tiffin-vendors', tiffinVendorRoutes);
app.use('/api/tiffin-reviews', tiffinReviewRoutes);
app.use('/api/marketplace-items', marketplaceItemRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/commute', commuteRoutes);

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-development-key-that-should-be-changed');
    socket.user = decoded; // Attach decoded user payload to the socket
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io for Real-Time features
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id, '| User ID:', socket.user.id);
  
  // Register handlers
  setupCommuteHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dayscholar-os';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('DB connection successful!');
    
    // Startup Routine: Restore timers for active commute rooms
    try {
      const activeRequests = await CommuteRequest.find({});
      const now = Date.now();
      let restoredCount = 0;
      
      activeRequests.forEach(request => {
        const expiresAt = new Date(request.createdAt).getTime() + (20 * 60 * 1000); // 20 mins from creation
        const remainingTime = expiresAt - now;
        
        if (remainingTime > 0) {
          // Re-arm timer with remaining time
          armRoomTimer(io, request.roomId, remainingTime);
          restoredCount++;
        }
      });
      console.log(`Startup Routine: Restored timers for ${restoredCount} active commute rooms.`);
    } catch (err) {
      console.error('Error in startup routine:', err);
    }

    server.listen(PORT, () => {
      console.log(`App running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });
