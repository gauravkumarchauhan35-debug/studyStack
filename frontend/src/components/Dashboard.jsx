import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

export default function Dashboard({ user, token, showToast, openCourseModal, openUserModal, activeTab, setActiveTab }) {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const isInstructor = user && user.role === 'instructor';

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isInstructor) return;
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    if (isInstructor) {
      fetchUsers();
    }
  }, [token, user]);

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete course');
      showToast('Course deleted successfully.', 'success');
      fetchCourses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      showToast('User deleted successfully.', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEnroll = (course) => {
    showToast(`Successfully enrolled in ${course.title}!`, 'success');
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculations
  const avgPrice = courses.length 
    ? Math.round(courses.reduce((sum, c) => sum + Number(c.price || 0), 0) / courses.length) 
    : 0;

  const uniqueInstructors = new Set(courses.map(c => c.instructor)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <main className="w-full">
        
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black font-outfit text-white tracking-tight flex items-center gap-3">
                  <span>Courses Overview</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider">
                    {courses.length} Live
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 font-semibold">Explore curated learning tracks and manage course modules</p>
              </div>
              {isInstructor && (
                <button 
                  onClick={() => openCourseModal(null, fetchCourses)}
                  className="flex items-center gap-2.5 px-5 py-3 text-xs font-black text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <i className="fa-solid fa-plus text-sm"></i> Add New Course
                </button>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Total Courses */}
              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-cyan-500/40 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-inner">
                    <i className="fa-solid fa-book-bookmark text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">{courses.length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Total Courses</div>
                  </div>
                </div>
              </div>

              {/* Avg Price */}
              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-indigo-500/40 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner">
                    <i className="fa-solid fa-indian-rupee-sign text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">₹{avgPrice.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Avg Course Price</div>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-purple-500/40 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-inner">
                    <i className="fa-solid fa-user-tie text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">{uniqueInstructors}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Active Instructors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <i className="fa-solid fa-magnifying-glass absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by title or instructor..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-slate-900/80 border border-slate-800/90 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition shadow-lg placeholder:text-slate-500 font-medium"
              />
            </div>

            {coursesLoading ? (
              <div className="flex flex-col items-center justify-center p-20 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fetching course catalog...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 mb-4 border border-slate-700/50">
                  <i className="fa-solid fa-book-open-reader text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-outfit text-white">No courses available</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">Try refining your search query or create a new course track.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course._id} className="relative flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 group">
                    
                    {/* Actions (Top Right Overlay) */}
                    {isInstructor && (
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                        <button 
                          onClick={() => openCourseModal(course, fetchCourses)}
                          className="w-9 h-9 flex items-center justify-center bg-slate-950/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-800 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md transition duration-200"
                          title="Edit Course"
                        >
                          <i className="fa-regular fa-edit text-xs"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          className="w-9 h-9 flex items-center justify-center bg-slate-950/80 hover:bg-rose-500 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md transition duration-200"
                          title="Delete Course"
                        >
                          <i className="fa-regular fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    )}

                    {/* Course Background Banner */}
                    <div 
                      className="h-[150px] bg-cover bg-center bg-no-repeat bg-slate-950 border-b border-slate-800/80 relative overflow-hidden group-hover:scale-105 transition-all duration-500"
                      style={{ backgroundImage: `url('${course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    </div>

                    {/* Details Body */}
                    <div className="flex-1 flex flex-col p-6 relative z-10">
                      <h3 className="font-bold font-outfit text-lg text-white mb-2 tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
                        <i className="fa-regular fa-user text-cyan-400"></i>
                        <span>{course.instructor}</span>
                      </div>

                      {/* Pricing & Footer Information */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/80">
                        <span className="text-2xl font-black font-outfit bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{Number(course.price || 0).toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleEnroll(course)}
                          className="px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 transition-all duration-200"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && isInstructor && (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black font-outfit text-white tracking-tight flex items-center gap-3">
                  <span>User Management</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider">
                    {users.length} Total
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 font-semibold">Manage registered students and instructor accounts</p>
              </div>
              <button 
                onClick={() => openUserModal(null, fetchUsers)}
                className="flex items-center gap-2.5 px-5 py-3 text-xs font-black text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-plus text-sm"></i> Add New User
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-cyan-500/40 transition duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-inner">
                    <i className="fa-solid fa-users text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">{users.length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Registered Users</div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-emerald-500/40 transition duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
                    <i className="fa-solid fa-user-graduate text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">
                      {users.filter(u => u.role === 'student').length}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Active Students</div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-xl group hover:border-purple-500/40 transition duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-inner">
                    <i className="fa-solid fa-chalkboard-user text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-black font-outfit text-white tracking-tight">
                      {users.filter(u => u.role === 'instructor').length}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Instructors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <i className="fa-solid fa-magnifying-glass absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-slate-900/80 border border-slate-800/90 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition shadow-lg placeholder:text-slate-500 font-medium"
              />
            </div>

            {usersLoading ? (
              <div className="flex flex-col items-center justify-center p-20 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fetching user directory...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 mb-4 border border-slate-700/50">
                  <i className="fa-solid fa-users-slash text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-outfit text-white">No users found</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">Add new accounts using the button above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users
                  .filter(u => 
                    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                  )
                  .map(u => {
                    const initials = u.name
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();
                    
                    const avatarBg = u.role === 'instructor' 
                      ? 'from-purple-500 to-indigo-600 shadow-purple-500/20 ring-purple-500/30'
                      : 'from-cyan-500 to-blue-600 shadow-cyan-500/20 ring-cyan-500/30';

                    return (
                      <div key={u._id} className="flex items-center gap-4 p-5 bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-xl hover:shadow-2xl hover:border-cyan-500/30 transition duration-300 relative group">
                        
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-white font-black text-sm shadow-lg ring-1 bg-gradient-to-tr ${avatarBg}`}>
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0 pr-16">
                          <h4 className="font-bold font-outfit text-base text-white truncate group-hover:text-cyan-300 transition-colors">{u.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 truncate font-medium">
                            <i className="fa-regular fa-envelope text-slate-500"></i>
                            <span className="truncate">{u.email}</span>
                          </div>
                          <div className="mt-3">
                            <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                              u.role === 'instructor' 
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' 
                                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                        </div>

                        <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button 
                            onClick={() => openUserModal(u, fetchUsers)}
                            className="w-9 h-9 flex items-center justify-center bg-slate-955 hover:bg-cyan-500 text-slate-300 hover:text-slate-955 border border-slate-800 rounded-xl text-xs font-bold shadow-md transition"
                            title="Edit User"
                          >
                            <i className="fa-regular fa-edit text-xs"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="w-9 h-9 flex items-center justify-center bg-slate-955 hover:bg-rose-500 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold shadow-md transition"
                            title="Delete User"
                          >
                            <i className="fa-regular fa-trash-can text-xs"></i>
                          </button>
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
