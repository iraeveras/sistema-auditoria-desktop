// File: src/ui/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import SalesChartCard from "../components/dashboard/charts/SalesChartCard";
import SalesLineChartCard from "../components/dashboard/charts/SalesLineChartCard";
import TotalSalesCard from "../components/dashboard/cards/TotalSalesCard";
import SalesByStoreChart from "../components/dashboard/charts/SalesByStoreChart";

const Dashboard: React.FC = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        (async () => {
            const user = await window.electronAPI.getUser();
            if (user) {
                setUserName(user.name);
            }
        })();
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 overflow-hidden">
            <header className="fixed top-0 w-full z-10 py-3 p-4 bg-neutral-800 text-white">Dashboard</header>
            <main className="flex-1 mt-11 p-4 overflow-y-scroll mb-11">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="sm:cols-4 col-span-1">
                            <TotalSalesCard />
                        </div>
                        <div className="sm:cols-4 col-span-1">
                            <TotalSalesCard />
                        </div>
                        <div className="sm:cols-4 col-span-1">
                            <TotalSalesCard />
                        </div>
                        <div className="sm:cols-4 col-span-1">
                            <TotalSalesCard />
                        </div>

                    </div>
                    <div className="grid grid-cols-1 h-96 gap-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <SalesChartCard />
                            </div>
                            <div className="col-span-2">
                                <SalesLineChartCard />
                            </div>
                            <div className="col-span-1">
                                <SalesByStoreChart />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <SalesLineChartCard />
                            </div>
                            <div className="col-span-1">
                                <SalesChartCard />
                            </div>
                            <div className="col-span-1">
                                <SalesByStoreChart />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <SalesLineChartCard />
                            </div>
                            <div className="col-span-1">
                                <SalesChartCard />
                            </div>
                            <div className="col-span-1">
                                <SalesByStoreChart />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="fixed bottom-0 w-full py-0.5 px-4 bg-neutral-800 text-neutral-500">
                <label className="text-neutral-400 text-sm">usuário :</label>
                <span className="text-sm"> {userName}</span>
            </footer>
        </div>
    )
}

export default Dashboard;