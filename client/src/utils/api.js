import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const normalizeBaseUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  let clean = rawUrl.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: normalizeBaseUrl(envUrl)
    ? normalizeBaseUrl(envUrl)
    : isLocalhost
      ? 'http://localhost:5000/api'
      : 'https://hospital-backend-78ur.onrender.com/api',
});

export const bookAppointment = (data) => api.post('/create-appointment', data);
export const getAppointments = () => api.get('/admin/appointments');
export const getAppointmentByToken = (token) => api.get(`/appointments/${token}`);
export const getConfig = () => api.get('/config');
export const updateConfig = (data) => api.post('/config', data);
export const adminLogin = (password) => api.post('/admin/login', { password });
export const updateAppointment = (id, status) => api.post('/admin/update-appointment', { id, paymentStatus: status });
export const fetchLabTests = () => api.get('/lab/tests');
export const fetchPharmacyProducts = () => api.get('/pharmacy/products');
export const fetchMedicinesCatalog = () => api.get('/medicines/catalog');

export const analyzeSymptoms = (symptoms) => api.post('/ai/symptom', { symptoms });
export const analyzeVisionImage = (image, symptoms) => api.post('/ai/vision', { image, symptoms });
export const chatWithAI = (query) => api.post('/ai/chat', { query });
export const discoverMedicines = (keyword) => api.post('/ai/medicine-discovery', { keyword });
export const savePatientClinicalNote = (data) => api.post('/admin/patient-clinical-note', data);
export const getPatientClinicalHistory = (patientName, phone) => api.post('/admin/patient-clinical-history', { patientName, phone });

export default api;
