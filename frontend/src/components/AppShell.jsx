import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract initials for the avatar (fallback to User if not available)
  const getInitials = (email) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Marketplace', path: '/app/marketplace' },
    { name: 'Tiffin', path: '/app/tiffin' },
    { name: 'Notes', path: '/app/shadow-campus' },
    { name: 'Commute', path: '/app/commute' },
    { name: 'Housing', path: '/app/housing-review' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/app/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-dark)]">
      {/* Top Nav Bar */}
      <nav className="border-b border-[var(--color-muted)]/10 px-4 md:px-8 py-4 sticky top-0 z-50 bg-[var(--color-dark)]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="font-display font-bold text-xl text-[var(--color-cream)] tracking-tight">
            DayScholar
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors border-b-2 py-1 ${
                    isActive 
                      ? 'text-[var(--color-coral)] border-[var(--color-coral)]' 
                      : 'text-[var(--color-muted)] border-transparent hover:text-[var(--color-cream)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side: Avatar & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Avatar Dropdown (simplified) */}
            <div className="relative group cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-coral)] text-[var(--color-dark)] font-mono font-bold text-sm">
              {getInitials(user?.email || user?.id)}
              
              {/* Simple hover dropdown for logout */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-[#25221C] border border-[#3A362E] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-coral)] hover:bg-[#3A362E]/50 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-[var(--color-muted)] p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[var(--color-muted)]/10 flex flex-col gap-4">
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium px-2 py-1 ${
                    isActive 
                      ? 'text-[var(--color-coral)]' 
                      : 'text-[var(--color-muted)] hover:text-[var(--color-cream)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Main Content wrapper */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
