import DB from '../config/db.js';

export const loginUser = (req, res) => {
   const { email, password } = req.body;
   const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
   const values = [email, password];
   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao realizar login:', err);
         return res.status(500).json({ error: 'Falha ao realizar login' });
      }
      if (result.length === 0) {
         return res.status(401).json({ error: 'Não encontrado nenhum usuário com essa senha ou email' });
      }
      req.session.userId = result[0].id;
      req.session.userName = result[0].name;
      res.status(200).json({ message: 'Login realizado com sucesso' });
   });
};

export const logoutUser = (req, res) => {

   req.session.destroy();

   res.status(200).json({ message: 'Logout realizado com sucesso' });
}



export const createUser = (req, res) => {
   const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
   const values = [req.body.name, req.body.email, req.body.password];

   DB.query(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao cadastrar usuário:', err);
         return res.status(500).json({ error: 'Falha ao cadastrar usuário' });
      }

      res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
   });
};
