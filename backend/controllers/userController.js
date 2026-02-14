import DB from '../config/db.js';

export const getUser = (req, res) => {

   const query = 'SELECT * FROM users WHERE id = ?';
   const values = [req.body.id];

   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao buscar usuário:', err);
         return res.status(500).json({ error: 'Falha ao buscar usuário' });
      }

      if (result.length === 0) {
         return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json(result[0]);
   });
};


export const updateUser = (req, res) => {


   const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
   const values = [req.body.name, req.body.email, req.body.id];

   DB.query(query, values, (err, result) => {

      if (err) {
         console.error('Erro atualizando informações do usuário:', err);
         return res.status(500).json({ error: 'Falha ao atualizar informações do usuário' });
      }


      res.status(200).json({ message: `Informações atualizadas com sucesso` });
   });
}

export const deleteUser = (req, res) => {
   const query = 'DELETE FROM users WHERE id = ?';
   const values = [req.body.id];
   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao deletar usuário:', err);
         return res.status(500).json({ error: 'Falha ao deletar usuário' });
      }

      res.status(200).json({ message: 'Usuário deletado com sucesso' });
   });
};