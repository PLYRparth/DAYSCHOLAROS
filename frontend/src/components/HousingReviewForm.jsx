import React, { useState } from 'react';
import axios from 'axios';
import StandardCard from './StandardCard';

const HousingReviewForm = ({ onReviewAdded }) => {
  const [formData, setFormData] = useState({
    location: '',
    wifi_speed: 3,
    landlord_interference: 3,
    hidden_charges: false
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await axios.post('/housing-reviews', formData);
      setStatus('Review submitted successfully!');
      setFormData({ location: '', wifi_speed: 3, landlord_interference: 3, hidden_charges: false });
      if (onReviewAdded) onReviewAdded();
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <StandardCard className="p-6 md:p-8">
        <h2 className="text-2xl font-display font-bold text-[var(--color-cream)] mb-6">Submit Housing Review</h2>
        {status && (
          <div className={`p-3 rounded-lg mb-6 text-sm border ${status.includes('Error') ? 'bg-[var(--color-coral)]/10 text-[var(--color-coral)] border-[var(--color-coral)]/30' : 'bg-[#25221C] text-[var(--color-cream)] border-[var(--color-muted)]/30'}`}>
            {status}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Location / Address</label>
            <input 
              type="text" 
              name="location" 
              required 
              value={formData.location} 
              onChange={handleChange}
              className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">WiFi Speed (1-5)</label>
              <input 
                type="number" 
                name="wifi_speed" 
                min="1" max="5" 
                required 
                value={formData.wifi_speed} 
                onChange={handleChange}
                className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Landlord Int. (1-5)</label>
              <input 
                type="number" 
                name="landlord_interference" 
                min="1" max="5" 
                required 
                value={formData.landlord_interference} 
                onChange={handleChange}
                className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 p-3 bg-[#17140F] border border-[#3A362E] rounded-lg cursor-pointer hover:border-[var(--color-muted)] transition-colors" onClick={() => setFormData(prev => ({...prev, hidden_charges: !prev.hidden_charges}))}>
            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors border ${formData.hidden_charges ? 'bg-[var(--color-coral)] border-[var(--color-coral)]' : 'bg-transparent border-[var(--color-muted)]'}`}>
              {formData.hidden_charges && (
                <svg className="w-3 h-3 text-[var(--color-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input 
              type="checkbox" 
              name="hidden_charges" 
              checked={formData.hidden_charges} 
              readOnly
              className="hidden" 
            />
            <span className="text-[var(--color-cream)] text-sm font-medium">Contains Hidden Charges?</span>
          </div>

          <button type="submit" className="mt-4 bg-[var(--color-coral)] hover:opacity-90 text-[var(--color-dark)] font-medium py-3 px-4 rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]">
            Submit Review
          </button>
        </form>
      </StandardCard>
    </div>
  );
};

export default HousingReviewForm;
