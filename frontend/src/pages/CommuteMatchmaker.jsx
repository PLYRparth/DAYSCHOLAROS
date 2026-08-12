import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StandardCard from '../components/StandardCard';
import ElevatedCard from '../components/ElevatedCard';

const CommuteMatchmaker = () => {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [memberLimit, setMemberLimit] = useState(4);
  const [joinCode, setJoinCode] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [participants, setParticipants] = useState([]);
  const [toast, setToast] = useState('');
  
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPublicRooms = async () => {
    try {
      const res = await axios.get('/commute/rooms');
      setPublicRooms(res.data.data.rooms);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('user_joined', (data) => {
      setParticipants(prev => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
      showToast(`User ${data.userId.substring(0,8)} joined the room!`);
    });

    socket.on('user_left', (data) => {
      setParticipants(prev => prev.filter(id => id !== data.userId));
      showToast(`User ${data.userId.substring(0,8)} left the room.`);
    });

    socket.on('room_expired', (data) => {
      showToast(data.message || 'Room Expired! Redirecting...');
      setTimeout(() => {
        setInRoom(false);
        setCurrentRoom('');
        setParticipants([]);
        navigate('/app/shadow-campus'); 
      }, 3000);
    });

    return () => {
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('room_expired');
    };
  }, [socket, navigate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!socket || !startPoint || !destination) return;
    
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanStart = startPoint.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const cleanDest = destination.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const roomId = `${cleanStart}-${cleanDest}-${randomHash}`;
    
    socket.emit('create_commute_room', { 
      roomId,
      start_point: startPoint,
      destination: destination,
      isPrivate,
      memberLimit: Number(memberLimit)
    }, (response) => {
      if (response && response.status === 'error') {
        showToast(response.message || 'Failed to create room.');
      } else {
        setCurrentRoom(roomId);
        setInRoom(true);
        setParticipants([user?.id]); 
      }
    });
  };

  const handleJoin = (roomIdToJoin) => {
    if (!socket || !roomIdToJoin) return;
    socket.emit('join_commute_room', { roomId: roomIdToJoin }, (response) => {
      if (response && response.status === 'error') {
        showToast(response.message || 'Failed to join room.');
      } else {
        setCurrentRoom(roomIdToJoin);
        setInRoom(true);
        setParticipants(response?.data?.participants || [user?.id]); 
      }
    });
  };
  
  const handleJoinByCode = (e) => {
    e.preventDefault();
    handleJoin(joinCode);
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave_commute_room', { roomId: currentRoom });
    }
    setInRoom(false);
    setCurrentRoom('');
    setParticipants([]);
  };

  const handleNoShow = async (targetUserId) => {
    try {
      await axios.post('/commute/no-show', { targetUserId, roomId: currentRoom });
      showToast(`Reported ${targetUserId.substring(0,8)} as No-Show.`);
    } catch (err) {
      showToast(`Report failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex flex-col relative min-h-[70vh]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[var(--color-coral)] text-[var(--color-dark)] px-6 py-3 rounded-lg shadow-2xl z-50 transition-opacity duration-300 font-medium text-sm">
          {toast}
        </div>
      )}

      {!inRoom ? (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto mt-10">
          
          {/* Left Column: Public Rooms */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-display font-bold text-[var(--color-cream)] mb-6">Available Commutes</h2>
            {publicRooms.length === 0 ? (
              <div className="bg-[#17140F] border border-[#3A362E] rounded-xl p-8 text-center text-[var(--color-muted)]">
                No public commutes available right now. Be the first to create one!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {publicRooms.map(room => (
                  <StandardCard key={room._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-[#807b71] tracking-widest uppercase mb-1">Route</div>
                      <div className="font-medium text-[var(--color-cream)]">
                        {room.start_point} <span className="text-[var(--color-muted)] mx-2">to</span> {room.destination}
                      </div>
                      <div className="flex gap-4 items-center mt-2">
                        <div className="text-xs text-[var(--color-muted)]">
                          Code: <span className="font-mono text-[var(--color-coral)]">{room.roomId}</span>
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">
                          Members: <span className="font-mono text-[var(--color-cream)]">{room.participants?.length || 0}/{room.memberLimit}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleJoin(room.roomId)}
                      className="bg-[#3A362E] text-[var(--color-cream)] hover:bg-[var(--color-coral)] hover:text-[var(--color-dark)] px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap focus:outline-none"
                    >
                      Join Room
                    </button>
                  </StandardCard>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column: Create/Join Actions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            
            {/* Create Room Card */}
            <StandardCard className="p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-[var(--color-cream)] mb-6">Create a Commute</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Start Point</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Metro Station"
                    required 
                    value={startPoint} 
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Destination</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Main Campus"
                    required 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-sm text-[var(--color-muted)] w-24">Max Members</label>
                  <input 
                    type="number" 
                    min="2"
                    max="10"
                    value={memberLimit}
                    onChange={(e) => setMemberLimit(e.target.value)}
                    className="w-20 bg-[#17140F] border border-[#3A362E] rounded-lg p-2 text-center text-sm text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3A362E] bg-[#17140F] text-[var(--color-coral)] focus:ring-[var(--color-coral)] focus:ring-offset-[#25221C]"
                  />
                  <label htmlFor="isPrivate" className="text-sm text-[var(--color-muted)] cursor-pointer">
                    Make room private (requires code to join)
                  </label>
                </div>
                <button 
                  type="submit"
                  className="w-full mt-2 bg-transparent border border-[var(--color-muted)] hover:border-[var(--color-cream)] text-[var(--color-cream)] font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-muted)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                >
                  Create Room
                </button>
              </form>
            </StandardCard>
            
            {/* Join Private Room Card */}
            <StandardCard className="p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-[var(--color-cream)] mb-6">Join Private Commute</h2>
              <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Enter Room Code"
                  required 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#17140F] border border-[#3A362E] rounded-lg p-3 font-mono text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40 uppercase" 
                />
                <button 
                  type="submit"
                  className="bg-[var(--color-coral)] hover:opacity-90 text-[var(--color-dark)] font-medium py-3 px-8 rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                >
                  Join
                </button>
              </form>
            </StandardCard>
            
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto mt-10">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-cream)]">Active Room</h1>
              {participants.length > 1 && (
                <div className="w-2 h-2 rounded-full bg-[var(--color-coral)] animate-pulse-coral" title="Live"></div>
              )}
            </div>
            <button 
              onClick={leaveRoom}
              className="bg-transparent border border-[var(--color-muted)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] text-[var(--color-muted)] px-5 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-muted)] focus:ring-offset-2 focus:ring-offset-[var(--color-dark)]"
            >
              Leave room
            </button>
          </div>
          
          <ElevatedCard className="relative overflow-hidden mb-8 p-6 md:p-8 border-none">
            {/* Ticket Stub Perforations (Page background color, overlapping edge) */}
            <div className="absolute left-[-10px] top-1/3 w-5 h-5 bg-[var(--color-dark)] rounded-full"></div>
            <div className="absolute left-[-10px] bottom-1/3 w-5 h-5 bg-[var(--color-dark)] rounded-full"></div>

            <div className="ml-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="font-mono text-[10px] text-[#807b71] tracking-widest uppercase mb-1">Commute Route</div>
                <div className="font-display font-bold text-2xl leading-tight text-[var(--color-dark)]">
                  {startPoint} <br/> <span className="text-[#807b71] font-normal text-xl">to</span> {destination}
                </div>
              </div>
              
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-[#807b71] tracking-widest uppercase mb-1 font-medium">Room Code</div>
                <div className="font-mono text-[var(--color-coral)] font-medium text-lg tracking-wider">{currentRoom}</div>
              </div>
            </div>
          </ElevatedCard>

          <h2 className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-4">Participants Live ({participants.length})</h2>
          
          <div className="flex flex-col gap-3">
            {participants.map(pId => (
              <StandardCard key={pId}>
                <div className="flex justify-between items-center -mb-4">
                  <span className="text-[var(--color-cream)] font-medium text-sm">
                    {pId === user?.id ? `${pId.substring(0,8)} (You)` : pId.substring(0,8)}
                  </span>
                  {pId !== user?.id && (
                    <button 
                      onClick={() => handleNoShow(pId)}
                      className="border border-[var(--color-coral)] text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10 text-xs font-medium py-1.5 px-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                    >
                      Report No-Show
                    </button>
                  )}
                </div>
              </StandardCard>
            ))}
            
            {participants.length === 1 && (
              <p className="text-[var(--color-muted)] text-sm italic mt-4 text-center">Waiting for others to join...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommuteMatchmaker;
