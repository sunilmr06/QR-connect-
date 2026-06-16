import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Check, Copy, ExternalLink, Download, FileText, UserPlus, Image as ImageIcon, QrCode, Plus } from 'lucide-react';
import { cardService } from '../services/api';

export default function SuccessPage() {
  const location = useLocation();
  const card = location.state?.card;

  const [copied, setCopied] = useState(false);

  // If page is accessed directly without card creation state, redirect to create page
  if (!card) {
    return <Navigate to="/create" replace />;
  }

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/u/${card.slug}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsset = (type) => {
    // Triggers direct backend download URLs
    const downloadUrl = cardService.getDownloadUrl(card.slug, type);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
      {/* Success Animation & Header */}
      <div className="mb-10">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10 animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
          Your Card is Ready!
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          Successfully generated all digital card formats and hybrid offline-online QR codes in under 30 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-12">
        {/* QR Code Card Display */}
        <div className="md:col-span-5 rounded-2xl glass-panel border border-slate-800/80 p-6 flex flex-col justify-between items-center bg-slate-900/10">
          <div>
            <h3 className="font-bold text-white mb-1">Hybrid QR Code</h3>
            <p className="text-[10px] text-gray-400 max-w-[180px] mx-auto">
              Scan offline to view contact details or scan online to load your digital profile.
            </p>
          </div>

          <div className="my-6 p-4 bg-white rounded-xl shadow-lg border border-slate-800 flex items-center justify-center">
            {card.hybrid_qr_url ? (
              <img 
                src={card.hybrid_qr_url} 
                alt="QR Code" 
                className="w-36 h-36 object-contain"
              />
            ) : (
              <div className="w-36 h-36 bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>

          <button 
            onClick={() => downloadAsset('qr')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-xs text-gray-200 transition-colors duration-150"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR (PNG)</span>
          </button>
        </div>

        {/* Actions & Sharing Card */}
        <div className="md:col-span-7 rounded-2xl glass-panel border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between text-left">
          
          {/* Profile URL Copy Link Box */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base">Public Profile URL</h3>
            <p className="text-xs text-gray-400">
              Share this web link to showcase your resume, social accounts, and projects.
            </p>
            
            <div className="flex bg-slate-900/60 border border-gray-800 rounded-xl p-1.5 items-center justify-between">
              <span className="text-xs text-purple-400 font-medium truncate px-2">
                {window.location.origin}/u/{card.slug}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <Link
                  to={`/u/${card.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                  title="Visit Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Downloads Action Grid */}
          <div className="space-y-3 mt-8">
            <h3 className="font-bold text-white text-sm">Download Card Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button 
                onClick={() => downloadAsset('pdf')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 bg-slate-900/30 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all text-center group cursor-pointer"
              >
                <FileText className="w-6 h-6 text-purple-400 group-hover:scale-105 transition-transform duration-200" />
                <span className="text-xs font-semibold text-white mt-2">Printable PDF</span>
                <span className="text-[9px] text-gray-500 mt-0.5">85.6mm & A4 templates</span>
              </button>

              <button 
                onClick={() => downloadAsset('png')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 bg-slate-900/30 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all text-center group cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-blue-400 group-hover:scale-105 transition-transform duration-200" />
                <span className="text-xs font-semibold text-white mt-2">Social Card</span>
                <span className="text-[9px] text-gray-500 mt-0.5">1080x1080 JPEG</span>
              </button>

              <button 
                onClick={() => downloadAsset('vcf')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 bg-slate-900/30 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all text-center group cursor-pointer"
              >
                <UserPlus className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform duration-200" />
                <span className="text-xs font-semibold text-white mt-2">VCF Contact</span>
                <span className="text-[9px] text-gray-500 mt-0.5">Offline contact vCard</span>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Another Card button */}
      <Link 
        to="/create" 
        className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-purple-500/10 hover:scale-[1.01]"
      >
        <Plus className="w-4 h-4" />
        <span>Create Another Card</span>
      </Link>
    </div>
  );
}
