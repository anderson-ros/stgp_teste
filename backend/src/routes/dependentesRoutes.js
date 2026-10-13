const express = require('express');
const router = express.Router();
const {
  submeterDeclaracao,
  validarProtocolo,
  healthCheck,
} = require('../controllers/dependentesController');

// Status da API
router.get('/health', healthCheck);

// Submissão do formulário de dependentes
router.post('/dependentes', submeterDeclaracao);

// Consulta pública para validar autenticidade do comprovante
router.get('/dependentes/validar/:protocolo', validarProtocolo);

module.exports = router;
