/**
 * =========================================================================
 * STGP DIGITAL — FCT UNESP
 * API BACKEND / WEBHOOK: DECLARAÇÃO DE DEPENDENTES (ENCARGOS DE FAMÍLIA)
 * =========================================================================
 * 
 * Configuração de Implantação no Google Apps Script:
 * 1. Executar como: "Eu (seu e-mail institucional)"
 * 2. Quem tem acesso: "Qualquer pessoa"
 */

// Configurações Gerais e de Segurança
var CONFIG = {
  NOME_ABA: "Respostas",                     // Nome da aba da planilha
  REMETENTE_OFICIAL: "rh.fct@unesp.br",       // Alias institucional oficial configurado no seu Gmail
  EMAIL_NOTIFICACAO: "anderros10@gmail.com", // Destinatário da notificação nos testes (trocar para rh.fct@unesp.br em produção)
  DOMINIO_PERMITIDO: "@unesp.br",            // Validação de segurança institucional
  CLIENT_ID: "778581688889-tbjjj3clvgu45bl6aqcgtbr2qcb15du6.apps.googleusercontent.com", // Client ID oficial do Google OAuth
  CHAVE_APLICACAO_STGP: "STGP_FCT_UNESP_SECURE_TOKEN_2026_9b8a7c", // Chave de integridade do portal
  COOLDOWN_SEGUNDOS: 15                      // Intervalo anti-flood entre submissões da mesma conta
};

/**
 * Endpoint POST: Recebe a submissão do formulário do portal STGP Digital
 */
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var dados = JSON.parse(rawData);

    // -------------------------------------------------------------
    // CAMADA 1: Validação da Chave de Integridade da Aplicação (App Key)
    // Impede chamadas diretas de robôs/spiders na URL do webhook
    // -------------------------------------------------------------
    if (dados.chaveSeguranca !== CONFIG.CHAVE_APLICACAO_STGP) {
      Logger.log("Acesso bloqueado: Chave de integridade ausente ou inválida.");
      return jsonResponse({
        sucesso: false,
        erro: "Requisição não autorizada: Chave de integridade do sistema inválida."
      });
    }

    // -------------------------------------------------------------
    // CAMADA 2: Validação do E-mail Institucional (@unesp.br)
    // -------------------------------------------------------------
    var emailServidor = (dados.email || "").toString().toLowerCase().trim();
    if (!emailServidor.endsWith(CONFIG.DOMINIO_PERMITIDO)) {
      return jsonResponse({
        sucesso: false,
        erro: "Acesso não autorizado: o e-mail deve pertencer ao domínio @unesp.br da UNESP."
      });
    }

    // -------------------------------------------------------------
    // CAMADA 3: Validação Criptográfica do Token Google (OAuth JWT)
    // Garante que o e-mail realmente pertence ao usuário logado e
    // impede forjar identidade de qualquer outro servidor
    // -------------------------------------------------------------
    var tokenGoogle = dados.tokenGoogle;
    if (!tokenGoogle) {
      return jsonResponse({
        sucesso: false,
        erro: "Acesso não autorizado: Token de sessão Google ausente."
      });
    }

    try {
      var urlTokenInfo = "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(tokenGoogle);
      var resGoogle = UrlFetchApp.fetch(urlTokenInfo, { muteHttpExceptions: true });

      if (resGoogle.getResponseCode() !== 200) {
        return jsonResponse({
          sucesso: false,
          erro: "Sessão Google expirada ou inválida. Por favor, recarregue a página e conecte-se com sua conta UNESP."
        });
      }

      var tokenInfo = JSON.parse(resGoogle.getContentText());

      // 3.1. O token deve pertencer ao Client ID oficial da nossa aplicação STGP
      if (tokenInfo.aud !== CONFIG.CLIENT_ID) {
        return jsonResponse({
          sucesso: false,
          erro: "Token Google não pertence a esta aplicação institucional."
        });
      }

      // 3.2. O e-mail autenticado pelo Google DEVE ser idêntico ao e-mail enviado no formulário
      var emailVerificadoGoogle = (tokenInfo.email || "").toString().toLowerCase().trim();
      if (emailVerificadoGoogle !== emailServidor) {
        return jsonResponse({
          sucesso: false,
          erro: "Divergência de autenticação: O e-mail do formulário não corresponde à conta Google conectada."
        });
      }

      // 3.3. Confirma o domínio institucional UNESP
      if (tokenInfo.hd !== "unesp.br" && !emailVerificadoGoogle.endsWith(CONFIG.DOMINIO_PERMITIDO)) {
        return jsonResponse({
          sucesso: false,
          erro: "Acesso negado: Conta Google não pertence à organização UNESP."
        });
      }

    } catch (errToken) {
      Logger.log("Erro na validação do token Google: " + errToken.toString());
      return jsonResponse({
        sucesso: false,
        erro: "Falha na verificação de identidade junto ao Google: " + errToken.toString()
      });
    }

    // -------------------------------------------------------------
    // CAMADA 4: Anti-Flood e Rate Limiting (CacheService)
    // Impede disparos em massa repetidos que esgotariam cotas de e-mail
    // -------------------------------------------------------------
    var cache = CacheService.getScriptCache();
    var chaveCache = "submissao_anti_flood_" + Utilities.base64Encode(emailServidor);
    if (cache.get(chaveCache)) {
      return jsonResponse({
        sucesso: false,
        erro: "Envio bloqueado temporariamente (Anti-Flood). Aguarde alguns instantes antes de reenviar."
      });
    }
    // Bloqueia envios repetidos da mesma conta pelos próximos 15 segundos
    cache.put(chaveCache, "ativo", CONFIG.COOLDOWN_SEGUNDOS);

    // 2. Data e hora oficial de Brasília
    var dataHora = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
    var anoAtual = new Date().getFullYear();

    // 3. Geração do Protocolo / Código de Autenticidade (Padrão: FCT-STGP-DEP-2026-XXXXXXXX)
    var sufixo = Utilities.getUuid().substring(0, 8).toUpperCase();
    var codigoAutenticidade = "FCT-STGP-DEP-" + anoAtual + "-" + sufixo;

    // 4. Geração do Hash SHA-256 para Carimbo Criptográfico
    var payloadIntegridade = codigoAutenticidade + "|" + (dados.cpf || "") + "|" + emailServidor + "|" + dataHora;
    var hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payloadIntegridade, Utilities.Charset.UTF_8);
    var hashAutenticidade = hashBytes.map(function(byte) {
      return (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0');
    }).join('');

    // 5. Tratamento dos dados de dependentes
    var possuiDependentes = Boolean(dados.possuiDependentes);
    var tipoDeclaracao = possuiDependentes ? "Com Dependentes" : "Declaração Negativa de Dependentes";
    var listaDependentes = Array.isArray(dados.dependentes) ? dados.dependentes : [];

    var dependentesFormatado = "Nenhum dependente informado (Declaração Negativa)";
    if (possuiDependentes && listaDependentes.length > 0) {
      dependentesFormatado = listaDependentes.map(function(dep, idx) {
        var fins = dep.finalidades && Array.isArray(dep.finalidades) ? dep.finalidades.join(", ") : (dep.finalidades || "N/A");
        var nomeComp = dep.nome || "N/A";
        if (dep.nomeAbreviado && dep.nomeAbreviado !== dep.nome) {
          nomeComp += " (" + dep.nomeAbreviado + ")";
        }
        var parentesco = dep.parentesco || "N/A";
        if (dep.responsabilidade && dep.responsabilidade !== "-") {
          parentesco += " [" + dep.responsabilidade + "]";
        }
        var nasc = dep.nascimento || dep.dataNascimento || "N/A";
        if (dep.idade) {
          nasc += " (" + dep.idade + ")";
        }
        return "[#" + (idx + 1) + " Nome: " + nomeComp + " | CPF: " + (dep.cpf || "N/A") + " | Sexo: " + (dep.sexo || "N/A") + " | Parentesco: " + parentesco + " | Nasc: " + nasc + " | Fins: " + fins + "]";
      }).join(";\n");
    }

    // 6. Gravação na Planilha Google
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(CONFIG.NOME_ABA);
    if (!aba) {
      aba = planilha.getSheets()[0];
    }

    // Se a aba estiver vazia, cria os cabeçalhos oficiais
    if (aba.getLastRow() === 0) {
      aba.appendRow([
        "Data e Hora",
        "Código de Autenticidade",
        "E-mail Institucional",
        "Nome do Servidor",
        "CPF",
        "Estado Civil",
        "Endereço Residencial",
        "Tipo de Declaração",
        "Qtd Dependentes",
        "Relação dos Dependentes",
        "Hash Criptográfico (SHA-256)"
      ]);
      aba.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#00a3e3").setFontColor("#ffffff");
      aba.setFrozenRows(1);
    }

    var linha = [
      dataHora,
      codigoAutenticidade,
      emailServidor,
      dados.nome || "",
      dados.cpf || "",
      dados.estadoCivil || "",
      dados.enderecoCompleto || "",
      tipoDeclaracao,
      possuiDependentes ? listaDependentes.length : 0,
      dependentesFormatado,
      hashAutenticidade
    ];

    aba.appendRow(linha);
    SpreadsheetApp.flush(); // Garante a gravação imediata na planilha

    // 7. Envio do Comprovante Institucional por E-mail via alias oficial da STGP
    var statusEmail = "OK";
    try {
      enviarEmailsComprovante({
        nome: dados.nome || emailServidor,
        email: emailServidor,
        cpf: dados.cpf || "",
        codigoAutenticidade: codigoAutenticidade,
        dataHora: dataHora,
        tipoDeclaracao: tipoDeclaracao,
        qtdDependentes: possuiDependentes ? listaDependentes.length : 0,
        hashAutenticidade: hashAutenticidade
      });
    } catch (errEmail) {
      statusEmail = "Erro no envio: " + errEmail.toString();
      Logger.log("Erro ao enviar e-mail: " + errEmail.toString());
    }

    // 8. Retorno JSON de Sucesso
    return jsonResponse({
      sucesso: true,
      mensagem: "Declaração registrada e autenticada com sucesso!",
      protocolo: codigoAutenticidade,
      dataHora: dataHora,
      hash: hashAutenticidade,
      statusEmail: statusEmail
    });

  } catch (error) {
    return jsonResponse({
      sucesso: false,
      erro: "Erro interno no servidor de registro: " + error.toString()
    });
  }
}

/**
 * Endpoint GET: Consulta pública para validação de autenticidade
 * Uso: URL_DO_SCRIPT?validar=FCT-STGP-DEP-2026-XXXX
 */
function doGet(e) {
  try {
    var protocolo = (e && e.parameter && e.parameter.validar) ? e.parameter.validar.trim().toUpperCase() : null;

    if (!protocolo) {
      return jsonResponse({
        sistema: "STGP Digital — API de Validação de Documentos",
        unidade: "Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente (UNESP)",
        status: "ONLINE"
      });
    }

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var abas = planilha.getSheets();

    for (var s = 0; s < abas.length; s++) {
      var dados = abas[s].getDataRange().getValues();
      for (var i = 0; i < dados.length; i++) {
        for (var col = 0; col < dados[i].length; col++) {
          var celula = (dados[i][col] || "").toString().trim().toUpperCase();
          if (celula === protocolo) {
            return jsonResponse({
              valido: true,
              protocolo: protocolo,
              dataHora: dados[i][0] || "N/A",
              nome: dados[i][3] || "Servidor Autenticado",
              tipoDeclaracao: dados[i][7] || "Declaração Oficial",
              qtdDependentes: dados[i][8] || 0,
              hash: dados[i][10] || "N/A"
            });
          }
        }
      }
    }

    return jsonResponse({
      valido: false,
      mensagem: "Protocolo não encontrado na base de autenticidade da STGP."
    });

  } catch (err) {
    return jsonResponse({
      valido: false,
      erro: err.toString()
    });
  }
}

/**
 * Envia o e-mail timbrado para o Servidor e notifica a STGP usando o alias institucional
 */
function enviarEmailsComprovante(info) {
  var assunto = "[STGP Digital] Comprovante de Declaração de Dependentes - " + info.codigoAutenticidade;

  var textoPuro = "STGP Digital — FCT UNESP\n" +
                  "Comprovante de Declaração de Dependentes (Encargos de Família)\n\n" +
                  "Prezado(a) " + info.nome + ",\n" +
                  "Confirmamos o recebimento eletrônico de sua " + info.tipoDeclaracao + ".\n\n" +
                  "Protocolo / Autenticidade: " + info.codigoAutenticidade + "\n" +
                  "Data e Hora: " + info.dataHora + "\n" +
                  "CPF: " + info.cpf + "\n" +
                  "E-mail: " + info.email + "\n" +
                  "Tipo: " + info.tipoDeclaracao + "\n" +
                  "Qtd. Dependentes: " + info.qtdDependentes + "\n" +
                  "Hash SHA-256: " + info.hashAutenticidade + "\n\n" +
                  "Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente / UNESP\n" +
                  "Seção Técnica de Gestão de Pessoas (STGP) — rh.fct@unesp.br";

  var htmlTemplate = 
    '<div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
      '<div style="background-color: #00a3e3; color: #ffffff; padding: 22px; text-align: center;">' +
        '<h2 style="margin: 0; font-size: 20px;">STGP Digital — FCT UNESP</h2>' +
        '<p style="margin: 4px 0 0; font-size: 14px; opacity: 0.95;">Comprovante de Declaração de Dependentes (Encargos de Família)</p>' +
      '</div>' +
      '<div style="padding: 24px; color: #334155; line-height: 1.6;">' +
        '<p>Prezado(a) <strong>' + info.nome + '</strong>,</p>' +
        '<p>Confirmamos o recebimento e o registro eletrônico de sua <strong>' + info.tipoDeclaracao + '</strong> junto à Seção Técnica de Gestão de Pessoas da FCT UNESP.</p>' +
        '<div style="background: #f0f9fd; border: 2px dashed #00a3e3; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">' +
          '<div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Código de Autenticidade / Protocolo:</div>' +
          '<div style="font-size: 22px; font-weight: bold; color: #0077a8; letter-spacing: 1px; margin-top: 4px;">' + info.codigoAutenticidade + '</div>' +
          '<div style="font-size: 12px; color: #64748b; margin-top: 4px;">Data e Hora: ' + info.dataHora + '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Servidor(a):</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' + info.nome + '</td></tr>' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">CPF:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' + info.cpf + '</td></tr>' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">E-mail:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' + info.email + '</td></tr>' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Tipo de Declaração:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' + info.tipoDeclaracao + '</td></tr>' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Qtd. Dependentes:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' + info.qtdDependentes + '</td></tr>' +
          '<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Hash SHA-256:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px; word-break: break-all;">' + info.hashAutenticidade + '</td></tr>' +
        '</table>' +
        '<p style="margin-top: 22px; font-size: 12px; color: #64748b;">Este comprovante possui autenticidade digital conferida e arquivada nos sistemas da FCT UNESP.</p>' +
      '</div>' +
      '<div style="background: #1b303b; color: #ffffff; padding: 14px; text-align: center; font-size: 11px;">' +
        'Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente / UNESP<br>' +
        'Seção Técnica de Gestão de Pessoas (STGP) — rh.fct@unesp.br' +
      '</div>' +
    '</div>';

  // 1. Verifica se o alias oficial está cadastrado na conta do Google
  var aliases = [];
  try {
    aliases = GmailApp.getAliases();
    Logger.log("Aliases disponíveis na conta: " + JSON.stringify(aliases));
  } catch (errAlias) {
    Logger.log("Não foi possível listar aliases: " + errAlias.toString());
  }

  var aliasOficialDisponivel = aliases.some(function(alias) {
    return alias.toLowerCase() === CONFIG.REMETENTE_OFICIAL.toLowerCase();
  });

  var opcoesPadrao = {
    name: "Seção Técnica de Gestão de Pessoas - FCT/UNESP",
    replyTo: CONFIG.REMETENTE_OFICIAL,
    htmlBody: htmlTemplate
  };

  if (aliasOficialDisponivel) {
    opcoesPadrao.from = CONFIG.REMETENTE_OFICIAL;
    Logger.log("Remetente configurado com o alias oficial: " + CONFIG.REMETENTE_OFICIAL);
  } else {
    Logger.log("Aviso: Alias " + CONFIG.REMETENTE_OFICIAL + " não retornado em getAliases(). Enviando com remetente padrão e replyTo oficial.");
  }

  // Função interna de disparo seguro com fallback
  function dispararEmailComSeguranca(destinatario, titulo) {
    try {
      GmailApp.sendEmail(destinatario, titulo, textoPuro, opcoesPadrao);
      Logger.log("E-mail enviado com sucesso para: " + destinatario);
    } catch (errEnvio) {
      Logger.log("Tentativa com opcoesPadrao falhou para " + destinatario + ": " + errEnvio.toString() + ". Tentando fallback sem parâmetro 'from'...");
      var opcoesFallback = {
        name: "Seção Técnica de Gestão de Pessoas - FCT/UNESP",
        replyTo: CONFIG.REMETENTE_OFICIAL,
        htmlBody: htmlTemplate
      };
      GmailApp.sendEmail(destinatario, titulo, textoPuro, opcoesFallback);
      Logger.log("E-mail enviado com sucesso (fallback) para: " + destinatario);
    }
  }

  // Envio 1: Comprovante para o Servidor Declarante (@unesp.br)
  dispararEmailComSeguranca(info.email, assunto);

  // Envio 2: Notificação para a Administração / Testes (anderros10@gmail.com)
  dispararEmailComSeguranca(CONFIG.EMAIL_NOTIFICACAO, "[Novo Registro] " + assunto);
}

/**
 * Função de Teste e Autorização Única de Envio de E-mails
 * Execute esta função manualmente no Editor do Apps Script para conceder a permissão do Gmail!
 */
function testarPermissaoEmail() {
  var meuEmail = Session.getActiveUser().getEmail() || CONFIG.EMAIL_NOTIFICACAO;
  Logger.log("Iniciando teste de e-mail e segurança para: " + meuEmail);
  Logger.log("Verificando aliases...");
  var aliases = GmailApp.getAliases();
  Logger.log("Aliases encontrados: " + JSON.stringify(aliases));

  // Testa UrlFetchApp para garantir que a permissão de requisição externa seja concedida
  try {
    UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo", { muteHttpExceptions: true });
    Logger.log("Permissão UrlFetchApp (validação de token Google) verificada com sucesso.");
  } catch (eUrl) {
    Logger.log("Aviso UrlFetchApp: " + eUrl.toString());
  }

  enviarEmailsComprovante({
    nome: "Anderson Luiz Ros de Sousa",
    email: meuEmail,
    cpf: "000.000.000-00",
    codigoAutenticidade: "FCT-STGP-DEP-TESTE",
    dataHora: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"),
    tipoDeclaracao: "Teste de Autorização Oficial STGP",
    qtdDependentes: 0,
    hashAutenticidade: "teste_autenticacao_ok"
  });
  Logger.log("Teste de e-mail e permissões concluído com sucesso!");
}

/**
 * Função auxiliar para retornar respostas em JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
