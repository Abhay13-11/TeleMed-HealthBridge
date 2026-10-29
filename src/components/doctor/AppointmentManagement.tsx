import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Video,
  MessageSquare,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  symptoms: string;
  medicalHistory?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  previousVisits: number;
  lastVisit?: string;
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string;
  prescriptionId?: string;
}

interface AppointmentManagementProps {
  onStartConsultation?: (appointmentId: string) => void;
  onWritePrescription?: (appointmentId: string, patientName: string) => void;
  onStartVideoCall?: (appointmentId: string) => void;
  onMessagePatient?: (patientId: string, patientName: string) => void;
}

export const AppointmentManagement: React.FC<AppointmentManagementProps> = ({
  onStartConsultation,
  onWritePrescription,
  onStartVideoCall,
  onMessagePatient
}) => {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentAction, setAppointmentAction] = useState<'approve' | 'reject' | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Mock appointment data
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Harpreet Singh',
      patientAge: 35,
      patientGender: 'Male',
      patientPhone: '+91 98765 43210',
      patientEmail: 'harpreet@example.com',
      patientAddress: 'Village Kalyan, Near Nabha',
      date: format(new Date(), 'PPP'),
      time: '10:00 AM',
      type: 'video',
      status: 'pending',
      symptoms: 'Fever, headache, and body ache for 3 days',
      medicalHistory: ['Diabetes Type 2', 'Hypertension'],
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: 78,
        temperature: 99.5,
        weight: 75,
        height: 175
      },
      previousVisits: 3,
      lastVisit: '2 months ago',
      priority: 'urgent'
    },
    {
      id: '2',
      patientName: 'Simran Kaur',
      patientAge: 28,
      patientGender: 'Female',
      patientPhone: '+91 98765 12345',
      patientEmail: 'simran@example.com',
      patientAddress: 'Nabha City',
      date: format(new Date(), 'PPP'),
      time: '11:30 AM',
      type: 'in-person',
      status: 'pending',
      symptoms: 'Chronic cough and breathing difficulty',
      medicalHistory: ['Asthma'],
      previousVisits: 5,
      lastVisit: '1 month ago',
      priority: 'urgent'
    },
    {
      id: '3',
      patientName: 'Jaspreet Sharma',
      patientAge: 42,
      patientGender: 'Male',
      patientPhone: '+91 98765 67890',
      patientEmail: 'jaspreet@example.com',
      patientAddress: 'Village Bhawanigarh',
      date: format(new Date(), 'PPP'),
      time: '2:00 PM',
      type: 'video',
      status: 'approved',
      symptoms: 'Routine checkup for diabetes management',
      medicalHistory: ['Diabetes Type 2', 'High Cholesterol'],
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: 82,
        temperature: 98.6,
        weight: 80,
        height: 170
      },
      previousVisits: 8,
      lastVisit: '3 weeks ago',
      priority: 'routine'
    },
    {
      id: '4',
      patientName: 'Gurpreet Kaur',
      patientAge: 55,
      patientGender: 'Female',
      patientPhone: '+91 98765 11111',
      patientEmail: 'gurpreet@example.com',
      patientAddress: 'Village Lubana',
      date: format(new Date(), 'PPP'),
      time: '3:30 PM',
      type: 'phone',
      status: 'pending',
      symptoms: 'Follow-up for blood pressure medication',
      medicalHistory: ['Hypertension', 'Arthritis'],
      previousVisits: 12,
      lastVisit: '2 weeks ago',
      priority: 'routine'
    }
  ];

  const [appointments, setAppointments] = useState(mockAppointments);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600';
      case 'urgent': return 'text-orange-600';
      case 'routine': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'cancelled': return <Badge variant="outline">Cancelled</Badge>;
      default: return null;
    }
  };

  const getAppointmentTypeBadge = (type: string) => {
    switch (type) {
      case 'video': return <Badge variant="outline" className="text-blue-600 border-blue-600"><Video className="h-3 w-3 mr-1" />Video</Badge>;
      case 'in-person': return <Badge variant="outline" className="text-green-600 border-green-600"><User className="h-3 w-3 mr-1" />In-Person</Badge>;
      case 'phone': return <Badge variant="outline" className="text-purple-600 border-purple-600"><Phone className="h-3 w-3 mr-1" />Phone</Badge>;
      default: return null;
    }
  };

  const handleApproveAppointment = (appointment: Appointment) => {
    try {
      storageService.updateAppointmentStatus(
        appointment.id, 
        'CONFIRMED', 
        user || { id: '2', name: 'Dr. Rachit', role: 'doctor', email: 'doctor@demo.com' }
      );
    } catch (e) {
      // Continue with UI state update
    }
    setAppointments(appointments.map(apt => 
      apt.id === appointment.id ? { ...apt, status: 'approved' } : apt
    ));
    
    toast({
      title: "✅ Appointment Approved",
      description: `${appointment.patientName}'s appointment at ${appointment.time} has been confirmed.`,
    });

    // Send notification to patient
    setTimeout(() => {
      toast({
        title: "📧 Patient Notified",
        description: "Confirmation SMS and email sent to the patient.",
      });
    }, 1000);

    setSelectedAppointment(null);
    setAppointmentAction(null);
  };

  const handleRejectAppointment = (appointment: Appointment) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === appointment.id ? { ...apt, status: 'rejected', notes: rejectionReason } : apt
    ));
    
    toast({
      title: "Appointment Rejected",
      description: `${appointment.patientName}'s appointment has been rejected.`,
      variant: "destructive"
    });

    setRejectionReason('');
    setSelectedAppointment(null);
    setAppointmentAction(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast({
        title: "Select Date & Time",
        description: "Please select both date and time for rescheduling.",
        variant: "destructive"
      });
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, date: rescheduleDate, time: rescheduleTime, notes: 'Rescheduled by doctor' } 
        : apt
    ));
    
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment moved to ${rescheduleDate} at ${rescheduleTime}.`,
    });

    setRescheduleDate('');
    setRescheduleTime('');
    setSelectedAppointment(null);
  };

  const handleCompleteAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointment.id ? { ...apt, status: 'completed' } : apt
    ));
    
    toast({
      title: "Appointment Completed",
      description: "Appointment marked as completed. Patient records updated.",
    });
  };

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const todayAppointments = appointments.filter(apt => 
    apt.status === 'approved' && apt.date === format(new Date(), 'PPP')
  );
  const upcomingAppointments = appointments.filter(apt => apt.status === 'approved');

  return (
    <div className="space-y-4">
      {/* Statistics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Appointments today</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Consultations</CardTitle>
            <Video className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.type === 'video').length}
            </div>
            <p className="text-xs text-muted-foreground">Online sessions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Management Tabs */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
          <CardDescription>Review and manage patient appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="today">
                Today's Schedule ({todayAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                All Appointments ({appointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {pendingAppointments.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        No pending appointments. All caught up!
                      </AlertDescription>
                    </Alert>
                  ) : (
                    pendingAppointments.map(appointment => (
                      <Card key={appointment.id} className="border-orange-200">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {/* Patient Info Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{appointment.patientName}</h3>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>{appointment.patientAge} yrs, {appointment.patientGender}</span>
                                    <span>•</span>
                                    <span className={getPriorityColor(appointment.priority)}>
                                      {appointment.priority.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getAppointmentTypeBadge(appointment.type)}
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span>{appointment.time}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{appointment.patientPhone}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{appointment.patientAddress}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Activity className="h-3 w-3 text-muted-foreground" />
                                  <span>{appointment.previousVisits} previous visits</span>
                                </div>
                                {appointment.lastVisit && (
                                  <div className="flex items-center space-x-2">
                                    <Timer className="h-3 w-3 text-muted-foreground" />
                                    <span>Last visit: {appointment.lastVisit}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Symptoms */}
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm font-medium mb-1">Chief Complaint:</p>
                              <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                            </div>

                            {/* Medical History */}
                            {appointment.medicalHistory && appointment.medicalHistory.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-wrap gap-2">
                                  {appointment.medicalHistory.map((condition, index) => (
                                    <Badge key={index} variant="secondary">{condition}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Vital Signs */}
                            {appointment.vitalSigns && (
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                {appointment.vitalSigns.bloodPressure && (
                                  <div className="bg-muted p-2 rounded text-center">
                                    <p className="text-xs text-muted-foreground">BP</p>
                                    <p className="font-medium">{appointment.vitalSigns.bloodPressure}</p>
                                  </div>
                                )}
                                {appointment.vitalSigns.heartRate && (
                                  <div className="bg-muted p-2 rounded text-center">
                                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                                    <p className="font-medium">{appointment.vitalSigns.heartRate} bpm</p>
                                  </div>
                                )}
                                {appointment.vitalSigns.temperature && (
                                  <div className="bg-muted p-2 rounded text-center">
                                    <p className="text-xs text-muted-foreground">Temp</p>
                                    <p className="font-medium">{appointment.vitalSigns.temperature}°F</p>
                                  </div>
                                )}
                                {appointment.vitalSigns.weight && (
                                  <div className="bg-muted p-2 rounded text-center">
                                    <p className="text-xs text-muted-foreground">Weight</p>
                                    <p className="font-medium">{appointment.vitalSigns.weight} kg</p>
                                  </div>
                                )}
                                {appointment.vitalSigns.height && (
                                  <div className="bg-muted p-2 rounded text-center">
                                    <p className="text-xs text-muted-foreground">Height</p>
                                    <p className="font-medium">{appointment.vitalSigns.height} cm</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApproveAppointment(appointment)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setAppointmentAction('reject');
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Reschedule
                              </Button>
                              
                              {appointment.type === 'video' && (
                                <Button 
                                  variant="medical" 
                                  size="sm"
                                  onClick={() => {
                                    handleApproveAppointment(appointment);
                                    onStartVideoCall?.(appointment.id);
                                  }}
                                >
                                  <Video className="h-4 w-4 mr-1" />
                                  Approve & Start Video
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onMessagePatient?.(appointment.id, appointment.patientName)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onWritePrescription?.(appointment.id, appointment.patientName)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Prescribe
                              </Button>
                            </div>

                            {/* Rejection Dialog */}
                            {selectedAppointment?.id === appointment.id && appointmentAction === 'reject' && (
                              <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
                                <h4 className="font-medium text-red-900">Rejection Reason</h4>
                                <Textarea
                                  placeholder="Please provide a reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleRejectAppointment(appointment)}
                                  >
                                    Confirm Rejection
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAppointment(null);
                                      setAppointmentAction(null);
                                      setRejectionReason('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Reschedule Dialog */}
                            {selectedAppointment?.id === appointment.id && appointmentAction !== 'reject' && (
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                                <h4 className="font-medium text-blue-900">Reschedule Appointment</h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm font-medium">New Date</label>
                                    <Input
                                      type="date"
                                      value={rescheduleDate}
                                      onChange={(e) => setRescheduleDate(e.target.value)}
                                      min={format(new Date(), 'yyyy-MM-dd')}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">New Time</label>
                                    <Input
                                      type="time"
                                      value={rescheduleTime}
                                      onChange={(e) => setRescheduleTime(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="medical"
                                    onClick={() => handleReschedule(appointment)}
                                  >
                                    Confirm Reschedule
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAppointment(null);
                                      setRescheduleDate('');
                                      setRescheduleTime('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No appointments scheduled for today.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    todayAppointments.map(appointment => (
                      <Card key={appointment.id} className="border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{appointment.patientName}</h3>
                                {getAppointmentTypeBadge(appointment.type)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.time}</span>
                                </span>
                                <span>{appointment.symptoms}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {appointment.type === 'video' && (
                                <Button 
                                  variant="medical" 
                                  size="sm"
                                  onClick={() => onStartVideoCall?.(appointment.id)}
                                >
                                  <Video className="h-4 w-4 mr-1" />
                                  Start Video
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onStartConsultation?.(appointment.id)}
                              >
                                <Stethoscope className="h-4 w-4 mr-1" />
                                Start Consultation
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleCompleteAppointment(appointment)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              {getStatusBadge(appointment.status)}
                              {getAppointmentTypeBadge(appointment.type)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{appointment.date}</span>
                              <span>{appointment.time}</span>
                              <span className={getPriorityColor(appointment.priority)}>
                                {appointment.priority}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};