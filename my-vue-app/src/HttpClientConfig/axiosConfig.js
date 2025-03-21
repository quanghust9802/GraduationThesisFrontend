import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7244/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// apiClient.get('/

export default apiClient;
