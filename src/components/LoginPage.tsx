import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Video, 
  Calendar, 
  FileText, 
  Pill, 
  Sparkles, 
  ArrowRight,
  Activity,
  Zap,
  Cpu,
  Lock,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NeuralCanvas } from '@/components/visual/NeuralCanvas';
import { TiltCard } from '@/components/visual/TiltCard';
import { AiCoreOrb } from '@/components/visual/AiCoreOrb';
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
      glowColor: 'rgba(0, 242, 254, 0.4)',
      accentBorder: 'hover:border-cyan-400/60',
      tag: 'Rural Care Access',
      desc: 'Instant consultation booking, offline health records, verified pharmacy medicine stock.'
    },
    { 
      role: 'Doctor', 
      email: 'doctor@demo.com', 
      name: 'Dr. Rachit Kumar (General Medicine)', 
      icon: Stethoscope, 
      glowColor: 'rgba(16, 185, 129, 0.4)',
      accentBorder: 'hover:border-emerald-400/60',
      tag: 'Clinical Command',
      desc: 'Video teleconsultations, appointment queue triaging, verifiable digital prescriptions.'
    },
    { 
      role: 'Pharmacist', 
      email: 'pharmacy@demo.com', 
      name: 'Nabha Rural Health Pharmacy', 
      icon: Pill, 
      glowColor: 'rgba(139, 92, 246, 0.4)',
      accentBorder: 'hover:border-violet-400/60',
      tag: 'Inventory Ledger',
      desc: 'Real-time medicine dispensing, batch tracking, stockout prevention across 173 villages.'
    },
    { 
      role: 'Administrator', 
      email: 'admin@demo.com', 
      name: 'Abhay Singh Chauhan (System Architect)', 
      icon: ShieldCheck, 
      glowColor: 'rgba(245, 158, 11, 0.4)',
      accentBorder: 'hover:border-amber-400/60',
      tag: 'Core Telemetry',
      desc: 'Live telemetry, immutable clinical audit logs, distributed healthcare provider governance.'
    },
  ];

  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    try {
      await login(demoEmail, '12345');
      toast({
        title: "Quantum Neural Link Established",
        description: `Authenticated session initiated for ${demoEmail}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to establish secure session";
      toast({
        title: "Authentication Failed",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Incomplete Credentials",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        if (!name) {
          toast({
            title: "Name Required",
            description: "Please enter your full name to create an account.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        await register({
          name,
          email,
          password,
          role: 'patient',
          phone,
          location: village ? `Village ${village}, Nabha` : 'Nabha, Punjab'
        });
        toast({
          title: "Account Created & Initialized",
          description: "Welcome to HealthBridge. Your biometric profile is verified.",
        });
      } else {
        await login(email, password);
        toast({
          title: "Session Verified",
          description: "Welcome back to HealthBridge.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Security authorization failed. Please try again.";
      toast({
        title: isRegisterMode ? "Registration Blocked" : "Authentication Failed",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Neural Particle Canvas Backdrop */}
      <NeuralCanvas />

      {/* Cybernetic Ambient Light Beams */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Futuristic Glass Top Bar */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#070b14]/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
              <div className="relative p-2.5 bg-[#090f1d] border border-cyan-400/40 rounded-xl text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <Heart className="h-5 w-5 fill-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-md">HealthBridge</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 tracking-wider">AI 3.0</span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/70 tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Nabha Telemedicine Hub • 173 Connected Nodes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-300">Sync: <span className="text-emerald-400 font-semibold">Active</span></span>
              <span className="text-white/20">|</span>
              <span className="text-xs font-mono text-slate-400">Low-Bandwidth 2G/3G Engine</span>
            </div>
            <a 
              href="#login-portal" 
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all duration-300 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Portal Access
            </a>
          </div>
        </div>
      </header>

      {/* Main Hero & 3D Interactive Stage */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col justify-center">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1122]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,242,254,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="text-xs font-medium text-slate-200">
              Grandmaster AI-Assisted Clinical Telemedicine System
            </span>
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">Lead Architect: Abhay Singh Chauhan</span>
          </motion.div>
        </div>

        {/* Hero Title and Orb Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Intelligent Healthcare,{' '}
              <span className="cyber-gradient-text block mt-1">
                Zero Distance.
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Bridging specialist physicians at <span className="text-cyan-300 font-medium">Nabha Civil Hospital</span> with over 173 rural gram panchayats. Features real-time AI triage, WebRTC video consultation rooms, and verifiable pharmacy stock tracking.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg mx-auto lg:mx-0">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <p className="text-2xl font-black text-cyan-400 font-mono">173</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Villages Connected</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <p className="text-2xl font-black text-emerald-400 font-mono">100%</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Truthful Stock</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <p className="text-2xl font-black text-violet-400 font-mono">7-State</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">State Machine</p>
              </div>
            </div>
          </div>

          {/* 3D Holographic AI Core Orb Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative">
              <AiCoreOrb size={320} />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#080d1a]/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,242,254,0.2)] text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Quantum Triage Core • Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Interactive Role Matrix */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Select Role to Launch Portal
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">One-click instant simulated access with pre-configured production credentials</p>
            </div>
            <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full mt-2 sm:mt-0">
              Default Password: 12345
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoAccounts.map((account, idx) => {
              const Icon = account.icon;
              return (
                <TiltCard
                  key={account.role}
                  glowColor={account.glowColor}
                  className={`cursor-pointer group p-6 rounded-2xl bg-[#090e1a]/80 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 ${account.accentBorder}`}
                  onClick={() => handleQuickLogin(account.email)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-cyan-300 group-hover:scale-110 group-hover:text-cyan-200 transition-all duration-300 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300">
                      {account.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{account.role}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-cyan-400/90 font-medium mb-2">{account.name}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{account.desc}</p>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-slate-200">
                    <span>{account.email}</span>
                    <span className="text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Dedicated Credentials & Direct Login Portal */}
        <div id="login-portal" className="max-w-xl mx-auto w-full mb-16">
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#090f1f]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden">
            {/* Top Scanning Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  {isRegisterMode ? 'Register Patient Account' : 'Secure Authenticator'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {isRegisterMode ? 'Free rural patient enrollment' : 'JWT 256-bit encrypted authentication gateway'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                {isRegisterMode ? 'Already have account? Login' : 'Need account? Sign Up'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">Full Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Balwinder Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-[#0e162a]/90 border-white/[0.12] focus:border-cyan-400 text-white placeholder:text-slate-500 rounded-xl py-5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">Village Name</label>
                      <Input
                        type="text"
                        placeholder="e.g. Alhoran"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="bg-[#0e162a]/90 border-white/[0.12] focus:border-cyan-400 text-white placeholder:text-slate-500 rounded-xl py-5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-[#0e162a]/90 border-white/[0.12] focus:border-cyan-400 text-white placeholder:text-slate-500 rounded-xl py-5"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">Email Address</label>
                <Input
                  type="email"
                  placeholder="patient@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0e162a]/90 border-white/[0.12] focus:border-cyan-400 text-white placeholder:text-slate-500 rounded-xl py-5 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#0e162a]/90 border-white/[0.12] focus:border-cyan-400 text-white placeholder:text-slate-500 rounded-xl py-5 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-[0_0_30px_rgba(0,242,254,0.35)] transition-all duration-300 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin" />
                    Authorizing Credentials...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isRegisterMode ? 'Complete Registration & Enter' : 'Authenticate & Enter System'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Anti-Privilege Escalation Enforced
              </span>
              <span>AES-256 Bit</span>
            </div>
          </div>
        </div>

        {/* Emergency Triage Hotlines Banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-rose-950/40 border border-rose-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Emergency Medical Critical Protocol</p>
              <p className="text-xs text-rose-200/70">For acute chest pain, trauma, or severe respiratory distress in Nabha, contact national helplines immediately.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:112" 
              className="px-4 py-2 rounded-xl bg-rose-600/30 border border-rose-500/50 hover:bg-rose-600/50 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              Dial 112 (National Emergency)
            </a>
            <a 
              href="tel:108" 
              className="px-4 py-2 rounded-xl bg-amber-600/30 border border-amber-500/50 hover:bg-amber-600/50 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Dial 108 (Ambulance)
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
