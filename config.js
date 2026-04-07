// API Configuration - Works for both local and deployed environments

// 🔧 CHANGE THIS to your deployed backend URL after deployment
const DEPLOYED_BACKEND_URL = 'https://your-backend.onrender.com'; // Replace with your actual backend URL

// Auto-detect environment
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use appropriate API URL based on environment
const API_BASE_URL = isLocalhost 
  ? window.location.origin + '/api'  // Local development
  : DEPLOYED_BACKEND_URL + '/api';   // Production deployment

// Socket.io URL
const SOCKET_URL = isLocalhost 
  ? window.location.origin          // Local development
  : DEPLOYED_BACKEND_URL;           // Production deployment

console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔌 Socket URL:', SOCKET_URL);
console.log('📍 Environment:', isLocalhost ? 'Local' : 'Production');
