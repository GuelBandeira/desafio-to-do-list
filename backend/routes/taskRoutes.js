import { addTask, getTasks, updateTask, deleteTask } from '../controllers/TaskController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';
import { validateCreateTask, validateUpdateTask, validateTaskId, validateUserId } from '../middleware/taskValidationMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/tasks/:id', ensureAuthenticated, validateCreateTask, addTask);
router.get('/tasks/:id', ensureAuthenticated, validateUserId, getTasks);
router.put('/tasks/:id', ensureAuthenticated, validateUpdateTask, updateTask);
router.delete('/tasks/:id', ensureAuthenticated, validateTaskId, deleteTask);

export default router;