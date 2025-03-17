export {};

declare global {
    interface Window {
        electronAPI: {
            sendLoginSuccess: (user: {name: string; token: string}) => void;
            getUser: () => Promise<{ name: string; token: string } | null>;
        };
    }
}