import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

export default function CourseModal({ course, token, onClose, onSuccess, showToast }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [instructor, setInstructor] = useState('');
  const [image, setImage] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const isEdit = !!course;

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setPrice(course.price || '');
      setInstructor(course.instructor || '');
      setImage(course.image || '');
    } else {
      setTitle('');
      setPrice('');
      setInstructor('');
      setImage('');
    }
  }, [course]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    showToast('Uploading image from device...', 'success');

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setImage(data.imageUrl);
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, price: Number(price), instructor, image };
    const url = isEdit ? `${API_BASE_URL}/api/courses/${course._id}` : `${API_BASE_URL}/api/courses`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save course');

      showToast(isEdit ? 'Course updated successfully!' : 'Course created successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <h3 className="font-black font-outfit text-xl text-white tracking-tight">{isEdit ? 'Edit Course Details' : 'Add New Course'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-lg">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Course Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Web Development" 
              required 
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Price (₹)</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 99" 
              min="0"
              required 
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Instructor Name</label>
            <input 
              type="text" 
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Jane Smith" 
              required 
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Course Background Image</label>
            <div className="flex flex-col gap-3 p-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/60">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="text-xs text-slate-400 file:mr-3.5 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500/15 file:text-cyan-300 hover:file:bg-cyan-500/25 cursor-pointer transition"
              />
              <div className="relative text-center my-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="bg-slate-950 px-3 relative z-1">OR URL</span>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800"></div>
              </div>
              <input 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL directly..." 
                className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500 transition font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-2xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={uploading}
              className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 rounded-2xl transition shadow-lg shadow-indigo-500/20"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
