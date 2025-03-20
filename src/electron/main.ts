// File: src/electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { isDev } from './util.js';
import { fileURLToPath } from 'url';
import { createMenu } from './menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.join(__dirname, 'preload.js');

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;
let loggedUser: { name: string; token: string } | null = null;

let childWindows: { win: BrowserWindow; offset: { x: number; y: number } }[] = [];

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 400,
        resizable: false,
        title: 'Login',
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
        },
    });
    loginWindow.loadURL('http://localhost:5123/login');
}

interface ChildWindowOptions {
    offset?: { x: number; y: number; };
    width?: number;
    height?: number;
    resizable?: boolean;
}

export function createChildWindow( 
    route: string,
    title: string,
    options: ChildWindowOptions = {}
) {
    // Define valores padrão
    const { offset = {x: 50, y: 50}, width = 1024, height = 768, resizable = true } = options;

    const childWindow = new BrowserWindow({
        width,
        height,
        title,
        parent: mainWindow || undefined,
        autoHideMenuBar: true,
        resizable,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Se a mainWindow existir, posiciona o childWindow relativo a ela
    if (mainWindow) {
        const mainBounds = mainWindow.getBounds();
        childWindow.setPosition(mainBounds.x + offset.x, mainBounds.y + offset.y);
    }

    // Força a atualização do título após o conteúdo carregar
    childWindow.webContents.on('did-finish-load', () => {
        childWindow.setTitle(title);
    });

    // Adiciona o listener para restringir o arrasto fora do container da mainWindow
    childWindow.on('move', () => {
        if (mainWindow) {
            const mainBounds = mainWindow.getBounds();
            const childBounds = childWindow.getBounds();
            let newX = childBounds.x;
            let newY = childBounds.y;

            // Verifica se a child window está fora dos limites da mainWindow
            if (childBounds.x < mainBounds.x) newX = mainBounds.x;
            if (childBounds.y < mainBounds.y) newY - mainBounds.y;
            if (childBounds.x + childBounds.width > mainBounds.x + mainBounds.width) {
                newX = mainBounds.x + mainBounds.width - childBounds.width;
            }

            if (childBounds.y + childBounds.height > mainBounds.y + mainBounds.height) {
                newY = mainBounds.y + mainBounds.height - childBounds.height;
            }

            if (newX !== childBounds.x || newY !== childBounds.y) {
                childWindow.setPosition(newX, newY);
            }
        }
    });

    // Armazena o childWindow e seu offset
    childWindows.push({ win: childWindow, offset });

    // Remove a referência quando a janela for fechada
    childWindow.on('closed', () => {
        childWindows = childWindows.filter(cw => cw.win !== childWindow);
    });

    // Carrega a rota na nova janela
    childWindow.loadURL(`http://localhost:5123${route}`);

    return childWindow;
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        },
    });

    mainWindow.maximize();
    mainWindow.loadURL('http://localhost:5123/dashboard');

    mainWindow.on('move', () => {
        if (mainWindow) {
            const mainBounds = mainWindow.getBounds();
            childWindows.forEach(({win, offset}) => {
                win.setPosition(mainBounds.x + offset.x, mainBounds.y + offset.y);
            });
        }
    });

    mainWindow.on('resize', () => {
        if (mainWindow) {
            const mainBounds = mainWindow.getBounds();
            childWindows.forEach(({win, offset}) => {
                win.setPosition(mainBounds.x + offset.x, mainBounds.y + offset.y);
            })
        }
    })


    // setParentWindow(mainWindow);
    // mainWindow.webContents.openDevTools();

    // if (isDev()) {
    //     mainWindow.loadURL('http://localhost:5123/dashboard');
    // } else {
    //     mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    // }
}

ipcMain.handle('get-user', async () => {
    return loggedUser;
})

app.whenReady().then(() => {
    createLoginWindow();


    ipcMain.on('login-success', (event, user) => {
        loggedUser = user;
        if (loginWindow) {
            loginWindow.close();
            loginWindow = null;
        }
        createMainWindow();
        createMenu();
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/**
 * Função para criar uma nova janela filha (child window) com base em uma rota.
 * @param route Rota da aplicação React (ex.: "/cadastros/categoria")
 * @param title Título da nova janela
 * @param offsetOffset Opcional: deslocamento em relação à mainWindow. Caso não seja informado, usaremos um padrão.
 */



