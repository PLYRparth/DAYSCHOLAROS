import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/admin/reports');
      setReports(res.data.data.reports);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports. Ensure your role is "admin".');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`/admin/reports/${id}`, { status });
      // Remove the processed report from the pending list instantly
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(0, 8) + '...';
  };

  if (loading) return <div className="flex items-center justify-center p-12 text-[var(--color-muted)] font-medium text-lg">Loading Admin Panel...</div>;

  return (
    <div className="flex flex-col relative">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-cream)] mb-8">Admin Panel - Moderation Queue</h1>
      
      {error ? (
        <div className="bg-[var(--color-coral)]/10 text-[var(--color-coral)] border border-[var(--color-coral)]/30 p-4 rounded-lg shadow-lg mb-8">
          {error}
        </div>
      ) : (
        <div className="bg-[#25221C] rounded-xl shadow-2xl border border-[#3A362E] overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#17140F] border-b border-[#3A362E]">
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm">Date</th>
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm">Target Type</th>
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm">Target ID</th>
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm">Reason</th>
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm">Reporter ID</th>
                <th className="p-4 font-medium text-[var(--color-muted)] text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-[var(--color-muted)] font-medium">No pending reports!</td>
                </tr>
              )}
              {reports.map((r, index) => (
                <tr key={r._id} className={`border-b border-[#3A362E] hover:bg-[#3A362E]/30 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-[#17140F]/50'}`}>
                  <td className="p-4 text-sm text-[var(--color-cream)]">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-4"><span className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">{r.target_type}</span></td>
                  <td className="p-4 text-sm font-mono text-[var(--color-coral)]">{truncateId(r.target_id)}</td>
                  <td className="p-4 text-sm text-[var(--color-cream)] max-w-[250px] truncate" title={r.reason}>{r.reason}</td>
                  <td className="p-4 text-sm font-mono text-[var(--color-muted)]">{truncateId(r.reporter_id)}</td>
                  <td className="p-4 flex gap-3 justify-center items-center h-full">
                    <button 
                      onClick={() => handleAction(r._id, 'upheld')}
                      className="bg-[var(--color-coral)] hover:opacity-90 text-[var(--color-dark)] px-4 py-1.5 rounded-full text-xs font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                    >
                      Uphold
                    </button>
                    <button 
                      onClick={() => handleAction(r._id, 'dismissed')}
                      className="bg-transparent border border-[var(--color-muted)] hover:text-[var(--color-cream)] hover:border-[var(--color-cream)] text-[var(--color-muted)] px-4 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-muted)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
