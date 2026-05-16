'use client';

import React from 'react';
import { useWebRTC } from '@/context/WebRTCContext';
import { useChat } from '@/context/ChatContext';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff,
  MessageSquare
} from 'lucide-react';

interface ControlsProps {
  toggleChat: () => void;
}

const Controls: React.FC<ControlsProps> = ({ toggleChat }) => {
  const { unreadCount } = useChat();
  const { 
    leaveCall, 
    toggleVideo, 
    toggleAudio, 
    isVideoEnabled, 
    isAudioEnabled,
    callAccepted,
  } = useWebRTC();

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-4 rounded-3xl glass-dark border border-white/20 shadow-2xl">
      <button
        onClick={toggleAudio}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isAudioEnabled ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
        }`}
      >
        {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>

      <button
        onClick={toggleVideo}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isVideoEnabled ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
        }`}
      >
        {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
      </button>

      {callAccepted && (
        <button
          onClick={leaveCall}
          className="p-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      )}

      <button
        onClick={toggleChat}
        className="p-4 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300 relative"
      >
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
            {unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default Controls;
