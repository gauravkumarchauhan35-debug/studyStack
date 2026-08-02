import React, { useState } from 'react';
import API_BASE_URL from '../apiConfig';

export default function Auth({ setAuth, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.token, data.user);
      showToast('Logged in successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: regRole })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.token, data.user);
      showToast('Account created successfully! Welcome to StudyStack.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-4">
      <div className="w-full max-w-[440px] rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-2xl shadow-black/80 ring-1 ring-white/5 transition-all duration-300 relative overflow-hidden">
        
        {/* Top ambient card glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {isLogin ? (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white mb-4 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
                <i className="fa-solid fa-lock text-lg"></i>
              </div>
              <h2 className="text-3xl font-black font-outfit tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-2 font-semibold">Access your courses and stack up your knowledge</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required 
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition duration-200 placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    minLength={8}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition duration-200 placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 mt-3 text-sm font-black tracking-wide text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/35 transform hover:-translate-y-0.5"
              >
                Sign In <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
              </button>
            </form>

            <div className="text-center mt-8 text-xs text-slate-400 font-semibold">
              <p>Don't have an account? <a href="#" onClick={() => setIsLogin(false)} className="text-cyan-400 font-extrabold hover:text-cyan-300 transition">Create an account</a></p>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white mb-4 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
                <i className="fa-solid fa-user-plus text-lg"></i>
              </div>
              <h2 className="text-3xl font-black font-outfit tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Create Account</h2>
              <p className="text-xs text-slate-400 mt-2 font-semibold">Join StudyStack and jumpstart your learning</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="text" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe" 
                    required 
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition duration-200 placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required 
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition duration-200 placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    minLength={8}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition duration-200 placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-black transition duration-200 ${
                      regRole === 'student' 
                        ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <i className="fa-solid fa-user-graduate text-base"></i>
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('instructor')}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-black transition duration-200 ${
                      regRole === 'instructor' 
                        ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <i className="fa-solid fa-chalkboard-user text-base"></i>
                    <span>Instructor</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 mt-3 text-sm font-black tracking-wide text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/35 transform hover:-translate-y-0.5"
              >
                Register <i className="fa-solid fa-user-plus ml-2 text-xs"></i>
              </button>
            </form>

            <div className="text-center mt-8 text-xs text-slate-400 font-semibold">
              <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)} className="text-cyan-400 font-extrabold hover:text-cyan-300 transition">Sign In</a></p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
