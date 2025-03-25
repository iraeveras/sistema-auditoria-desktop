import { Venda } from "../../../pages/DashboardPage";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    vendas: Venda[];
}

export function SalesByExchangeChart({ vendas }: Props) {
    const dadosTroca = vendas.reduce(
        (acc, venda) => {
        const valor = parseFloat(venda.valor);
        if (venda.troca) {
            acc.comTroca += valor;
        } else {
            acc.semTroca += valor;
        }
        return acc;
        },
        { comTroca: 0, semTroca: 0 }
    );

    const data = [
        { tipo: "Com Troca", total: dadosTroca.comTroca },
        { tipo: "Sem Troca", total: dadosTroca.semTroca },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Vendas com e sem Troca</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" className="text-sm" />
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    <Bar dataKey="total" fill="#F97316" barSize={20} radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}