import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Video, 
  Calendar, 
  FileText, 
  Pill, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  WifiOff,
  Clock,
  Sparkles,
  MapPin,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/layout/Footer';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');

  const demoAccounts = [
    { 
      role: 'Patient', 
      email: 'patient@demo.com', 
      name: 'Krishna (Rampur Village)', 
      icon: Heart, 
      color: 'bg-emerald-800 text-white',
      desc: 'Book visits, check pharmacy stock, view CBC records'
    },
    { 
      role: 'Doctor', 
      email: 'doctor@demo.com', 
      name: 'Dr. Rachit (General Medicine)', 
      icon: Stethoscope, 
      color: 'bg-emerald-900 text-white',
      desc: 'Triage requests, issue prescriptions, manage consultations'
    },
    { 
      role: 'Pharmacist', 
      email: 'pharmacy@demo.com', 
      name: 'Rural Health Pharmacy (Nabha)', 
      icon: Building2, 
      color: 'bg-amber-800 text-white',
      desc: 'Adjust stock quantities, update rack locations & batches'
    },
    { 
      role: 'Administrator', 
      email: 'admin@demo.com', 
      name: 'Abhay Singh Chauhan (Lead Architect)', 
      icon: ShieldCheck, 
      color: 'bg-stone-800 text-white',
      desc: 'Operational audits, system health, aggregate platform metrics'
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        const success = await register({
          name,
          email,
          password,
          phone,
          location: village || 'Nabha, Punjab'
        });
        if (success) {
          toast({
            title: "Registration Complete",
            description: "Your patient account has been created. Welcome to HealthBridge!",
          });
        }
      } else {
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Signed In Successfully",
            description: "Welcome to TeleMed HealthBridge Nabha.",
          });
        } else {
          toast({
            title: "Invalid Credentials", 
            description: "Check your email and password, or click a demo account below.",
            variant: "destructive",
          });
        }
      }
    } catch (err: unknown) {
      toast({
        title: "Authentication Error",
        description: err instanceof Error ? err.message : "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setIsRegisterMode(false);
    setEmail(demoEmail);
    setPassword('12345');
    toast({
      title: "Credentials Filled",
      description: `Loaded ${demoEmail}. Click "Sign In" to proceed.`,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-800 text-white rounded-lg">
              <Heart className="h-5 w-5" fill="currentColor" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">TeleMed</span>
              <span className="text-xs text-emerald-400 font-medium ml-1.5 hidden sm:inline">HealthBridge Nabha</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-stone-400 hidden md:inline">Emergency Support: Dial 112 / 108</span>
            <Button 
              size="sm" 
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3.5"
              onClick={() => {
                const el = document.getElementById('auth-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Access Platform
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dedicated Rural Telemedicine • Nabha, Punjab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 leading-tight">
              Bridging Nabha & 173 Rural Villages to Qualified Medical Specialists.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Nabha Civil Hospital operates under significant clinical strain with a 52% doctor vacancy rate. HealthBridge connects agricultural communities and daily-wage families to remote consultations, truthful pharmacy availability, and secure clinical records without unnecessary travel.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-stone-200">
              <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700/60">
                <p className="text-xl font-bold text-emerald-400">173 Villages</p>
                <p className="text-xs text-stone-400 mt-0.5">Target catchment region</p>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700/60">
                <p className="text-xl font-bold text-amber-400">52% Vacancy</p>
                <p className="text-xs text-stone-400 mt-0.5">Civil Hospital staffing gap</p>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700/60 col-span-2 sm:col-span-1">
                <p className="text-xl font-bold text-stone-200">2G / 3G Ready</p>
                <p className="text-xs text-stone-400 mt-0.5">Low-bandwidth resilience</p>
              </div>
            </div>
          </div>

          {/* Interactive Login / Registration Card */}
          <div className="lg:col-span-5" id="auth-card">
            <Card className="bg-stone-900 border-stone-700 text-stone-100 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold text-stone-100">
                    {isRegisterMode ? 'Register New Patient' : 'Sign In to HealthBridge'}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                  >
                    {isRegisterMode ? 'Existing User? Sign In' : 'New Patient? Register'}
                  </Button>
                </div>
                <CardDescription className="text-xs text-stone-400">
                  {isRegisterMode 
                    ? 'Create your rural telemedicine account for consultation scheduling'
                    : 'Select a demo account or sign in with registered credentials'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  {isRegisterMode && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-stone-300">Full Name</label>
                        <Input
                          placeholder="e.g. Jaswinder Singh"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-stone-950 border-stone-700 text-stone-100 text-xs mt-1"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-stone-300">Phone</label>
                          <Input
                            placeholder="+91 98765 00000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-stone-950 border-stone-700 text-stone-100 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-stone-300">Village</label>
                          <Input
                            placeholder="e.g. Kalyan, Nabha"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            className="bg-stone-950 border-stone-700 text-stone-100 text-xs mt-1"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-xs font-medium text-stone-300">Email Address</label>
                    <Input
                      type="email"
                      placeholder="user@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-stone-950 border-stone-700 text-stone-100 text-xs mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-300">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-stone-950 border-stone-700 text-stone-100 text-xs mt-1"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-2 mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Authenticating...' : isRegisterMode ? 'Complete Patient Registration' : 'Sign In'}
                  </Button>
                </form>

                {/* Instant Role Selector */}
                {!isRegisterMode && (
                  <div className="pt-3 border-t border-stone-800 space-y-2">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Instant Demo Role Access (Password: 12345)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {demoAccounts.map((account) => {
                        const Icon = account.icon;
                        return (
                          <button
                            key={account.role}
                            type="button"
                            onClick={() => fillDemo(account.email)}
                            className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-emerald-700/80 transition-colors text-left flex items-start space-x-2 group focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            <div className={`p-1.5 rounded-md ${account.color} mt-0.5 shrink-0`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-stone-200 group-hover:text-emerald-400 leading-tight">
                                {account.role}
                              </p>
                              <p className="text-[10px] text-stone-400 truncate mt-0.5">
                                {account.name.split(' ')[0]}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Structured Platform Workflows */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-800/40 bg-emerald-50">
            Cohesive Telemedicine Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Designed for Rural Realities, Built to Clinical Standards
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Every feature is architected around the constraints of rural healthcare delivery in Punjab: sporadic internet connectivity, traveling doctors, daily-wage constraints, and pharmacy stock uncertainty.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="p-2.5 bg-emerald-100/80 text-emerald-900 rounded-lg w-fit">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">1. Availability-Verified Booking</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Patients select genuine open slots for Nabha Civil Hospital physicians. Duplicate bookings and time conflicts are strictly prevented by the appointment state machine.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="p-2.5 bg-emerald-100/80 text-emerald-900 rounded-lg w-fit">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">2. Bandwidth-Adaptive Teleconsultation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Video sessions with camera/microphone control and connection interruption recovery. Fallback to audio and structured chat when 2G/3G connections experience high packet loss.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="p-2.5 bg-emerald-100/80 text-emerald-900 rounded-lg w-fit">
              <Pill className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">3. Truthful Pharmacy Inventory</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Live stock levels with batch numbers and expiry dates. Prevents patients from traveling miles only to discover critical medicines like Amoxicillin or Cetirizine are out of stock.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="p-2.5 bg-emerald-100/80 text-emerald-900 rounded-lg w-fit">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">4. Protected Health Records (PHR)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Strict role-based isolation ensures patients only see their own medical history, while attending physicians can securely review vitals and clinical consultation summaries.
            </p>
          </div>
        </div>

        {/* Low-Bandwidth & Emergency Disclosures */}
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <span>Emergency Clinical Protocol</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900">
              HealthBridge is intended for non-acute consultations, follow-ups, and routine specialty care. For life-threatening emergencies, severe chest pain, major trauma, or pediatric acute distress, do not wait for a teleconsultation. Dial National Emergency 112 or Medical Ambulance 108 immediately.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <WifiOff className="h-4 w-4 text-emerald-700" />
              <span>Low-Bandwidth Resilience Guarantee</span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-900">
              Engineered with lightweight JavaScript bundles, localized data persistence, and zero superfluous background network polling. Static assets remain responsive even over rural 2G mobile data connections.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-stone-900">Frequently Asked Questions</h3>
            <p className="text-xs text-stone-600">Common questions about the HealthBridge rural pilot</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1.5">
              <p className="font-bold text-stone-900">Can patients from any village book consultations?</p>
              <p className="text-stone-600 leading-relaxed">
                Yes, during the Nabha pilot, residents from Nabha town and all 173 surrounding Gram Panchayats in Patiala district can register and book teleconsultations with Civil Hospital physicians.
              </p>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1.5">
              <p className="font-bold text-stone-900">Is the AI Symptom Checker a medical diagnosis?</p>
              <p className="text-stone-600 leading-relaxed">
                No. The AI Symptom Checker is purely an informational triage aid designed to assist patients in organizing their symptoms before speaking with a licensed physician. It does not issue prescriptions or replace clinical judgment.
              </p>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1.5">
              <p className="font-bold text-stone-900">How is patient data protected?</p>
              <p className="text-stone-600 leading-relaxed">
                HealthBridge implements strict role-based access control (RBAC). Patients cannot view or modify other patients' medical records, and all clinical actions leave an immutable audit trail.
              </p>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1.5">
              <p className="font-bold text-stone-900">What languages are supported?</p>
              <p className="text-stone-600 leading-relaxed">
                The platform supports English, Hindi, and Punjabi, allowing rural users to switch interfaces seamlessly using the language switcher in the header.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
