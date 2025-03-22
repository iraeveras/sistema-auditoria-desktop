// File: src/electron/menu.ts
import { app, BrowserWindow, Menu } from 'electron';
import { createChildWindow, ChildWindowOptions } from './main.js';

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
                {
                    label: 'Categoria',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 360, resizable: false }
                        createChildWindow('/cadastros/categoria', 'Cadastro de Categoria', options)
                    }
                },
                {
                    label: 'Forma de Pagamento',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/forma-pagamento', 'Cadastro de Forma de Pagamento', options)
                    }
                },
                {
                    label: 'Motivo de Pausa',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 450, height: 400, resizable: false }
                        createChildWindow('/cadastros/motivo-pausa', 'Cadastro de Motivo de Pausa', options)
                    }
                },
                {
                    label: 'Loja',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/loja', 'Cadastro de Loja', options)
                    }
                },
                {
                    label: 'Avaliação Operacional',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/avaliacao-operacional', 'Avaliação Operacional', options)
                    }
                },
                {
                    label: 'Questões',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/questoes', 'Cadastro de Questões', options)
                    }
                },
                {
                    label: 'Motivo de Perdas',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/motivo-perdas', 'Cadastro de Motivo de Perdas', options)
                    }
                },
                {
                    label: 'Gênero',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/cadastros/genero', 'Cadastro de Gênero', options)
                    }
                },
                {
                    label: 'Usuário',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 650, height: 530, resizable: false }
                        createChildWindow('/cadastros/usuario', 'Cadastro de Usuário', options)
                    }
                },
            ],
        },
        {
            label: 'Relatórios',
            submenu: [
                {
                    label: 'Gerar Relatórios',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 800, height: 578, resizable: false }
                        createChildWindow('/relatorios', 'Relatórios', options)
                    }
                },
            ],
        },
        {
            label: 'Auditoria',
            submenu: [
                {
                    label: 'Agendamento de Auditoria',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/auditoria/agendamento', 'Agendamento de Auditoria', options)
                    }
                },
            ],
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        const options: ChildWindowOptions = { offset: { x: 100, y: 100 }, width: 400, height: 400, resizable: false }
                        createChildWindow('/sobre', 'Sobre o Sistema', options)
                    }
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};