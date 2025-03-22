import React, {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";


const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface PaymentMethod {
    id: number;
    name: string;
    situacao: boolean;
}

const PaymentMethodPage: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        situacao: true
    });

    const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchPaymentMethods = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/formadepagamento`);
            if (response.data && response.data.formadepagamento) {
                setPaymentMethods(response.data.formadepagamento);
            } else if (Array.isArray(response.data)) {
                setPaymentMethods(response.data);
            } else {
                setPaymentMethods([]);
            }
        } catch (err) {
            console.error('Erro ao buscar formas de pagamentos', err);
            setError('Erro ao buscar formas de pagamentos');
        }

    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const filteredPaymentMethod = paymentMethods.filter((paymentMethod) => {
        const query = searchQuery.toLowerCase();
        return (
            paymentMethod.name.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredPaymentMethod.length / itemsPerPage);
    const paginatedPaymentMethod = filteredPaymentMethod.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPaymentMethod) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/formadepagamento/${editingPaymentMethod.id}`, formData);
                await fetchPaymentMethods();
                setEditingPaymentMethod(null);
                setFormData({ name: '', situacao: true });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar forma de pagamento', err);
                setError('Erro ao atualizar forma de pagamento');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/formadepagamento`, formData);
                fetchPaymentMethods();
                setFormData({name: '', situacao: true});
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar forma de pagamento', err);
                setError('Erro ao criar forma de pagamento');
            }
        }
    };

    const handleEdit = (paymentMethod: PaymentMethod) => {
        setEditingPaymentMethod(paymentMethod);
        setFormData({name: paymentMethod.name, situacao: paymentMethod.situacao});
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir forma de pagamento?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`${API_BASE_URL}/formadepagamento/${id}`);
            setPaymentMethods(paymentMethods.filter((paymentMethod) => paymentMethod.id !== id));
            setError('')
        } catch (err: any) {
            console.error('Erro ao excluir forma de pagamento', err);
            setError('Erro ao excluir forma de pagamento');
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
                            placeholder='Nova forma de pagamento'
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
                            {editingPaymentMethod ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingPaymentMethod && (
                            <button
                            type="button"
                            onClick={() => {
                                setEditingPaymentMethod(null);
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
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Forma de pagamento</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Situação</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPaymentMethod.map((paymentMethod) => (
                        <tr key={paymentMethod.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{paymentMethod.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{paymentMethod.name}</td>
                            <td className={`px-4 border border-neutral-400 text-xs font-medium ${paymentMethod.situacao ? "text-green-600" : "text-red-400"}`}>{paymentMethod.situacao ? 'Ativo' : 'Inativo'}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(paymentMethod)}
                                    className="flex-1 text-white text-sm px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(paymentMethod.id)}
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

export default PaymentMethodPage;