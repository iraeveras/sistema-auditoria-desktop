// File: src/electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { isDev } from './util.js';
import { fileURLToPath } from 'url';
import { createMenu, setParentWindow } from './menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.join(__dirname, 'preload.js');

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;
let loggedUser: { name: string; token: string } | null = null;

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

    loginWindow.removeMenu();

    loginWindow.loadURL('http://localhost:5123/login');
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

    setParentWindow(mainWindow);
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