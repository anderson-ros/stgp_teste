// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(' 🚀 STGP DIGITAL — API DECLARAÇÃO DE DEPENDENTES');
  console.log(' Faculdade de Ciências e Tecnologia — FCT UNESP');
  console.log('====================================================');
  console.log(` Servidor em execução na porta: ${PORT}`);
  console.log(` Health check:  http://localhost:${PORT}/api/health`);
  console.log(` Submissão:     POST http://localhost:${PORT}/api/dependentes`);
  console.log(` Validação:     GET  http://localhost:${PORT}/api/dependentes/validar/:protocolo`);
  console.log('====================================================');
});
