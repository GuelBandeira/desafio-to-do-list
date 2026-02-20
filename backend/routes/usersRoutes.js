import { getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();

// Todas as rotas de usuários requerem autenticação
router.get("/users/:id", ensureAuthenticated, getUser);
router.put("/users/:id", ensureAuthenticated, updateUser);
router.delete("/users/:id", ensureAuthenticated, deleteUser);

export default router;