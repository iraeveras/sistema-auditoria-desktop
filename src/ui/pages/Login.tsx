// File: src/ui/pages/Login.tsx
import React, {useState} from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://back-auditoria.onrender.com';

const Login: React.FC = () => {
    const [username,setUserName] = useState('');
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

            const {token, user} = response.data;
            window.electronAPI.sendLoginSuccess({ name: user.name, token });
            
        } catch (error: any) {
            console.error('Erro de login completo:', error);
            setErro(error.response?.data?.message || 'Erro na autenticação');
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input
                    type='text'
                    placeholder='Nome de usuário'
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className='w-full border p-2 mb-4'
                />

                <input 
                    type="password"
                    placeholder='Senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full border p-2 mb-4'
                />

                {erro && <p className="text-red-500 mb-4">{erro}</p>}

                <button type="submit" className="w-full bg-blue-500 text-white p-2">
                    Entrar
                </button>
            </form>
        </div>
    )
}

export default Login;