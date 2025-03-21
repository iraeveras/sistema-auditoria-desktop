// File: src/ui/pages/Login.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const API_BASE_URL = 'https://back-auditoria.onrender.com';

const Login: React.FC = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('window.electronAPI:', window.electronAPI);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signIn/`, {
                username,
                password,
            });

            const { token, user } = response.data;
            window.electronAPI.sendLoginSuccess({ name: user.name, token });

        } catch (error: any) {
            console.error('Erro de login completo:', error);
            setErro(error.response?.data?.message || 'Erro na autenticação');
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <form onSubmit={handleLogin} className="bg-transparent p-8 rounded w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-neutral-600">Login</h2>
                <h3 className='text-center text-xs text-neutral-400 mb-3'>Insira seu nome de usuário e senha para acessar o sistema de Auditoria</h3>
                <input
                    type='text'
                    placeholder='Nome de usuário'
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className='w-full text-xs border px-2 py-1 mb-4 outline-neutral-500 border-neutral-400'
                />

                <input
                    type="password"
                    placeholder='Senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full text-xs border px-2 py-1 mb-4 outline-neutral-500 border-neutral-400'
                />

                {erro && <p className="text-red-500 mb-4">{erro}</p>}

                <button type="submit" className="w-full p-2 transition bg-neutral-600 hover:bg-neutral-500 cursor-pointer text-xs text-white">
                    Entrar
                </button>
            </form>
        </div>
    )
}

export default Login;