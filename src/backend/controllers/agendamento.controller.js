const db = require('../models/db');

const converterData = (dataStr) => {
  if (dataStr.includes('/')) {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
  }
  return dataStr;
};

exports.createAgendamento = (req, res) => {
  let { nome_pet, tipo_animal, raca, data, horario } = req.body;
  data = converterData(data);

  const imagem = req.file ? req.file.filename : null;

  if (!nome_pet || !tipo_animal || !raca || !data || !horario) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const query = "INSERT INTO agendamentos (nome_pet, tipo_animal, raca, data, horario, imagem) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [nome_pet, tipo_animal, raca, data, horario, imagem], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(201).json({ message: "Agendamento criado com sucesso!", id: result.insertId });
  });
};

exports.getAgendamentos = (req, res) => {
  const query = "SELECT * FROM agendamentos";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.json(results);
  });
};

exports.getAgendamentoById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM agendamentos WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    return res.json(results[0]);
  });
};

exports.updateAgendamento = (req, res) => {
  const { id } = req.params;
  let { nome_pet, tipo_animal, raca, data, horario } = req.body;
  data = converterData(data);
  const imagem = req.file ? req.file.filename : null;

  let query = "UPDATE agendamentos SET nome_pet = ?, tipo_animal = ?, raca = ?, data = ?, horario = ?";
  const values = [nome_pet, tipo_animal, raca, data, horario];

  if (imagem) {
    query += ", imagem = ?";
    values.push(imagem);
  }
  query += " WHERE id = ?";
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    return res.json({ message: "Agendamento atualizado com sucesso!" });
  });
};

exports.deleteAgendamento = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM agendamentos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    return res.json({ message: "Agendamento excluído com sucesso!" });
  });
};
