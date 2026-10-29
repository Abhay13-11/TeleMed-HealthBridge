import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Bell, 
  Calendar, 
  MessageSquare, 
  FileText,
  Home,
  CheckCircle,
  Shield,
  Stethoscope,
  Building2,
  AlertCircle,
  Activity,
  Cpu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { storageService } from '@/services/storage';
import { NotificationItem, PatientProfile } from '@/types/medical';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user?.id) {
      setNotifications(storageService.getNotifications(user.id));
      if (user.role === 'patient') {
        setPatientProfile(storageService.getPatientProfile(user.id));
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Consultations', path: '/consultations', icon: Video },
    { label: 'Appointments', path: '/appointments', icon: Calendar },
    { label: 'Records', path: '/reports', icon: FileText },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'doctor':
        return <Stethoscope className="h-4 w-4 text-emerald-400" />;
      case 'pharmacy':
        return <Building2 className="h-4 w-4 text-violet-400" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-amber-400" />;
      default:
        return <UserIcon className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#060911]/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b border-cyan-500/20' 
            : 'bg-[#070b14]/80 backdrop-blur-xl border-b border-white/[0.08]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
                <div className="relative p-2 bg-[#090f1d] border border-cyan-400/40 rounded-xl text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                  <Heart className="h-5 w-5 fill-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg text-white tracking-tight drop-shadow-md">HealthBridge</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">AI</span>
                </div>
                <p className="text-[10px] font-mono text-cyan-400/70 hidden sm:block">Nabha Telehealth Node</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1.5 text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]' 
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Right Action Section */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Notifications Button */}
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-300 hover:text-cyan-300 hover:bg-white/[0.06] rounded-xl border border-white/[0.06]"
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00F2FE] animate-pulse" />
                  )}
                </Button>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2.5 pl-2.5 pr-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all text-left focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <div className="p-1 rounded-lg bg-black/40 border border-white/[0.1]">
                        {getRoleIcon()}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                        <p className="text-[10px] font-mono text-cyan-400 capitalize mt-0.5 leading-none">{user.role}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 bg-[#080d1a]/95 border-cyan-500/30 text-slate-200 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] rounded-xl p-1">
                    <DropdownMenuLabel className="text-[11px] font-mono text-cyan-400">ROLE: {user.role.toUpperCase()}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/[0.08]" />
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300 focus:bg-cyan-500/10 focus:text-cyan-300 rounded-lg"
                      onClick={() => setIsProfileOpen(true)}
                    >
                      <UserIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                      <span>Profile & Consent</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300 focus:bg-cyan-500/10 focus:text-cyan-300 rounded-lg"
                      onClick={() => navigate('/appointments')}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                      <span>My Consultations</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.08]" />
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 rounded-lg"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="sm" 
                  variant="default"
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  onClick={() => navigate('/')}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/[0.08] bg-[#070b14]/95 backdrop-blur-2xl px-4 py-4 space-y-2"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]' 
                        : 'text-slate-300 hover:bg-white/[0.06]'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-2 border-t border-white/[0.08]">
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md bg-[#080d1a] border-cyan-500/30 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Clinical System Notifications
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Live alerts, appointment status shifts, and medication tracking updates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border transition-all text-xs ${
                    notif.read 
                      ? 'bg-white/[0.02] border-white/[0.06] text-slate-400' 
                      : 'bg-cyan-950/20 border-cyan-500/30 text-slate-200'
                  }`}
                >
                  <p className="font-semibold text-white mb-0.5">{notif.title}</p>
                  <p className="text-slate-300 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Profile & Consent Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md bg-[#080d1a] border-cyan-500/30 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-cyan-400" />
              Patient Profile & Telehealth Consent
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <p><span className="text-slate-400 font-mono">Name:</span> <strong className="text-white">{user?.name}</strong></p>
              <p><span className="text-slate-400 font-mono">Email:</span> <span className="text-cyan-300">{user?.email}</span></p>
              <p><span className="text-slate-400 font-mono">Role:</span> <span className="capitalize text-emerald-400 font-semibold">{user?.role}</span></p>
              {patientProfile && (
                <>
                  <p><span className="text-slate-400 font-mono">Village:</span> <span className="text-white">{patientProfile.village}</span></p>
                  <p><span className="text-slate-400 font-mono">District:</span> <span className="text-white">{patientProfile.district}</span></p>
                  <p><span className="text-slate-400 font-mono">Blood Group:</span> <span className="text-rose-400 font-bold">{patientProfile.bloodGroup}</span></p>
                </>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Informed Consent Verified
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Authorized for remote triage, secure consultation recordings, and encrypted digital prescription processing in Nabha regional health network.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
