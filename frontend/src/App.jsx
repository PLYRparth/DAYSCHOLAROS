import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

// Pages and Components
import Landing from './pages/Landing';
import TiffinDashboard from './pages/TiffinDashboard';
import Marketplace from './pages/Marketplace';
import ShadowCampus from './pages/ShadowCampus';
import HousingReviewForm from './components/HousingReviewForm';
import CommuteMatchmaker from './pages/CommuteMatchmaker';
import AdminPanel from './pages/AdminPanel';

const LoginScreen = ({ email, setEmail, password, setPassword, handleAuth, errorMsg }) => (
  <div className="min-h-screen bg-[var(--color-dark)] flex flex-col items-center justify-center p-6 font-body">
    <h1 className="text-4xl font-display font-bold mb-8 text-[var(--color-cream)] tracking-tight">DayScholar</h1>
    <div className="bg-[#25221C] border border-[#3A362E] p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-xl font-display font-medium mb-6 text-center text-[var(--color-cream)]">Login / Register</h2>
      {errorMsg && (
        <div className="bg-[var(--color-coral)]/10 border border-[var(--color-coral)] text-[var(--color-coral)] p-3 rounded mb-6 text-sm">
          {errorMsg}
        </div>
      )}
      <div className="space-y-4 mb-8">
        <input
          type="email"
          placeholder="College Email (must end in .edu.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]"
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => handleAuth('login')}
          className="flex-1 bg-[var(--color-coral)] text-[var(--color-dark)] font-medium py-3 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
        >
          Login
        </button>
        <button
          onClick={() => handleAuth('register')}
          className="flex-1 bg-transparent border border-[var(--color-muted)] text-[var(--color-muted)] hover:text-[var(--color-cream)] font-medium py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-muted)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
        >
          Register
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const { token, login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (action) => {
    try {
      setErrorMsg('');
      if (action === 'register') {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <Routes>
      {/* Landing page accessible to everyone */}
      <Route path="/" element={<Landing />} />
      
      {/* Login explicitly separated */}
      <Route path="/login" element={
        token ? <Navigate to="/app/shadow-campus" replace /> : 
        <LoginScreen 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
          handleAuth={handleAuth} 
          errorMsg={errorMsg} 
        />
      } />
      
      {/* The main app, protected */}
      <Route path="/app/*" element={
        <ProtectedRoute>
          <AppShell>
            <Routes>
              <Route path="/" element={<Navigate to="shadow-campus" replace />} />
              <Route path="tiffin" element={<TiffinDashboard />} />
              <Route path="commute" element={<CommuteMatchmaker />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="shadow-campus" element={<ShadowCampus />} />
              <Route path="housing-review" element={<HousingReviewForm />} />
              <Route path="admin" element={<AdminPanel />} />
            </Routes>
          </AppShell>
        </ProtectedRoute>
      } />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
