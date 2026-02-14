import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import cors from 'cors';

const app = express();


app.use(express.json());
app.use(cors());
app.use(usersRoutes);
app.use(taskRoutes);
app.use(sessionRoutes);

export default app;