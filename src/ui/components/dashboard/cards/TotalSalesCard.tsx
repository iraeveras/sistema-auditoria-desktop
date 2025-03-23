// File: src/ui/components/TotalSalesCard.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/axiosInstance';

interface Sale {
    id: number;
    valor: string;
}

interface SalesResponse {
    vendas: Sale[];
}

const TotalSalesCard: React.FC = () => {
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await axiosInstance.get<SalesResponse>('/vendas');
                const sales = response.data.vendas;
                const total = sales.reduce((acc, sale) => acc + parseFloat(sale.valor), 0);
                setTotalSales(total);
            } catch (error) {
                console.error('Erro ao buscar vendas para total acumulado:', error);
            }
        };

        fetchTotalSales();
    }, []);

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-bold mb-2">Total Acumulado</h2>
            <p className="text-lg">{totalSales.toFixed(2)}</p>
        </div>
    );
};

export default TotalSalesCard;