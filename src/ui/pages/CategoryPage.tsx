// File: src/ui/pages/CategoryPage.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

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
            <h1 className="text-2xl font-bold mb-4">Cadastro de Categoria</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="mb-4 flex items-center"
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
                    className="border p-2 mr-2 flex-1"
                />

                <button>
                    {editingCategory ? 'Atualizar' : 'Cadastrar'}
                </button>
                {editingCategory && (
                    <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="bg-gray-500 text-white px-4 py-2 ml-2"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border">Nome</th>
                        <th className="py-2 px-4 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td className="py-2 px-4 border">{cat.id}</td>
                            <td className="py-2 px-4 border">{cat.name}</td>
                            <td className="py-2 px-4 border">
                                <button
                                    onClick={() => handleEditCategory(cat)}
                                    className="bg-green-500 text-white px-2 py-1 mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="bg-red-500 text-white px-2 py-1"
                                >
                                    Excluir
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