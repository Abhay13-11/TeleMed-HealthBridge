import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { 
  Calendar, 
  Clock, 
  User, 
  Pill, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MessageSquare, 
  Video, 
  Phone,
  Siren,
  Heart,
  Bell,
  Activity,
  Download,
  Shield,
  Stethoscope,
  TestTube,
  Truck,
  UserPlus,
  CreditCard,
  MapPin,
  HeartHandshake,
  Microscope
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import { storageService } from '@/services/storage';
import { Appointment } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsList } from '@/components/chat/ConversationsList';
import { MedicalChatbot } from '@/components/chat/MedicalChatbot';
import { VideoCall } from '@/components/VideoCall';
import { AppointmentBooking } from '@/components/AppointmentBooking';
import { SymptomChecker } from '@/components/SymptomChecker';
import { MedicineSearch } from '@/components/MedicineSearch';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { conversations, activeConversation } = useMessaging();
  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);

  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>(() => {
    return user?.id ? storageService.getAppointments({ patientId: user.id }) : [];
  });

  const reloadAppointments = () => {
    if (user?.id) {
      setPatientAppointments(storageService.getAppointments({ patientId: user.id }));
    }
  };

  React.useEffect(() => {
    reloadAppointments();
  }, [user?.id]);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === user?.id);


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <Layout>
      <div className="px-4 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            {t('dashboard.patient.title')}
          </h1>
          <p className="text-lg text-cyan-300/80 font-medium">
            {t('dashboard.patient.welcomeMessage', { name: user?.name })}
          </p>
        </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('common.dashboard')}</TabsTrigger>
          <TabsTrigger value="messages">{t('common.notifications')}</TabsTrigger>
          <TabsTrigger value="symptoms">{t('dashboard.patient.symptomChecker')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('nav.appointments')}</TabsTrigger>
          <TabsTrigger value="medicines">{t('nav.medicines')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{t('dashboard.patient.upcomingAppointments')}</CardTitle>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-4xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    {patientAppointments.length}
                  </motion.div>
                  <p className="text-sm text-gray-600 mt-2">{t('time.today')} 10:00 AM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{t('dashboard.patient.recentPrescriptions')}</CardTitle>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <FileText className="h-6 w-6 text-green-500" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-4xl font-bold text-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    {patientPrescriptions.length}
                  </motion.div>
                  <p className="text-sm text-gray-600 mt-2">2 {t('nav.medicines')} {t('time.today')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{t('dashboard.patient.healthMetrics')}</CardTitle>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="h-6 w-6 text-orange-500" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-4xl font-bold text-orange-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  >
                    Good
                  </motion.div>
                  <p className="text-sm text-gray-600 mt-2">Based on recent checkups</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="text-2xl">Quick Actions</CardTitle>
                <CardDescription className="text-blue-100">Essential healthcare services at your fingertips</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 lg:grid-cols-4 gap-4 p-6">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="medical" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                    onClick={() => setShowAppointmentBooking(true)}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Calendar className="h-10 w-10" />
                    </motion.div>
                    <span className="text-lg font-semibold">{t('dashboard.patient.bookAppointment')}</span>
                  </Button>
                </motion.div>
              
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Button 
                    variant="destructive" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg relative overflow-hidden"
                    onClick={() => {
                      toast({
                        title: "🚨 " + t('dashboard.patient.emergencyServices'),
                        description: "Alerting nearest ambulance and emergency contacts. Help is on the way!",
                        variant: "destructive"
                      });
                      setTimeout(() => {
                        toast({
                          title: "📍 Ambulance Dispatched",
                          description: "Ambulance from Nabha Civil Hospital is on the way. ETA: 10 minutes. Stay calm.",
                        });
                      }, 2000);
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    <Siren className="h-10 w-10 relative z-10" />
                    <span className="text-lg font-semibold relative z-10">{t('dashboard.patient.emergencyServices')}</span>
                  </Button>
                </motion.div>
              
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "📋 " + t('dashboard.patient.viewMedicalHistory'),
                        description: "Accessing your medical history...",
                      });
                      setTimeout(() => {
                        toast({
                          title: "✅ Records Ready",
                          description: "Your complete health records are now available for download.",
                        });
                      }, 1500);
                    }}
                  >
                    <Download className="h-10 w-10 text-blue-600" />
                    <span className="text-lg font-semibold">{t('dashboard.patient.viewMedicalHistory')}</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="success" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                    onClick={() => {
                      toast({
                        title: "💊 Medicine Reminder Set",
                        description: "You'll receive notifications for your medicines at scheduled times.",
                      });
                    }}
                  >
                    <Bell className="h-10 w-10" />
                    <span className="text-lg font-semibold">Medicine Reminder</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 shadow-lg"
                    onClick={() => {
                      const vitals = {
                        heartRate: Math.floor(Math.random() * 20) + 70,
                        bp: `${Math.floor(Math.random() * 10) + 115}/${Math.floor(Math.random() * 10) + 75}`,
                        oxygen: Math.floor(Math.random() * 3) + 97,
                        temp: (Math.random() * 0.5 + 98).toFixed(1)
                      };
                      toast({
                        title: "🩺 Health Vitals",
                        description: `Heart Rate: ${vitals.heartRate} bpm | BP: ${vitals.bp} | SpO2: ${vitals.oxygen}% | Temp: ${vitals.temp}°F`,
                      });
                    }}
                  >
                    <Activity className="h-10 w-10 text-purple-600" />
                    <span className="text-lg font-semibold">Check Vitals</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "🏥 Insurance Details",
                        description: "Your health insurance is active. Coverage: ₹5,00,000 | Policy: NABHA2024HC",
                      });
                    }}
                  >
                    <Shield className="h-10 w-10 text-cyan-600" />
                    <span className="text-lg font-semibold">Insurance Info</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "🩺 Find Specialist",
                        description: "Searching for specialists in your area...",
                      });
                    }}
                  >
                    <Stethoscope className="h-10 w-10 text-indigo-600" />
                    <span className="text-lg font-semibold">Find Doctor</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "🧪 Lab Test Booking",
                        description: "Available tests: Blood Test, X-Ray, MRI, CT Scan",
                      });
                    }}
                  >
                    <TestTube className="h-10 w-10 text-pink-600" />
                    <span className="text-lg font-semibold">Lab Tests</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "🚚 Medicine Delivery",
                        description: "Free home delivery within 2 hours in Nabha",
                      });
                    }}
                  >
                    <Truck className="h-10 w-10 text-amber-600" />
                    <span className="text-lg font-semibold">Home Delivery</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="outline" 
                    className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 shadow-lg"
                    onClick={() => {
                      toast({
                        title: "👨‍⚕️ Second Opinion",
                        description: "Connect with senior specialists for second opinion",
                      });
                    }}
                  >
                    <UserPlus className="h-10 w-10 text-teal-600" />
                    <span className="text-lg font-semibold">2nd Opinion</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-4">
              {/* AI Health Assistant */}
              <div className="lg:col-span-1">
                <MedicalChatbot className="h-full" />
              </div>
              
              {/* Messages Section */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <CardTitle>Messages & Consultations</CardTitle>
                    <CardDescription className="text-blue-100">Connect with healthcare providers</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      className="grid md:grid-cols-3 gap-4 p-4" 
                      style={{ 
                        height: 'min(calc(100vh - 400px), 500px)',
                        minHeight: '400px'
                      }}
                    >
                      <div className="md:col-span-1 h-full flex flex-col overflow-hidden">
                        <ConversationsList />
                      </div>
                      <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
                        <ChatInterface 
                          onVideoCall={() => setShowVideoCall(true)}
                          onVoiceCall={() => {
                            toast({
                              title: "Voice Call Started",
                              description: "Connecting voice call...",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <SymptomChecker onBookAppointment={() => setShowAppointmentBooking(true)} />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>Manage your doctor consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{appointment.doctorName}</span>
                    </div>
                    <Badge variant={appointment.status === 'approved' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  {appointment.symptoms && (
                    <p className="text-sm text-muted-foreground">Symptoms: {appointment.symptoms}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <MedicineSearch />
          
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Prescriptions</CardTitle>
              <CardDescription>Active prescriptions from doctors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientPrescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{prescription.doctorName}</span>
                    </div>
                    <Badge variant="secondary">{prescription.date}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center space-x-2 text-sm">
                        <Pill className="h-3 w-3 text-success" />
                        <span className="font-medium">{medicine.name}</span>
                        <span className="text-muted-foreground">
                          {medicine.dosage} - {medicine.frequency} for {medicine.duration}
                        </span>
                      </div>
                    ))}
                  </div>

                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      Notes: {prescription.notes}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Booking Dialog */}
      <Dialog open={showAppointmentBooking} onOpenChange={setShowAppointmentBooking}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentBooking 
            onClose={() => setShowAppointmentBooking(false)}
            onMessage={(doctorId, doctorName) => {
              setShowAppointmentBooking(false);
              // Switch to messages tab to show the conversation
              const tabsList = document.querySelector('[role="tablist"]');
              const messagesTab = tabsList?.querySelector('[value="messages"]') as HTMLButtonElement;
              messagesTab?.click();
              
              toast({
                title: "Chat Started",
                description: `You can now message ${doctorName}`,
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          {activeConversation && (
            <VideoCall
              participantName={activeConversation.participants.find(p => p.id !== user?.id)?.name || 'Doctor'}
              participantRole="doctor"
              onEndCall={() => setShowVideoCall(false)}
              onToggleChat={() => {
                setShowVideoCall(false);
                setShowChat(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
