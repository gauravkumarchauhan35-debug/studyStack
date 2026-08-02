import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CourseModal from './components/CourseModal';
import UserModal from './components/UserModal';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Modals state
  const [courseModal, setCourseModal] = useState({ open: false, course: null, callback: null });
  const [userModal, setUserModal] = useState({ open: false, editUser: null, callback: null });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Active Tab state for navigation
  const [activeTab, setActiveTab] = useState('courses');

  // Theme side effects
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'success');
      return nextTheme;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Automatically clear toasts after 3.5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.');
  };

  const openCourseModal = (course = null, callback = null) => {
    setCourseModal({ open: true, course, callback });
  };

  const openUserModal = (editUser = null, callback = null) => {
    setUserModal({ open: true, editUser, callback });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Premium Aurora background effects */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      {/* Toast Alerts */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-xs shadow-2xl backdrop-blur-xl border transition-all duration-300 transform scale-100 animate-in fade-in slide-in-from-top-6 ${
          toast.type === 'success' 
            ? 'border-emerald-500/40 bg-slate-900/90 text-emerald-400 shadow-emerald-500/10' 
            : 'border-rose-500/40 bg-slate-900/90 text-rose-400 shadow-rose-500/10'
        }`}>
          {toast.type === 'success' ? (
            <div className="w-6 h-6 flex items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <i className="fa-solid fa-check text-xs"></i>
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <i className="fa-solid fa-triangle-exclamation text-xs"></i>
            </div>
          )}
          <span className="tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-xl font-bold tracking-tight select-none cursor-pointer">
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <i className="fa-solid fa-graduation-cap text-lg"></i>
              </div>
              <span className="font-outfit text-2xl font-black text-white tracking-tight">
                Study<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Stack</span>
              </span>
            </div>

            {token && user && (
              <nav className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-800/80">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    activeTab === 'courses' 
                      ? 'text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 font-extrabold' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Courses
                </button>
                {user.role === 'instructor' && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                      activeTab === 'users' 
                        ? 'text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 font-extrabold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Users
                  </button>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token && user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-inner">
                  <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white text-xs font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-200">{user.name}</span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase rounded-lg font-black tracking-widest">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-bold rounded-2xl border border-slate-800/80 hover:border-rose-500/30 transition-all duration-200"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="py-4">
        {token && user ? (
          <Dashboard 
            user={user} 
            token={token} 
            showToast={showToast} 
            openCourseModal={openCourseModal}
            openUserModal={openUserModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <Auth setAuth={handleAuth} showToast={showToast} />
        )}
      </main>

      {/* Course Modal */}
      {courseModal.open && (
        <CourseModal 
          course={courseModal.course}
          token={token}
          onClose={() => setCourseModal({ open: false, course: null, callback: null })}
          onSuccess={courseModal.callback}
          showToast={showToast}
        />
      )}

      {/* User Modal */}
      {userModal.open && (
        <UserModal 
          editUser={userModal.editUser}
          token={token}
          onClose={() => setUserModal({ open: false, editUser: null, callback: null })}
          onSuccess={userModal.callback}
          showToast={showToast}
        />
      )}

    </div>
  );
}
