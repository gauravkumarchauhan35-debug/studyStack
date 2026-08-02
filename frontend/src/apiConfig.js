const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? '' : 'https://studystack-kmko.onrender.com');

export default API_BASE_URL;
