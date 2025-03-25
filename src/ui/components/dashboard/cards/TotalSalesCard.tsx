// File: src/ui/components/TotalSalesCard.tsx
import { Venda } from "../../../pages/DashboardPage";

interface Props {
    vendas: Venda[];
}

export function TotalSalesCard({ vendas }: Props) {
    const total = vendas.reduce((acc, venda) => acc + parseFloat(venda.valor), 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Total Geral de Vendas</h2>
        <p className="text-2xl font-bold text-green-600 mt-2">
            R$ {total.toFixed(2)}
        </p>
        </div>
    );
}