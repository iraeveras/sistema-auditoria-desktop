// File: src/ui/pages/AuditoriaPage.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FiEdit } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';

const API_BASE_URL = 'https://back-auditoria.onrender.com';

interface Loja {
    id: number;
    name: string;
}

interface Usuario {
    id?: number;
    name: string;
}

interface LoggedUser extends Usuario {
    token: string;
}

interface Auditoria {
    id: number;
    lojaId: number;
    usuarioId: number;
    criadorId: number;
    data: string;
    horaInicial: string;
    horaFinal: string;
    createdAt: string;
    updatedAt: string;
    loja?: Loja;
    usuario?: Usuario;
    criador?: Usuario;
}

const AuditPage: React.FC = () => {
    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [lojas, setLojas] = useState<Loja[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
    const [formData, setFormData] = useState({
        lojaId: '',
        usuarioId: '',
        data: '',
        horaInicial: '00:00',
        horaFinal: '00:00',
    });
    const [editingAuditoria, setEditingAuditoria] = useState<Auditoria | null>(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Busca o usuário logado via IPC e decodifica o token para extrair o id
    useEffect(() => {
        async function getLoggedUser() {
            try {
                const user = await window.electronAPI.getUser();
                if (user && user.token) {
                    // Importa dinamicamente o módulo jwt-decode e faz o cast para permitir indexação
                    const jwtModule = (await import('jwt-decode')) as { [key: string]: any };

                    // Acessa explicitamente a função jwtDecode exportada pelo módulo
                    const jwtDecodeFn = jwtModule.jwtDecode;
                    if (typeof jwtDecodeFn !== 'function') {
                        throw new Error('jwtDecode não é uma função');
                    }

                    // Define o tipo da função para que possamos usar argumentos de tipo
                    const typedJwtDecodeFn = jwtDecodeFn as <T>(token: string) => T;
                    const decoded = typedJwtDecodeFn<{ id: number }>(user.token);

                    // Utiliza Object.assign para garantir que o id seja incluído
                    const updatedUser = Object.assign({}, user, { id: decoded.id });
                    setLoggedUser(updatedUser);
                }
            } catch (err) {
                console.error('Erro ao importar ou utilizar jwt-decode:', err);
            }
        }
        getLoggedUser();
    }, []);

    // Busca auditorias
    const fetchAuditorias = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/auditoria`);
            if (Array.isArray(response.data)) {
                setAuditorias(response.data);
            } else if (response.data.auditoria) {
                setAuditorias(response.data.auditoria);
            } else {
                setAuditorias([]);
            }
        } catch (err) {
            console.error('Erro ao buscar auditorias', err);
            setError('Erro ao buscar auditorias');
        }
    };

    // Busca lojas
    const fetchLojas = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/loja`);
            if (response.data && response.data.loja) {
                setLojas(response.data.loja);
            } else if (Array.isArray(response.data)) {
                setLojas(response.data);
            } else {
                setLojas([]);
            }
        } catch (err) {
            console.error('Erro ao buscar lojas', err);
        }
    };

    // Busca usuários (auditores)
    const fetchUsuarios = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/usuarios`);
            if (response.data && response.data.users) {
                setUsuarios(response.data.users);
            } else if (Array.isArray(response.data)) {
                setUsuarios(response.data);
            } else {
                setUsuarios([]);
            }
        } catch (err) {
            console.error('Erro ao buscar usuários', err);
        }
    };

    useEffect(() => {
        fetchAuditorias();
        fetchLojas();
        fetchUsuarios();
    }, []);

    // Atualiza cada auditoria para incluir o objeto "criador" usando "criadorId"
    useEffect(() => {
        if (auditorias.length > 0 && usuarios.length > 0) {
            let shouldUpdate = false;
            const updatedAuditorias = auditorias.map(auditoria => {
                if (!auditoria.criador && auditoria.criadorId) {
                    const creator = usuarios.find(u => u.id === auditoria.criadorId);
                    if (creator) {
                        shouldUpdate = true;
                        return { ...auditoria, criador: creator };
                    }
                }
                return auditoria;
            });
            if (shouldUpdate) {
                setAuditorias(updatedAuditorias);
            }
        }
    }, [auditorias, usuarios]);

    // Limpa a mensagem de erro após 3 segundos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Filtra auditorias pelo nome da loja
    const filteredAuditorias = auditorias.filter((auditoria) => {
        const query = searchQuery.toLowerCase();
        return auditoria.loja?.name.toLowerCase().includes(query) || auditoria.usuario?.name.toLowerCase().includes(query) || auditoria.data?.toLowerCase().includes(query) || false;
    });

    const totalPages = Math.ceil(filteredAuditorias.length / itemsPerPage);
    const paginatedAuditorias = filteredAuditorias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedUser) {
            setError('Usuário não logado');
            return;
        }
        const dataToSend = {
            lojaId: formData.lojaId ? Number(formData.lojaId) : null,
            usuarioId: formData.usuarioId ? Number(formData.usuarioId) : null,
            criadorId: loggedUser.id, // Utiliza o id extraído do token
            data: formData.data,
            horaInicial: formData.horaInicial + ':00',
            horaFinal: formData.horaFinal + ':00',
        };

        if (editingAuditoria) {
            try {
                await axiosInstance.put(`${API_BASE_URL}/auditoria/${editingAuditoria.id}`, dataToSend);
                await fetchAuditorias();
                setEditingAuditoria(null);
                setFormData({ lojaId: '', usuarioId: '', data: '', horaInicial: '00:00', horaFinal: '00:00' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao atualizar auditoria', err);
                setError('Erro ao atualizar auditoria');
            }
        } else {
            try {
                await axiosInstance.post(`${API_BASE_URL}/auditoria`, dataToSend);
                await fetchAuditorias();
                setFormData({ lojaId: '', usuarioId: '', data: '', horaInicial: '00:00', horaFinal: '00:00' });
                setError('');
            } catch (err: any) {
                console.error('Erro ao criar auditoria', err);
                setError('Erro ao criar auditoria');
            }
        }
    };

    const handleEdit = (auditoria: Auditoria) => {
        setEditingAuditoria(auditoria);
        setFormData({
            lojaId: String(auditoria.lojaId),
            usuarioId: String(auditoria.usuarioId),
            data: auditoria.data.split('T')[0],
            horaInicial: auditoria.horaInicial.slice(0, 5),
            horaFinal: auditoria.horaFinal.slice(0, 5),
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Deseja realmente excluir essa auditoria?');
        if (!confirmed) return;
        try {
            await axiosInstance.delete(`${API_BASE_URL}/auditoria/${id}`);
            await fetchAuditorias();
            setError('');
        } catch (err: any) {
            console.error('Erro ao excluir auditoria', err);
            setError('Erro ao excluir auditoria');
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            {error && (
                <p className="w-full h-7 text-sm rounded bg-red-100 px-2 py-0.5 text-red-500 mb-4 transition-opacity duration-300 ease-in-out">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="border-b border-neutral-400 mb-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Select para Loja */}
                    <div className="flex flex-col">
                        <label className="text-xs text-neutral-600">Loja:</label>
                        <select
                            value={formData.lojaId}
                            onChange={(e) => setFormData({ ...formData, lojaId: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        >
                            <option value="">Selecione uma loja</option>
                            {lojas.map((loja) => (
                                <option key={loja.id} value={loja.id}>
                                    {loja.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Select para Auditor */}
                    <div className="flex flex-col">
                        <label className="text-xs text-neutral-600">Auditor:</label>
                        <select
                            value={formData.usuarioId}
                            onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        >
                            <option value="">Selecione um auditor</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Campo de data */}
                    <div className="flex flex-col">
                        <label className="text-xs text-neutral-600">Data:</label>
                        <input
                            type="date"
                            value={formData.data}
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
                    </div>
                    {/* Campo de hora inicial */}
                    <div className="flex flex-col">
                        <label className="text-xs text-neutral-600">Hora Inicial:</label>
                        <input
                            type="time"
                            value={formData.horaInicial}
                            onChange={(e) => setFormData({ ...formData, horaInicial: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
                    </div>
                    {/* Campo de hora final */}
                    <div className="flex flex-col">
                        <label className="text-xs text-neutral-600">Hora Final:</label>
                        <input
                            type="time"
                            value={formData.horaFinal}
                            onChange={(e) => setFormData({ ...formData, horaFinal: e.target.value })}
                            className="px-2 py-1 border border-neutral-400 outline-none text-xs"
                            required
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button
                        type="submit"
                        className="border border-blue-500 text-white text-xs px-4 py-1 cursor-pointer bg-blue-400 hover:bg-blue-500"
                    >
                        {editingAuditoria ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {editingAuditoria && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingAuditoria(null);
                                setFormData({ lojaId: '', usuarioId: '', data: '', horaInicial: '00:00', horaFinal: '00:00' });
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
                    placeholder="Pesquisar auditorias por Loja ou Auditor ou data ( aaaa-mm-dd )..."
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
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Auditor</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Criador</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Data</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Hora Inicial</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Hora Final</th>
                        <th className="py-1 bg-neutral-300 px-2 border border-neutral-400 text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAuditorias.map((auditoria) => (
                        <tr key={auditoria.id} className="border border-neutral-400">
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.id}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.loja ? auditoria.loja.name : 'N/A'}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.usuario ? auditoria.usuario.name : 'N/A'}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.criador ? auditoria.criador.name : 'N/A'}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{new Date(auditoria.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.horaInicial}</td>
                            <td className="px-4 border border-neutral-400 text-xs">{auditoria.horaFinal}</td>
                            <td className="flex py-1 px-2 border border-neutral-200 justify-center">
                                <button
                                    onClick={() => handleEdit(auditoria)}
                                    className="flex-1 text-white text-xs px-2 cursor-pointer mr-1"
                                >
                                    <FiEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(auditoria.id)}
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

export default AuditPage;