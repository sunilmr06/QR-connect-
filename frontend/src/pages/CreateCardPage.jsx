import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, User, Briefcase, Link as LinkIcon, Palette, CheckCircle, Upload } from 'lucide-react';
import CardPreview from '../components/CardPreview';
import { cardService } from '../services/api';

export default function CreateCardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    photo: null,
    designation: '',
    department: '',
    company: '',
    address: '',
    linkedin: '',
    github: '',
    instagram: '',
    portfolio_url: '',
    resume_url: '',
    theme: 'professional_blue',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleThemeChange = (themeName) => {
    setFormData((prev) => ({ ...prev, theme: themeName }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    // Prepare multi-part form data
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== '') {
        submissionData.append(key, formData[key]);
      }
    });

    try {
      const data = await cardService.createCard(submissionData);
      // Navigate to success page and pass the created card data
      navigate('/success', { state: { card: data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create business card. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Check step validity
  const isStepValid = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.phone.trim() !== '' && formData.email.trim() !== '';
    }
    if (step === 2) {
      return formData.designation.trim() !== '' && formData.company.trim() !== '';
    }
    return true; // steps 3, 4, 5 are always valid/optional
  };

  const stepDetails = [
    { num: 1, label: "Personal", icon: <User className="w-4 h-4" /> },
    { num: 2, label: "Work", icon: <Briefcase className="w-4 h-4" /> },
    { num: 3, label: "Social", icon: <LinkIcon className="w-4 h-4" /> },
    { num: 4, label: "Theme", icon: <Palette className="w-4 h-4" /> },
    { num: 5, label: "Review", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      
      {/* Step Wizard Indicator */}
      <div className="max-w-3xl mx-auto mb-10 md:mb-16">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -translate-y-1/2 z-0" />
          
          {stepDetails.map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              disabled={s.num > step}
              className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  step === s.num
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : step > s.num
                      ? 'bg-purple-950 border-purple-500 text-purple-400'
                      : 'bg-slate-900 border-gray-800 text-gray-500'
                }`}
              >
                {s.icon}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold mt-2 ${
                step === s.num ? 'text-purple-400 font-bold' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        
        {/* FORM SIDE */}
        <div className="lg:col-span-7 rounded-2xl glass-panel border border-slate-800/80 p-6 md:p-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="step-container"
            >
              
              {/* STEP 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Personal Details</h2>
                    <p className="text-xs text-gray-400">Introduce yourself to your contacts.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 99999 12345"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. alex.morgan@stripe.com"
                      className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Image Upload box */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Profile Photo</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/60 hover:border-purple-500/50 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-400 font-semibold">
                            {formData.photo ? formData.photo.name : 'Click to Upload photo'}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">PNG, JPG or JPEG (max. 2MB)</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Professional Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Professional Details</h2>
                    <p className="text-xs text-gray-400">Share your current title and company details.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Designation *</label>
                      <input 
                        type="text" 
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Lead Product Designer"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Department</label>
                      <input 
                        type="text" 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Product Engineering"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Company *</label>
                    <input 
                      type="text" 
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Stripe Inc."
                      className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Company Address</label>
                    <textarea 
                      rows="3"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 510 Townsend St, San Francisco, CA 94103"
                      className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Social & Portfolio Links */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Social Links</h2>
                    <p className="text-xs text-gray-400">Add digital profile details for your online card page.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">LinkedIn URL</label>
                      <input 
                        type="url" 
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">GitHub URL</label>
                      <input 
                        type="url" 
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Instagram URL</label>
                    <input 
                      type="url" 
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                      className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Portfolio URL</label>
                      <input 
                        type="url" 
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleInputChange}
                        placeholder="https://username.dev"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Resume Link (PDF URL)</label>
                      <input 
                        type="url" 
                        name="resume_url"
                        value={formData.resume_url}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/.../resume.pdf"
                        className="w-full bg-slate-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Theme Selection */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Theme Selection</h2>
                    <p className="text-xs text-gray-400">Pick the visual color palette that matches your brand.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handleThemeChange('professional_blue')}
                      className={`flex items-center justify-between p-5 rounded-xl border text-left transition-all duration-150 ${
                        formData.theme === 'professional_blue'
                          ? 'bg-blue-950/20 border-blue-500 text-white'
                          : 'bg-slate-900/30 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">Professional Blue</h4>
                        <p className="text-xs text-gray-400 mt-1">Trustworthy & corporate. Perfect for builders & managers.</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-400" />
                    </button>

                    <button
                      onClick={() => handleThemeChange('executive_dark')}
                      className={`flex items-center justify-between p-5 rounded-xl border text-left transition-all duration-150 ${
                        formData.theme === 'executive_dark'
                          ? 'bg-amber-950/10 border-amber-500 text-white'
                          : 'bg-slate-900/30 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">Executive Dark</h4>
                        <p className="text-xs text-gray-400 mt-1">Premium & elegant charcoal matte with gold accents.</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-amber-500 border border-amber-450" />
                    </button>

                    <button
                      onClick={() => handleThemeChange('modern_purple')}
                      className={`flex items-center justify-between p-5 rounded-xl border text-left transition-all duration-150 ${
                        formData.theme === 'modern_purple'
                          ? 'bg-purple-950/20 border-purple-500 text-white'
                          : 'bg-slate-900/30 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">Modern Purple</h4>
                        <p className="text-xs text-gray-400 mt-1">Creative & vibrant violet gradients. Highly interactive look.</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-purple-600 border border-purple-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Review & Generate */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Generate Identity</h2>
                    <p className="text-xs text-gray-400">Review your card details and tap generate to create assets.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 leading-relaxed">
                    ✨ <span className="font-bold">Event Optimized:</span> QRConnect will compile your Offline QR (VCard), Online QR, printable business card PDFs (A4 template included), and shareable PNGs in less than 30 seconds.
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/30 space-y-3 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-300">Name</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-300">Role</span>
                      <span>{formData.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-300">Company</span>
                      <span>{formData.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-300">Theme</span>
                      <span>{formData.theme.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-8 border-t border-slate-900 mt-8">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-800 text-xs text-gray-300 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
                      isStepValid()
                        ? 'bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/15'
                        : 'bg-slate-900 border border-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center space-x-1.5 px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all ${
                      loading ? 'opacity-50 cursor-wait' : 'shadow-lg shadow-purple-500/20'
                    }`}
                  >
                    {loading ? (
                      <span>Generating Assets...</span>
                    ) : (
                      <>
                        <span>Generate & Export</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* STICKY LIVE PREVIEW SIDE */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="text-center lg:text-left">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Real-time Card Preview
            </h3>
            <CardPreview data={formData} themeId={formData.theme} />
          </div>
        </div>

      </div>
    </div>
  );
}
