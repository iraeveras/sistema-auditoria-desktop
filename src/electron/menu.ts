// File: src/electron/menu.ts
import { BrowserWindow, Menu, app } from 'electron';

export const createMenu = () => {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Nova Janela',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        const newWindow = new BrowserWindow({
                            width: 600,
                            height: 600,
                            webPreferences: {
                                contextIsolation: true,
                                nodeIntegration: false,
                            },
                        });
                        newWindow.loadURL('http://localhost:5123/dashboard');
                    },
                },
                {
                    label: 'Abrir...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        console.log('Abrir arquivo...');
                    },
                },
                { type: 'separator'},
                {
                    label: 'Sair',
                    accelerator: 'CmdOrCtrl+Q',
                    role: 'quit',
                },
            ],
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Desfazer' },
                { role: 'redo', label: 'Refazer' },
                { type: 'separator' },
                { role: 'cut', label: 'Recortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Colar' },
                { role: 'delete', label: 'Excluir' },
                { role: 'selectAll', label: 'Selecionar Tudo' },
            ],
        },
        {
            label: 'Exibir',
            submenu: [
                { role: 'reload', label: 'Recarregar' },
                { role: 'forceReload', label: 'Forçar Recarregar' },
                { role: 'toggleDevTools', label: 'Toggle DevTools' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Resetar Zoom' },
                { role: 'zoomIn', label: 'Ampliar Zoom' },
                { role: 'zoomOut', label: 'Diminuir Zoom' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Tela Cheia' },
            ],
        },
        {
            label: 'Janela',
            submenu: [
                { role: 'minimize', label: 'Minimizar' },
                { role: 'close', label: 'Fechar Janela' },
                ],
            },
            {
                label: 'Ajuda',
                submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                    // Você pode abrir uma janela de "Sobre" ou redirecionar para uma URL
                    console.log('Exibindo informações sobre o aplicativo...');
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}