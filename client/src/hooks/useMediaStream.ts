'use client';

import { useState, useEffect, useCallback } from 'react';

const mediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    width: 640,
    height: 480,
    frameRate: 24,
  },
};

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getStream = useCallback(async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setStream(currentStream);
      return currentStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    getStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  }, [stream]);

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  }, [stream]);

  return { stream, toggleVideo, toggleAudio, getStream };
};
