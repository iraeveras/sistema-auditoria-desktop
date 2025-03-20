// File: src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    sendLoginSuccess: (user: { name: string; token: string }) =>
        ipcRenderer.send('login-success', user),
    getUser: () => {
        return ipcRenderer.invoke('get-user');
    }
});