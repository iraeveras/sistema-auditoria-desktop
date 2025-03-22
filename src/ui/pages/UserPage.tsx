// File: src/ui/pages/UserPage.tsx
import React, { useState, useEffect } from 'react';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import axiosInstance from '../../services/axiosInstance';

const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Categoria {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    name: string;
    situacao: boolean;
    categoria?: Categoria;
    createdAt: string;
    updatedAt: string;
}

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        situacao: true,
        password: '',
        passwordConfirmation: '',
        categoriaId: '',
    });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [error, setError] = useState('');

    // Estados para pesquisa e paginação
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Quantos itens por página

    // Função para buscar usuários
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/usuarios`);
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
            }
        } catch (err) {
            console.error('Erro ao buscar usuários', err);
            setError('Erro ao buscar usuários');
        }
    };

    // Função para buscar categorias para o select
    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/categorias`);
            let cats = [];
            if (response.data && response.data.cats) {
                cats = response.data.cats;
            } else if (Array.isArray(response.data)) {
                cats = response.data;
            }
            setCategories(cats);
        } catch (err) {
            console.error('Erro ao buscar categorias', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, []);

    // Filtrando os usuários com base na pesquisa
    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.username.toLowerCase().includes(query) ||
            user.name.toLowerCase().includes(query)
        );
    });

    // Cálculo para paginação
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Converte categoriaId para número (se não estiver vazio)
        const dataToSend = {
            ...formData,
            categoriaId: formData.categoriaId ? Number(formData.categoriaId) : null,
        };

        if (editingUser) {
            // Atualizar usuário
            try {
                await axiosInstance.put(`${API_BASE_URL}/usuarios/${editingUser.id}`, dataToSend);
                await fetchUsers();
                setEditingUser(null);
                setFormData({ username: '', name: '', situacao: true, password: '', passwordConfirmation: '', categoriaId: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar usuário', err);
                setError(err.response?.data?.error || 'Erro ao atualizar usuário');
            }
        } else {
            // Criar novo usuário
            try {
                await axiosInstance.post(`${API_BASE_URL}/usuarios`, dataToSend);
                await fetchUsers();
                setFormData({ username: '', name: '', situacao: true, password: '', passwordConfirmation: '', categoriaId: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar usuário', err);
                setError(err.response?.data?.error || 'Erro ao criar usuário');
            }
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            name: user.name,
            situacao: user.situacao,
            password: '', // não preenche senha ao editar
            passwordConfirmation: '',
            categoriaId: user.categoria ? String(user.categoria.id) : '',
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir este usuário?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/usuarios/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setError('');
        } catch (err: any) {
            console.error('Erro ao excluir usuário', err);
            setError(err.response?.data?.error || 'Erro ao excluir usuário');
        }
    };

    // Funções para mudar de página
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            {/* <h1 className="text-2xl font-bold mb-4">Cadastro de Usuário</h1> */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="border-b border-b-neutral-400 mb-6 pb-4">
                <div className='w-full flex gap-2'>
                    <div className="w-96 flex flex-col mb-2">
                        <label className="text-xs text-neutral-500">Nome de usuário:</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <label className="text-xs text-neutral-500">Nome:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
                    </div>
                </div>
                <div className='w-full flex gap-2'>
                    <div className="w-full flex flex-col mb-2">
                        <label className="text-xs text-neutral-500">Senha:</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required={!editingUser}
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <label className="text-xs text-neutral-500">Confirmação de Senha:</label>
                        <input
                            type="password"
                            value={formData.passwordConfirmation}
                            onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required={!editingUser}
                        />
                    </div>
                </div>
                <div className="w-full flex gap-2">
                    <div className="w-full flex flex-col mb-4">
                        <label className="text-xs text-neutral-500">Categoria:</label>
                        <select
                            value={formData.categoriaId}
                            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center ">
                        <label className="text-sm text-neutral-600 mr-2">Ativo?</label>
                        <input
                            type="checkbox"
                            checked={formData.situacao}
                            onChange={(e) =>
                            setFormData({ ...formData, situacao: e.target.checked })
                            }
                            className="h-4 w-4"
                        />
                    </div>
                </div>
                <div className='w-full flex gap-2 items-center justify-end'>
                    <button type="submit" className="border border-blue-500 text-white text-xs px-4 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500">
                        {editingUser ? 'Atualizar' : 'Cadastrar'}
                    </button>

                    {editingUser && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingUser(null);
                                setFormData({ username: '', name: '', situacao: true, password: '', passwordConfirmation: '', categoriaId: '' });
                            }}
                            className="border border-gray-500 text-white text-xs px-4 py-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Campo de pesquisa */}
            <div className="mb-4 ">
                <input
                    type="text"
                    placeholder="Pesquisar usuário..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reinicia para a página 1 quando a pesquisa muda
                    }}
                    className="border border-neutral-400 outline-none text-xs px-2 py-1 w-full"
                />
            </div>

            <table className="min-w-full bg-white border border-neutral-400">
                <thead>
                    <tr className="border border-neutral-400">
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">#</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Nome de usuário</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Nome</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Categoria</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{user.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{user.username}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{user.name}</td>
                            <td className="px-4 border border-neutral-400 text-xs">
                                {user.categoria ? user.categoria.name : 'N/A'}
                            </td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${user.situacao ? "text-green-600" : "text-red-400"}`}>
                                {user.situacao ? 'Ativo' : 'Inativo'}
                            </td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer"
                                >
                                    <FaRegTrashAlt className="text-red-500" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Controles de paginação */}
            <div className="flex items-center justify-end mt-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400  cursor-pointer"
                >
                    Anterior
                </button>
                <span className="px-3 py-1 text-xs text-neutral-500">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400  cursor-pointer"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default UserPage;