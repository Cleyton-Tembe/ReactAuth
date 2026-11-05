# React Auth

Sistema de autenticação completo com React e Express: registo, verificação do email por código, login, recuperação da password por email e área protegida.

> **Âmbito do projecto:** este é um projecto de estudo. Fi-lo para me familiarizar com o fluxo completo de autenticação (JWT em cookies, hash de passwords, verificação do email e reposição da password), o envio de emails com Nodemailer, o React com TypeScript e o Express, e para pôr isso em prática. Não é um produto final.

## Demo

🔗 **[Ver demo](COLOCA_AQUI_O_LINK_DA_DEMO)**

## Funcionalidades

- **Registo** com nome, email e password, e um **medidor da força da password** em tempo real (tamanho, maiúsculas, minúsculas, números e símbolos)
- **Verificação do email:** o utilizador recebe um código de 6 dígitos e confirma-o num ecrã próprio (também aceita colar o código)
- **Email de boas-vindas** depois de a conta ser verificada
- **Login e logout** com JWT guardado num cookie `httpOnly` (válido 7 dias)
- **Passwords encriptadas** com bcrypt
- **Recuperar a password:** o utilizador pede um link por email, que expira em 1 hora, e define uma nova password
- **Email de confirmação** quando a password é alterada
- **Área protegida** com os dados do perfil, a data de registo e o último login
- Emails em HTML com templates próprios
- Interface com animações (Framer Motion), formas flutuantes no fundo e notificações (toasts)

## Tecnologias

| Front-end | Back-end |
|---|---|
| React 18 + TypeScript | Node.js + Express 5 (TypeScript) |
| Vite | MongoDB + Mongoose |
| Tailwind CSS 4 | JWT (`jsonwebtoken`) + `cookie-parser` |
| Framer Motion | bcryptjs |
| React Router | **Nodemailer** (envio de emails) |
| Axios · React Hot Toast · Lucide | |

## Estrutura

```
ReactAuth/
├── FrontEnd/     # aplicação React (Vite) — porta 5173
├── BackEnd/      # API Express — porta 4000
└── vercel.json   # deploy do front-end e da API no mesmo domínio
```

## API

| Método | Rota | Acção |
|---|---|---|
| POST | `/api/auth/register` | Cria a conta e envia o código de verificação |
| POST | `/api/auth/verify` | Verifica o email com o código |
| POST | `/api/auth/login` | Inicia a sessão |
| GET | `/api/auth/logout` | Termina a sessão |
| GET | `/api/auth/protect` | Devolve o utilizador autenticado |
| POST | `/api/auth/forgot-password` | Envia o link para repor a password |
| POST | `/api/auth/reset-password/:token` | Define a nova password |

## Como correr localmente

### Pré-requisitos

- **Node.js 22.18 ou superior**: o back-end corre os ficheiros `.ts` directamente com o Node.
- Uma base de dados **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Uma conta **Gmail** com uma [App Password](https://myaccount.google.com/apppasswords), que exige a verificação em 2 passos activa. É com ela que a app envia os emails.

### 1. Clonar e instalar

```bash
git clone https://github.com/Cleyton-Tembe/ReactAuth.git
cd ReactAuth
npm install --prefix BackEnd
npm install --prefix FrontEnd
```

### 2. Variáveis de ambiente

Cria `BackEnd/.env`:

```env
PORT=4000
NODE_ENV=development
MONGO_URL=mongodb+srv://<utilizador>:<password>@<cluster>/<base-de-dados>
TOKEN_SECRET=um-segredo-longo-e-aleatorio

# Envio de emails (Gmail)
APP_EMAIL=o-teu-email@gmail.com
MAIL_PWD=a-tua-app-password   # a App Password de 16 letras, não a password normal

# Endereço da página de reposição da password (o token é acrescentado no fim)
RESET_PWD_URL=http://localhost:5173/reset-password
```

Cria `FrontEnd/.env`. É isto que faz o front-end falar com a API em `localhost:4000`:

```env
VITE_NODE_ENV=development
```

### 3. Arrancar

Na raiz do projecto, em dois terminais:

```bash
npm run back    # API em http://localhost:4000
```

```bash
npm run front   # aplicação em http://localhost:5173
```

Ao arrancar, a API verifica a ligação ao servidor de email e escreve o resultado na consola.

## Deploy

O `vercel.json` publica o front-end e a API no **mesmo domínio** da Vercel: os pedidos a `/api/*` vão para o Express e o resto para o React. Assim, os cookies de login funcionam sem configuração extra de CORS.

Na Vercel, define as mesmas variáveis do `BackEnd/.env`, com `NODE_ENV=production` e `RESET_PWD_URL=https://<o-teu-dominio>/reset-password`.

## Autor

**Cleyton Tembe** — [GitHub](https://github.com/Cleyton-Tembe)
