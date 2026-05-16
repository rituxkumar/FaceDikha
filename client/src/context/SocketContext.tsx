'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  status: 'online' | 'offline';
  busy: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  me: string;
  onlineUsers: User[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [me, setMe] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      const myId = socketInstance.id || '';
      setMe(myId);
      socketInstance.emit('user-online', {
        username: `Stranger_${myId.substring(0, 5)}`,
      });
    });

    socketInstance.on('online-users', (users: User[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, me, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
