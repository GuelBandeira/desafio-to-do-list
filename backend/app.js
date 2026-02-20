import express from 'express';
import session from 'express-session';
import usersRoutes from './routes/usersRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors({
   origin: 'http://localhost:5173', // URL do frontend
   credentials: true
}));

app.use(express.json());



// Configurar sessão
app.use(session({
   cookieName: 'session-to-do-list',
   secret: 'd956f56c-a1e1-474c-a91d-52bf3c156161',
   duration: 24 * 60 * 60 * 1000,
   activeDuration: 1000 * 60 * 5,
   resave: true,
   saveUninitialized: true
}));



// Rotas
app.use(sessionRoutes);
app.use(usersRoutes);
app.use(taskRoutes);

export default app;