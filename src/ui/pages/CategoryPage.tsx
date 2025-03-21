// File: src/ui/pages/CategoryPage.tsx
import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import axiosInstance from "../../services/axiosInstance";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

const Category: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [error, setError] = useState('');

    // Estados para pesquisa e paginação
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Quantos itens por página

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/categorias`);
            if (response.data && response.data.cats) {
                setCategories(response.data.cats);
            } else if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error('Erro ao buscar categorias', err);
            setError('Erro ao buscar categorias');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filtrando os usuários com base na pesquisa
    const filteredCategories = categories.filter((category) => {
        const query = searchQuery.toLowerCase();
        return (
            category.name.toLowerCase().includes(query)
        );
    });

    // Cálculo para paginação
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/categorias`, { name: newCategoryName });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
            setError('');
        } catch (err) {
            console.error('Erro ao criar categoria', err);
            setError('Erro ao criar categoria');
        }
    };

    const handleEditCategory = (cat: Category) => {
        setEditingCategory(cat);
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.name.trim()) return;

        const confirm = window.confirm('Deseja realmente editar esta categoria?');
        if (!confirm) return;

        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/categorias/${editingCategory.id}`, { name: editingCategory.name });
            setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
            setEditingCategory(null);
            setError('');
        } catch (err) {
            console.error('Erro ao atualizar categoria', err);
            setError('Erro ao atualizar categoria');
        }
    };

    const handleDeleteCategory = async (id: number) => {
        const confirm = window.confirm('Deseja realmente excluir esta categoria?');
        if (!confirm) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/categorias/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
            setError('');
        } catch (err) {
            console.error('Erro ao excluir categoria', err);
            setError('Erro ao excluir categoria');
        }
    };

    // Funções para mudar de página
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <Helmet>
                <title>Cadastro de Categoria</title>
            </Helmet>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="flex items-center justify-between border-b border-b-neutral-400 mb-4 pb-4 gap-2"
            >
                <input
                    type="text"
                    value={editingCategory ? editingCategory.name : newCategoryName}
                    onChange={(e) => {
                        if (editingCategory) {
                            setEditingCategory({ ...editingCategory, name: e.target.value });
                        } else {
                            setNewCategoryName(e.target.value);
                        }
                    }}
                    placeholder="Nome da categoria"
                    className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                />

                <button className="border border-blue-500 text-white text-xs p-1 cursor-pointer bg-blue-400 hover:bg-blue-500">
                    {editingCategory ? 'Atualizar' : 'Cadastrar'}
                </button>
                {editingCategory && (
                    <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="border border-gray-500 text-white text-xs p-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            {/* Campo de pesquisa */}
            <div className="mb-4 ">
                <input
                    type="text"
                    placeholder="Pesquisar categoria..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reinicia para a página 1 quando a pesquisa muda
                    }}
                    className="px-2 py-1 w-full border border-neutral-400 outline-none text-xs"
                />
            </div>

            <table className="min-w-full bg-white border border-neutral-400">
                <thead>
                    <tr className="border border-neutral-400">
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">#</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Grupo</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCategories.map(cat => (
                        <tr key={cat.id} className="border border-neutral-400">
                            <td className=" px-4 border border-neutral-400 text-xs">{cat.id}</td>
                            <td className="w-full px-4 border border-neutral-400 text-xs">{cat.name}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEditCategory(cat)}
                                    className="flex-1  text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="flex-1  text-white text-sm px-2 cursor-pointer"
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
                    className="px-2 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400  cursor-pointer"
                >
                    Anterior
                </button>
                <span className="text-xs px-2 py-1 text-neutral-500">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400  cursor-pointer"
                >
                    Próxima
                </button>
            </div>
        </div>
    )
};

export default Category;