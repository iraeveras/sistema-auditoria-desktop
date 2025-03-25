import { Venda } from "../../../pages/DashboardPage";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface Props {
    vendas: Venda[];
}

const coresGenero = ["#6366F1", "#F472B6", "#22D3EE"];

export function SalesByGenderChart({ vendas }: Props) {
    const dadosPorGenero = vendas.reduce((acc, venda) => {
        const genero = venda.sexo.name.trim();
        const valor = parseFloat(venda.valor);

        const existente = acc.find((item) => item.genero === genero);
        if (existente) {
        existente.total += valor;
        } else {
        acc.push({ genero, total: valor });
        }
        return acc;
    }, [] as { genero: string; total: number }[]);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-[400px]">
        <h2 className="text-lg font-semibold mb-4">Vendas por Gênero</h2>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={dadosPorGenero}
                dataKey="total"
                nameKey="genero"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ genero, total }) => `${genero}: R$ ${total.toFixed(2)}`}
            >
                {dadosPorGenero.map((_, index) => (
                <Cell key={`cell-${index}`} fill={coresGenero[index % coresGenero.length]} />
                ))}
            </Pie>
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
}