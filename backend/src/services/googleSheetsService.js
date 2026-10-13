const { getSheetsClient } = require('../config/google');

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Respostas';

/**
 * Adiciona uma nova linha com a declaração na planilha do Google Sheets.
 * 
 * @param {Object} dados - Dados estruturados para inserção
 * @returns {Promise<Object>} Resposta da API do Google Sheets
 */
async function appendDeclaracaoRow(dados) {
  const sheets = getSheetsClient();

  if (!sheets) {
    throw new Error('Cliente Google Sheets não inicializado. Verifique o arquivo credentials/service-account.json.');
  }

  if (!SPREADSHEET_ID) {
    throw new Error('ID da planilha (GOOGLE_SPREADSHEET_ID) não configurado no arquivo .env.');
  }

  // Monta a linha conforme a estrutura de colunas definida:
  // A: Data e Hora
  // B: Código de Autenticidade / Protocolo
  // C: E-mail Institucional
  // D: Nome do Servidor
  // E: CPF
  // F: Estado Civil
  // G: Endereço Residencial
  // H: Tipo de Declaração (Com Dependentes / Declaração Negativa)
  // I: Qtd de Dependentes
  // J: Relação dos Dependentes (Formatada em texto / JSON legível)
  // K: Hash Criptográfico (SHA-256)
  // L: IP de Origem
  const row = [
    dados.dataHoraFormatada || '',
    dados.codigoAutenticidade || '',
    dados.email || '',
    dados.nome || '',
    dados.cpf || '',
    dados.estadoCivil || '',
    dados.enderecoCompleto || '',
    dados.tipoDeclaracao || '',
    dados.qtdDependentes || 0,
    dados.dependentesTexto || '',
    dados.hashAutenticidade || '',
    dados.ipOrigem || ''
  ];

  const range = `${SHEET_NAME}!A:L`;

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  return response.data;
}

/**
 * Consulta a planilha pelo código de autenticidade (Protocolo) para validação pública.
 * 
 * @param {string} protocolo - Código único (ex: UNESP-DEP-2026-F4B2D981)
 * @returns {Promise<Object|null>} Dados públicos da certidão ou null se não encontrada
 */
async function buscarDeclaracaoPorProtocolo(protocolo) {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) {
    return null;
  }

  const range = `${SHEET_NAME}!A:K`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });

  const rows = response.data.values;
  if (!rows || rows.length <= 1) {
    return null;
  }

  const codigoNormalizado = protocolo.trim().toUpperCase();

  // Procura na coluna B (índice 1)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowProtocolo = (row[1] || '').trim().toUpperCase();

    if (rowProtocolo === codigoNormalizado) {
      return {
        valido: true,
        dataHora: row[0],
        protocolo: row[1],
        email: row[2],
        nome: row[3],
        tipoDeclaracao: row[7],
        qtdDependentes: row[8],
        hash: row[10]
      };
    }
  }

  return null;
}

module.exports = {
  appendDeclaracaoRow,
  buscarDeclaracaoPorProtocolo,
};
