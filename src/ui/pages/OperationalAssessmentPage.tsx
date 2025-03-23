// File: src/ui/pages/OperationalAssessmentPage.tsx
import React, {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";


const API_BASE_URL = 'https://back-auditoria.onrender.com';

// const API_BASE_URL = process.env.URL_API;

interface OperationalAssessment {
    id: number;
    descricao: string;
    situacao: boolean;
}

const OperationalAssessmentPage: React.FC = () => {
    const [operationalAssessments, setOperationalAssessments] = useState<OperationalAssessment[]>([]);
    const [formData, setFormData] = useState({
        descricao: '', 
        situacao: true
    });

    const [editingOperationalAssessment, setEditingOperationalAssessment] = useState<OperationalAssessment | null>(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchOperationalAssessments = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/cadavoperacional`);
            console.log(response.data);
            
            if (response.data && response.data.cadavoperacional) {
                setOperationalAssessments(response.data.cadavoperacional);
            } else if (Array.isArray(response.data)) {
                setOperationalAssessments(response.data);
            } else {
                setOperationalAssessments([]);
            }
        } catch (err) {
            console.error('Erro ao buscar avaliação operacional', err);
            setError('Erro ao buscar pausas');
        }

    };

    useEffect(() => {
        fetchOperationalAssessments();
    }, []);

    const filteredOperationalAssessments = operationalAssessments.filter((operationalAssessment) => {
        const query = searchQuery.toLowerCase();
        return (
            operationalAssessment.descricao.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredOperationalAssessments.length / itemsPerPage);
    const paginatedOperationalAssessment = filteredOperationalAssessments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingOperationalAssessment) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/cadavoperacional/${editingOperationalAssessment.id}`, formData);
                await fetchOperationalAssessments();
                setEditingOperationalAssessment(null);
                setFormData({ descricao: '', situacao: true});
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar avaliação operacional', err);
                setError('Erro ao atualizar avaliação operacional');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/cadavoperacional`, formData);
                fetchOperationalAssessments();
                setFormData({ descricao: '', situacao: true});
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar avaliação operacional', err);
                setError('Erro ao criar avaliação operacional');
            }
        }
    };

    const handleEdit = (operationalAssessment: OperationalAssessment) => {
        setEditingOperationalAssessment(operationalAssessment);
        setFormData({ descricao: operationalAssessment.descricao, situacao: operationalAssessment.situacao });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir a avaliação operacional?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/cadavoperacional/${id}`);
            setOperationalAssessments(operationalAssessments.filter((operationalAssessment) => operationalAssessment.id !== id));
            setError('')
        } catch (err: any) {
            console.error('Erro ao excluir avaliação operacional', err);
            setError('Erro ao excluir avaliação operacional');
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
                <div className='w-full flex gap-2 mb-2'>
                    <div className="w-full flex flex-col mb-2 ">
                        {/* <label className="text-xs text-neutral-500">Nome do gênero:</label> */}
                        <input
                            type="text"
                            placeholder='Nova avaliação operacional'
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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

                <div className="flex gap-2 items-end justify-end">
                    <button
                        type="submit"
                        className="border border-blue-500 text-white text-xs px-2 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                    >
                        {editingOperationalAssessment ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {editingOperationalAssessment && (
                        <button
                        type="button"
                        onClick={() => {
                            setEditingOperationalAssessment(null);
                            setFormData({ descricao: '', situacao: true });
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
                    placeholder="Pesquisar avaliação operacional..."
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
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Descrição</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Status</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOperationalAssessment.map((operationalAssessment) => (
                        <tr key={operationalAssessment.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{operationalAssessment.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{operationalAssessment.descricao}</td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${operationalAssessment.situacao ? "text-green-600" : "text-red-400"}`}>{operationalAssessment.situacao ? 'Ativo' : 'Inativo'}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(operationalAssessment)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(operationalAssessment.id)}
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

export default OperationalAssessmentPage;