// File: src/ui/pages/LojaPage.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { Transition } from '@headlessui/react';

const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Store {
    id: number;
    name: string;
    obs: string;
    situacao: boolean;
    tipo: boolean;
    codigo: number;
    luc: string;
    piso: string;
    createdAt: string;
    updatedAt: string;
}

const StorePage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        obs: '',
        situacao: true,
        tipo: true,
        codigo: '',
        luc: '',
        piso: ''
    });
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Função para buscar as lojas
    const fetchStores = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/loja`);
            if (response.data && response.data.loja) {
                setStores(response.data.loja);
            } else if (Array.isArray(response.data)) {
                setStores(response.data);
            } else {
                setStores([]);
            }
        } catch (err) {
            console.error('Erro ao buscar lojas', err);
            setError('Erro ao buscar lojas');
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Efeito para limpar a mensagem de erro após 3 segundos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Filtra as lojas com base no campo de pesquisa (por nome)
    const filteredStores = stores.filter((store) => {
        const query = searchQuery.toLowerCase();
        return store.name.toLowerCase().includes(query) || store.piso.toLowerCase().includes(query);
    });

    // Paginação
    const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
    const paginatedStores = filteredStores.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Converte o campo "codigo" para número (se fornecido)
        const dataToSend = {
            ...formData,
            codigo: formData.codigo ? Number(formData.codigo) : null,
        };

        if (editingStore) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/loja/${editingStore.id}`, dataToSend);
                await fetchStores();
                setEditingStore(null);
                setFormData({ name: '', obs: '', situacao: true, tipo: true, codigo: '', luc: '', piso: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar loja', err);
                setError('Erro ao atualizar loja');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/loja`, dataToSend);
                await fetchStores();
                setFormData({ name: '', obs: '', situacao: true, tipo: true, codigo: '', luc: '', piso: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar loja', err);
                setError('Erro ao criar loja');
            }
        }
    };

    const handleEdit = (store: Store) => {
        setEditingStore(store);
        setFormData({
            name: store.name,
            obs: store.obs,
            situacao: store.situacao,
            tipo: store.tipo,
            codigo: String(store.codigo),
            luc: store.luc,
            piso: store.piso,
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir esta loja?');
        if (!confirmed) return;
        try {
            await axiosInstance.delete(`${API_BASE_URL}/loja/${id}`);
            setStores(stores.filter((store) => store.id !== id));
            setError('');
        } catch (err: any) {
            console.error('Erro ao excluir loja', err);
            setError('Erro ao excluir loja');
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <Transition
                show={!!error}
                enter="transition-opacity duration-400"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-400"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <p className="w-full h-7 text-sm rounded bg-red-100 px-2 py-0.5 text-red-500 mb-4">
                    {error}
                </p>
            </Transition>

            <form onSubmit={handleSubmit} className="border-b border-neutral-400 mb-4 pb-4">
                <div className="grid grid-cols-1 gap-4">
                    <div className="w-full flex items-center gap-2">
                        <div className="w-full flex flex-col">
                            {/* <label className="text-xs text-neutral-600">Nome:</label> */}
                            <input
                                type="text"
                                placeholder="Nome da loja"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs text-neutral-600">Ativo?</label>
                            <input
                                type="checkbox"
                                checked={formData.situacao}
                                onChange={(e) => setFormData({ ...formData, situacao: e.target.checked })}
                                className="h-4 w-4"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-neutral-600">Tipo?</label>
                            <input
                                type="checkbox"
                                checked={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.checked })}
                                className="h-4 w-4"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {/* <label className="text-xs text-neutral-600">Código:</label> */}
                        <input
                            type="number"
                            placeholder="Código"
                            value={formData.codigo}
                            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                        />
                    </div>
                    <div className="flex flex-col">
                        {/* <label className="text-xs text-neutral-600">Luc:</label> */}
                        <input
                            type="text"
                            placeholder="Luc"
                            value={formData.luc}
                            onChange={(e) => setFormData({ ...formData, luc: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                        />
                    </div>
                    <div className="flex flex-col">
                        {/* <label className="text-xs text-neutral-600">Piso:</label> */}
                        <input
                            type="text"
                            placeholder="Piso"
                            value={formData.piso}
                            onChange={(e) => setFormData({ ...formData, piso: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                        />
                    </div>


                    <div className="flex flex-col">
                        <textarea
                            placeholder="Observação"
                            value={formData.obs}
                            onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                            className="px-2 py-1 h-24 border border-neutral-400 outline-none text-xs"
                            required
                        >
                        </textarea>
                    </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button
                        type="submit"
                        className="border border-blue-500 text-white text-xs px-4 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                    >
                        {editingStore ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {editingStore && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingStore(null);
                                setFormData({ name: '', obs: '', situacao: true, tipo: true, codigo: '', luc: '', piso: '' });
                            }}
                            className="border border-gray-500 text-white text-xs px-4 py-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Campo de pesquisa */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar lojas..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border border-neutral-400 outline-none text-xs px-2 py-1 w-full"
                />
            </div>

            <table className="min-w-full bg-white border border-neutral-400">
                <thead>
                    <tr className="border border-neutral-400">
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">#</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Loja</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Obs</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Código</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">MUC</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Piso</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Tipo</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedStores.map((store) => (
                        <tr key={store.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{store.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{store.name}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{store.obs}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{store.codigo}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{store.luc}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{store.piso}</td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${store.situacao ? 'text-green-600' : 'text-red-400'}`}>
                                {store.situacao ? 'Ativo' : 'Inativo'}
                            </td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${store.tipo ? 'text-green-600' : 'text-red-400'}`}>
                                {store.tipo ? 'Sim' : 'Não'}
                            </td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(store)}
                                    className="flex-1 text-white text-xs px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(store.id)}
                                    className="flex-1 text-white text-xs px-2 cursor-pointer"
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
                    className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400 cursor-pointer"
                >
                    Anterior
                </button>
                <span className="px-3 py-1 text-xs text-neutral-500">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 border border-neutral-400 cursor-pointer"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default StorePage;
