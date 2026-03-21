import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: (envUrl && envUrl.trim())
    ? envUrl.trim()
    : isLocalhost
      ? 'http://localhost:5000/api'
      : 'https://hospital-backend-78ur.onrender.com/api',
});

export const bookAppointment = (data) => api.post('/create-appointment', data);
export const getAppointments = () => api.get('/admin/appointments');
export const getConfig = () => api.get('/config');
export const updateConfig = (data) => api.post('/config', data);
export const adminLogin = (password) => api.post('/admin/login', { password });
export const updateAppointment = (id, status) => api.post('/admin/update-appointment', { id, paymentStatus: status });
export const fetchLabTests = () => api.get('/lab/tests');
export const fetchPharmacyProducts = () => api.get('/pharmacy/products');

export const analyzeSymptoms = (symptoms) => api.post('/ai/symptom', { symptoms });
export const analyzeVisionImage = (image, symptoms) => api.post('/ai/vision', { image, symptoms });
export const chatWithAI = (query) => api.post('/ai/chat', { query });

export default api;
