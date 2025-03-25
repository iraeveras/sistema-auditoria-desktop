// File: src/ui/components/SalesByStoreChart.tsx
import { Venda } from "../../../pages/DashboardPage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    vendas: Venda[];
}

export function SalesByStoreChart({ vendas }: Props) {
    const dadosPorLoja = vendas.reduce((acc, venda) => {
    const loja = venda.auditoria.loja.name.trim();
    const valor = parseFloat(venda.valor);

    const lojaExistente = acc.find((item) => item.loja === loja);
    if (lojaExistente) {
        lojaExistente.total += valor;
        } else {
        acc.push({ loja, total: valor });
        }
        return acc;
    }, [] as { loja: string; total: number }[]);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Vendas por Loja</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosPorLoja} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" className="text-sm" />
                    <YAxis dataKey="loja" type="category" className="text-sm" />
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    <Bar dataKey="total" barSize={20} fill="#4F46E5" radius={[0, 5, 5, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}