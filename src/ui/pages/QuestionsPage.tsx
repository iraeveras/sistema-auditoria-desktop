// File: src/ui/pages/QuestionsPage.tsx
import React, {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { Transition } from '@headlessui/react';


const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Cadavoperacional {
    id: number;
    descricao: string;
    situacao: boolean;
}

interface Question {
    id: number;
    name: string;
    situacao: boolean;
    cadavoperacionalId: number;
    cadavoperacional?: Cadavoperacional;
    createdAt: string;
    updatedAt: string;
}

const QuestionsPage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [operacionais, setOperacionais] = useState<Cadavoperacional[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        situacao: true,
        cadavoperacionalId: '',
    });

    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchQuestions = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/cadquestoes`);
            if (response.data && response.data.cadquestoes) {
                setQuestions(response.data.cadquestoes);
            } else if (Array.isArray(response.data)) {
                setQuestions(response.data);
            } else {
                setQuestions([]);
            }
        } catch (err) {
            console.error('Erro ao buscar questões cadastradas', err);
            setError('Erro ao buscar questões cadastradas');
        }
    };

      // Busca os operacionais para preencher o select
    const fetchOperacionais = async () => {
        try {
        const response = await axiosInstance.get(`${API_BASE_URL}/cadavoperacional`);
        if (response.data && response.data.cadavoperacional) {
            setOperacionais(response.data.cadavoperacional);
        } else if (Array.isArray(response.data)) {
            setOperacionais(response.data);
        } else {
            setOperacionais([]);
        }
        } catch (err) {
        console.error('Erro ao buscar operacionais', err);
        }
    };

    useEffect(() => {
        fetchQuestions();
        fetchOperacionais();
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const filteredQuestions = questions.filter((question) => {
        const query = searchQuery.toLowerCase();
        return question.name.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const paginatedQuestion = filteredQuestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            cadavoperacionalId: formData.cadavoperacionalId ? Number(formData.cadavoperacionalId) : null,
        };

        if (editingQuestion) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/cadquestoes/${editingQuestion.id}`, dataToSend);
                await fetchQuestions();
                setEditingQuestion(null);
                setFormData({ name: '', situacao: true, cadavoperacionalId: '' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar questão', err);
                setError('Erro ao atualizar questão');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/cadquestoes`, dataToSend);
                fetchQuestions();
                setFormData({name: '', situacao: true, cadavoperacionalId: ''});
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar questão', err);
                setError('Erro ao criar questão');
            }
        }
    };

    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        setFormData({
            name: question.name, 
            situacao: question.situacao,
            cadavoperacionalId: question.cadavoperacional ? String(question.cadavoperacional.id) : '',
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir questão?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/cadquestoes/${id}`);
            setQuestions(questions.filter((question) => question.id !== id));
            setError('')
        } catch (err: any) {
            console.error('Erro ao excluir questão', err);
            setError('Erro ao excluir questão');
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className='p-4'>
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
            <form onSubmit={handleSubmit} className="border-b border-b-neutral-400 mb-4 pb-4">
                <div className='w-full flex flex-col  gap-2'>
                    <div className="w-full flex gap-2">
                        <div className="w-full flex flex-col justify-center ">
                            {/* <label className="text-xs text-neutral-500">Nome do gênero:</label> */}
                            <input
                                type="text"
                                placeholder='Nova questão'
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
                    <div className="w-full flex flex-col mb-4">
                        <label className="text-xs text-neutral-500">Operacional</label>
                        <select
                        value={formData.cadavoperacionalId}
                        onChange={(e) => setFormData({ ...formData, cadavoperacionalId: e.target.value })}
                        className="w-full px-2 py-1 border border-neutral-400 outline-none text-xs"
                        required
                        >
                        <option value="">Selecione um operacional</option>
                        {operacionais.map((op) => (
                            <option key={op.id} value={op.id}>
                            {op.descricao}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="flex gap-2 items-end justify-end">
                        <button
                            type="submit"
                            className="border border-blue-500 text-white text-xs px-2 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                        >
                            {editingQuestion ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingQuestion && (
                            <button
                            type="button"
                            onClick={() => {
                                setEditingQuestion(null);
                                setFormData({ name: '', situacao: true, cadavoperacionalId: '' });
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
                    placeholder="Pesquisar questões..."
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
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Questões</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Operacional</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedQuestion.map((question) => (
                        <tr key={question.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{question.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{question.name}</td>
                            <td className="px-4 border border-neutral-400 text-xs">
                                {question.cadavoperacional ? question.cadavoperacional.descricao : 'N/A'}
                            </td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${question.situacao ? "text-green-600" : "text-red-400"}`}>{question.situacao ? 'Ativo' : 'Inativo'}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(question)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(question.id)}
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

export default QuestionsPage;