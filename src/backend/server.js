const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const db = require('./models/db');

const authRoutes = require('./routes/auth.routes');
const agendamentoRoutes = require('./routes/agendamento.routes');

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Servidor backend do Petshop AuMiau está funcionando!');
});

app.use('/api/auth', authRoutes);

app.use('/api/agendamentos', agendamentoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
