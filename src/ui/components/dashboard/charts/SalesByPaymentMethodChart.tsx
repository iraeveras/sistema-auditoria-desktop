import { Venda } from "../../../pages/DashboardPage";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    vendas: Venda[];
}

export function SalesByPaymentMethodChart({ vendas }: Props) {
    const dadosPorPagamento = vendas.reduce((acc, venda) => {
        const metodo = venda.formadepagamento.name.trim();
        const valor = parseFloat(venda.valor);

        const existente = acc.find((item) => item.metodo === metodo);
        if (existente) {
        existente.total += valor;
        } else {
        acc.push({ metodo, total: valor });
        }
        return acc;
    }, [] as { metodo: string; total: number }[]);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Vendas por Forma de Pagamento</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosPorPagamento} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metodo" className="text-sm" />
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    <Bar dataKey="total" barSize={20} fill="#14B8A6" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}