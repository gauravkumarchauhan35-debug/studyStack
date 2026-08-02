import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

export default function UserModal({ editUser, token, onClose, onSuccess, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const isEdit = !!editUser;

  useEffect(() => {
    if (editUser) {
      setName(editUser.name || '');
      setEmail(editUser.email || '');
      setRole(editUser.role || 'student');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setRole('student');
      setPassword('');
    }
  }, [editUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, role };
    
    if (password) {
      payload.password = password;
    } else if (!isEdit) {
      showToast('Password is required for new users', 'error');
      return;
    }

    const url = isEdit ? `${API_BASE_URL}/api/users/${editUser._id}` : `${API_BASE_URL}/api/users`;
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

      if (!res.ok) throw new Error(data.error || 'Failed to save user');

      showToast(isEdit ? 'User updated successfully!' : 'User created successfully!', 'success');
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
          <h3 className="font-black font-outfit text-xl text-white tracking-tight">{isEdit ? 'Edit User Details' : 'Create New User'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-lg">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe" 
              required 
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com" 
              required 
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              Password {isEdit ? '(Leave blank to keep current)' : ''}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? '••••••••' : 'Password (Min 8 chars)'}
              required={!isEdit}
              minLength={8}
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition placeholder:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Platform Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%239ca3af%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 font-medium"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
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
              className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl transition shadow-lg shadow-indigo-500/20"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
