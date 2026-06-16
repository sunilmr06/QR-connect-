import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Smartphone, Wifi, WifiOff, ShieldCheck, Download, BarChart2, Palette, ChevronDown, Check, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [offlineSim, setOfflineSim] = useState(false); // false = online mode, true = offline mode
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      title: "Offline vCard Technology",
      description: "Embeds direct contact data inside the QR. Even deep in cell-dead zones, people can scan and instantly save your contact details."
    },
    {
      icon: <Wifi className="w-6 h-6 text-purple-400" />,
      title: "Rich Online Profile",
      description: "When scanned online, unlocks a stunning social page displaying your portfolio, social links, resume download, and more."
    },
    {
      icon: <Palette className="w-6 h-6 text-amber-400" />,
      title: "Premium Design Themes",
      description: "Choose from Professional Blue, Executive Dark, and Modern Purple. Feel like a funded startup founder in one tap."
    },
    {
      icon: <Download className="w-6 h-6 text-emerald-400" />,
      title: "Multi-Format Export",
      description: "Get print-ready business card PDFs (including A4 template sheets), social media PNG cards (1080x1080), and VCF files."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-rose-400" />,
      title: "Real-time Analytics",
      description: "Track your network's growth. Monitor profile views, QR scans, and contact downloads from your personal dashboard."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: "Zero Friction Share",
      description: "No app installs or accounts required for scanners. Works directly with native iOS, Android, and Google Lens camera apps."
    }
  ];

  const templates = [
    {
      name: "Professional Blue",
      class: "bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-blue-500/20",
      textColor: "text-blue-400",
      badge: "Classic Choice"
    },
    {
      name: "Executive Dark",
      class: "bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 border-amber-500/20",
      textColor: "text-amber-400",
      badge: "Premium Matte"
    },
    {
      name: "Modern Purple",
      class: "bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 border-purple-500/20",
      textColor: "text-purple-400",
      badge: "Vibrant Modern"
    }
  ];

  const faqs = [
    {
      question: "How does the Offline Experience work without internet?",
      answer: "Most digital business card QRs only contain a web link. If internet is down, the scan fails. QRConnect uses a Hybrid QR code that actually packs VCard 3.0 structured data inside the QR. When a phone scans it offline, the native camera app reads the raw contact card strings, allowing them to view your details and save you to their contacts instantly."
    },
    {
      question: "Do I get printed cards, or is it purely digital?",
      answer: "We provide high-resolution print-ready files. Every generated card includes a Business Card size PDF (85.6mm x 53.98mm) and a formatted A4 PDF sheet containing cut lines and fold marks. You can print these at home or at any local print shop."
    },
    {
      question: "Can I update my details after printing the QR?",
      answer: "Yes! Since the QR contains a hybrid link routing to our tracking system, you can update your social links, photo, and bio online anytime. Scanners who have internet access will always see your latest profile updates."
    },
    {
      question: "Is there an analytics system included?",
      answer: "Yes, our built-in tracker registers every profile view, QR scan, and file download. You can monitor the performance of your business card directly on the Admin Dashboard."
    }
  ];

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300 inline-block mb-6 tracking-wide uppercase">
            🚀 Offline + Online Hybrid Tech
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Your Digital Identity in <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-blue-400 bg-clip-text text-transparent">
              One Single Scan
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-400 mb-10 font-normal leading-relaxed">
            Create smart, QR-powered digital business cards that work seamlessly online *and* offline. Elevate your networking game at events, pitches, and meetups.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/create" 
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Create Your Card</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a 
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 border border-gray-800 text-gray-200 font-semibold hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              View QR Demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* QR SIMULATOR SECTION */}
      <section id="demo" className="py-20 bg-slate-950/40 border-y border-gray-900 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Interactive QR Simulator
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Experience the core USP. Toggle connection modes below and scan/preview the card to see the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Connection Toggle & Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl glass-panel border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span>Connection Mode</span>
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Switch the mock internet status to see what happens when someone scans your hybrid QR code.
                </p>
                
                <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800/80">
                  <button
                    onClick={() => setOfflineSim(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      offlineSim 
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <WifiOff className="w-4 h-4" />
                    <span>Offline (No Net)</span>
                  </button>
                  <button
                    onClick={() => setOfflineSim(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      !offlineSim 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Wifi className="w-4 h-4" />
                    <span>Online (Active)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 text-xs text-gray-400">
                {offlineSim ? (
                  <p className="leading-relaxed">
                    ⚠️ <span className="font-semibold text-white">Offline Experience active:</span> Native scanners parses standard VCard bytes immediately. Phone presents "Create New Contact" options directly in the camera app screen without fetching any website.
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    ✅ <span className="font-semibold text-white">Online Experience active:</span> Scanner loads the URL redirection, logs scan views for analytics, and opens a premium LinkedIn-style landing page with direct call, email, and social networks.
                  </p>
                )}
              </div>
            </div>

            {/* Simulated Scan Result Phone Frame */}
            <div className="md:col-span-7 flex justify-center">
              <div className="relative w-[310px] h-[610px] bg-slate-900 border-[8px] border-slate-800 rounded-[40px] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                {/* Speaker grill / camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-950 rounded-full" />
                </div>
                
                {/* Phone screen content */}
                <div className="flex-1 bg-slate-950 rounded-[28px] overflow-hidden p-4 relative flex flex-col pt-8">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mb-6">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1.5">
                      {offlineSim ? <WifiOff className="w-3.5 h-3.5 text-red-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
                      <span className="w-4 h-2 border border-gray-600 rounded-sm bg-gray-400" />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {offlineSim ? (
                      /* OFFLINE VCARD PREVIEW */
                      <motion.div
                        key="offline-ui"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        <div className="text-center mt-4">
                          <span className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                            <Smartphone className="w-6 h-6" />
                          </span>
                          <h4 className="text-sm font-semibold text-white">Add Contact Found</h4>
                          <p className="text-[10px] text-gray-500 mt-1">Found embedded VCard details in scan</p>
                        </div>

                        {/* Contact details list */}
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mt-4 space-y-2.5 text-left text-xs">
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Name</p>
                            <p className="text-white font-medium">Alex Morgan</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Job Title</p>
                            <p className="text-white font-medium">Lead Designer at Stripe</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Mobile</p>
                            <p className="text-white font-medium">+91 99999 12345</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                            <p className="text-white font-medium truncate">alex.morgan@stripe.com</p>
                          </div>
                        </div>

                        <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 mt-6 shadow-md shadow-blue-500/10">
                          Add to Contacts
                        </button>
                      </motion.div>
                    ) : (
                      /* ONLINE PUBLIC PROFILE PREVIEW */
                      <motion.div
                        key="online-ui"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col justify-between text-center"
                      >
                        <div className="pt-2">
                          <div className="w-16 h-16 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-white font-bold ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-950">
                            AM
                          </div>
                          <h4 className="text-sm font-bold text-white mt-3">Alex Morgan</h4>
                          <p className="text-[10px] text-purple-400 font-semibold mt-0.5">Lead Designer</p>
                          <p className="text-[10px] text-gray-400 font-medium">Stripe Inc.</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <span className="py-2 bg-slate-900 rounded-lg text-[10px] text-white font-semibold border border-slate-800">
                            📞 Call User
                          </span>
                          <span className="py-2 bg-slate-900 rounded-lg text-[10px] text-white font-semibold border border-slate-800">
                            ✉️ Send Email
                          </span>
                        </div>

                        {/* Social Links Stack */}
                        <div className="space-y-1.5 mt-4">
                          <div className="py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-gray-300 flex items-center justify-between px-3">
                            <span>LinkedIn Profile</span>
                            <span className="text-purple-400">→</span>
                          </div>
                          <div className="py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-gray-300 flex items-center justify-between px-3">
                            <span>GitHub Work</span>
                            <span className="text-purple-400">→</span>
                          </div>
                          <div className="py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-gray-300 flex items-center justify-between px-3">
                            <span>Download Resume</span>
                            <span className="text-purple-400">↓</span>
                          </div>
                        </div>

                        <div className="py-1 text-[8px] text-gray-500 font-medium">
                          Powered by QRConnect
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Designed for the Modern Networker
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
            A state-of-the-art solution that equips professionals, designers, developers, and founders with next-gen cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700/60 transition-all duration-200 group flex flex-col justify-between"
              whileHover={{ y: -5 }}
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 w-fit rounded-xl border border-slate-800/80 group-hover:scale-105 transition-transform duration-200">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section className="py-20 bg-slate-950/20 border-t border-gray-900 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Premium Styling Themes
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Three pre-made harmony color schemes built with professional typography and border configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((temp, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl border flex flex-col justify-between h-56 transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl ${temp.class}`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/5 rounded-full ${temp.textColor}`}>
                    {temp.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-4">{temp.name}</h3>
                </div>
                <div className="text-xs text-gray-400">
                  Clean outlines, harmonious fonts, and rich vector layouts.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 max-w-4xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-2xl glass-panel border border-slate-800 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white hover:bg-slate-900/30 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-slate-900 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-gray-900 text-center text-xs text-gray-500 relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <QrCode className="h-5 w-5 text-purple-500" />
            <span className="font-bold text-white text-sm">QRConnect</span>
          </div>
          <p>© 2026 QRConnect Inc. Built for the College Entrepreneurship Event.</p>
        </div>
      </footer>
    </div>
  );
}
