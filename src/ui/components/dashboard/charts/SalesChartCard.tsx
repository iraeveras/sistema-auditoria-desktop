import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../../../services/axiosInstance';

interface Sale {
    id: number;
    valor: string;
    formadepagamento: {
        id: number;
        name: string;
    };
    // Outros campos que você julgar necessários...
}

interface SalesResponse {
    vendas: Sale[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

interface ChartDataItem {
    name: string;
    total: number;
}

const SalesChartCard: React.FC = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axiosInstance.get<SalesResponse>('/vendas');
                const sales = response.data.vendas;

                // Agrupa as vendas por forma de pagamento (pode ajustar conforme necessário)
                const grouped = sales.reduce((acc: Record<string, number>, sale: Sale) => {
                    const paymentName = sale.formadepagamento.name;
                    const value = parseFloat(sale.valor);
                    if (!acc[paymentName]) {
                        acc[paymentName] = value;
                    } else {
                        acc[paymentName] += value;
                    }
                    return acc;
                }, {});

                // Converte o objeto agrupado em um array para o Recharts
                const data: ChartDataItem[] = Object.entries(grouped).map(([key, value]) => ({
                    name: key,
                    total: value,
                }));

                setChartData(data);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
            }
        };

        fetchSalesData();
    }, []);

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-2">Vendas por Forma de Pagamento</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis className='text-xs' dataKey="name" />
                    <YAxis className='text-xs' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" barSize={20} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChartCard;