import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Globe, MapPin, Building, RotateCw, Sparkles } from 'lucide-react';
import themes from '../utils/theme';

export default function CardPreview({ data, themeId = 'professional_blue' }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = themes[themeId] || themes.professional_blue;

  // Handle photo source
  const getPhotoSrc = () => {
    if (!data.photo) return null;
    if (typeof data.photo === 'string') return data.photo;
    return URL.createObjectURL(data.photo);
  };

  const photoSrc = getPhotoSrc();
  const initials = data.name
    ? data.name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : 'QR';

  return (
    <div className="flex flex-col items-center">
      {/* 3D Card Container */}
      <div 
        className="w-full max-w-[420px] aspect-[85.6/53.98] cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full duration-700 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* FRONT SIDE */}
          <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border backface-hidden shadow-2xl ${theme.bgClass} ${theme.cardBg}`}>
            
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 w-3 h-full rounded-l-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Photo or Initials */}
                <div className={`relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ring-2 ${theme.ringColor} ring-offset-2 ring-offset-slate-900 bg-slate-800`}>
                  {photoSrc ? (
                    <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-white">{initials}</span>
                  )}
                </div>
                
                {/* Name & Titles */}
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight tracking-tight">
                    {data.name || 'Your Name'}
                  </h3>
                  <p className={`text-xs font-semibold ${theme.accentText} leading-snug mt-0.5`}>
                    {data.designation || 'Designation'} {data.department ? `| ${data.department}` : ''}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {data.company || 'Company Name'}
                  </p>
                </div>
              </div>
              
              <div className="text-white/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10 my-1" />
            
            {/* Contact Details */}
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className={`w-3.5 h-3.5 ${theme.accentText}`} />
                <span>{data.phone || '+91 99999 99999'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className={`w-3.5 h-3.5 ${theme.accentText}`} />
                <span className="truncate">{data.email || 'you@domain.com'}</span>
              </div>
              {data.portfolio_url ? (
                <div className="flex items-center space-x-2">
                  <Globe className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  <span className="truncate">{data.portfolio_url}</span>
                </div>
              ) : data.address ? (
                <div className="flex items-center space-x-2">
                  <MapPin className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  <span className="truncate">{data.address}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* BACK SIDE */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex items-center justify-between border backface-hidden shadow-2xl rotateY-180 ${theme.bgClass} ${theme.cardBg}`}
          >
            {/* Brand details */}
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  QRConnect
                </h3>
                <p className={`text-[10px] ${theme.taglineColor} font-medium mt-1`}>
                  Your Digital Identity in One Scan
                </p>
              </div>
              
              <div className="text-[9px] text-gray-400">
                <p className="font-semibold">Offline-First Tech</p>
                <p>Scan to Save Card & Profile</p>
              </div>
            </div>
            
            {/* QR Code Container */}
            <div className="relative p-2.5 bg-white rounded-xl shadow-lg flex items-center justify-center">
              {data.hybrid_qr_url ? (
                <img 
                  src={data.hybrid_qr_url} 
                  alt="QR Code" 
                  className="w-28 h-28 object-contain"
                />
              ) : (
                /* Mock QR grid pattern for preview */
                <div className="w-28 h-28 flex flex-col justify-between p-1 bg-white opacity-90">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-4 border-slate-900 bg-white" />
                    <div className="w-6 h-6 border-4 border-slate-900 bg-white" />
                  </div>
                  <div className="flex items-center justify-center">
                    <QrSquarePattern theme={theme} />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-4 border-slate-900 bg-white" />
                    <div className="w-6 h-6 border-[2px] border-slate-500 bg-slate-900" />
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </motion.div>
      </div>
      
      {/* Flip action control */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsFlipped(!isFlipped);
        }}
        className="mt-6 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-gray-300 hover:text-white transition-colors duration-150 shadow-glass-sm border border-slate-700/50"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span>Flip to View {isFlipped ? 'Front' : 'Back'}</span>
      </button>
    </div>
  );
}

// Simple Helper component to draw a mock QR grid pattern
function QrSquarePattern({ theme }) {
  return (
    <div className="grid grid-cols-6 gap-0.5 opacity-60">
      {[...Array(36)].map((_, i) => (
        <div 
          key={i} 
          className={`w-1 h-1 ${
            (i % 3 === 0 || i % 4 === 1) && i % 5 !== 0 
              ? 'bg-slate-900' 
              : 'bg-transparent'
          }`} 
        />
      ))}
    </div>
  );
}
