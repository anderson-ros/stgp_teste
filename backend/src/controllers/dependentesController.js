const { verifyUnespUser } = require('../services/googleAuthService');
const { generateAuthenticity } = require('../services/authenticityService');
const { appendDeclaracaoRow, buscarDeclaracaoPorProtocolo } = require('../services/googleSheetsService');
const { enviarComprovantesEmail } = require('../services/emailService');

/**
 * Controller principal para submissão da Declaração de Dependentes
 */
async function submeterDeclaracao(req, res) {
  try {
    const { idToken, formulario } = req.body;

    if (!idToken) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Token de autenticação Google não fornecido.'
      });
    }

    if (!formulario || typeof formulario !== 'object') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados do formulário incompletos ou ausentes.'
      });
    }

    // 1. Validação obrigatória da conta @unesp.br
    const usuarioGoogle = await verifyUnespUser(idToken);

    // 2. Determinar tipo de declaração
    const possuiDependentes = Boolean(formulario.possuiDependentes);
    const tipoDeclaracao = possuiDependentes ? 'Com Dependentes' : 'Declaração Negativa de Dependentes';
    const listaDependentes = Array.isArray(formulario.dependentes) ? formulario.dependentes : [];

    // Formata os dependentes de maneira legível para a célula da planilha
    let dependentesTexto = 'Nenhum dependente informado (Declaração Negativa)';
    if (possuiDependentes && listaDependentes.length > 0) {
      dependentesTexto = listaDependentes.map((dep, index) => {
        const finalidades = dep.finalidades && Array.isArray(dep.finalidades) ? dep.finalidades.join(', ') : 'N/A';
        return `[Dep #${index + 1}: ${dep.nome || 'N/A'} | CPF: ${dep.cpf || 'N/A'} | Parentesco: ${dep.parentesco || 'N/A'} | Nasc: ${dep.dataNascimento || 'N/A'} | Finalidades: ${finalidades}]`;
      }).join(';\n');
    }

    // 3. Gerar código verificador e carimbo criptográfico
    const autenticidade = generateAuthenticity({
      cpf: formulario.cpf,
      email: usuarioGoogle.email,
      tipoDeclaracao: tipoDeclaracao
    });

    const ipOrigem = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'N/A';

    // 4. Montar registro para a planilha
    const registroPlanilha = {
      dataHoraFormatada: autenticidade.dataHoraFormatada,
      codigoAutenticidade: autenticidade.codigoAutenticidade,
      email: usuarioGoogle.email,
      nome: formulario.nome || usuarioGoogle.nome,
      cpf: formulario.cpf || '',
      estadoCivil: formulario.estadoCivil || '',
      enderecoCompleto: formulario.enderecoCompleto || '',
      tipoDeclaracao: tipoDeclaracao,
      qtdDependentes: possuiDependentes ? listaDependentes.length : 0,
      dependentesTexto: dependentesTexto,
      hashAutenticidade: autenticidade.hashAutenticidade,
      ipOrigem: String(ipOrigem)
    };

    // 5. Gravação no Google Sheets via Conta de Serviço
    await appendDeclaracaoRow(registroPlanilha);

    // 6. Envio de e-mails em segundo plano
    enviarComprovantesEmail(registroPlanilha).catch((err) => {
      console.error('[ERRO E-MAIL] Falha ao enviar e-mail de comprovante:', err.message);
    });

    // 7. Retorno de sucesso para o frontend
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Declaração registrada e autenticada com sucesso no sistema!',
      dados: {
        protocolo: autenticidade.codigoAutenticidade,
        dataHora: autenticidade.dataHoraFormatada,
        hash: autenticidade.hashAutenticidade,
        servidor: {
          nome: registroPlanilha.nome,
          email: registroPlanilha.email,
          cpf: registroPlanilha.cpf
        },
        tipoDeclaracao: registroPlanilha.tipoDeclaracao,
        qtdDependentes: registroPlanilha.qtdDependentes
      }
    });

  } catch (error) {
    console.error('[ERRO API] Erro ao submeter declaração:', error);
    return res.status(error.message && error.message.includes('não autorizado') ? 403 : 500).json({
      sucesso: false,
      erro: error.message || 'Erro interno ao processar a declaração de dependentes.'
    });
  }
}

/**
 * Endpoint público para validação de autenticidade de comprovantes
 */
async function validarProtocolo(req, res) {
  try {
    const { protocolo } = req.params;

    if (!protocolo) {
      return res.status(400).json({ valido: false, erro: 'Protocolo não informado.' });
    }

    const resultado = await buscarDeclaracaoPorProtocolo(protocolo);

    if (!resultado) {
      return res.status(404).json({
        valido: false,
        mensagem: 'Protocolo de declaração não localizado no banco de registros oficial.'
      });
    }

    return res.status(200).json({
      valido: true,
      mensagem: 'Documento autêntico e verificado na base oficial da STGP FCT UNESP.',
      certidao: {
        protocolo: resultado.protocolo,
        dataHora: resultado.dataHora,
        nomeServidor: resultado.nome,
        tipoDeclaracao: resultado.tipoDeclaracao,
        qtdDependentes: resultado.qtdDependentes,
        hash: resultado.hash
      }
    });

  } catch (error) {
    console.error('[ERRO VALIDAÇÃO]:', error);
    return res.status(500).json({
      valido: false,
      erro: 'Erro interno ao consultar autenticidade.'
    });
  }
}

/**
 * Health check da API
 */
function healthCheck(req, res) {
  res.status(200).json({
    status: 'ONLINE',
    servico: 'STGP Digital — API de Declaração de Dependentes',
    versao: '1.0.0',
    data: new Date().toISOString()
  });
}

module.exports = {
  submeterDeclaracao,
  validarProtocolo,
  healthCheck,
};
