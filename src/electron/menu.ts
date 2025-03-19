// File: src/electron/menu.ts
import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Definindo __filename e __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let parentWindow: BrowserWindow | null = null;

export const setParentWindow = (win: BrowserWindow) => {
    parentWindow = win;
};

/**
 * Função auxiliar para criar uma nova janela (child window) que carrega uma rota específica.
 * Essa janela ocultará o menu (autoHideMenuBar: true) para que o menu global apareça somente na janela principal.
 * @param route Rota da aplicação React (ex: '/cadastros/categoria')
 * @param title Título da nova janela
 */
export function createChildWindow(route: string, title: string) {
    const childWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title,
        parent: parentWindow || undefined,
        modal: false,
        autoHideMenuBar: true, // Oculta o menu nessa janela
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
        },
    });

    // Em desenvolvimento, a URL é a do Vite; em produção, utilize loadFile conforme necessário.
    childWindow.loadURL(`http://localhost:5123${route}`);

    // childWindow.webContents.openDevTools();

    return childWindow;
}

/**
 * Cria o menu da aplicação. Esse menu será exibido apenas na janela principal,
 * pois nas janelas filhas (child windows) estamos utilizando autoHideMenuBar.
 */
export const createMenu = () => {
    const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Sair',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ],
        },
        {
            label: 'Cadastros',
            submenu: [
                { label: 'Categoria', click: () => createChildWindow('/cadastros/categoria', 'Cadastro de Categoria') },
                { label: 'Forma de Pagamento', click: () => createChildWindow('/cadastros/forma-pagamento', 'Cadastro de Forma de Pagamento') },
                { label: 'Motivo de Pausa', click: () => createChildWindow('/cadastros/motivo-pausa', 'Cadastro de Motivo de Pausa') },
                { label: 'Loja', click: () => createChildWindow('/cadastros/loja', 'Cadastro de Loja') },
                { label: 'Avaliação Operacional', click: () => createChildWindow('/cadastros/avaliacao-operacional', 'Avaliação Operacional') },
                { label: 'Questões', click: () => createChildWindow('/cadastros/questoes', 'Cadastro de Questões') },
                { label: 'Motivo de Perdas', click: () => createChildWindow('/cadastros/motivo-perdas', 'Cadastro de Motivo de Perdas') },
                { label: 'Gênero', click: () => createChildWindow('/cadastros/genero', 'Cadastro de Gênero') },
                { label: 'Usuário', click: () => createChildWindow('/cadastros/usuario', 'Cadastro de Usuário') },
            ],
        },
        {
            label: 'Relatórios',
            submenu: [
                { label: 'Gerar Relatórios', click: () => createChildWindow('/relatorios', 'Relatórios') },
            ],
        },
        {
            label: 'Auditoria',
            submenu: [
                { label: 'Agendamento de Auditoria', click: () => createChildWindow('/auditoria/agendamento', 'Agendamento de Auditoria') },
            ],
        },
        {
            label: 'Ajuda',
            submenu: [
                { label: 'Sobre', click: () => createChildWindow('/sobre', 'Sobre o Sistema') },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};