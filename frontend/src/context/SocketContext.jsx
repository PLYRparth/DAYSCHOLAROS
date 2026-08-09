import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    let newSocket;
    
    // Only initialize socket connection if user is authenticated
    if (token) {
      newSocket = io('http://localhost:5000', {
        auth: {
          token: token // Passed exactly as required by our Phase 2 Socket.io middleware
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected successfully:', newSocket.id);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      setSocket(newSocket);
    }

    // Cleanup: Disconnect socket when component unmounts or token changes (like logout)
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
