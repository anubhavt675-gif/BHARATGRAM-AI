import React, { useEffect, useRef, useState } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

interface VideoCallProps {
  isIncoming: boolean;
  remoteName: string;
  onClose: () => void;
  remoteId: string;
  initialOffer?: any;
}

const VideoCall: React.FC<VideoCallProps> = ({ isIncoming, remoteName, onClose, remoteId, initialOffer }) => {
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [callStatus, setCallStatus] = useState(isIncoming ? 'Ringing...' : 'Calling...');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initCall = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });

        localStream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, localStream);
        });

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus('Connected');
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketService.emitIceCandidate(remoteId, event.candidate);
          }
        };

        if (isIncoming && initialOffer) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(initialOffer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socketService.emitAnswer(remoteId, answer);
        } else {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socketService.emitCall(remoteId, user._id || user.id, user.fullName, offer);
        }
      } catch (err) {
        console.error("Failed to initialize WebRTC:", err);
        setCallStatus('Call Error');
      }
    };

    initCall();

    socketService.onCallAccepted(async (data) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallStatus('Connecting...');
      }
    });

    socketService.onIceCandidate(async (data) => {
      if (data.candidate && peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    });

    socketService.onCallEnded(() => {
      handleClose();
    });

    return () => {
      streamCleanup();
    };
  }, []);

  const streamCleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    peerConnection.current?.close();
  };

  const handleClose = () => {
    socketService.emitEndCall(remoteId);
    streamCleanup();
    onClose();
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300">
      {/* Remote Video (Fullscreen) */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover" 
        />
        {/* Decorative Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Local Video (PiP) */}
      <div className="absolute top-8 right-8 w-32 h-48 md:w-44 md:h-64 bg-slate-800 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-20">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : ''}`} 
        />
        {isCameraOff && (
          <div className="w-full h-full flex items-center justify-center bg-slate-700">
            <span className="text-white font-bold text-xs">Camera Off</span>
          </div>
        )}
      </div>

      {/* Caller Info */}
      <div className="relative z-10 text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-saffron p-1 bg-white/10 backdrop-blur-md">
          <img src={`https://ui-avatars.com/api/?name=${remoteName}&background=random`} className="w-full h-full rounded-full object-cover shadow-2xl" alt="" />
        </div>
        <h2 className="text-white text-4xl font-black mb-2 tracking-tight">{remoteName}</h2>
        <div className="flex items-center justify-center gap-2">
           <div className="w-2 h-2 bg-saffron rounded-full animate-ping"></div>
           <p className="text-orange-200 font-black tracking-[0.3em] uppercase text-[10px]">{callStatus}</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="relative z-10 flex items-center gap-6 mt-auto mb-16">
        <button 
          onClick={toggleMute} 
          className={`p-6 rounded-full backdrop-blur-xl border border-white/10 ${isMuted ? 'bg-red-500/80' : 'bg-white/10'} text-white transition-all hover:scale-110 active:scale-95`}
        >
           {isMuted ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
           )}
        </button>

        <button 
          onClick={handleClose} 
          className="p-10 rounded-full bg-red-600 text-white shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m3 21 18-18"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m7 7 10 10"/></svg>
        </button>

        <button 
          onClick={toggleCamera} 
          className={`p-6 rounded-full backdrop-blur-xl border border-white/10 ${isCameraOff ? 'bg-red-500/80' : 'bg-white/10'} text-white transition-all hover:scale-110 active:scale-95`}
        >
           {isCameraOff ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="m16 16-3.5 2"/><path d="M14.5 4.5 22 12l-7.5 7.5L7 12l7.5-7.5z"/><path d="m2 2 20 20"/></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
           )}
        </button>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase italic">
        <span style={{ color: COLORS.SAFFRON }}>BHARAT</span>GRAM SECURE SIGNALING
      </div>
    </div>
  );
};

export default VideoCall;
