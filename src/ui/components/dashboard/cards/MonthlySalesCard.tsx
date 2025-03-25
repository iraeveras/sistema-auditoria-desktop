import { Venda } from "../../../pages/DashboardPage";
import { isSameMonth, parseISO } from "date-fns";

interface Props {
    vendas: Venda[];
}

export function MonthlySalesCard({ vendas }: Props) {
    const hoje = new Date();

    const totalMensal = vendas.reduce((acc, venda) => {
        const dataVenda = parseISO(venda.createdAt);
        if (isSameMonth(dataVenda, hoje)) {
        return acc + parseFloat(venda.valor);
        }
        return acc;
    }, 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Vendas do Mês</h2>
        <p className="text-2xl font-bold text-purple-600 mt-2">
            R$ {totalMensal.toFixed(2)}
        </p>
        </div>
    );
}