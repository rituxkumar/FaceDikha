'use client';

import React, { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/context/WebRTCContext';
import { User as UserIcon, Search, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { onlineUsers, me } = useSocket();
  const { callUser, callAccepted, callEnded } = useWebRTC();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = onlineUsers.filter(
    (user) => user.id !== me && user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full glass-dark overflow-hidden flex flex-col border-r border-white/10"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Online Users</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search strangers..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
          <AnimatePresence mode="popLayout">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-4 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${user.busy ? 'bg-red-500' : 'bg-green-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white truncate w-32">{user.username}</p>
                      <p className={`text-[10px] ${user.busy ? 'text-red-400' : 'text-green-400'}`}>
                        {user.busy ? 'Busy in Call' : 'Available'}
                      </p>
                    </div>
                  </div>
                  
                  {!callAccepted && !user.busy && (
                    <button
                      onClick={() => callUser(user.id)}
                      className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-center text-white/40 text-sm mt-10">No strangers online</p>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white/60" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white/80 truncate">Owner (You)</p>
            <p className="text-[10px] text-white/40 truncate font-mono">{me}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
