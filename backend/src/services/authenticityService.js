const crypto = require('crypto');

/**
 * Gera um protocolo oficial legível e um hash criptográfico SHA-256 para o carimbo de autenticidade.
 * 
 * @param {Object} dados - Informações do formulário e do servidor
 * @returns {Object} { codigoAutenticidade, hashAutenticidade, dataHoraFormatada, timestamp }
 */
function generateAuthenticity(dados) {
  const agora = new Date();
  const anoAtual = agora.getFullYear();

  // Sufixo aleatório em maiúsculas de 8 caracteres hexadecimais (ex: 8AF29C1B)
  const sufixo = crypto.randomBytes(4).toString('hex').toUpperCase();
  const codigoAutenticidade = `FCT-STGP-DEP-${anoAtual}-${sufixo}`;

  // Data e hora oficial de Brasília
  const dataHoraFormatada = agora.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Payload assinado digitalmente com SHA-256
  const payloadIntegridade = [
    codigoAutenticidade,
    dados.cpf ? dados.cpf.replace(/\D/g, '') : '',
    dados.email || '',
    dados.tipoDeclaracao || '',
    agora.toISOString(),
  ].join('|');

  const hashAutenticidade = crypto
    .createHash('sha256')
    .update(payloadIntegridade)
    .digest('hex');

  return {
    codigoAutenticidade,
    hashAutenticidade,
    dataHoraFormatada,
    timestamp: agora.toISOString()
  };
}

module.exports = {
  generateAuthenticity,
};
