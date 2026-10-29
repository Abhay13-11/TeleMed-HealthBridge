import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  MessageSquare,
  Maximize,
  Volume2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
  participantName: string;
  participantRole: string;
  onEndCall: () => void;
  onToggleChat?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  participantName,
  participantRole,
  onEndCall,
  onToggleChat
}) => {
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {

    // Attempt local media stream acquisition
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          setCameraPermissionGranted(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => {
          // Fallback gracefully for permission denial or sandbox constraints
          setCameraPermissionGranted(false);
        });
    }

    // Simulate peer connection handshake
    const connectTimer = setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Teleconsultation Connected",
        description: `Secure clinical video link active with ${participantName}`,
      });
    }, 1500);

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(timer);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [participantName, toast]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(t => { t.enabled = !isVideoOn; });
    }
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera Disabled" : "Camera Enabled",
      description: isVideoOn ? "Your video feed has been turned off" : "Your video feed is now streaming",
    });
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(t => { t.enabled = isMuted; });
    }
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Your audio is live" : "Your audio has been muted",
    });
  };

  const handleEndCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    toast({
      title: "Consultation Concluded",
      description: `Teleconsultation session with ${participantName} ended. Duration: ${formatDuration(callDuration)}.`,
    });
    onEndCall();
  };

  return (
    <Card className="h-full bg-stone-950 text-white border-0 flex flex-col justify-between overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col relative">
        {/* Top Floating Status Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={connectionStatus === 'connected' ? 'success' : 'secondary'}
              className="text-[11px] bg-emerald-950/80 text-emerald-300 border-emerald-800"
            >
              {connectionStatus === 'connecting' && "Establishing Session..."}
              {connectionStatus === 'connected' && `Encrypted Session • ${formatDuration(callDuration)}`}
              {connectionStatus === 'reconnecting' && "Reconnecting..."}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-stone-300 border-stone-700 bg-stone-900/80">
              <ShieldCheck className="h-3 w-3 mr-1 text-emerald-400" />
              Nabha Civil Hospital
            </Badge>
          </div>

          <div className="text-xs text-stone-400 bg-stone-900/80 px-2 py-1 rounded border border-stone-800 hidden sm:block">
            Low-Bandwidth Adaptive Mode
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 relative bg-stone-900 flex items-center justify-center overflow-hidden">
          {/* Remote Video Feed (Main) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-950 border-2 border-emerald-700 flex items-center justify-center mb-3 shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-200">
                {participantName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-100">{participantName}</h3>
            <p className="text-xs text-emerald-400 capitalize">{participantRole} • Attending Consultation</p>
            
            {cameraPermissionGranted === false && (
              <div className="mt-4 px-3 py-1.5 rounded bg-amber-950/70 border border-amber-800/80 text-[11px] text-amber-300 flex items-center space-x-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Camera preview inactive. Continuing in audio-primary rural mode.</span>
              </div>
            )}
          </div>

          {/* Local Video Feed (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-44 sm:h-32 bg-stone-950 rounded-lg overflow-hidden border border-stone-700 shadow-xl z-10">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {(!isVideoOn || cameraPermissionGranted === false) && (
              <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-stone-400">
                <VideoOff className="h-5 w-5 mb-1 text-stone-500" />
                <span className="text-[10px]">Camera Muted</span>
              </div>
            )}
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-stone-300 font-medium">
              You
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3.5 bg-stone-900/95 border-t border-stone-800 z-20">
          <div className="flex items-center justify-center space-x-3">
            <Button
              size="sm"
              variant={isMuted ? "destructive" : "secondary"}
              className={`rounded-full h-10 w-10 p-0 ${
                isMuted ? 'bg-red-700 text-white' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
              onClick={toggleMute}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              size="sm"
              variant={isVideoOn ? "secondary" : "destructive"}
              className={`rounded-full h-10 w-10 p-0 ${
                !isVideoOn ? 'bg-red-700 text-white' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
              onClick={toggleVideo}
              title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className="rounded-full px-5 h-10 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-4 w-4 mr-1.5" />
              End Consultation
            </Button>

            {onToggleChat && (
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-10 w-10 p-0 bg-stone-800 hover:bg-stone-700 text-stone-200"
                onClick={onToggleChat}
                title="Open Clinical Chat"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCall;
