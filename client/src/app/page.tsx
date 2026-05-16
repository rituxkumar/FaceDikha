'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import VideoContainer from '@/components/VideoContainer';
import ChatContainer from '@/components/ChatContainer';
import Controls from '@/components/Controls';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIncoming, X, Check } from 'lucide-react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const { 
    callUser, 
    receivingCall, 
    answerCall, 
    callerName, 
    callAccepted, 
    callEnded 
  } = useWebRTC();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsChatOpen(false);
      } else {
        setIsSidebarOpen(true);
        setIsChatOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="h-screen w-screen bg-[#050505] flex flex-col overflow-hidden selection:bg-primary/30">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} />
        
        <VideoContainer />
        
        <ChatContainer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        
        <Controls toggleChat={toggleChat} />
      </div>

      {/* Incoming Call Notification */}
      <AnimatePresence>
        {receivingCall && !callAccepted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm glass-dark border-white/20 p-8 rounded-[40px] text-center shadow-2xl relative overflow-hidden"
            >
              {/* Ringing Animation */}
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
                <div className="w-64 h-64 border-2 border-primary rounded-full animate-ping" />
              </div>

              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mx-auto mb-6">
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <PhoneIncoming className="w-10 h-10 text-primary animate-ring rounded-full" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Incoming Call</h2>
                <p className="text-white/60 mb-8 font-medium">Stranger is calling you...</p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Decline
                  </button>
                  <button
                    onClick={answerCall}
                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
