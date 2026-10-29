import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { NeuralCanvas } from '@/components/visual/NeuralCanvas';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Interactive 3D Neural Mesh Background */}
      <NeuralCanvas className="opacity-40" />

      {/* Cyber Ambient Radiance Blobs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Header />
      <main className="pt-24 pb-16 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
