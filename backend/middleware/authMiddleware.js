export const ensureAuthenticated = (req, res, next) => {
   if (req.session.userId) {
      return next();
   }
   return res.status(401).json({ error: 'Usuário não autenticado' });
};

export const ensureNotAuthenticated = (req, res, next) => {
   if (!req.session.userId) {
      return next();
   }
   return res.status(400).json({ error: 'Usuário já autenticado' });
};
