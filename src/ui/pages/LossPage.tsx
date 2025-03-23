import React, {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";


const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Loss {
    id: number;
    name: string;
    situacao: boolean;
    obs: string;
}

const LossPage: React.FC = () => {
    const [losses, setLosses] = useState<Loss[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        situacao: true,
        obs: ''
    });

    const [editingLoss, setEditingLoss] = useState<Loss | null>(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchLosses = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/motivoperdas`);
            console.log(response.data);
            
            if (response.data && response.data.motivoperdas) {
                setLosses(response.data.motivoperdas);
            } else if (Array.isArray(response.data)) {
                setLosses(response.data);
            } else {
                setLosses([]);
            }
        } catch (err) {
            console.error('Erro ao buscar pausas', err);
            setError('Erro ao buscar pausas');
        }

    };

    useEffect(() => {
        fetchLosses();
    }, []);

    const filteredLosses = losses.filter((loss) => {
        const query = searchQuery.toLowerCase();
        return (
            loss.name.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredLosses.length / itemsPerPage);
    const paginatedLoss = filteredLosses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLoss) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/motivoperdas/${editingLoss.id}`, formData);
                await fetchLosses();
                setEditingLoss(null);
                setFormData({ name: '', situacao: true, obs: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar motivo de perdas', err);
                setError('Erro ao atualizar motivo de perdas');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/motivoperdas`, formData);
                fetchLosses();
                setFormData({name: '', situacao: true, obs: ''});
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar motivo de perdas', err);
                setError('Erro ao criar motivo de perdas');
            }
        }
    };

    const handleEdit = (loss: Loss) => {
        setEditingLoss(loss);
        setFormData({name: loss.name, situacao: loss.situacao, obs: loss.obs });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir o motivo de perda?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/motivoperdas/${id}`);
            setLosses(losses.filter((loss) => loss.id !== id));
            setError('')
        } catch (err: any) {
            console.error('Erro ao excluir motivo de perdas', err);
            setError('Erro ao excluir motivo de perdas');
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className='p-4'>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="border-b border-b-neutral-300 mb-4 pb-4">
                <div className='w-full flex gap-2 '>
                    <div className="w-full flex flex-col mb-2 ">
                        {/* <label className="text-xs text-neutral-500">Nome do gênero:</label> */}
                        <input
                            type="text"
                            placeholder='Novo motivo de perda'
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
                </div>

                <div className="w-full mb-2">
                    <textarea 
                        value={formData.obs} 
                        onChange={(e) => 
                            setFormData({...formData, obs: e.target.value})
                        } 
                        className='w-full h-28 px-2 py-1 border border-neutral-400 outline-none text-xs' placeholder='Observação'
                    >
                    </textarea>
                </div>

                <div className="flex gap-2 items-end justify-end">
                    <button
                        type="submit"
                        className="border border-blue-500 text-white text-xs px-2 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                    >
                        {editingLoss ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {editingLoss && (
                        <button
                        type="button"
                        onClick={() => {
                            setEditingLoss(null);
                            setFormData({ name: '', situacao: true, obs: '' });
                        }}
                        className="border border-gray-500 text-white text-xs px-2 py-1 cursor-pointer bg-gray-400 hover:bg-gray-500"
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
                    placeholder="Pesquisar motivo de perda..."
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
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Motivo de perdas</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Observação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLoss.map((loss) => (
                        <tr key={loss.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{loss.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{loss.name}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{loss.obs}</td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${loss.situacao ? "text-green-600" : "text-red-400"}`}>{loss.situacao ? 'Ativo' : 'Inativo'}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(loss)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(loss.id)}
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

export default LossPage;