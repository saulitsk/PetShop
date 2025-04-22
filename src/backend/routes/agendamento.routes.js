const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer-config');
const agendamentoController = require('../controllers/agendamento.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/', verifyToken, upload.single('imagem'), agendamentoController.createAgendamento);

router.get('/', agendamentoController.getAgendamentos);

router.get('/:id', agendamentoController.getAgendamentoById);

router.put('/:id', verifyToken, upload.single('imagem'), agendamentoController.updateAgendamento);

router.delete('/:id', verifyToken, agendamentoController.deleteAgendamento);

module.exports = router;
