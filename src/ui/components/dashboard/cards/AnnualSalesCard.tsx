import { Venda } from "../../../pages/DashboardPage";
import { parseISO } from "date-fns";

interface Props {
    vendas: Venda[];
}

export function AnnualSalesCard({ vendas }: Props) {
    const anoAtual = new Date().getFullYear();

    const totalAnual = vendas.reduce((acc, venda) => {
        const dataVenda = parseISO(venda.createdAt);
        if (dataVenda.getFullYear() === anoAtual) {
        return acc + parseFloat(venda.valor);
        }
        return acc;
    }, 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Vendas do Ano</h2>
        <p className="text-2xl font-bold text-yellow-600 mt-2">
            R$ {totalAnual.toFixed(2)}
        </p>
        </div>
    );
}