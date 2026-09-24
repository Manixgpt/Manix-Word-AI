import React from 'react';

interface ManixWordLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export default function ManixWordLogo({
  size = 'md',
  showText = true,
  textColor,
  className = '',
}: ManixWordLogoProps) {
  let pixelSize = 36;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'xs':
        pixelSize = 22;
        break;
      case 'sm':
        pixelSize = 28;
        break;
      case 'md':
        pixelSize = 36;
        break;
      case 'lg':
        pixelSize = 48;
        break;
      case 'xl':
        pixelSize = 64;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 select-none ${className}`}>
      {/* Official 3D Ribbon 'W' Logo Image directly from logo.png */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <img
          src="/logo.png"
          alt="Manix Word Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.endsWith('/logo.jpg')) {
              target.src = '/logo.jpg';
            }
          }}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight text-left">
          <div className="flex items-center space-x-1.5">
            <span
              className={`font-bold tracking-tight text-base sm:text-lg ${
                textColor ? textColor : 'text-slate-800'
              }`}
            >
              Manix
            </span>
            <span className="font-light tracking-wide text-base sm:text-lg text-blue-600">
              Word
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 -mt-0.5">
            Traitement de texte
          </span>
        </div>
      )}
    </div>
  );
}
