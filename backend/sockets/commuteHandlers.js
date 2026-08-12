const CommuteRequest = require('../models/CommuteRequest');
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
  socket.on('join_commute_room', async (data, callback) => {
    const { roomId } = data;
    if (!roomId) {
      if (callback) return callback({ status: 'error', message: 'Room ID is required.' });
      return;
    }
    
    try {
      const room = await CommuteRequest.findOne({ roomId });
      if (!room) {
        if (callback) return callback({ status: 'error', message: 'Room not found.' });
        return;
      }
      
      if (room.participants.length >= room.memberLimit && !room.participants.includes(socket.user.id)) {
        if (callback) return callback({ status: 'error', message: 'Room is full.' });
        return;
      }
      
      if (!room.participants.includes(socket.user.id)) {
        room.participants.push(socket.user.id);
        await room.save();
      }
      
      socket.join(roomId);
      console.log(`User ${socket.user.id} joined room ${roomId}`);
      socket.to(roomId).emit('user_joined', { userId: socket.user.id });
      
      if (callback) return callback({ status: 'success', data: { participants: room.participants } });
    } catch (err) {
      console.error('Error joining room:', err);
      if (callback) return callback({ status: 'error', message: 'Server error while joining room.' });
    }
  });

  const handleUserLeave = async (userId, specificRoomId = null) => {
    try {
      // Find all rooms this user is in, or specific one
      const query = specificRoomId ? { roomId: specificRoomId } : { participants: userId };
      const rooms = await CommuteRequest.find(query);
      
      for (const room of rooms) {
        if (room.creator_id.toString() === userId) {
          // Leader is leaving - destroy the room
          console.log(`Leader ${userId} left room ${room.roomId}. Destroying room.`);
          io.to(room.roomId).emit('room_expired', { message: 'Leader has left the room. The room is now closed.' });
          io.in(room.roomId).socketsLeave(room.roomId);
          await CommuteRequest.findByIdAndDelete(room._id);
        } else {
          // Normal participant leaving
          room.participants = room.participants.filter(id => id.toString() !== userId);
          await room.save();
          io.to(room.roomId).emit('user_left', { userId });
          console.log(`User ${userId} left room ${room.roomId}`);
        }
      }
    } catch (err) {
      console.error('Error handling user leave:', err);
    }
  };

  socket.on('leave_commute_room', async (data) => {
    const { roomId } = data;
    if (!roomId) return;

    socket.leave(roomId);
    await handleUserLeave(socket.user.id, roomId);
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected from commute socket:', socket.id);
    await handleUserLeave(socket.user.id);
  });

  socket.on('create_commute_room', async (data, callback) => {
    const { roomId, start_point, destination, isPrivate, memberLimit } = data;
    if (!roomId || !start_point || !destination) {
      if (callback) return callback({ status: 'error', message: 'Missing required fields.' });
      return;
    }

    socket.join(roomId);
    
    try {
      const newRoom = await CommuteRequest.create({
        roomId,
        creator_id: socket.user.id,
        start_point,
        destination,
        isPrivate: isPrivate || false,
        memberLimit: memberLimit || 4,
        participants: [socket.user.id]
      });
      
      // Start the 1-hour server-side timeout when the room is created
      armRoomTimer(io, roomId, 60 * 60 * 1000); 
      console.log(`Room ${roomId} created by User ${socket.user.id}. Timer started for 1 hour.`);
      
      if (callback) return callback({ status: 'success', data: { room: newRoom } });
    } catch (err) {
      console.error('Error saving commute room:', err);
      if (callback) return callback({ status: 'error', message: 'Failed to create room.' });
    }
  });
};

module.exports = {
  setupCommuteHandlers,
  armRoomTimer
};
