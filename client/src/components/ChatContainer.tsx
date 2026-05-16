'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Smile } from 'lucide-react';

const ChatContainer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { messages, sendMessage, typingStatus, sendTypingStatus, resetUnreadCount } = useChat();
  const { me } = useSocket();
  const { caller, callAccepted, callEnded } = useWebRTC();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) resetUnreadCount();
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingStatus]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && caller) {
      sendMessage(caller, input);
      setInput('');
      sendTypingStatus(caller, false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (caller) {
      sendTypingStatus(caller, e.target.value.length > 0);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 360 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full glass-dark border-l border-white/10 flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h3 className="font-bold text-white">Stranger Chat</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.from === me;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none'
              }`}>
                {msg.message}
              </div>
              <span className="text-[10px] text-white/20 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          );
        })}
        {caller && typingStatus[caller] && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            Stranger is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        {!callAccepted || callEnded ? (
          <p className="text-center text-xs text-white/20 py-2">Start a call to enable chat</p>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={input}
                onChange={handleTyping}
              />
              <Smile className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 cursor-pointer hover:text-white/60 transition-colors" />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </motion.aside>
  );
};

export default ChatContainer;
