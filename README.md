# Desafio Fullstack – Plataforma de Tarefas (To-Do List)
## Objetivo
- Criar uma aplicação web completa que permita usuários se cadastrarem, autenticarem, e gerenciarem uma lista de tarefas.

## Documentação Obrigatória do Código
- Como executar: 
  1. Pré-requisitos:
	  - Node.js 18+ instalado.
	  - npm instalado.
  2. Clone o repositório e entre na pasta do projeto:
	  - `git clone <url-do-repositorio>`
	  - `cd desafio-to-do-list`
  3. Instale e rode o backend:
	  - `cd backend`
	  - `npm install`
	  - `npm run dev`
	  - API disponível em `http://localhost:3000`.
  4. Em outro terminal, instale e rode o frontend:
	  - `cd frontend`
	  - `npm install`
	  - `npm run dev`
	  - App disponível em `http://localhost:5173`.
  5. Fluxo de acesso:
	  - Abra `http://localhost:5173`.
	  - Faça cadastro em `/signup`.
	  - Faça login em `/login` e acesse `/dashboard`.



- Descrição Geral:
	- Tecnologias utilizadas:
	  - Backend: Node.js, Express e SQLite3.
	  - Frontend: React.js e Tailwind CSS.

- Estrutura de Pastas e Arquivos
  - Backend:
    - `server.js`: inicialização da API e porta.
    - `app.js`: middlewares globais (JSON, CORS, sessão) e registro de rotas.
    - `config/db.js`: conexão SQLite e criação das tabelas.
    - `routes/`: definição dos endpoints HTTP.
    - `controllers/`: definição dos controladores principais (Users, Task e um controlador de sessão).
    - `middleware/`: middleware de autenticação e validações de entrada.
  - Frontend:
    - `src/App.tsx`: definição das rotas (`/login`, `/signup`, `/dashboard`).
    - `src/pages/`: telas principais (Login, Signup, Dashboard, Profile).
    - `src/components/`: componentes do frontend (Navbar, TaskForm, TaskCard, Toast, Spinner).

  
- Explicação do propósito de cada pasta/arquivo:
	- Backend (arquivos):
	  - `backend/server.js`: inicia o servidor HTTP e define a porta.
	  - `backend/app.js`: configura middlewares globais e registra rotas.
	  - `backend/config/db.js`: conexão SQLite e criação das tabelas `users` e `tasks`.
	  - `backend/controllers/sessionController.js`: cadastro, login, logout e `checkAuth`.
	  - `backend/controllers/TaskController.js`: CRUD de tarefas.
	  - `backend/controllers/userController.js`: leitura, atualização e remoção do usuário.
	  - `backend/middleware/authMiddleware.js`: proteção de rotas autenticadas.
	  - `backend/middleware/validationMiddleware.js`: validações de login e registro.
	  - `backend/middleware/taskValidationMiddleware.js`: validações de parâmetros e payload de tarefas.
	  - `backend/routes/sessionRoutes.js`: rotas de autenticação e sessão.
	  - `backend/routes/taskRoutes.js`: rotas de tarefas por usuário/tarefa.
	  - `backend/routes/usersRoutes.js`: rotas de perfil de usuário.
	- Frontend (arquivos):
	  - `frontend/src/App.tsx`: rotas principais da aplicação.
	  - `frontend/src/pages/Login.tsx`: tela de autenticação.
	  - `frontend/src/pages/Signup.tsx`: tela de cadastro com validação e exibição de erros.
	  - `frontend/src/pages/Dashboard.tsx`: listagem e gerenciamento de tarefas.
	  - `frontend/src/pages/Profile.tsx`: edição de dados do perfil.
	  - `frontend/src/components/Navbar.tsx`: navegação principal (desktop/mobile).
	  - `frontend/src/components/TaskForm.tsx`: formulário modal de criar/editar tarefa.
	  - `frontend/src/components/TaskCard.tsx`: card de exibição de tarefa.
	  - `frontend/src/components/Toast.tsx`: notificações de sucesso/erro.
	  - `frontend/src/components/Spinner.tsx`: indicador visual de carregamento.
- Modelagem do Banco de Dados
	- Descrição textual das tabelas e relacionamentos:
	  - `users`: `id`, `name`, `email (unique)`, `password (hash)`, `created_at`, `updated_at`.
	  - `tasks`: `id`, `title`, `description`, `completed`, `user_id`, `created_at`, `updated_at`.
	  - Relacionamento: `users (1) -> (N) tasks` via `tasks.user_id` com `ON DELETE CASCADE`.
- Funções Principais
	- Principais funções/métodos:
	  - `sessionController`: `createUser`, `loginUser`, `logoutUser`, `checkAuth`.
	  - `TaskController`: `addTask`, `getTasks`, `updateTask`, `deleteTask`.
	  - `userController`: `getUser`, `updateUser`, `deleteUser`.
	- Rotas e validações:
	  - `POST /register`: valida `name`, `email`, `password`; retorna `details` em erro de validação.
	  - `POST /login`: busca usuário com mesmo `email` e `password`, e cria sessão.
	  - `POST /logout`: encerra sessão.
	  - `GET /auth/check`: verifica se está autenticado.
	  - `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`: rotas privadas do usuário.
	  - `POST /tasks/:id`, `GET /tasks/:id`, `PUT /tasks/:id`, `DELETE /tasks/:id`: CRUD de tarefas.
- Segurança Aplicada
	- Hash de senhas
	  - Senhas armazenadas com `bcrypt` no cadastro e comparadas no login.
	- Proteção de rotas privadas
	  - Middleware `ensureAuthenticated` aplicado em usuários, tarefas e logout.
	- Validação de input
	  - `express-validator` em autenticação e tarefas, com respostas padronizadas (`error` + `details`).
	- Tratamento de erros e mensagens
	  - Códigos HTTP adequados (`400`, `401`, `404`, `409`, `500`) e mensagens objetivas.
	  - Frontend exibe erros de validação no formulário e feedback de alterações com toast.

## Fluxo de Uso do Sistema
- Usuário acessa `/signup`, envia `name`, `email`, `password` e confirma cadastro.
- Usuário realiza login em `/login`; backend cria sessão e frontend redireciona para `/dashboard`.
- Dashboard consulta tarefas do usuário autenticado e permite criar, editar, marcar como concluído e excluir.
- Usuário pode editar perfil, fazer logout e encerrar a sessão.

