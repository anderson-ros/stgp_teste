const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dependentesRoutes = require('./routes/dependentesRoutes');

const app = express();

// Proteção de cabeçalhos HTTP
app.use(helmet());

// Configuração do CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite chamadas sem origin (como curl, mobile apps ou do mesmo servidor) ou dentro da whitelist
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origem "${origin}" bloqueada pela política CORS.`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parser para requisições em JSON
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Registro das rotas principais sob o prefixo /api
app.use('/api', dependentesRoutes);

// Rota raiz de boas-vindas
app.get('/', (req, res) => {
  res.json({
    sistema: 'STGP Digital — Backend de Gestão de Documentos',
    unidade: 'Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente (UNESP)',
    documentacao: 'Consulte /api/health para verificar a saúde da API.'
  });
});

// Middleware para tratamento de 404 (Rota não encontrada)
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: `A rota ${req.method} ${req.originalUrl} não foi encontrada.`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('[ERRO NÃO TRATADO]:', err);
  res.status(500).json({
    sucesso: false,
    erro: err.message || 'Erro interno no servidor.'
  });
});

module.exports = app;
