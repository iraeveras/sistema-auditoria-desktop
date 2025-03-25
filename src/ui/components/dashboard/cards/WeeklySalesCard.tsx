import { Venda } from "../../../pages/DashboardPage";
import { isSameWeek, parseISO } from "date-fns";

interface Props {
    vendas: Venda[];
}

export function WeeklySalesCard({ vendas }: Props) {
    const hoje = new Date();

    const totalSemanal = vendas.reduce((acc, venda) => {
        const dataVenda = parseISO(venda.createdAt);
        if (isSameWeek(dataVenda, hoje, { weekStartsOn: 1 })) {
        return acc + parseFloat(venda.valor);
        }
        return acc;
    }, 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Vendas da Semana</h2>
        <p className="text-2xl font-bold text-indigo-600 mt-2">
            R$ {totalSemanal.toFixed(2)}
        </p>
        </div>
    );
}