'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './SocketContext';
import { useMediaStream } from '@/hooks/useMediaStream';

interface WebRTCContextType {
  callUser: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  callAccepted: boolean;
  callEnded: boolean;
  receivingCall: boolean;
  caller: string;
  callerName: string;
  callerSignal: any;
  userVideo: React.RefObject<HTMLVideoElement | null>;
  myVideo: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  remoteStream: MediaStream | null;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) throw new Error('useWebRTC must be used within a WebRTCProvider');
  return context;
};

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, me } = useSocket();
  const { stream, toggleVideo: toggleV, toggleAudio: toggleA } = useMediaStream();
  
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerName, setCallerName] = useState('');
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-call', ({ from, name, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerName(name);
      setCallerSignal(signal);
      
      // Play ringtone
      const audio = new Audio('/sounds/ringtone.mp3');
      audio.loop = true;
      audio.play().catch(() => {});
      (window as any).ringtone = audio;
    });

    socket.on('end-call', () => {
      leaveCall();
    });

    return () => {
      socket.off('incoming-call');
      socket.off('end-call');
    };
  }, [socket]);

  const callUser = (id: string) => {
    if (!stream || !socket) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: configuration,
    });

    peer.on('signal', (data) => {
      socket.emit('call-user', {
        userToCall: id,
        signalData: data,
        from: me,
        name: 'Stranger',
      });
    });

    peer.on('stream', (currentStream) => {
      setRemoteStream(currentStream);
    });

    socket.once('call-accepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!stream || !socket) return;

    // Stop ringtone
    if ((window as any).ringtone) {
      (window as any).ringtone.pause();
    }

    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: configuration,
    });

    peer.on('signal', (data) => {
      socket.emit('answer-call', { signal: data, to: caller });
    });

    peer.on('stream', (currentStream) => {
      setRemoteStream(currentStream);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (socket && caller) {
      socket.emit('end-call', { to: caller });
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  const toggleVideo = () => {
    toggleV();
    setIsVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    toggleA();
    setIsAudioEnabled((prev) => !prev);
  };

  return (
    <WebRTCContext.Provider
      value={{
        callUser,
        answerCall,
        leaveCall,
        callAccepted,
        callEnded,
        receivingCall,
        caller,
        callerName,
        callerSignal,
        userVideo,
        myVideo,
        stream,
        remoteStream,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
