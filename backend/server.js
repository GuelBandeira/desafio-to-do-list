import app from './app.js';
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
   res.send('Hello world');
});

app.listen(PORT, () => {
   console.log(`API está rodando na porta ${PORT}`);
});

export default app;