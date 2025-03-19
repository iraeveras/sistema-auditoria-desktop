// File: src/ui/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";

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
        <div className="flex flex-col min-h-screen">
            <header className="py-3 p-4 bg-gray-800 text-white">Dashboard</header>
            <main className="flex-1 p-4">

            </main>
            <footer className="py-1 px-4 bg-gray-800 text-neutral-500">
                <label className="text-neutral-400 text-sm">usuário :</label>
                <span className="text-sm"> {userName}</span>
            </footer>
        </div>
    )
}

export default Dashboard;