// File: src/ui/services/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = 'https://back-auditoria.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log('Token adicionado:', config.headers.Authorization);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;