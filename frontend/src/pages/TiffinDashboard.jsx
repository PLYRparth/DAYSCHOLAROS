import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StandardCard from '../components/StandardCard';

const TiffinDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, reviewRes] = await Promise.all([
          axios.get('/tiffin-vendors'),
          axios.get('/tiffin-reviews')
        ]);
        setVendors(vendorRes.data.data.vendors);
        setReviews(reviewRes.data.data.reviews);
      } catch (err) {
        console.error('Error fetching tiffin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(id.length - 6).toUpperCase();
  };

  if (loading) return <div className="text-center text-[var(--color-muted)] py-12">Loading Vendors...</div>;

  return (
    <div className="flex flex-col relative">
      <div className="flex justify-between items-end mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-cream)]">Tiffin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Vendors Section */}
        <div>
          <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-4">Vendors</div>
          <div className="flex flex-col gap-4">
            {vendors.length === 0 && (
              <div className="bg-[#25221C] p-8 rounded-xl text-center text-[var(--color-muted)] border border-[#3A362E]">
                No vendors found.
              </div>
            )}
            {vendors.map((v) => (
              <StandardCard 
                key={v._id}
                title={v.name}
                rightCode={`TV-${truncateId(v._id)}`}
              >
                <p className="mb-2 text-[var(--color-cream)]">{v.location}</p>
                {v.daily_menu && <p className="text-sm">Menu: {v.daily_menu}</p>}
              </StandardCard>
            ))}
          </div>
        </div>
        
        {/* Recent Reviews Section */}
        <div>
          <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-4">Recent Reviews</div>
          <div className="flex flex-col gap-4">
            {reviews.length === 0 && (
              <div className="bg-[#25221C] p-8 rounded-xl text-center text-[var(--color-muted)] border border-[#3A362E]">
                No reviews yet.
              </div>
            )}
            {reviews.map((r) => (
              <StandardCard 
                key={r._id}
                leftValue={`${r.rating}.0 / 5.0`}
                rightCode={`RV-${truncateId(r._id)}`}
              >
                <p className="text-sm text-[var(--color-cream)] mb-1">Vendor ID: {truncateId(r.vendor_id)}</p>
                <p className="text-[10px] text-[var(--color-muted)]/70 tracking-widest uppercase mt-2">
                  Reviewer: {truncateId(r.reviewer_id)}
                </p>
              </StandardCard>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TiffinDashboard;
