import DB from '../config/db.js';

export const updateTask = (req, res) => {
   const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
   const values = [req.body.title, req.body.description, req.body.status, req.params.id];

   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao atualizar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao atualizar tarefa' });
      }

      res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
   });
}


export const deleteTask = (req, res) => {
   const query = 'DELETE FROM tasks WHERE id = ?';
   const values = [req.params.id];
   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao deletar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao deletar tarefa' });
      }

      res.status(200).json({ message: 'Tarefa deletada com sucesso' });
   });
};


export const getTasks = (req, res) => {
   const query = 'SELECT * FROM tasks WHERE user_id = ?';
   const values = [req.params.id];

   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao buscar tarefas:', err);
         return res.status(500).json({ error: 'Falha ao buscar tarefas' });
      }

      res.status(200).json(result);
   });
};


export const addTask = (req, res) => {
   const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
   const values = [req.body.title, req.body.description, req.body.status, req.params.id];
   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao adicionar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao adicionar tarefa' });
      }

      res.status(201).json({ message: 'Tarefa adicionada com sucesso' });
   });
};