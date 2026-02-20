import DB from '../config/db.js';

export const updateTask = (req, res) => {
   const { title, description, completed } = req.body;
   const { id } = req.params;

   if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
   }

   if (title.length > 255) {
      return res.status(400).json({ error: 'Título não pode ter mais de 255 caracteres' });
   }

   if (completed !== undefined && ![0, 1].includes(completed)) {
      return res.status(400).json({ error: 'Completed deve ser 0 ou 1' });
   }

   const query = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
   const values = [title.trim(), description || '', completed || 0, id];

   DB.run(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao atualizar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao atualizar tarefa' });
      }

      res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
   });
}


export const deleteTask = (req, res) => {
   const { id } = req.params;

   const query = 'DELETE FROM tasks WHERE id = ?';
   DB.run(query, [id], (err, result) => {
      if (err) {
         console.error('Erro ao deletar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao deletar tarefa' });
      }

      res.status(200).json({ message: 'Tarefa deletada com sucesso' });
   });
};


export const getTasks = (req, res) => {
   const { id } = req.params;

   const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
   DB.all(query, [id], (err, result) => {
      if (err) {
         console.error('Erro ao buscar tarefas:', err);
         return res.status(500).json({ error: 'Falha ao buscar tarefas' });
      }

      res.status(200).json(result || []);
   });
};


export const addTask = (req, res) => {
   const { title, description, completed } = req.body;
   const { id } = req.params;

   if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
   }

   if (title.length > 255) {
      return res.status(400).json({ error: 'Título não pode ter mais de 255 caracteres' });
   }

   if (description && description.length > 1000) {
      return res.status(400).json({ error: 'Descrição não pode ter mais de 1000 caracteres' });
   }

   if (completed !== undefined && ![0, 1].includes(completed)) {
      return res.status(400).json({ error: 'Completed deve ser 0 ou 1' });
   }

   const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)';
   const values = [title.trim(), description ? description.trim() : '', completed || 0, id];

   DB.run(query, values, function (err) {
      if (err) {
         console.log('Erro ao adicionar tarefa:', err);
         return res.status(500).json({ error: 'Falha ao adicionar tarefa' });
      }

      res.status(201).json({
         message: 'Tarefa adicionada com sucesso',
         task: {
            id: this.lastID,
            title: values[0],
            description: values[1],
            completed: values[2],
            user_id: values[3]
         }
      });
   });
};