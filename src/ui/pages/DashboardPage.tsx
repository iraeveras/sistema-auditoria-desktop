import { useEffect, useState } from "react";
import { TotalSalesCard } from "../components/dashboard/cards/TotalSalesCard";
import { DailySalesCard } from "../components/dashboard/cards/DailySalesCard";
import { WeeklySalesCard } from "../components/dashboard/cards/WeeklySalesCard";
import { MonthlySalesCard } from "../components/dashboard/cards/MonthlySalesCard";
import { AnnualSalesCard } from "../components/dashboard/cards/AnnualSalesCard";
import { SalesByStoreChart } from "../components/dashboard/charts/SalesByStoreChart";
import { SalesByAgeGroupChart } from "../components/dashboard/charts/SalesByAgeGroupChart";
import { SalesByGenderChart } from "../components/dashboard/charts/SalesByGenderChart";
import { SalesByPaymentMethodChart } from "../components/dashboard/charts/SalesByPaymentMethodChart";
import { SalesByExchangeChart } from "../components/dashboard/charts/SalesByExchangeChart";
import axiosInstance from "../../services/axiosInstance";
// import { ChartsTabsLayout } from "../components/tabsCharts/ChartsTabsLayout";

const API_BASE_URL = 'https://back-auditoria.onrender.com';

export interface Venda {
    id: number;
    valor: string;
    troca: boolean;
    faixaetaria: string;
    createdAt: string;
    auditoria: {
        data: string;
        loja: {
        name: string;
        };
    };
    formadepagamento: {
        name: string;
    };
    sexo: {
        name: string;
    };
    }

    export function DashboardPage() {
    const [vendas, setVendas] = useState<Venda[]>([]);

    useEffect(() => {
        axiosInstance
        .get(`${API_BASE_URL}/vendas`)
        .then((response) => {
            setVendas(response.data.vendas);
        })
        .catch((error) => {
            console.error("Erro ao buscar dados de vendas:", error);
        });
    }, []);

    return (
        <div className="p-4 space-y-3">
            <h1 className="text-2xl font-bold">Dashboard de Vendas</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <TotalSalesCard vendas={vendas} />
                <DailySalesCard vendas={vendas} />
                <WeeklySalesCard vendas={vendas} />
                <MonthlySalesCard vendas={vendas} />
                <AnnualSalesCard vendas={vendas} />

            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="cols-span-2">
                    <SalesByStoreChart vendas={vendas} />
                </div>
                <div className="cols-span-1">
                    <SalesByAgeGroupChart vendas={vendas} />
                </div>
                <div className="cols-span-1">

                    <SalesByGenderChart vendas={vendas} />
                </div>
                <SalesByPaymentMethodChart vendas={vendas} />
                <SalesByExchangeChart vendas={vendas} />
            </div>
        </div>
    );
}