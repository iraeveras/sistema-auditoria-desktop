// File: src/services/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = 'https://back-auditoria.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const loggedUser = await window.electronAPI.getUser();
    if (loggedUser && loggedUser.token) {
        config.headers.Authorization = `Bearer ${loggedUser.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;