import { loginUser, logoutUser, createUser } from '../controllers/sessionController.js';
import express from 'express';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', createUser);

export default router;