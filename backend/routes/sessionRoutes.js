import { loginUser, logoutUser, createUser, checkAuth } from '../controllers/sessionController.js';
import { validateLogin, validateRegister } from '../middleware/validationMiddleware.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/login', validateLogin, loginUser);

router.post('/logout', ensureAuthenticated, logoutUser);

router.post('/register', validateRegister, createUser);

router.get('/auth/check', checkAuth);

export default router;