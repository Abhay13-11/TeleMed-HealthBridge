import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, MessageSquare, Phone, Clock, Star, Lock, Stethoscope, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsList } from '@/components/chat/ConversationsList';
import { VideoCall } from '@/components/VideoCall';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ConsultationDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  consultations: number;
  availability: string;
  price: string;
}

export const Consultations = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { createConversation, setActiveConversation, activeConversation } = useMessaging();

  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<ConsultationDoctor | null>(null);

  const doctors: ConsultationDoctor[] = [
    {
      id: '2',
      name: 'Dr. Rachit Kumar',
      specialty: 'General Medicine',
      rating: 4.8,
      consultations: 1250,
      availability: 'Available Now',
      price: 'Free OPD (Nabha Civil Hospital)'
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Singh',
      specialty: 'Pediatrician',
      rating: 4.9,
      consultations: 980,
      availability: 'Available Today',
      price: 'Free OPD (Nabha Civil Hospital)'
    },
    {
      id: 'doc-4',
      name: 'Dr. Amit Sharma',
      specialty: 'Cardiologist',
      rating: 4.7,
      consultations: 850,
      availability: 'Available in 30 min',
      price: 'Free OPD (Nabha Civil Hospital)'
    }
  ];

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Sign In Required</h2>
          <p className="text-xs text-stone-600">
            Please log in to your account to initiate remote video consultations and communicate with attending physicians.
          </p>
          <Button 
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
            onClick={() => navigate('/')}
          >
            Go to Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStartConsultation = (doctor: ConsultationDoctor, type: 'video' | 'chat' | 'voice') => {
    setSelectedDoctor(doctor);
    if (type === 'video') {
      setShowVideoCall(true);
    } else if (type === 'voice') {
      toast({
        title: "Voice Channel Initiated",
        description: `Connecting audio channel with ${doctor.name}...`,
      });
    } else {
      const conv = createConversation(doctor.id);
      setActiveConversation(conv);
      toast({
        title: "Consultation Chat Active",
        description: `Messaging channel open with ${doctor.name}.`,
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="pb-4 border-b border-stone-200">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Remote Medical Consultations
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Encrypted Telemedicine Channels • Nabha Civil Hospital Attending Staff
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Doctors List */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-stone-200 bg-white shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold text-stone-900">Available Civil Hospital Doctors</CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Select an active doctor to initiate a direct video consultation or clinical message
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-3.5 border border-stone-200 rounded-lg hover:border-emerald-600 transition-all bg-stone-50/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-11 h-11 bg-emerald-100 text-emerald-900 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                          {doctor.name.split(' ')[1]?.[0] || 'D'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-xs text-stone-900">{doctor.name}</h3>
                            <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-700/40 bg-emerald-50">
                              {doctor.availability}
                            </Badge>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">{doctor.specialty}</p>
                          <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-stone-500">
                            <div className="flex items-center text-amber-600">
                              <Star className="h-3 w-3 fill-current mr-0.5" />
                              <span className="font-semibold">{doctor.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{doctor.consultations} consultations</span>
                            <span>•</span>
                            <span className="text-emerald-800 font-medium">{doctor.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-1.5 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-stone-200">
                        <Button 
                          size="sm" 
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-7 px-3"
                          onClick={() => handleStartConsultation(doctor, 'video')}
                        >
                          <Video className="h-3.5 w-3.5 mr-1" />
                          Start Video
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7 px-3 border-stone-300"
                          onClick={() => handleStartConsultation(doctor, 'chat')}
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Rural Teleconsultation Guidelines */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
              <div className="flex items-center space-x-2 font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Guidelines for Effective Rural Teleconsultation</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px]">
                <li>Have previous prescriptions or medicine strips ready to show on camera.</li>
                <li>Sit in a quiet room with sufficient natural lighting on your face.</li>
                <li>In case of video freezing due to 2G/3G network drops, switch to audio or chat mode.</li>
                <li>Clinical prescriptions generated during the call will immediately appear under your "Reports" tab.</li>
              </ul>
            </div>
          </div>

          {/* Chat & Clinical Messaging Section */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="h-[560px] flex flex-col border-stone-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-3.5 border-b border-stone-100">
                <CardTitle className="text-xs font-bold text-stone-900 flex items-center justify-between">
                  <span>Clinical Messaging</span>
                  {activeConversation && (
                    <span className="text-[10px] text-emerald-700 font-normal">Active Session</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                {activeConversation ? (
                  <ChatInterface />
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="p-2.5 bg-stone-50 border-b border-stone-100 text-[11px] text-stone-500">
                      Select a physician from the list to start a conversation:
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <ConversationsList />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden border-stone-800">
          {selectedDoctor && (
            <VideoCall
              participantName={selectedDoctor.name}
              participantRole={selectedDoctor.specialty}
              onEndCall={() => setShowVideoCall(false)}
              onToggleChat={() => {
                setShowVideoCall(false);
                const conv = createConversation(selectedDoctor.id);
                setActiveConversation(conv);
                toast({
                  title: "Switched to Chat",
                  description: "Continuing consultation over low-bandwidth text channel.",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Consultations;
