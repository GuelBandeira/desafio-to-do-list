import { addTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import express from 'express';
const router = express.Router();

router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;