// File: src/electron/menu.ts
import { app, BrowserWindow, Menu } from 'electron';
import { createChildWindow } from './main.js';

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
                { label: 'Categoria', click: () => createChildWindow('/cadastros/categoria', 'Cadastro de Categoria', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Forma de Pagamento', click: () => createChildWindow('/cadastros/forma-pagamento', 'Cadastro de Forma de Pagamento', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Motivo de Pausa', click: () => createChildWindow('/cadastros/motivo-pausa', 'Cadastro de Motivo de Pausa', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Loja', click: () => createChildWindow('/cadastros/loja', 'Cadastro de Loja', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Avaliação Operacional', click: () => createChildWindow('/cadastros/avaliacao-operacional', 'Avaliação Operacional', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Questões', click: () => createChildWindow('/cadastros/questoes', 'Cadastro de Questões', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Motivo de Perdas', click: () => createChildWindow('/cadastros/motivo-perdas', 'Cadastro de Motivo de Perdas', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Gênero', click: () => createChildWindow('/cadastros/genero', 'Cadastro de Gênero', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
                { label: 'Usuário', click: () => createChildWindow('/cadastros/usuario', 'Cadastro de Usuário', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
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
                { label: 'Agendamento de Auditoria', click: () => createChildWindow('/auditoria/agendamento', 'Agendamento de Auditoria', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
            ],
        },
        {
            label: 'Ajuda',
            submenu: [
                { label: 'Sobre', click: () => createChildWindow('/sobre', 'Sobre o Sistema', {offset: {x:100, y: 100}, width: 400, height: 400, resizable: false}) },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};