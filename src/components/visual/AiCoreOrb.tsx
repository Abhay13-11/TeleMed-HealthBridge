import React from 'react';
import { motion } from 'framer-motion';

export const AiCoreOrb: React.FC<{ size?: number; className?: string }> = ({ size = 260, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Field */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.45) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 75%)'
        }}
      />

      {/* Orbit Ring 1 (Cyber Cyan) */}
      <motion.div
        animate={{ rotate: 360, rotateX: 65 }}
        transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
        className="absolute rounded-full border border-cyan-400/40"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.35), inset 0 0 15px rgba(0, 242, 254, 0.2)'
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#00F2FE]" />
      </motion.div>

      {/* Orbit Ring 2 (Neon Emerald) */}
      <motion.div
        animate={{ rotate: -360, rotateY: 60 }}
        transition={{ repeat: Infinity, duration: 13, ease: 'linear' }}
        className="absolute rounded-full border border-emerald-400/35"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          boxShadow: '0 0 18px rgba(16, 185, 129, 0.3)'
        }}
      >
        <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      {/* Orbit Ring 3 (Violet Quantum Pulse) */}
      <motion.div
        animate={{ rotate: 360, rotateZ: 45 }}
        transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
        className="absolute rounded-full border border-violet-400/30"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          boxShadow: '0 0 12px rgba(139, 92, 246, 0.25)'
        }}
      />

      {/* Inner Central Quantum Nucleus */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 0 30px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.6)',
            '0 0 50px rgba(16, 185, 129, 0.6), inset 0 0 30px rgba(16, 185, 129, 0.7)',
            '0 0 30px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.6)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="relative rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500/20 via-emerald-500/30 to-violet-600/30 backdrop-blur-md border border-white/30"
        style={{
          width: size * 0.42,
          height: size * 0.42
        }}
      >
        {/* Core Glyph / Pulsing Center */}
        <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_24px_#ffffff] animate-ping opacity-60" />
        <div className="absolute w-4 h-4 rounded-full bg-cyan-200 shadow-[0_0_16px_#00F2FE]" />
      </motion.div>
    </div>
  );
};
