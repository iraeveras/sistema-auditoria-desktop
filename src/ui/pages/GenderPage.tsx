import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";


const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Gender {
    id: number;
    name: string;
    situacao: boolean;
}

const GenderPage: React.FC = () => {
    const [genres, setGenres] = useState<Gender[]>([]);
    const [formData, setFormData] = useState({ 
        name: '', 
        situacao: true
    });
    const [editingGender, setEditingGender] = useState<Gender | null>(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchGenres = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/cadsexo`);
            if (response.data && response.data.cadsexo) {
                setGenres(response.data.cadsexo);
            } else if (Array.isArray(response.data)) {
                setGenres(response.data);
            } else {
                setGenres([]);
            }
        } catch (err) {
            console.error('Erro ao buscar gêneros', err);
            setError('Erro ao buscar gêneros');
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const filteredGenres = genres.filter((gender) => {
        const query = searchQuery.toLowerCase();
        return(
            gender.name.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredGenres.length / itemsPerPage);
    const paginatedGenres = filteredGenres.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // const dataToSend = {...formData}
        if (editingGender) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/cadsexo/${editingGender.id}`, formData);
                await fetchGenres();
                setEditingGender(null);
                setFormData({ name: '', situacao: true });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar gênero', err);
                setError(err.response?.data?.error || 'Erro ao atualizar gênero')
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/cadsexo`, formData);
                fetchGenres();
                setFormData({ name: '', situacao: true });
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar gênero', err);
                setError(err.response?.data?.error || 'Erro ao criar gênero');
            }
        }
    };

    const handleEdit = (gender: Gender) => {
        setEditingGender(gender);
        setFormData({ name: gender.name, situacao: gender.situacao });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir gênero?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/cadsexo/${id}`);
            setGenres(genres.filter((gender) => gender.id !== id));
            setError('');
        } catch (err: any) {
            console.error('Erro ao excluir gênero', err);
            setError(err.response?.data?.error || 'Erro ao excluir gênero');
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className='p-4'>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="border-b border-b-neutral-400 mb-4 pb-4">
                <div className='w-full flex items-center gap-2 '>
                    <div className="w-96 flex flex-col justify-center ">
                        {/* <label className="text-xs text-neutral-500">Nome do gênero:</label> */}
                        <input
                            type="text"
                            placeholder='Novo do gênero'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
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

                    <div className="flex gap-2 items-end justify-end">
                        <button
                            type="submit"
                            className="border border-blue-500 text-white text-xs px-2 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                        >
                            {editingGender ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingGender && (
                            <button
                            type="button"
                            onClick={() => {
                                setEditingGender(null);
                                setFormData({ name: '', situacao: true });
                            }}
                            className="border border-gray-500 text-white text-xs px-2 py-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
                            >
                            Cancelar
                            </button>
                        )}
                    </div>
                </div>

                
            </form>

            {/* Campo de pesquisa */}
            <div className="mb-4 ">
                <input
                    type="text"
                    placeholder="Pesquisar gênero..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reinicia para a página 1 quando a pesquisa muda
                    }}
                    className="border border-neutral-400 outline-none text-xs px-2 py-1 w-full"
                />
            </div>

            <table className="min-w-full bg-white border border-neutral-400">
                <thead >
                    <tr className="border border-neutral-400">
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">#</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Nome gênero</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedGenres.map((gender) => (
                        <tr key={gender.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{gender.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{gender.name}</td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${gender.situacao ? "text-green-600" : "text-red-400"}`}>{gender.situacao ? 'Ativo' : 'Inativo'}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(gender)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(gender.id)}
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
    )
}

export default GenderPage;