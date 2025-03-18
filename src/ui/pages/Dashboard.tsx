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
                
            </main>
            <footer className="p-4 bg-gray-800 text-neutral-500">
                <span className="text-neutral-400">Usuário :</span> {userName}
            </footer>
        </div>
    )
}

export default Dashboard;