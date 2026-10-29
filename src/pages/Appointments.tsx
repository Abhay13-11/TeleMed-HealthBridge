import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Phone,
  Eye,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import { Appointment, AppointmentStatus } from '@/types/medical';
import { AppointmentBooking } from '@/components/AppointmentBooking';
import { VideoCall } from '@/components/VideoCall';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const Appointments = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<Appointment | null>(null);
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const loadAppointments = () => {
    if (!user) return;
    if (user.role === 'patient') {
      setAppointments(storageService.getAppointments({ patientId: user.id }));
    } else if (user.role === 'doctor') {
      setAppointments(storageService.getAppointments({ doctorId: user.id }));
    } else {
      setAppointments(storageService.getAppointments());
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  // Protect route
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Sign In Required</h2>
          <p className="text-xs text-stone-600">
            Please log in with your HealthBridge account to access your medical appointments and consultation schedule.
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

  const handleCancelAppointment = (apt: Appointment) => {
    if (!window.confirm(`Are you sure you want to cancel the appointment with ${apt.doctorName}?`)) {
      return;
    }

    try {
      storageService.updateAppointmentStatus(apt.id, 'CANCELLED', user, {
        reason: 'Cancelled by patient request'
      });
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${apt.doctorName} has been cancelled.`,
      });
      loadAppointments();
    } catch (err: unknown) {
      toast({
        title: "Cancellation Error",
        description: err instanceof Error ? err.message : "Failed to cancel appointment.",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleSubmit = () => {
    if (!reschedulingApt || !newDate || !newTime) {
      toast({
        title: "Select Date & Time",
        description: "Please specify both the new date and time.",
        variant: "destructive"
      });
      return;
    }

    try {
      storageService.updateAppointmentStatus(reschedulingApt.id, 'RESCHEDULED', user, {
        newDate,
        newTime,
        notes: `Rescheduled by ${user.name}`
      });

      toast({
        title: "Appointment Rescheduled",
        description: `Consultation moved to ${newDate} at ${newTime}.`,
      });

      setReschedulingApt(null);
      setNewDate('');
      setNewTime('');
      loadAppointments();
    } catch (err: unknown) {
      toast({
        title: "Rescheduling Error",
        description: err instanceof Error ? err.message : "Failed to reschedule appointment.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'CONFIRMED':
      case 'APPROVED':
        return <Badge variant="success" className="text-xs">Confirmed</Badge>;
      case 'REQUESTED':
      case 'PENDING':
        return <Badge variant="warning" className="text-xs">Requested</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="text-xs">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" className="text-xs">Cancelled</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="default" className="text-xs bg-emerald-700 animate-pulse">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const filtered = appointments.filter(apt => {
    const s = apt.status.toUpperCase();
    if (filter === 'pending') return s === 'REQUESTED' || s === 'PENDING';
    if (filter === 'confirmed') return s === 'CONFIRMED' || s === 'APPROVED';
    if (filter === 'completed') return s === 'COMPLETED';
    if (filter === 'cancelled') return s === 'CANCELLED';
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {user.role === 'patient' ? 'My Consultations & Visits' : 'Patient Appointment Schedule'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Nabha Civil Hospital Telemedicine Service • Verified Patient Registry
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAppointments}
              className="text-xs border-stone-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            {user.role === 'patient' && (
              <Button 
                size="sm" 
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
                onClick={() => setIsBookingOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Book Consultation
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab === 'all' ? 'All Appointments' : tab}
              <span className="ml-1.5 opacity-70">
                ({tab === 'all' 
                  ? appointments.length 
                  : appointments.filter(a => {
                      const s = a.status.toUpperCase();
                      if (tab === 'pending') return s === 'REQUESTED' || s === 'PENDING';
                      if (tab === 'confirmed') return s === 'CONFIRMED' || s === 'APPROVED';
                      if (tab === 'completed') return s === 'COMPLETED';
                      if (tab === 'cancelled') return s === 'CANCELLED';
                      return false;
                    }).length
                })
              </span>
            </button>
          ))}
        </div>

        {/* Appointments Grid */}
        {filtered.length === 0 ? (
          <Card className="border-stone-200 bg-white text-center py-12">
            <CardContent className="space-y-3">
              <Calendar className="h-12 w-12 text-stone-400 mx-auto" />
              <h3 className="text-base font-semibold text-stone-800">No Appointments Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {filter === 'all' 
                  ? "You have no scheduled consultations. Book an appointment to consult with a Nabha Civil Hospital doctor." 
                  : `No appointments currently marked as ${filter}.`}
              </p>
              {user.role === 'patient' && (
                <Button 
                  size="sm"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs mt-2"
                  onClick={() => setIsBookingOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Schedule New Visit
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((apt) => {
              const isConfirmed = ['CONFIRMED', 'APPROVED'].includes(apt.status.toUpperCase());
              const isPending = ['REQUESTED', 'PENDING'].includes(apt.status.toUpperCase());
              const isCompleted = apt.status.toUpperCase() === 'COMPLETED';
              
              return (
                <Card 
                  key={apt.id} 
                  className="border-stone-200 bg-white hover:border-emerald-600 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-1.5 w-full rounded-t-lg ${
                      isConfirmed ? 'bg-emerald-700' :
                      isPending ? 'bg-amber-500' :
                      isCompleted ? 'bg-stone-400' : 'bg-red-500'
                    }`} />
                    
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-bold text-stone-900">
                            {user.role === 'patient' ? apt.doctorName : apt.patientName}
                          </CardTitle>
                          <CardDescription className="text-xs text-stone-500 mt-0.5">
                            {apt.specialty}
                          </CardDescription>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-2.5 text-xs text-stone-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3.5 w-3.5 text-stone-400" />
                        <span className="font-medium text-stone-800">{apt.date}</span>
                        <span>•</span>
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        <span>{apt.time}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {apt.type === 'video' ? (
                          <div className="flex items-center text-emerald-800 font-medium">
                            <Video className="h-3.5 w-3.5 mr-1" />
                            <span>Video Consultation</span>
                          </div>
                        ) : apt.type === 'phone' ? (
                          <div className="flex items-center text-stone-700">
                            <Phone className="h-3.5 w-3.5 mr-1" />
                            <span>Phone Consultation</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-stone-700">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>Nabha Civil Hospital OPD</span>
                          </div>
                        )}
                      </div>

                      {apt.symptoms && (
                        <div className="p-2 bg-stone-50 rounded border border-stone-100 text-[11px]">
                          <span className="text-stone-400 block font-medium">Notes:</span>
                          <span className="line-clamp-2 text-stone-700">{apt.symptoms}</span>
                        </div>
                      )}

                      {apt.rejectionReason && (
                        <div className="p-2 bg-red-50 text-red-900 rounded border border-red-200 text-[11px]">
                          <span className="font-semibold">Cancellation / Decline Reason:</span>
                          <p>{apt.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 pt-0 border-t border-stone-100 flex gap-2 mt-2">
                    {isConfirmed && apt.type === 'video' && (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-8"
                        onClick={() => setActiveVideoCall(apt)}
                      >
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Join Call
                      </Button>
                    )}

                    {isPending && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs h-8 border-stone-300"
                          onClick={() => setReschedulingApt(apt)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1 text-xs h-8 bg-red-700 hover:bg-red-800"
                          onClick={() => handleCancelAppointment(apt)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-8 text-stone-600 hover:text-stone-900"
                      onClick={() => setSelectedDetails(apt)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-900">Schedule Telemedicine Consultation</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Nabha Civil Hospital • Free Rural Healthcare Access
            </DialogDescription>
          </DialogHeader>
          <AppointmentBooking 
            onClose={() => setIsBookingOpen(false)}
            onSuccess={() => {
              loadAppointments();
              setIsBookingOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Appointment Details Modal */}
      <Dialog open={!!selectedDetails} onOpenChange={() => setSelectedDetails(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Consultation Details</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Reference ID: {selectedDetails?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedDetails && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg space-y-2 border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Patient:</span>
                  <span className="font-semibold text-stone-800">{selectedDetails.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Attending Physician:</span>
                  <span className="font-semibold text-stone-800">{selectedDetails.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Department:</span>
                  <span>{selectedDetails.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date & Slot:</span>
                  <span className="font-medium text-emerald-800">{selectedDetails.date} at {selectedDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  {getStatusBadge(selectedDetails.status)}
                </div>
              </div>

              {selectedDetails.symptoms && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-700 block mb-1">Reported Symptoms:</span>
                  <p className="text-stone-600 leading-relaxed">{selectedDetails.symptoms}</p>
                </div>
              )}

              {selectedDetails.auditLog && selectedDetails.auditLog.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <span className="font-semibold text-stone-700 block">Audit History:</span>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedDetails.auditLog.map((log, i) => (
                      <div key={i} className="text-[10px] text-stone-500 flex justify-between">
                        <span>{log.action} by {log.actorName} ({log.actorRole})</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={!!reschedulingApt} onOpenChange={() => setReschedulingApt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Reschedule Consultation</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Select a new date and time for {reschedulingApt?.doctorName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-medium text-stone-700">New Date (YYYY-MM-DD)</label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700">New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs mt-1"
              >
                <option value="">Select Slot</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setReschedulingApt(null)} className="text-xs">
                Back
              </Button>
              <Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs" onClick={handleRescheduleSubmit}>
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Call Modal */}
      <Dialog open={!!activeVideoCall} onOpenChange={() => setActiveVideoCall(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
          {activeVideoCall && (
            <VideoCall
              participantName={activeVideoCall.doctorName}
              participantRole="doctor"
              onEndCall={() => {
                setActiveVideoCall(null);
                loadAppointments();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Appointments;
