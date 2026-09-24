import React, { useEffect, useState } from 'react';
import ManixWordLogo from './ManixWordLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onFinish, durationMs = 2000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress bar tick
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 250);

    // Trigger fade-out 300ms before completion
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(0, durationMs - 350));

    // Complete splash screen
    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-white p-8 select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[11px] font-mono text-slate-500 tracking-wider">v2026.4 • Pro Edition</span>
      </div>

      {/* Center Branding Showcase */}
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-6 animate-fade-in">
        <div className="relative group">
          {/* Subtle glow aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative p-2 bg-slate-900/80 rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-sm">
            <ManixWordLogo size={80} showText={false} />
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center space-x-2">
            <span>Manix</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300 font-light">
              Word
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Traitement de texte moderne & Rédaction IA intégrée
          </p>
        </div>

        {/* Progress Bar with animated shine */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50 p-[1px]">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              <span>Chargement de votre espace de travail...</span>
            </span>
            <span className="font-semibold text-blue-400">{Math.min(100, progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Credits */}
      <div className="text-center space-y-1">
        <p className="text-[11px] text-slate-500">
          Manix Word • Document Studio • Tous droits réservés
        </p>
      </div>
    </div>
  );
}
