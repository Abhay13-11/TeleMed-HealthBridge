import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Lock,
  AlertTriangle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-stone-900 text-stone-200 overflow-hidden border-t border-stone-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Core Principles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-stone-800">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/50 rounded-lg text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-stone-100 text-sm">Patient Privacy</p>
              <p className="text-xs text-stone-400 mt-0.5">Role-based access control and clinical confidentiality</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/50 rounded-lg text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-stone-100 text-sm">Secure Communications</p>
              <p className="text-xs text-stone-400 mt-0.5">Protected consultation channels & encrypted records</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/50 rounded-lg text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-stone-100 text-sm">Rural Health Equity</p>
              <p className="text-xs text-stone-400 mt-0.5">Serving Nabha & 173 surrounding villages in Punjab</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-950/80 border border-amber-800/50 rounded-lg text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-stone-100 text-sm">Emergency Protocols</p>
              <p className="text-xs text-stone-400 mt-0.5">Call National 112 / Medical 108 for critical emergencies</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-800 text-white rounded-lg">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">TeleMed</h3>
                <p className="text-xs text-emerald-400 font-medium">HealthBridge Nabha</p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bridging the healthcare gap between rural communities and clinical specialists through accessible telemedicine, truthful pharmacy tracking, and digital records.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">Healthcare Workflows</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Remote Teleconsultations</li>
              <li>Doctor Availability Scheduling</li>
              <li>Digital Health Records (PHR)</li>
              <li>Civil Hospital Pharmacy Tracking</li>
              <li>Triage Assessment Safety Guidelines</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">Target Deployment</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Nabha Civil Hospital, Punjab</li>
              <li>Patiala District Primary Care</li>
              <li>173 Surrounding Gram Panchayats</li>
              <li>Low-Bandwidth Rural Kiosks</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">Clinical Disclaimer</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>
                TeleMed HealthBridge is not an emergency dispatch provider. If you or a loved one is experiencing severe chest pain, shortness of breath, acute trauma, or loss of consciousness, please seek immediate emergency care at Nabha Civil Hospital or dial 112.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {currentYear} HealthBridge Nabha. Architected & Developed by <span className="text-emerald-400 font-medium">Abhay Singh Chauhan</span>.</p>
          <p className="text-stone-400">Optimized for Low-Bandwidth Networks (2G/3G/4G)</p>
        </div>
      </div>
    </footer>
  );
};
