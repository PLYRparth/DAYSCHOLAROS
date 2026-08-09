const rateLimiter = new Map(); // Map to store userId -> last message timestamp

const armRoomTimer = (io, roomId, timeRemainingMs) => {
  setTimeout(() => {
    console.log(`Room ${roomId} expired after 20 minutes. Disconnecting users.`);
    // 1. Emit the room_expired event
    io.to(roomId).emit('room_expired', { message: 'This commute room has expired.' });
    
    // 2. Disconnect all sockets in this room
    io.in(roomId).disconnectSockets(true);
  }, timeRemainingMs);
};

const setupCommuteHandlers = (io, socket) => {
  // Rate-limiting middleware: 1 message per second per user
  socket.use((event, next) => {
    const userId = socket.user.id;
    const now = Date.now();
    const lastMessageTime = rateLimiter.get(userId);

    if (lastMessageTime && now - lastMessageTime < 1000) {
      // Reject the event if within 1 second of the last message
      return next(new Error('Rate limit exceeded: 1 message per second allowed.'));
    }

    rateLimiter.set(userId, now);
    next();
  });

  // Handle errors thrown by middleware (like rate limiting)
  socket.on('error', (err) => {
    console.error(`Socket Error for User ${socket.user.id}:`, err.message);
    socket.emit('socket_error', { message: err.message });
  });

  // Example handlers for joining/leaving based on start_point and destination
  socket.on('join_commute_room', (data) => {
    // data should contain start_point, destination, or a generated roomId based on them
    const { roomId } = data;
    if (!roomId) return;
    
    socket.join(roomId);
    console.log(`User ${socket.user.id} joined room ${roomId}`);
    socket.to(roomId).emit('user_joined', { userId: socket.user.id });
  });

  socket.on('leave_commute_room', (data) => {
    const { roomId } = data;
    if (!roomId) return;

    socket.leave(roomId);
    console.log(`User ${socket.user.id} left room ${roomId}`);
    socket.to(roomId).emit('user_left', { userId: socket.user.id });
  });

  socket.on('create_commute_room', (data) => {
    const { roomId } = data;
    if (!roomId) return;

    socket.join(roomId);
    // Start the 20-minute server-side timeout when the room is created
    armRoomTimer(io, roomId, 20 * 60 * 1000); 
    console.log(`Room ${roomId} created by User ${socket.user.id}. Timer started.`);
  });
};

module.exports = {
  setupCommuteHandlers,
  armRoomTimer
};
