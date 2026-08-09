import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StandardCard from '../components/StandardCard';

const ShadowCampus = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [subjectTag, setSubjectTag] = useState('');
  const [file, setFile] = useState(null);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/study-materials');
      setMaterials(res.data.data.materials);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject_tag', subjectTag);
    formData.append('file', file);

    setUploadStatus('Uploading...');
    try {
      await axios.post('/study-materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('Upload successful!');
      setTitle('');
      setSubjectTag('');
      setFile(null);
      // Refresh list
      fetchMaterials();
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      setUploadStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(0, 8) + '...';
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start relative">
      {/* Upload Section */}
      <div className="w-full md:w-1/3 md:sticky md:top-24">
        <StandardCard className="p-6">
          <h2 className="font-display font-bold text-xl text-[var(--color-cream)] mb-6">Upload notes</h2>
          
          {uploadStatus && (
            <div className={`p-3 rounded-lg mb-6 text-sm border ${uploadStatus.includes('Error') ? 'bg-[var(--color-coral)]/10 text-[var(--color-coral)] border-[var(--color-coral)]/30' : 'bg-[#25221C] text-[var(--color-cream)] border-[var(--color-muted)]/30'}`}>
              {uploadStatus}
            </div>
          )}
          
          <form onSubmit={handleUpload} className="flex flex-col gap-5">
            <div>
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">Subject Tag</label>
              <input 
                type="text" 
                required 
                value={subjectTag} 
                onChange={(e) => setSubjectTag(e.target.value)}
                className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors placeholder:text-[var(--color-muted)]/40" 
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-sm font-medium mb-2">File (PDF/PNG/JPG)</label>
              <input 
                type="file" 
                required 
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-[#17140F] border border-[#3A362E] rounded-lg p-2 text-sm text-[var(--color-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[var(--color-muted)]/30 file:text-sm file:font-medium file:bg-transparent file:text-[var(--color-muted)] hover:file:text-[var(--color-cream)] hover:file:border-[var(--color-muted)]/50 transition-colors cursor-pointer" 
              />
            </div>
            <button type="submit" className="mt-2 bg-[var(--color-coral)] text-[var(--color-dark)] font-medium py-3 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]">
              Upload
            </button>
          </form>
        </StandardCard>
      </div>

      {/* Browse Section */}
      <div className="w-full md:w-2/3">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-2xl font-display font-bold text-[var(--color-cream)]">Shadow Campus (Notes)</h1>
        </div>
        
        {loading ? (
          <div className="text-[var(--color-muted)] text-center py-12">Loading Materials...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {materials.length === 0 && (
              <div className="bg-[#25221C] p-8 rounded-xl text-center text-[var(--color-muted)] border border-[#3A362E]">
                No materials uploaded yet. Be the first!
              </div>
            )}
            {materials.map(mat => (
              <StandardCard 
                key={mat._id}
                eyebrow={mat.subject_tag}
                title={mat.title}
                leftValue={`${mat.upvotes} UPVOTES`}
                rightCode={`U-${truncateId(mat.uploader_id)}`}
              >
                <div className="flex justify-between items-center mt-1">
                  <div className="text-[10px] text-[var(--color-muted)]/70">
                    Uploader: {truncateId(mat.uploader_id)}
                  </div>
                  <a 
                    href={`http://localhost:5000${mat.file_url}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[var(--color-coral)] text-[var(--color-dark)] px-4 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[#25221C]"
                  >
                    View file
                  </a>
                </div>
              </StandardCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShadowCampus;
