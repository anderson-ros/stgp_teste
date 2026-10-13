const { oauthClient } = require('../config/google');

/**
 * Valida o ID Token gerado pelo login do Google Workspace.
 * Garante que o e-mail seja estritamente do domínio @unesp.br.
 * 
 * @param {string} idToken - Token JWT recebido do frontend
 * @returns {Promise<Object>} Dados do perfil do usuário autenticado
 */
async function verifyUnespUser(idToken) {
  if (!idToken) {
    throw new Error('Token de autenticação não fornecido.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID não está configurado no ambiente.');
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken: idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Não foi possível obter os dados do usuário a partir do token.');
  }

  const email = (payload.email || '').toLowerCase().trim();
  const hostedDomain = payload.hd || '';

  // Validação estrita: domínio institucional UNESP obrigatório
  const isUnespDomain = email.endsWith('@unesp.br') || hostedDomain === 'unesp.br';

  if (!isUnespDomain) {
    throw new Error(
      `Acesso não autorizado para o e-mail "${email}". O sistema é de uso exclusivo para contas institucionais da UNESP (@unesp.br).`
    );
  }

  if (!payload.email_verified) {
    throw new Error('O e-mail informado no Google não está verificado.');
  }

  return {
    email: payload.email,
    nome: payload.name || '',
    foto: payload.picture || '',
    sub: payload.sub,
    hostedDomain: payload.hd
  };
}

module.exports = {
  verifyUnespUser,
};
