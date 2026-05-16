'use client';

import React, { useEffect } from 'react';
import { SocketProvider } from "@/context/SocketContext";
import { WebRTCProvider } from "@/context/WebRTCContext";
import { ChatProvider } from "@/context/ChatContext";
import { Buffer } from 'buffer';

// Polyfill for simple-peer
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = { env: {} };
  (window as any).Buffer = Buffer;
}

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketProvider>
      <WebRTCProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </WebRTCProvider>
    </SocketProvider>
  );
};

export default ClientLayout;
