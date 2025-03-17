# Sistema de Auditoria de Lojas

O Sistema de auditoria de Lojas está sendo construído para funcionar em Desktop, sendo assim optei em utilizar o ElctronJS mais React como Framework frontend.

## Estrutura do projeto

```
/SISTEMA-AUDITORIA-DESKTOP
├── src/
│   ├── assets/              
│   ├── electron/
│   │   ├── main.ts
│   │   ├── menu.ts
│   │   ├── preload.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.preload.json
│   │   └── util.ts     
│   ├── services/
│   │   └── authService.ts
│   ├── types/
│   │   └── global.d.ts
│   └── ui/          
│       ├── assets/
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   └── Login.tsx
│       ├── App.tsx       
│       ├── index.css       
│       ├── main.tsx       
│       └── vite-env.d.ts       
├── .gitignore
├── electron-builder.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
Após baixar o projeto, executar os seguintes comandos pra garantir a compilação e rodar o electronJS.

```
npm install
```
```
npm run transpile:electron
```
```
npm run transpile:preload
```
```
npm run dev:react
```
```
npm run dev
```