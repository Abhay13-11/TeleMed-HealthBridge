import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Clock, 
  Star, 
  Circle, 
  MessageSquare, 
  Video, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Stethoscope, 
  MapPin, 
  Languages,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { storageService } from '@/services/storage';
import { Appointment } from '@/types/medical';
import { format } from 'date-fns';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  languages: string[];
  rating: number;
  isOnline: boolean;
  availability: string[];
  location: string;
  consultationFee: number;
}

interface AppointmentBookingProps {
  onClose: () => void;
  onMessage?: (doctorId: string, doctorName: string) => void;
  onSuccess?: (appointment: Appointment) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  onClose, 
  onMessage,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createConversation } = useMessaging();
  
  const [step, setStep] = useState<'category' | 'doctors' | 'datetime' | 'confirm' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('General Medicine');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person' | 'phone'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  const categories = [
    { id: 'General Medicine', name: 'General Medicine', desc: 'Fever, cold, hypertension, diabetes' },
    { id: 'Pediatrician', name: 'Pediatrics', desc: 'Child health, infant care, immunizations' },
    { id: 'Gynecologist', name: 'Maternal & Women Health', desc: 'Antenatal care, maternal wellness' },
    { id: 'Cardiologist', name: 'Cardiology', desc: 'Chest pressure, heart health, blood pressure' },
    { id: 'Dermatologist', name: 'Dermatology', desc: 'Skin rashes, allergies, infections' }
  ];

  const availableDoctors: Doctor[] = [
    {
      id: 'doc-1',
      name: 'Dr. Rachit Kumar',
      specialization: 'General Medicine',
      experience: '10 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.8,
      isOnline: true,
      availability: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 0 // Free public health care at Nabha Civil Hospital
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Singh',
      specialization: 'Pediatrician',
      experience: '8 years',
      languages: ['English', 'Hindi'],
      rating: 4.7,
      isOnline: true,
      availability: ['09:00 AM', '10:30 AM', '01:00 PM', '05:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 0
    },
    {
      id: 'doc-3',
      name: 'Dr. Harpreet Kaur',
      specialization: 'Gynecologist',
      experience: '15 years',
      languages: ['English', 'Punjabi'],
      rating: 4.9,
      isOnline: false,
      availability: ['11:00 AM', '12:00 PM', '03:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 0
    },
    {
      id: 'doc-4',
      name: 'Dr. Amit Sharma',
      specialization: 'Cardiologist',
      experience: '12 years',
      languages: ['English', 'Hindi'],
      rating: 4.6,
      isOnline: true,
      availability: ['10:00 AM', '02:00 PM', '04:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 0
    },
    {
      id: 'doc-5',
      name: 'Dr. Simran Bajwa',
      specialization: 'Dermatologist',
      experience: '6 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.5,
      isOnline: true,
      availability: ['09:30 AM', '11:30 AM', '03:30 PM', '05:30 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 0
    }
  ];

  const filteredDoctors = availableDoctors.filter(d => 
    selectedCategory === 'all' || d.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('datetime');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Details",
        description: "Please pick a doctor, date, and available time slot.",
        variant: "destructive"
      });
      return;
    }

    if (!consentConfirmed) {
      toast({
        title: "Consent Required",
        description: "Please acknowledge the telemedicine consent before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive"
      });
      return;
    }

    // Duplicate submission protection
    setIsSubmitting(true);

    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const newApt = storageService.createAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialization,
        date: dateString,
        time: selectedTime,
        type: consultationType,
        status: 'REQUESTED',
        symptoms: symptoms.trim() || 'General health consultation'
      }, user);

      setCreatedAppointment(newApt);
      setStep('success');

      toast({
        title: "Appointment Requested!",
        description: `Request submitted for ${selectedDoctor.name} on ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
      });

      if (onSuccess) {
        onSuccess(newApt);
      }
    } catch (err: unknown) {
      toast({
        title: "Booking Conflict",
        description: err instanceof Error ? err.message : "Unable to book appointment at this time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageDoctor = (doctor: Doctor) => {
    createConversation(doctor.id);
    if (onMessage) {
      onMessage(doctor.id, doctor.name);
    }
    toast({
      title: "Opening Chat",
      description: `Starting consultation channel with ${doctor.name}...`,
    });
  };

  return (
    <div className="space-y-4 text-stone-900 font-sans">
      {/* Step 1: Specialty Category */}
      {step === 'category' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">Select Clinical Specialty</h3>
            <p className="text-xs text-stone-500">Choose the medical discipline for your consultation at Nabha Civil Hospital</p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setStep('doctors');
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedCategory === cat.id 
                    ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700' 
                    : 'border-stone-200 bg-white hover:border-emerald-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-stone-900">{cat.name}</h4>
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setStep('doctors');
              }}
              className="text-xs"
            >
              Browse All Available Doctors
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Doctor Selection */}
      {step === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-stone-600 px-1.5 h-7"
                  onClick={() => setStep('category')}
                >
                  ← Specialties
                </Button>
                <h3 className="text-sm font-bold text-stone-900">Physicians in Nabha</h3>
              </div>
              <p className="text-xs text-stone-500">Showing verified civil hospital practitioners</p>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-700/40 bg-emerald-50">
              <Circle className="h-2 w-2 fill-current mr-1 text-emerald-600" />
              {filteredDoctors.filter(d => d.isOnline).length} Active Now
            </Badge>
          </div>

          <ScrollArea className="h-[380px] pr-2">
            <div className="space-y-3">
              {filteredDoctors.map(doctor => (
                <Card 
                  key={doctor.id} 
                  className="border-stone-200 hover:border-emerald-600 transition-all shadow-sm"
                >
                  <CardContent className="p-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 border border-stone-200">
                          <AvatarFallback className="bg-emerald-100 text-emerald-900 text-xs font-bold">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-stone-900">{doctor.name}</h4>
                            {doctor.isOnline && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                                Available Today
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-[11px] text-stone-600">
                            <Stethoscope className="h-3 w-3 text-stone-400" />
                            <span>{doctor.specialization}</span>
                            <span>•</span>
                            <span>{doctor.experience}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-[11px] text-stone-500">
                            <MapPin className="h-3 w-3 text-stone-400" />
                            <span>{doctor.location}</span>
                            <span>•</span>
                            <span className="text-emerald-800 font-medium">Free Public Healthcare</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-1.5 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        <Button 
                          size="sm" 
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-7 px-3"
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Select Slot
                        </Button>
                        
                        {doctor.isOnline && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs h-7 px-2.5 border-stone-300"
                            onClick={() => handleMessageDoctor(doctor)}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Ask Query
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Step 3: Date, Time & Consultation Type */}
      {step === 'datetime' && selectedDoctor && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-stone-600 px-1.5 h-7"
              onClick={() => setStep('doctors')}
            >
              ← Back to Doctors
            </Button>
            <div className="text-xs">
              <span className="font-semibold text-stone-900">{selectedDoctor.name}</span>
              <span className="text-stone-500 ml-1">({selectedDoctor.specialization})</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-stone-200">
              <CardHeader className="py-2.5 px-3">
                <CardTitle className="text-xs font-semibold text-stone-800">1. Preferred Date</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border border-stone-200 text-xs"
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Card className="border-stone-200">
                <CardHeader className="py-2.5 px-3">
                  <CardTitle className="text-xs font-semibold text-stone-800">2. Consultation Mode</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('video')}
                      className={`p-2 rounded border text-xs text-center font-medium transition-colors ${
                        consultationType === 'video'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Video className="h-4 w-4 mx-auto mb-1 text-emerald-700" />
                      Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('in-person')}
                      className={`p-2 rounded border text-xs text-center font-medium transition-colors ${
                        consultationType === 'in-person'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <MapPin className="h-4 w-4 mx-auto mb-1 text-emerald-700" />
                      Hospital OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('phone')}
                      className={`p-2 rounded border text-xs text-center font-medium transition-colors ${
                        consultationType === 'phone'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Clock className="h-4 w-4 mx-auto mb-1 text-emerald-700" />
                      Phone Call
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-stone-200">
                <CardHeader className="py-2.5 px-3">
                  <CardTitle className="text-xs font-semibold text-stone-800">3. Available Time Slots</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDoctor.availability.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        className={`text-xs h-7 ${
                          selectedTime === time 
                            ? 'bg-emerald-800 hover:bg-emerald-900 text-white' 
                            : 'border-stone-200 text-stone-700 hover:border-emerald-600'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-stone-200">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs font-semibold text-stone-800">4. Symptoms or Reason for Visit</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Textarea
                placeholder="Briefly describe what symptoms you are experiencing (e.g. fever for 3 days, joint pain)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                className="text-xs bg-stone-50/50 border-stone-200"
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep('doctors')} className="text-xs">
              Back
            </Button>
            <Button 
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-4"
              onClick={() => setStep('confirm')}
              disabled={!selectedTime}
            >
              Review Booking
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review, Informed Consent & Duplicate-Protected Submission */}
      {step === 'confirm' && selectedDoctor && selectedDate && selectedTime && (
        <Card className="border-stone-200 shadow-md">
          <CardHeader className="py-3 px-4 border-b border-stone-100">
            <CardTitle className="text-sm font-bold text-stone-900">Review & Confirm Consultation Request</CardTitle>
            <CardDescription className="text-xs text-stone-500">
              Your request will be placed in the physician's queue for confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Physician:</span>
                <span className="font-semibold text-stone-900">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Department:</span>
                <span className="text-stone-800">{selectedDoctor.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-medium text-emerald-800">{format(selectedDate, 'PPP')} at {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Consultation Type:</span>
                <span className="capitalize font-medium text-stone-800">{consultationType} Consultation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Facility:</span>
                <span className="text-stone-800">{selectedDoctor.location}</span>
              </div>
              {symptoms && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500 block">Reported Symptoms:</span>
                  <span className="text-stone-700 italic">{symptoms}</span>
                </div>
              )}
            </div>

            {/* Informed Consent Checkbox */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-amber-300 text-emerald-800 focus:ring-emerald-600"
                />
                <span className="text-xs text-amber-900 leading-relaxed">
                  I give my voluntary consent to receive medical consultation via telemedicine. I understand that if the doctor determines an in-person physical examination or emergency intervention is necessary, I will be referred to Nabha Civil Hospital.
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setStep('datetime')}
                disabled={isSubmitting}
                className="text-xs"
              >
                Modify Details
              </Button>
              <Button 
                size="sm"
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-4"
                onClick={handleConfirmBooking}
                disabled={!consentConfirmed || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Submit Consultation Request'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success State Showing Persisted ID & Next Actions */}
      {step === 'success' && createdAppointment && (
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Consultation Request Placed</h3>
              <p className="text-xs text-stone-600">
                Your request has been saved with Reference ID: <span className="font-mono font-semibold text-emerald-900">{createdAppointment.id}</span>
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Doctor:</span>
                <span className="font-medium">{createdAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Scheduled:</span>
                <span className="font-medium">{createdAppointment.date} at {createdAppointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Current Status:</span>
                <Badge variant="outline" className="text-[10px] uppercase text-amber-700 border-amber-300 bg-amber-50">
                  {createdAppointment.status}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-stone-500">
              You will receive a notification as soon as the doctor confirms the appointment.
            </p>

            <Button
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs w-full"
              onClick={onClose}
            >
              Done & View In My Appointments
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentBooking;
