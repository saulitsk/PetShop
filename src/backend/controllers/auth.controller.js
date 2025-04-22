const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }
  
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: "Usuário já existe." });
    }

    try {
      const hashedSenha = await bcrypt.hash(senha, 10);
      const createQuery = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
      db.query(createQuery, [email, hashedSenha], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return res.status(201).json({ message: "Usuário criado com sucesso!" });
      });
    } catch (hashError) {
      return res.status(500).json({ error: hashError });
    }
  });
};

const login = (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    
    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(senha, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // o token expira em 1 hora
      );
      
      return res.status(200).json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
};

module.exports = { register, login };
