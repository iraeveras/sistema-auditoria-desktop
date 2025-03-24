// File: src/services/authService.ts
import axios from "axios";

const API_BASE_URL = 'https://back-auditoria.onrender.com';

export const signin = async (id: number, username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signIn/`, {
        id,
        username,
        password,
    });

    return response.data;
}