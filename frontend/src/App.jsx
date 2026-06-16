import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CreateCardPage from './pages/CreateCardPage';
import SuccessPage from './pages/SuccessPage';
import PublicProfilePage from './pages/PublicProfilePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-height-screen flex flex-col bg-brand-dark-dark text-gray-100 selection:bg-purple-500 selection:text-white overflow-hidden">
        {/* Transparent top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none z-0" />
        
        {/* Check if not public profile to show standard header */}
        <Routes>
          {/* Public Profile Page handles its own clean layout without main Navbar */}
          <Route path="/u/:slug" element={<PublicProfilePage />} />
          
          {/* Main platform pages */}
          <Route 
            path="/*" 
            element={
              <>
                <Navbar />
                <div className="flex-1 relative z-10">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/create" element={<CreateCardPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </div>
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
