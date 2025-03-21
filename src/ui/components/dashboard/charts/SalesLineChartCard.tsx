import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../../../services/axiosInstance';

interface Sale {
    id: number;
    valor: string;
    createdAt: string;
    // Outros campos...
}

interface SalesResponse {
    vendas: Sale[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

interface ChartDataItem {
    date: string;
    total: number;
}

const SalesLineChartCard: React.FC = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axiosInstance.get<SalesResponse>('/vendas');
                const sales = response.data.vendas;

                // Agrupa as vendas por data (aqui, formatamos a data para 'YYYY-MM-DD')
                const grouped = sales.reduce((acc: Record<string, number>, sale: Sale) => {
                    const date = new Date(sale.createdAt).toISOString().split('T')[0];
                    const value = parseFloat(sale.valor);
                    if (!acc[date]) {
                        acc[date] = value;
                    } else {
                        acc[date] += value;
                    }
                    return acc;
                }, {});

                const data: ChartDataItem[] = Object.entries(grouped)
                    .map(([date, total]) => ({ date, total }))
                    .sort((a, b) => (a.date > b.date ? 1 : -1));

                setChartData(data);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
            }
        };

        fetchSalesData();
    }, []);

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-2">Vendas ao Longo do Tempo</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis className='text-xs' dataKey="date" />
                    <YAxis className='text-xs' />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesLineChartCard;