import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/layout/Layout';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Video, 
  CheckCircle, 
  XCircle, 
  Users, 
  MessageSquare, 
  Phone,
  Stethoscope,
  Activity,
  TrendingUp,
  Award,
  DollarSign,
  BarChart3,
  Shield,
  Heart,
  BookOpen,
  Bell,
  Star,
  Zap,
  Target,
  AlertTriangle,
  Clipboard,
  HeartHandshake,
  Brain,
  Microscope
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { storageService } from '@/services/storage';
import { Appointment } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsList } from '@/components/chat/ConversationsList';
import { VideoCall } from '@/components/VideoCall';
import { AppointmentManagement } from '@/components/doctor/AppointmentManagement';
import { PrescriptionWriter } from '@/components/doctor/PrescriptionWriter';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { conversations, activeConversation } = useMessaging();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAppointmentManagement, setShowAppointmentManagement] = useState(false);
  const [showPrescriptionWriter, setShowPrescriptionWriter] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<{id: string; name: string} | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    notes: ''
  });

  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>(() => {
    return user?.id ? storageService.getAppointments({ doctorId: user.id }) : [];
  });

  const reloadDoctorAppointments = () => {
    if (user?.id) {
      setDoctorAppointments(storageService.getAppointments({ doctorId: user.id }));
    }
  };

  React.useEffect(() => {
    reloadDoctorAppointments();
  }, [user?.id]);
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = doctorAppointments.filter(apt => apt.status === 'approved').length;

  // Animation variants
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

  const handleApproveAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Approved",
      description: "Patient has been notified about the approved appointment.",
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Rejected",
      description: "Patient has been notified. Please suggest alternative dates if possible.",
      variant: "destructive"
    });
  };

  const handleAddPrescription = () => {
    if (!prescriptionForm.medicines.trim()) {
      toast({
        title: "Error",
        description: "Please add medicines to the prescription.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Prescription Added",
      description: "Prescription has been saved and patient has been notified.",
    });

    setPrescriptionForm({ patientId: '', medicines: '', notes: '' });
  };

  const startVideoCall = (appointmentId: string) => {
    setShowVideoCall(true);
    toast({
      title: "Video Call Started",
      description: "Connecting to patient...",
    });
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
            Doctor's Command Center
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, Dr. {user?.name} - Ready to heal and serve!
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <motion.div
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Pending Requests</CardTitle>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Clock className="h-6 w-6 text-orange-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-orange-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {pendingCount}
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">Awaiting your approval</p>
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
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-blue-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      {approvedCount}
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">Scheduled consultations</p>
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
                <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Total Patients</CardTitle>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="h-6 w-6 text-green-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-green-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      156
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">This month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Consultations</CardTitle>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Video className="h-6 w-6 text-purple-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-purple-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      89
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">Completed this week</p>
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
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CardTitle className="text-2xl">Doctor's Toolkit</CardTitle>
                  <CardDescription className="text-green-100">Essential tools for patient care and management</CardDescription>
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
                      onClick={() => setShowAppointmentManagement(true)}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <CheckCircle className="h-10 w-10" />
                      </motion.div>
                      <span className="text-lg font-semibold">Manage Appointments</span>
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
                        setCurrentPatient({ id: '1', name: 'Patient' });
                        setShowPrescriptionWriter(true);
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <FileText className="h-10 w-10" />
                      </motion.div>
                      <span className="text-lg font-semibold">Write Prescription</span>
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
                      onClick={() => setShowVideoCall(true)}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Video className="h-10 w-10 text-purple-600" />
                      </motion.div>
                      <span className="text-lg font-semibold">Start Consultation</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📊 Patient Records",
                          description: "Access complete medical history and reports",
                        });
                      }}
                    >
                      <Clipboard className="h-10 w-10 text-yellow-600" />
                      <span className="text-lg font-semibold">Patient Records</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "🚨 Emergency Protocol",
                          description: "Access emergency guidelines and procedures",
                        });
                      }}
                    >
                      <AlertTriangle className="h-10 w-10 text-red-600" />
                      <span className="text-lg font-semibold">Emergency</span>
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
                          title: "🔬 Lab Reports",
                          description: "Review and analyze patient lab results",
                        });
                      }}
                    >
                      <Microscope className="h-10 w-10 text-cyan-600" />
                      <span className="text-lg font-semibold">Lab Reports</span>
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
                          title: "📚 Medical Library",
                          description: "Access medical references and guidelines",
                        });
                      }}
                    >
                      <BookOpen className="h-10 w-10 text-indigo-600" />
                      <span className="text-lg font-semibold">References</span>
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
                          title: "💊 Drug Database",
                          description: "Search drug interactions and information",
                        });
                      }}
                    >
                      <Heart className="h-10 w-10 text-pink-600" />
                      <span className="text-lg font-semibold">Drug Info</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📈 Analytics",
                          description: "View your practice statistics and insights",
                        });
                      }}
                    >
                      <BarChart3 className="h-10 w-10 text-emerald-600" />
                      <span className="text-lg font-semibold">Analytics</span>
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
                          title: "🤝 Referrals",
                          description: "Connect with specialists for patient referrals",
                        });
                      }}
                    >
                      <HeartHandshake className="h-10 w-10 text-teal-600" />
                      <span className="text-lg font-semibold">Referrals</span>
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
                          title: "🏆 Achievements",
                          description: "Track your professional milestones",
                        });
                      }}
                    >
                      <Award className="h-10 w-10 text-amber-600" />
                      <span className="text-lg font-semibold">Achievements</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "🧠 AI Assistant",
                          description: "Get AI-powered diagnostic suggestions",
                        });
                      }}
                    >
                      <Brain className="h-10 w-10 text-slate-600" />
                      <span className="text-lg font-semibold">AI Assistant</span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="relative">
            <div 
              className="grid md:grid-cols-3 gap-4" 
              style={{ 
                height: 'min(calc(100vh - 320px), 600px)',
                minHeight: '450px'
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
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
              <CardDescription>Manage patient appointment requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-success" />
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                    <Badge variant={
                      appointment.status === 'pending' ? 'secondary' :
                      appointment.status === 'approved' ? 'default' : 'outline'
                    }>
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
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Symptoms:</strong> {appointment.symptoms}
                    </div>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleApproveAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectAppointment(appointment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {appointment.status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="medical"
                      onClick={() => startVideoCall(appointment.id)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Start Consultation
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add Prescription</CardTitle>
              <CardDescription>Create prescription for your patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient</label>
                <Input
                  placeholder="Enter patient name or ID"
                  value={prescriptionForm.patientId}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, patientId: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Medicines</label>
                <Textarea
                  placeholder="e.g., Paracetamol 500mg - Twice daily for 5 days"
                  value={prescriptionForm.medicines}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, medicines: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <Textarea
                  placeholder="Any additional instructions for the patient"
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button onClick={handleAddPrescription} variant="medical" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Video Consultations</CardTitle>
              <CardDescription>Manage your remote consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="font-medium">Available for Consultations</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Patients can book video calls with you
                  </p>
                  <Button variant="outline" size="sm">
                    Go Offline
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-2">
                  <div className="text-lg font-semibold">Next Consultation</div>
                  <div className="text-sm text-muted-foreground">
                    Krishna - 10:00 AM Today
                  </div>
                  <Button variant="medical" size="sm">
                    <Video className="h-4 w-4 mr-1" />
                    Join Call
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Demo Video Call Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High-quality video and audio</li>
                  <li>• Screen sharing for medical reports</li>
                  <li>• Recording for medical records</li>
                  <li>• Secure, HIPAA-compliant platform</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Management Dialog */}
      <Dialog open={showAppointmentManagement} onOpenChange={setShowAppointmentManagement}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Management</DialogTitle>
          </DialogHeader>
          <AppointmentManagement
            onStartVideoCall={(appointmentId) => {
              setShowAppointmentManagement(false);
              setShowVideoCall(true);
            }}
            onWritePrescription={(appointmentId, patientName) => {
              setCurrentPatient({ id: appointmentId, name: patientName });
              setShowAppointmentManagement(false);
              setShowPrescriptionWriter(true);
            }}
            onMessagePatient={(patientId, patientName) => {
              toast({
                title: "Opening Chat",
                description: `Starting conversation with ${patientName}...`,
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Prescription Writer Dialog */}
      <Dialog open={showPrescriptionWriter} onOpenChange={setShowPrescriptionWriter}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionWriter
            patientName={currentPatient?.name}
            patientId={currentPatient?.id}
            onSave={(prescription) => {
              console.log('Prescription saved:', prescription);
            }}
            onSend={(prescription) => {
              console.log('Prescription sent:', prescription);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          {activeConversation && (
            <VideoCall
              participantName={activeConversation.participants.find(p => p.id !== user?.id)?.name || 'Patient'}
              participantRole="patient"
              onEndCall={() => setShowVideoCall(false)}
              onToggleChat={() => {
                setShowVideoCall(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
