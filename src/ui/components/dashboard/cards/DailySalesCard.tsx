import { Venda } from "../../../pages/DashboardPage";
import { isSameDay, parseISO } from "date-fns";

interface Props {
    vendas: Venda[];
}

export function DailySalesCard({ vendas }: Props) {
    const hoje = new Date();

    const totalDiario = vendas.reduce((acc, venda) => {
        const dataVenda = parseISO(venda.createdAt);
        if (isSameDay(dataVenda, hoje)) {
        return acc + parseFloat(venda.valor);
        }
        return acc;
    }, 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Vendas do Dia</h2>
        <p className="text-2xl font-bold text-blue-600 mt-2">
            R$ {totalDiario.toFixed(2)}
        </p>
        </div>
    );
}