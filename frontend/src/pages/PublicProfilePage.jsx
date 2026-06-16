import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Mail, Globe, MapPin, Download, UserPlus, FileText, Share2, Sparkles, Building2 } from 'lucide-react';
import { cardService } from '../services/api';
import themes from '../utils/theme';

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const data = await cardService.getCard(slug);
        setCard(data);
      } catch (err) {
        console.error(err);
        setError("Digital profile not found. Please verify the URL.");
      } finally {
        setLoading(false);
      }
    };
    fetchCardDetails();
  }, [slug]);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAsset = (type) => {
    const downloadUrl = cardService.getDownloadUrl(slug, type);
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-slate-800 rounded-full animate-spin" />
        <p className="text-xs text-gray-500 mt-4">Loading digital profile...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Profile Not Found</h2>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-6">{error}</p>
        <a href="/" className="px-6 py-2.5 bg-slate-900 border border-gray-800 rounded-xl text-xs text-gray-300 hover:text-white transition-colors">
          Go to QRConnect Home
        </a>
      </div>
    );
  }

  const theme = themes[card.theme] || themes.professional_blue;
  const initials = card.name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();

  return (
    <div className={`min-h-screen ${theme.bgClass} flex flex-col items-center justify-start px-4 py-8 pb-16 relative overflow-x-hidden`}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card panel (Mobile-First 420px max width) */}
      <div className="w-full max-w-[430px] flex flex-col relative z-10 space-y-6">
        
        {/* Floating Share Button */}
        <button
          onClick={handleShareProfile}
          className="absolute top-0 right-0 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5 backdrop-blur"
          title="Share Link"
        >
          {copied ? <span className="text-[10px] font-bold text-emerald-400 uppercase px-1">Copied</span> : <Share2 className="w-4 h-4" />}
        </button>

        {/* Profile Card Intro Box */}
        <div className={`rounded-3xl border p-6 text-center shadow-xl ${theme.cardBg} flex flex-col items-center relative overflow-hidden pt-10`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
          
          {/* Avatar Photo */}
          <div className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center ring-4 ${theme.ringColor} ring-offset-4 ring-offset-slate-900 bg-slate-800 mb-5`}>
            {card.photo_url ? (
              <img src={card.photo_url} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-white">{initials}</span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-1.5 justify-center">
            <span>{card.name}</span>
            <Sparkles className="w-4.5 h-4.5 text-yellow-400" />
          </h1>
          
          <p className={`text-xs font-semibold ${theme.accentText} uppercase tracking-wider mb-1`}>
            {card.designation} {card.department ? `• ${card.department}` : ''}
          </p>
          
          <p className="text-sm text-gray-300 font-medium flex items-center gap-1 justify-center mb-3">
            <Building2 className="w-3.5 h-3.5 opacity-60" />
            <span>{card.company}</span>
          </p>

          {card.address && (
            <p className="text-[11px] text-gray-400 flex items-center gap-1 justify-center max-w-[280px]">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="truncate">{card.address}</span>
            </p>
          )}

          {/* Quick Action Contact Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <a 
              href={`tel:${card.phone}`}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-900 hover:text-white text-xs text-gray-200 transition-colors duration-150"
            >
              <Phone className={`w-4 h-4 ${theme.accentText}`} />
              <span>Call User</span>
            </a>
            <a 
              href={`mailto:${card.email}`}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-900 hover:text-white text-xs text-gray-200 transition-colors duration-150"
            >
              <Mail className={`w-4 h-4 ${theme.accentText}`} />
              <span>Send Email</span>
            </a>
          </div>

          {/* Save contact to phone CTA */}
          <button
            onClick={() => handleDownloadAsset('vcf')}
            className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-bold text-white mt-3 shadow-lg ${theme.btnPrimary}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Save Contact Card</span>
          </button>
        </div>

        {/* Social Links Stack */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            Professional Networks & Links
          </h3>

          <div className="space-y-2">
            {card.linkedin && (
              <a 
                href={card.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-xs text-gray-200 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[#0A66C2] fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="font-semibold">Connect on LinkedIn</span>
                </div>
                <span className="text-gray-500">→</span>
              </a>
            )}

            {card.github && (
              <a 
                href={card.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-xs text-gray-200 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <span className="font-semibold">Review Projects on GitHub</span>
                </div>
                <span className="text-gray-500">→</span>
              </a>
            )}

            {card.instagram && (
              <a 
                href={card.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-xs text-gray-200 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[#E1306C] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span className="font-semibold">Follow on Instagram</span>
                </div>
                <span className="text-gray-500">→</span>
              </a>
            )}

            {card.portfolio_url && (
              <a 
                href={card.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-xs text-gray-200 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <Globe className={`w-5 h-5 ${theme.accentText}`} />
                  <span className="font-semibold">Visit Personal Portfolio</span>
                </div>
                <span className="text-gray-500">→</span>
              </a>
            )}
            
            {card.resume_url && (
              <a 
                href={card.resume_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-xs text-gray-200 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-400" />
                  <span className="font-semibold">Download Professional Resume</span>
                </div>
                <span className="text-gray-500">→</span>
              </a>
            )}
          </div>
        </div>

        {/* Assets & Printing Area */}
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            Card Export Formats
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownloadAsset('pdf')}
              className="flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-900 text-xs text-gray-300 font-semibold"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Printable PDF</span>
            </button>
            <button
              onClick={() => handleDownloadAsset('png')}
              className="flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-900 text-xs text-gray-300 font-semibold"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Social PNG Card</span>
            </button>
          </div>
        </div>

        {/* QRConnect Brand Footnote */}
        <div className="text-center pt-8 text-[10px] text-gray-500 font-medium">
          <span className="text-gray-400">QRConnect</span> • Your Digital Identity in One Scan
        </div>

      </div>
    </div>
  );
}
