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
            <header className="p-4 bg-gray-800 text-white">Dashboard</header>
            <main className="flex-1 p-4">
                <h1>Bem-vindo, {userName}</h1>
            </main>
            <footer>
                Usuário: {userName}
            </footer>
        </div>
    )
}

export default Dashboard;