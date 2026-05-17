# Bairro-Shop

Instruções para clonar, configurar e executar o projeto Bairro-Shop (backend + frontend).

## Pré-requisitos
- Node.js (>=18 recomendado)
- npm
- Conta no MongoDB Atlas
- Git

## 1) Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/bairro-shop.git
cd bairro-shop
```

Substitua `SEU_USUARIO` pelo nome da conta que contém o repositório.

## 2) Preparar o MongoDB Atlas

1. Crie um cluster no MongoDB Atlas.
2. Crie um usuário de banco de dados e senha (guarde esses dados).
3. Em *Network Access* adicione seu IP (ou `0.0.0.0/0` apenas em desenvolvimento).
4. Em *Connect* → *Drivers* → *Node.js* copie a URI de conexão.

Exemplo de URI:

```
mongodb+srv://<usuario>:<senha>@bairro-shop.tgssw0a.mongodb.net/bairro-shop?retryWrites=true&w=majority
```

## 3) Configurar o backend

Entre na pasta `backend` e crie um arquivo `.env` com as variáveis abaixo:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<senha>@bairro-shop.tgssw0a.mongodb.net/bairro-shop?retryWrites=true&w=majority
```

Observações:
- Não repita `MONGO_URI=` dentro do valor — use somente `MONGO_URI=<uri>`.
- O `server.js` já usa `dotenv` e lê `process.env.MONGO_URI`.

Instale dependências e rode o servidor:

```bash
cd backend
npm install
npm run dev
```

Você deve ver mensagens como:

- `Servidor rodando na porta 5000`
- `✅ Conectado ao MongoDB com sucesso!`

Se der erro `MongoParseError: Invalid scheme`, verifique o `.env` e confirme que `MONGO_URI` começa com `mongodb://` ou `mongodb+srv://`.

## 4) Configurar e rodar o frontend

No terminal (ou nova aba), entre em `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Por padrão o Next tenta a porta `3000`. Se `3000` já estiver em uso, rode em outra porta:

```bash
npm run dev -- --port 3001
```

Abra no navegador a URL exibida (`http://localhost:3000` ou `http://localhost:3001`).

Problema comum: `Another next dev server is already running`
- Significa que já existe um processo Next dev rodando na mesma pasta/porta.
- Solução: pare o processo existente ou use outra porta.
  - Para parar no Windows: `taskkill /PID <PID> /F`

## 5) Estrutura de dados (resumo)

O backend usa MongoDB/Mongoose com uma coleção `stores`.
Cada documento `Store` possui campos:
- `name`, `category`, `cep`, `address`, `phone`
- `products` (array de subdocumentos `Product`)
- `createdAt`, `updatedAt` (timestamps)

`Product` contém: `name`, `price`, `image`, `isPromo`, `stock`.

## 6) Troubleshooting rápido
- `MongoParseError: Invalid scheme` → `.env` com `MONGO_URI` incorreto (verifique prefixo e formato).
- `Another next dev server is already running` → pare o processo ou rode em outra porta.
- `Could not read package.json` → executar comandos no diretório correto (`backend` ou `frontend`).

## 7) Segurança e boas práticas
- Nunca comite `.env` com credenciais para repositórios públicos.
- Para compartilhar com o grupo, crie um arquivo `backend/.env.example` sem credenciais reais.

## 8) Links úteis no repositório
- Backend: [backend](backend)
- Frontend: [frontend](frontend)

---
Se quiser, eu adiciono também um `backend/.env.example` e atualizo o `frontend/README.md` com um link para este README.
