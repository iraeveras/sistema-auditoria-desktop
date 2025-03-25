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
│   │   ├── axiosInstance.ts
│   │   └── authService.ts
│   ├── types/
│   │   ├── jwt.decode.d.ts
│   │   └── global.d.ts
│   └── ui/          
│       ├── assets/
│       ├── components/
│       │   └── dashboard/
│       │       ├── cards/
│       │       └── charts/
│       ├── pages/
│       │   ├── AuditPage.tsx
│       │   ├── CategoryPage.tsx
│       │   ├── GenderPage.tsx
│       │   ├── Login.tsx
│       │   ├── LossPage.tsx
│       │   ├── Main.tsx
│       │   ├── OperationalAssessmentPage.tsx
│       │   ├── PausePage.tsx
│       │   ├── PaymentMethodPage.tsx
│       │   ├── QuestionsPage.tsx
│       │   ├── StorePage.tsx
│       │   └── UserPage.tsx
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