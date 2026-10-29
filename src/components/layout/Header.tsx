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
  AlertCircle
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: Calendar, label: t('nav.appointments'), path: '/appointments' },
    { icon: MessageSquare, label: t('nav.consultations'), path: '/consultations' },
    { icon: FileText, label: t('nav.reports'), path: '/reports' },
  ];

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'doctor':
        return <Stethoscope className="h-4 w-4 text-emerald-100" />;
      case 'pharmacy':
        return <Building2 className="h-4 w-4 text-emerald-100" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-emerald-100" />;
      default:
        return <UserIcon className="h-4 w-4 text-emerald-100" />;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled 
            ? 'bg-stone-900/95 backdrop-blur-md shadow-md border-b border-stone-800' 
            : 'bg-stone-900 border-b border-stone-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="p-2 bg-emerald-800 text-white rounded-lg shadow-sm">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <span className="font-bold text-lg text-stone-100 tracking-tight">TeleMed</span>
                <span className="text-xs text-emerald-400 font-medium ml-1.5 hidden sm:inline-block">HealthBridge Nabha</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-stone-800 text-emerald-400 font-semibold' 
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
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
                  className="relative text-stone-300 hover:text-white hover:bg-stone-800"
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
                  )}
                </Button>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <div className="p-1 rounded-full bg-emerald-900 border border-emerald-700/50">
                        {getRoleIcon()}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-medium text-stone-100 leading-none">{user.name}</p>
                        <p className="text-[10px] text-stone-400 capitalize mt-0.5 leading-none">{user.role}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 bg-stone-900 border-stone-800 text-stone-200">
                    <DropdownMenuLabel className="text-xs text-stone-400">Account Role: {user.role.toUpperCase()}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-stone-800" />
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer hover:bg-stone-800 focus:bg-stone-800"
                      onClick={() => setIsProfileOpen(true)}
                    >
                      <UserIcon className="mr-2 h-3.5 w-3.5 text-stone-400" />
                      <span>Profile & Consent</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer hover:bg-stone-800 focus:bg-stone-800"
                      onClick={() => navigate('/appointments')}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5 text-stone-400" />
                      <span>My Consultations</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-stone-800" />
                    <DropdownMenuItem 
                      className="text-xs cursor-pointer text-red-400 hover:bg-stone-800 focus:bg-stone-800"
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
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                  onClick={() => navigate('/')}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-stone-300 hover:text-white rounded-md"
                aria-label="Toggle navigation menu"
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-stone-900 border-b border-stone-800 px-4 py-3 space-y-2"
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-stone-300 hover:text-white hover:bg-stone-800"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </Button>
              ))}
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <LanguageSwitcher />
                {user && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" />
                    Sign Out
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center justify-between">
              <span>Workflow Notifications</span>
              {unreadCount > 0 && <Badge variant="secondary" className="text-xs bg-stone-800 text-stone-300">{unreadCount} Unread</Badge>}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Live updates regarding appointments, clinical records, and pharmacy items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No notifications received yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    n.read 
                      ? 'bg-stone-950/40 border-stone-800/80 text-stone-400' 
                      : 'bg-stone-800/60 border-stone-700 text-stone-200'
                  }`}
                  onClick={() => {
                    storageService.markNotificationRead(n.id);
                    if (user?.id) setNotifications(storageService.getNotifications(user.id));
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-stone-200">{n.title}</p>
                    <span className="text-[10px] text-stone-500 shrink-0">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-stone-300">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile & Consent Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-lg bg-stone-900 border-stone-800 text-stone-100">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">User Profile & Clinical Consent</DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Authorized credentials and rural healthcare registry information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Name</span>
                <span className="font-medium text-stone-200">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Email</span>
                <span className="text-stone-200">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Assigned Role</span>
                <Badge variant="outline" className="text-[10px] uppercase text-emerald-400 border-emerald-700/60">{user?.role}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Location</span>
                <span className="text-stone-200">{user?.location || 'Nabha, Punjab'}</span>
              </div>
            </div>

            {patientProfile && (
              <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                <p className="font-semibold text-stone-300 border-b border-stone-800 pb-1.5">Registered Patient Context</p>
                <div className="flex justify-between">
                  <span className="text-stone-400">Village Gram Panchayat</span>
                  <span className="text-stone-200">{patientProfile.village}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Emergency Contact</span>
                  <span className="text-stone-200">{patientProfile.emergencyContact.name} ({patientProfile.emergencyContact.relationship})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Emergency Phone</span>
                  <span className="text-stone-200">{patientProfile.emergencyContact.phone}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-stone-800">
                  <span className="text-stone-400">Telemedicine Consent</span>
                  <div className="flex items-center text-emerald-400 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Verified Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
