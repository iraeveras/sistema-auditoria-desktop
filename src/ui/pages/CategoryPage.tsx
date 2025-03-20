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
                    className="w-full p-1 border border-neutral-400 outline-none text-sm"
                />

                <button className="border border-blue-500 text-white text-sm p-1 cursor-pointer bg-blue-400 hover:bg-blue-500">
                    {editingCategory ? 'Atualizar' : 'Cadastrar'}
                </button>
                {editingCategory && (
                    <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="border border-gray-500 text-white text-sm p-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <table className="min-w-full bg-white border border-neutral-400">
                <thead>
                    <tr className="border border-neutral-400">
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-sm">#</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-sm">Categoria</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-sm">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id} className="border border-neutral-400">
                            <td className=" px-4 border border-neutral-400 text-sm">{cat.id}</td>
                            <td className="w-full px-4 border border-neutral-400 text-sm">{cat.name}</td>
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
        </div>
    )
};

export default Category;