import { Venda } from "../../../pages/DashboardPage";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface Props {
    vendas: Venda[];
}

const cores = ["#4F46E5", "#EC4899", "#10B981", "#F59E0B"];

export function SalesByAgeGroupChart({ vendas }: Props) {
    const dadosPorFaixa = vendas.reduce((acc, venda) => {
        const faixa = venda.faixaetaria.toLowerCase();
        const valor = parseFloat(venda.valor);

        const faixaExistente = acc.find((item) => item.faixa === faixa);
        if (faixaExistente) {
        faixaExistente.total += valor;
        } else {
        acc.push({ faixa, total: valor });
        }
        return acc;
    }, [] as { faixa: string; total: number }[]);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Vendas por Faixa Etária</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={dadosPorFaixa}
                        dataKey="total"
                        nameKey="faixa"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ faixa, total }) => `${faixa}: R$ ${total.toFixed(2)}`}
                    >
                        {dadosPorFaixa.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}