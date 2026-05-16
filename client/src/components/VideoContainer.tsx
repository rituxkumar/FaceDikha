'use client';

import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MicOff, VideoOff, User } from 'lucide-react';

const VideoContainer: React.FC = () => {
  const { 
    myVideo, 
    userVideo, 
    callAccepted, 
    callEnded, 
    stream, 
    remoteStream,
    isVideoEnabled,
    isAudioEnabled 
  } = useWebRTC();

  useEffect(() => {
    if (userVideo.current && remoteStream) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex-1 relative bg-[#050505] flex flex-col items-center justify-center p-2 md:p-6 overflow-hidden">
      <div className="w-full h-full max-w-7xl flex flex-col md:flex-row gap-2 md:gap-6 relative z-10">
        
        {/* Owner Video */}
        <div className="flex-1 relative rounded-3xl overflow-hidden glass-dark border border-white/5 shadow-2xl">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoEnabled ? 'opacity-100' : 'opacity-0'}`}
          />
          
          <AnimatePresence>
            {!isVideoEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white/20" />
                </div>
                <p className="text-white/40 text-sm font-medium">Camera Disabled</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Owner (You)
          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            {!isAudioEnabled && (
              <div className="p-2 rounded-lg bg-red-500/20 text-red-500 backdrop-blur-md">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Stranger Video */}
        <div className="flex-1 relative rounded-3xl overflow-hidden glass-dark border border-white/5 shadow-2xl bg-[#080808]">
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className={`w-full h-full object-cover transition-opacity duration-500 ${callAccepted && !callEnded ? 'opacity-100' : 'opacity-0'}`}
          />

          <AnimatePresence>
            {(!callAccepted || callEnded) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                  <User className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Waiting for Stranger</h3>
                <p className="text-white/40 text-sm">Select an available user to start calling</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            {callAccepted && !callEnded && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
            Stranger
          </div>
        </div>
      </div>

      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-0" />
    </div>
  );
};

export default VideoContainer;
