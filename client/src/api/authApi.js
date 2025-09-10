import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
// console.log("API_URL:", API_URL);

// Set token in axios headers
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Auth APIs
export const loginApi = (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password });

export const registerApi = (name, email, password, role) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password, role });

export const getCurrentUserApi = () => axios.get(`${API_URL}/auth/me`);

export const changePasswordApi = (currentPassword, newPassword) =>
    axios.put(`${API_URL}/auth/change-password`, { currentPassword, newPassword });

// User APIs
export const updateProfileApi = (profileData) =>
    axios.put(`${API_URL}/users/profile`, profileData);
