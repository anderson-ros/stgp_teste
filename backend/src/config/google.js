const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

/**
 * Caminho do arquivo de chave da Conta de Serviço (Service Account).
 */
const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH 
  ? path.resolve(__dirname, '../../', process.env.GOOGLE_SERVICE_ACCOUNT_PATH)
  : path.resolve(__dirname, '../../credentials/service-account.json');

/**
 * Inicialização da autenticação do Google Sheets via Conta de Serviço
 */
let sheetsClient = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  if (!fs.existsSync(keyFilePath)) {
    console.warn(`[AVISO] Arquivo de credenciais não encontrado em: ${keyFilePath}`);
    console.warn('[AVISO] Para gravar no Google Sheets, insira o arquivo service-account.json na pasta backend/credentials/.');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

/**
 * Cliente OAuth2 para validação de ID Token do Google Workspace (@unesp.br)
 */
const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  getSheetsClient,
  oauthClient,
  keyFilePath,
};
