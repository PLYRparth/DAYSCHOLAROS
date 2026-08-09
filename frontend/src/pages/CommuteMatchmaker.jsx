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
  const [inRoom, setInRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [participants, setParticipants] = useState([]);
  const [toast, setToast] = useState('');
  
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleAction = (e, type) => {
    e.preventDefault();
    if (!socket || !startPoint || !destination) return;
    
    const roomId = `${startPoint}_TO_${destination}`.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    
    if (type === 'create') {
      socket.emit('create_commute_room', { roomId });
    } else {
      socket.emit('join_commute_room', { roomId });
    }
    
    setCurrentRoom(roomId);
    setInRoom(true);
    setParticipants([user?.id]); 
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
        <div className="max-w-md mx-auto w-full mt-10">
          <StandardCard className="p-6 md:p-8">
            <h1 className="text-2xl font-display font-bold text-[var(--color-cream)] mb-6 text-center">Find a Commute</h1>
            <form className="flex flex-col gap-5">
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
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={(e) => handleAction(e, 'create')}
                  className="flex-1 bg-transparent border border-[var(--color-muted)] hover:border-[var(--color-cream)] text-[var(--color-cream)] font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-muted)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                >
                  Create room
                </button>
                <button 
                  onClick={(e) => handleAction(e, 'join')}
                  className="flex-1 bg-[var(--color-coral)] hover:opacity-90 text-[var(--color-dark)] font-medium py-3 px-4 rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                >
                  Join room
                </button>
              </div>
            </form>
          </StandardCard>
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
