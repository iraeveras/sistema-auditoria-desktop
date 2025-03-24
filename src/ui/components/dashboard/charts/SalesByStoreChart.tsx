// File: src/ui/components/SalesByStoreChart.tsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../../../services/axiosInstance';

interface Sale {
    id: number;
    valor: string;
    createdAt: string;
    auditoria?: {
        loja?: { id: number; name: string };
    };
}

interface SalesResponse {
    vendas: Sale[];
}

interface ChartDataItem {
    name: string;
    total: number;
}

const SalesByStoreChart: React.FC = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axiosInstance.get<SalesResponse>('/vendas');
                const sales = response.data.vendas;
                const data = sales.reduce((acc: Record<string, number>, sale: Sale) => {
                    const lojaName = sale.auditoria?.loja?.name || 'Desconhecida';
                    const valor = parseFloat(sale.valor);
                    acc[lojaName] = (acc[lojaName] || 0) + valor;
                    return acc;
                }, {});
                const formattedData = Object.entries(data).map(([name, total]) => ({ name, total }));
                setChartData(formattedData);
            } catch (error) {
                console.error('Erro ao buscar vendas por loja:', error);
            }
        };

        fetchSales();
    }, []);

    return (
        <div className="bg-transparent border border-neutral-400 shadow rounded p-4">
            <h2 className="text-sm font-bold mb-2">Vendas por Loja</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis className='text-xs' dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" barSize={10} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesByStoreChart;