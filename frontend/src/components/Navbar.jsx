import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, LayoutDashboard, Plus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel-light backdrop-blur-md border-b border-gray-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                QRConnect
              </span>
            </Link>
            
            {/* College / Organization Banner */}
            <div className="hidden md:flex items-center pl-4 border-l border-gray-800 shrink-0">
              <img 
                src="/sadhana_banner.png" 
                alt="Sponsors & Affiliations" 
                className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>

          {/* Glowing Horizontal Connector Line */}
          <div className="hidden md:block flex-1 mx-6 h-px bg-gradient-to-r from-gray-800/20 via-purple-500/30 to-indigo-500/30 via-gray-800/20" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 shrink-0">
            <Link 
              to="/admin" 
              className={`flex items-center space-x-1.5 text-sm font-medium transition-colors duration-150 ${
                isActive('/admin') ? 'text-purple-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/create" 
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Card</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-gray-800/40 px-2 pt-2 pb-4 space-y-1">
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/admin') ? 'bg-purple-950/40 text-purple-400' : 'text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/create"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-medium shadow-md shadow-purple-500/10"
          >
            <Plus className="w-5 h-5" />
            <span>Create Card</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
