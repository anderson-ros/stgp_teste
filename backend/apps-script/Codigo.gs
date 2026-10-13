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
  COOLDOWN_SEGUNDOS: 15,                     // Intervalo anti-flood entre submissões da mesma conta
  URL_VALIDACAO: "https://anderson-ros.github.io/stgp_teste/dependentes/validar.html" // URL de validação (alterar caso aponte para domínio próprio)
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
    var hashCalculado = hashBytes.map(function(byte) {
      return (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
    var hashAutenticidade = (dados.hashCliente && dados.hashCliente.length >= 16) ? dados.hashCliente.toUpperCase() : hashCalculado;

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
        estadoCivil: dados.estadoCivil || "-",
        endereco: dados.endereco || {},
        enderecoCompleto: dados.enderecoCompleto || "",
        codigoAutenticidade: codigoAutenticidade,
        dataHora: dataHora,
        tipoDeclaracao: tipoDeclaracao,
        possuiDependentes: possuiDependentes,
        dependentes: listaDependentes,
        qtdDependentes: possuiDependentes ? listaDependentes.length : 0,
        hashAutenticidade: hashAutenticidade,
        pdfBase64: dados.pdfBase64 || null,
        filename: dados.filename || null
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
      dataHora: dataHora + " (Horário de Brasília)",
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
    var paramBusca = (e && e.parameter) ? (e.parameter.validar || e.parameter.codigo || e.parameter.protocolo || e.parameter.hash) : null;
    var protocolo = paramBusca ? paramBusca.trim().toUpperCase() : null;

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
            var rawDataHora = dados[i][0];
            var dataHoraFormatada = "N/A";
            if (rawDataHora instanceof Date) {
              dataHoraFormatada = Utilities.formatDate(rawDataHora, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss") + " (Horário de Brasília)";
            } else if (rawDataHora) {
              var strDH = rawDataHora.toString().trim().replace(/\s*\([^)]*bras[ií]lia[^)]*\)/gi, "").trim();
              var mSemSeg = strDH.match(/^(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2})$/);
              if (mSemSeg) strDH += ":00";
              dataHoraFormatada = strDH + " (Horário de Brasília)";
            }
            return jsonResponse({
              valido: true,
              protocolo: protocolo,
              dataHora: dataHoraFormatada,
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

  // Formata data e hora para exibição: "DD/MM/AAAA às HH:mm"
  var dataTransmissao = info.dataHora || "";
  if (dataTransmissao) {
    var partesDH = dataTransmissao.split(" ");
    if (partesDH.length >= 2) {
      dataTransmissao = partesDH[0] + " às " + partesDH[1].substring(0, 5);
    }
  }

  var dependentes = Array.isArray(info.dependentes) ? info.dependentes : [];
  var qtdDeps = info.possuiDependentes ? dependentes.length : 0;

  // Montagem da Seção de Dependentes (Tabela ou Declaração Negativa)
  var secaoDependentesHtml = "";
  var textoDependentesPuro = "";

  if (info.possuiDependentes && dependentes.length > 0) {
    var linhasTabela = "";
    for (var i = 0; i < dependentes.length; i++) {
      var dep = dependentes[i];

      // 1. Nome Completo e Nome Secundário/Abreviado em maiúsculas
      var nomeOficial = dep.nome || "Não informado";
      var nomeSecundario = dep.nomeAbreviado || dep.nome || "";
      var htmlNome = '<div style="font-weight: bold; color: #0f172a;">' + nomeOficial + '</div>';
      if (nomeSecundario) {
        htmlNome += '<div style="color: #64748b; font-size: 11px; margin-top: 3px; text-transform: uppercase;">(' + nomeSecundario.toUpperCase() + ')</div>';
      }

      // 2. CPF
      var htmlCpf = dep.cpf || "-";

      // 3. Parentesco e Responsabilidade (se aplicável)
      var parentescoStr = dep.parentesco || "-";
      var htmlParentesco = '<div>' + parentescoStr + '</div>';
      var resp = (dep.responsabilidade || "").trim();
      if (resp && resp !== "-" && !/^n[aã]o/i.test(resp)) {
        htmlParentesco += '<div style="color: #475569; font-size: 12px; margin-top: 2px;">(' + resp + ')</div>';
      }

      // 4. Nascimento e Idade calculada
      var nascStr = dep.nascimento || dep.dataNascimento || "-";
      var idadeStr = dep.idade || "";
      if (!idadeStr && nascStr && nascStr !== "-") {
        var partesNasc = nascStr.split("/");
        if (partesNasc.length === 3) {
          var anoN = parseInt(partesNasc[2], 10);
          var mesN = parseInt(partesNasc[1], 10) - 1;
          var diaN = parseInt(partesNasc[0], 10);
          var dtN = new Date(anoN, mesN, diaN);
          var dtHoje = new Date();
          var diffAnos = dtHoje.getFullYear() - dtN.getFullYear();
          var diffMes = dtHoje.getMonth() - dtN.getMonth();
          if (diffMes < 0 || (diffMes === 0 && dtHoje.getDate() < dtN.getDate())) {
            diffAnos--;
          }
          idadeStr = diffAnos + (diffAnos === 1 ? " ano" : " anos");
        }
      } else if (idadeStr && !/ano/i.test(idadeStr)) {
        idadeStr = idadeStr + " anos";
      }
      var htmlNascIdade = nascStr + (idadeStr ? ' (' + idadeStr + ')' : '');

      // 5. Finalidades amigáveis (IRRF, Plano Saúde, etc.)
      var fins = dep.finalidades || [];
      if (!Array.isArray(fins)) fins = [fins];
      var rotulos = fins.map(function(item) {
        var str = (item || "").toString().trim();
        if (/imposto/i.test(str) || /irrf/i.test(str)) return "IRRF";
        if (/sal[aá]rio/i.test(str)) return "Salário-Família";
        if (/plano/i.test(str) || /sa[uú]de/i.test(str) || /odonto/i.test(str)) return "Plano Saúde";
        if (/incapacitado/i.test(str)) return "Incapacitado p/ Trabalho";
        return str;
      });
      var htmlFinalidades = rotulos.length > 0 ? rotulos.join(", ") : "-";

      linhasTabela += 
        '<tr style="background-color: #ffffff; border: 1px solid #cbd5e1;">' +
          '<td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">' + htmlNome + '</td>' +
          '<td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1; white-space: nowrap;">' + htmlCpf + '</td>' +
          '<td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">' + htmlParentesco + '</td>' +
          '<td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1; white-space: nowrap;">' + htmlNascIdade + '</td>' +
          '<td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">' + htmlFinalidades + '</td>' +
        '</tr>';

      textoDependentesPuro += "\n- " + nomeOficial + " (" + (nomeSecundario || "").toUpperCase() + ") | CPF: " + htmlCpf + " | Parentesco: " + parentescoStr + (resp && resp !== "-" ? " (" + resp + ")" : "") + " | Nasc: " + htmlNascIdade + " | Fins: " + htmlFinalidades;
    }

    secaoDependentesHtml = 
      '<h3 style="color: #0055a5; font-size: 16px; font-weight: bold; margin: 24px 0 12px 0;">Dependentes Declarados (' + dependentes.length + '):</h3>' +
      '<table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 22px; border: 1px solid #cbd5e1;">' +
        '<thead>' +
          '<tr style="background-color: #004b87; color: #ffffff;">' +
            '<th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Nome</th>' +
            '<th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">CPF</th>' +
            '<th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Parentesco</th>' +
            '<th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Nascimento/<br>Idade</th>' +
            '<th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Finalidades</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          linhasTabela +
        '</tbody>' +
      '</table>';
  } else {
    secaoDependentesHtml = 
      '<h3 style="color: #0055a5; font-size: 16px; font-weight: bold; margin: 24px 0 12px 0;">Declaração Negativa de Dependentes:</h3>' +
      '<div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px 18px; color: #334155; font-size: 13px; line-height: 1.6;">' +
        'O(a) servidor(a) declarou sob as penas da lei que <strong style="color: #ea580c;">NÃO POSSUI DEPENDENTES</strong> para fins de dedução do Imposto de Renda Retido na Fonte (IRRF), percepção de Salário-Família ou vinculação a Plano de Saúde Privado junto à UNESP.' +
      '</div>';
    textoDependentesPuro = "\nNÃO POSSUI DEPENDENTES (Declaração Negativa)";
  }

  var textoPuro = "STGP Digital — FCT UNESP\n" +
                  "Comprovante de Declaração de Dependentes (Encargos de Família)\n\n" +
                  "Servidor(a) Declarante: " + info.nome + "\n" +
                  "E-mail Institucional: " + info.email + "\n" +
                  "CPF: " + info.cpf + "\n" +
                  "Estado Civil: " + (info.estadoCivil || "-") + "\n" +
                  "Data e Hora de Transmissão: " + dataTransmissao + "\n\n" +
                  "Código de Autenticidade: " + info.codigoAutenticidade + "\n\n" +
                  "Dependentes Declarados (" + qtdDeps + "):" + textoDependentesPuro + "\n\n" +
                  "Autenticidade Criptográfica (SHA-256):\n" + (info.hashAutenticidade || "").toUpperCase() + "\n\n" +
                  "Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente / UNESP\n" +
                  "Seção Técnica de Gestão de Pessoas (STGP) — rh.fct@unesp.br";

  var htmlTemplate = 
    '<div style="font-family: Arial, Helvetica, sans-serif; max-width: 680px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
      '<div style="background-color: #004b87; color: #ffffff; padding: 20px; text-align: center;">' +
        '<h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.01em;">STGP Digital — FCT UNESP</h2>' +
        '<p style="margin: 4px 0 0; font-size: 13px; opacity: 0.95;">Comprovante de Declaração de Dependentes (Encargos de Família)</p>' +
      '</div>' +
      '<div style="padding: 24px; color: #334155; line-height: 1.6;">' +
        '<div style="background: #f0f9fd; border: 2px dashed #00a3e3; border-radius: 6px; padding: 14px; text-align: center; margin-bottom: 20px;">' +
          '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Código de Autenticidade / Protocolo:</div>' +
          '<div style="font-size: 20px; font-weight: bold; color: #0077a8; letter-spacing: 1px; margin-top: 3px;">' + info.codigoAutenticidade + '</div>' +
        '</div>' +

        '<!-- Bloco Superior de Identificação do Servidor (Conforme Print Oficial) -->' +
        '<div style="background-color: #f0f7fc; border-left: 4px solid #0055a5; padding: 14px 18px; margin: 18px 0 22px 0; font-size: 14px; line-height: 1.7; color: #1e293b;">' +
          '<div><strong>Servidor(a) Declarante:</strong> ' + info.nome + '</div>' +
          '<div><strong>E-mail Institucional:</strong> ' + info.email + '</div>' +
          '<div><strong>CPF:</strong> ' + info.cpf + '</div>' +
          '<div><strong>Estado Civil:</strong> ' + (info.estadoCivil || "-") + '</div>' +
          '<div><strong>Data e Hora de Transmissão:</strong> ' + dataTransmissao + '</div>' +
        '</div>' +

        '<!-- Seção de Dependentes Declarados (Tabela Oficial) -->' +
        secaoDependentesHtml +

        '<!-- Bloco de Autenticidade Criptográfica SHA-256 (Conforme Print Oficial) -->' +
        '<div style="margin-top: 22px; border: 1px dashed #94a3b8; border-radius: 4px; padding: 12px 16px; background-color: #f8fafc;">' +
          '<div style="font-weight: bold; color: #1e293b; font-size: 13px; margin-bottom: 4px;">Autenticidade Criptográfica (SHA-256):</div>' +
          '<div style="font-family: \'Courier New\', Courier, monospace; font-size: 12px; color: #0f172a; word-break: break-all; letter-spacing: 0.5px;">' + (info.hashAutenticidade || "").toUpperCase() + '</div>' +
        '</div>' +

        '<p style="margin-top: 24px; font-size: 12px; color: #64748b; line-height: 1.5;">' +
          'Este comprovante possui autenticidade digital conferida e arquivada nos sistemas eletrônicos da FCT UNESP.' +
        '</p>' +
      '</div>' +
      '<div style="background: #1b303b; color: #ffffff; padding: 14px; text-align: center; font-size: 11px; line-height: 1.5;">' +
        'Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente / UNESP<br>' +
        'Seção Técnica de Gestão de Pessoas (STGP) — rh.fct@unesp.br' +
      '</div>' +
    '</div>';

  // 0. Preparação do Documento PDF Oficial da Declaração (Folha A4 Paisagem)
  var pdfAnexo = null;
  try {
    if (info.pdfBase64) {
      var pdfBytes = Utilities.base64Decode(info.pdfBase64);
      var nomeArquivoPdf = info.filename || ("Declaracao_Dependentes_" + (info.nome || "Servidor").replace(/\s+/g, "_") + ".pdf");
      pdfAnexo = Utilities.newBlob(pdfBytes, "application/pdf", nomeArquivoPdf);
      Logger.log("PDF oficial (vetorial jsPDF) decodificado e anexado com sucesso: " + pdfAnexo.getName());
    } else {
      pdfAnexo = gerarPdfDeclaracao(info);
      Logger.log("PDF oficial gerado via fallback interno: " + pdfAnexo.getName());
    }
  } catch (errPdf) {
    Logger.log("Erro na preparação do anexo PDF: " + errPdf.toString());
  }

  var anexos = pdfAnexo ? [pdfAnexo] : [];

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
    htmlBody: htmlTemplate,
    attachments: anexos
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
        htmlBody: htmlTemplate,
        attachments: anexos
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
 * =========================================================================
 * GERAÇÃO DO PDF OFICIAL TIMBRADO (A4 PAISAGEM)
 * =========================================================================
 * - Suporta até 8 dependentes numa mesma folha A4
 * - Contém barra vertical na margem direita com carimbo de assinatura eletrônica,
 *   data/hora e link oficial para verificação de autenticidade
 */
function gerarHtmlDeclaracaoPdf(info) {
  var urlValidacao = CONFIG.URL_VALIDACAO || "https://anderson-ros.github.io/stgp_teste/dependentes/validar.html";
  var nomeServidor = (info.nome || "").toUpperCase();
  var emailServidor = (info.email || "").toLowerCase();
  var cpfServidor = info.cpf || "-";
  var cpfLimpo = (info.cpf || "").replace(/\D/g, "");
  var ctpsNum = cpfLimpo.length >= 7 ? cpfLimpo.substring(0, 7) : cpfLimpo;
  var ctpsSerie = cpfLimpo.length >= 11 ? cpfLimpo.substring(cpfLimpo.length - 4) : (cpfLimpo.substring(7) || "-");
  var ctpsUf = "SP";
  var cpfFormatado = cpfLimpo.length === 11 ? cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpfServidor;
  var estadoCivil = (info.estadoCivil || "-").toUpperCase();

  // Endereço do Servidor
  var end = info.endereco || {};
  var logradouroCompleto = (end.tipoLogradouro ? (end.tipoLogradouro + " ") : "") + (end.logradouro || "");
  if (!logradouroCompleto.trim() && info.enderecoCompleto) {
    logradouroCompleto = info.enderecoCompleto;
  }
  var numero = end.numero || "-";
  var complemento = end.complemento || "-";
  var bairro = (end.bairro || "-").toUpperCase();
  var cidade = (end.cidade || "PRESIDENTE PRUDENTE").toUpperCase();
  var uf = (end.uf || "SP").toUpperCase();
  var cep = end.cep || "-";
  var cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length === 8) {
    cep = cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  // Data por extenso oficial
  var dataHoje = new Date();
  var meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var dataPorExtenso = "Presidente Prudente, " + dataHoje.getDate() + " de " + meses[dataHoje.getMonth()] + " de " + dataHoje.getFullYear() + ".";

  // Data e hora para a lateral de autenticação
  var dataHoraLateral = info.dataHora || Utilities.formatDate(dataHoje, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
  var partesDH = dataHoraLateral.split(" ");
  var dataTransmissao = partesDH[0] + (partesDH[1] ? " às " + partesDH[1].substring(0, 5) : "");

  // Linhas da Tabela de Dependentes
  var possuiDeps = Boolean(info.possuiDependentes);
  var dependentes = Array.isArray(info.dependentes) ? info.dependentes : [];
  var linhasTabelaHtml = "";
  var textoIntro = "";

  if (possuiDeps && dependentes.length > 0) {
    textoIntro = "Em obediência à legislação vigente, venho pela presente informar que possuo como encargo(s) de família a(s) pessoa(s) abaixo relacionada(s):";

    for (var i = 0; i < dependentes.length; i++) {
      var d = dependentes[i];
      var seq = i + 1;
      var nomeDep = (d.nome || "-").toUpperCase();
      var nascDep = d.nascimento || d.dataNascimento || "-";
      var parentescoDep = (d.parentesco || "-").toUpperCase();
      var sexoDep = (d.sexo || "-").toUpperCase();
      var respDep = (d.responsabilidade && d.responsabilidade !== "-" ? d.responsabilidade : "-").toUpperCase();
      var cpfDep = d.cpf || "-";

      var finalidades = d.finalidades || [];
      if (!Array.isArray(finalidades)) finalidades = [finalidades];

      var isIR = finalidades.some(function(f) { return /irrf|imposto/i.test(String(f)); }) ? "Sim" : "Não";
      var isSalario = finalidades.some(function(f) { return /sal[aá]rio/i.test(String(f)); }) ? "Sim" : "Não";
      var isSaude = finalidades.some(function(f) { return /plano|sa[uú]de/i.test(String(f)); }) ? "Sim" : "Não";
      var isIncapacitado = finalidades.some(function(f) { return /incapacitado/i.test(String(f)); }) ? "Sim" : "Não";

      linhasTabelaHtml += 
        '<tr>' +
          '<td>' + seq + '</td>' +
          '<td class="text-left">' + nomeDep + '</td>' +
          '<td>' + nascDep + '</td>' +
          '<td>' + parentescoDep + '</td>' +
          '<td>' + sexoDep + '</td>' +
          '<td>' + respDep + '</td>' +
          '<td>' + cpfDep + '</td>' +
          '<td>' + isIR + '</td>' +
          '<td>' + isSalario + '</td>' +
          '<td>' + isSaude + '</td>' +
          '<td>' + isIncapacitado + '</td>' +
        '</tr>';
    }
  } else {
    textoIntro = "Em obediência à legislação vigente, venho pela presente informar que NÃO POSSUO DEPENDENTES para fins de dedução do Imposto de Renda, Salário-Família ou Plano de Saúde.";
    linhasTabelaHtml = 
      '<tr>' +
        '<td colspan="11" class="td-negativa">' +
          'NÃO HÁ DEPENDENTES A DECLARAR (DECLARAÇÃO NEGATIVA DE ENCARGOS DE FAMÍLIA)' +
        '</td>' +
      '</tr>';
  }

  var html = 
    '<!DOCTYPE html>' +
    '<html lang="pt-BR">' +
    '<head>' +
      '<meta charset="UTF-8">' +
      '<title>Declaração de Dependentes - ' + info.codigoAutenticidade + '</title>' +
      '<style>' +
        '@page { size: A4 landscape; margin: 0; }' +
        '* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
        'body { font-family: Arial, Helvetica, sans-serif; color: #000000; width: 297mm; height: 210mm; padding: 6mm 14mm 5mm 10mm; position: relative; background: #ffffff; font-size: 7.5pt; line-height: 1.15; }' +
        '.lateral-svg { position: absolute; right: 1.5mm; top: 5mm; width: 10mm; height: 200mm; }' +
        '.doc-container { width: 271mm; }' +
        '.doc-header { text-align: center; margin-bottom: 2mm; }' +
        '.doc-title { font-size: 13.5pt; font-weight: bold; letter-spacing: 0.3px; }' +
        '.doc-subtitle { font-size: 7.8pt; margin-top: 1mm; color: #111111; }' +
        'table.grid-table { width: 100%; border-collapse: collapse; border: 0.8px solid #000000; margin-bottom: 1.8mm; }' +
        'table.grid-table th, table.grid-table td { border: 0.8px solid #000000; padding: 1.5px 3px; text-align: center; vertical-align: middle; }' +
        'table.grid-table th { background-color: #e8edf5; font-size: 6.2pt; font-weight: bold; color: #000000; height: 4.2mm; }' +
        'table.grid-table td { font-size: 7.2pt; height: 5.2mm; background-color: #ffffff; }' +
        '.td-val-bold { font-weight: bold; font-size: 8.2pt; }' +
        '.text-left { text-align: left !important; padding-left: 4px !important; }' +
        '.intro-text { font-size: 7.8pt; text-align: center; margin: 1.6mm 0; }' +
        'table.dep-table { width: 100%; border-collapse: collapse; border: 0.8px solid #000000; margin-bottom: 1.8mm; }' +
        'table.dep-table th, table.dep-table td { border: 0.8px solid #000000; padding: 1.2px 2px; text-align: center; vertical-align: middle; }' +
        'table.dep-table th { background-color: #e8edf5; font-size: 5.8pt; font-weight: bold; line-height: 1.1; height: 7mm; }' +
        'table.dep-table td { font-size: 6.8pt; height: 4.6mm; }' +
        '.td-negativa { background-color: #ffedd6 !important; color: #9a3412 !important; font-weight: bold; font-size: 7.5pt; height: 11mm; text-align: center; vertical-align: middle; border: 0.8px solid #000000 !important; letter-spacing: 0.2px; }' +
        '.decl-text { font-size: 7.6pt; text-align: justify; margin-bottom: 1.8mm; line-height: 1.2; }' +
        '.signature-block { text-align: center; margin-bottom: 2mm; }' +
        '.sig-date { font-size: 7.8pt; margin-bottom: 2.2mm; }' +
        '.sig-name { font-size: 8.2pt; font-weight: bold; text-transform: uppercase; }' +
        '.sig-email { font-size: 7.8pt; color: #222222; }' +
      '</style>' +
    '</head>' +
    '<body>' +
      '<svg class="lateral-svg" viewBox="0 0 40 700">' +
        '<text transform="translate(14, 680) rotate(-90)" font-family="Arial, Helvetica, sans-serif" font-size="8" fill="#333333">' +
          'Assinado eletronicamente por ' + nomeServidor + ' (' + emailServidor + '), em ' + dataTransmissao + '.' +
        '</text>' +
        '<text transform="translate(26, 680) rotate(-90)" font-family="Arial, Helvetica, sans-serif" font-size="8" fill="#333333">' +
          'Para conferir a autenticidade, acesse "' + urlValidacao + '" e informe o código ' + info.codigoAutenticidade +
        '</text>' +
      '</svg>' +
      '<div class="doc-container">' +
        '<div class="doc-header">' +
          '<div class="doc-title">DECLARAÇÃO DE DEPENDENTES</div>' +
          '<div class="doc-subtitle">Declaração de dependentes para fins de atualização cadastral (SisRH e Folha de Pagamento) e posterior envio ao eSocial</div>' +
        '</div>' +
        '<table class="grid-table">' +
          '<colgroup>' +
            '<col style="width: 29.6%;">' +
            '<col style="width: 7.4%;">' +
            '<col style="width: 13.3%;">' +
            '<col style="width: 17.0%;">' +
            '<col style="width: 17.4%;">' +
            '<col style="width: 4.1%;">' +
            '<col style="width: 11.2%;">' +
          '</colgroup>' +
          '<tr><th colspan="7">NOME DO DECLARANTE</th></tr>' +
          '<tr><td colspan="7" class="td-val-bold">' + nomeServidor + '</td></tr>' +
          '<tr>' +
            '<th>ENDEREÇO</th>' +
            '<th>Nº</th>' +
            '<th>COMPLEMENTO</th>' +
            '<th>BAIRRO</th>' +
            '<th>CIDADE</th>' +
            '<th>UF</th>' +
            '<th>CEP</th>' +
          '</tr>' +
          '<tr>' +
            '<td>' + logradouroCompleto.toUpperCase() + '</td>' +
            '<td>' + numero + '</td>' +
            '<td>' + complemento + '</td>' +
            '<td>' + bairro + '</td>' +
            '<td>' + cidade + '</td>' +
            '<td>' + uf + '</td>' +
            '<td>' + cep + '</td>' +
          '</tr>' +
          '<tr>' +
            '<th colspan="2">ESTADO CIVIL</th>' +
            '<th>CTPS Nº</th>' +
            '<th>CTPS SÉRIE</th>' +
            '<th>CTPS UF</th>' +
            '<th colspan="2">CPF</th>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="2">' + estadoCivil + '</td>' +
            '<td>' + ctpsNum + '</td>' +
            '<td>' + ctpsSerie + '</td>' +
            '<td>' + ctpsUf + '</td>' +
            '<td colspan="2" class="td-val-bold">' + cpfFormatado + '</td>' +
          '</tr>' +
        '</table>' +
        '<div class="intro-text">' + textoIntro + '</div>' +
        '<table class="dep-table">' +
          '<thead>' +
            '<tr>' +
              '<th style="width: 3.2%;">SEQ</th>' +
              '<th style="width: 25%;">NOME COMPLETO</th>' +
              '<th style="width: 8%;">DATA DE<br>NASC.</th>' +
              '<th style="width: 11%;">GRAU DE<br>PARENTESCO</th>' +
              '<th style="width: 4%;">SEXO</th>' +
              '<th style="width: 11%;">RESPONSABILIDADE</th>' +
              '<th style="width: 11%;">CPF</th>' +
              '<th style="width: 6.2%;">DEP<br>DE IR</th>' +
              '<th style="width: 6.8%;">DEP DE SAL.<br>FAMÍLIA</th>' +
              '<th style="width: 7.8%;">DEP DE PLANO<br>DE SAÚDE</th>' +
              '<th style="width: 7%;">INCAPACITADO<br>PARA O TRAB.</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            linhasTabelaHtml +
          '</tbody>' +
        '</table>' +
        '<div class="decl-text">' +
          'Declaro sob as penas da lei, que as informações aqui prestadas são verdadeiras e de minha inteira responsabilidade, não cabendo a fonte pagadora qualquer responsabilidade perante a fiscalização.' +
        '</div>' +
        '<div class="signature-block">' +
          '<div class="sig-date">' + dataPorExtenso + '</div>' +
          '<div class="sig-name">' + nomeServidor + '</div>' +
          '<div class="sig-email">' + emailServidor + '</div>' +
        '</div>' +
        '<table class="grid-table">' +
          '<colgroup>' +
            '<col style="width: 29.6%;">' +
            '<col style="width: 7.4%;">' +
            '<col style="width: 13.3%;">' +
            '<col style="width: 17.0%;">' +
            '<col style="width: 17.4%;">' +
            '<col style="width: 4.1%;">' +
            '<col style="width: 11.2%;">' +
          '</colgroup>' +
          '<tr><th colspan="7">NOME DA EMPRESA</th></tr>' +
          '<tr><td colspan="7" class="td-val-bold">UNESP - CÂMPUS DE PRESIDENTE PRUDENTE</td></tr>' +
          '<tr>' +
            '<th colspan="4">ENDEREÇO</th>' +
            '<th>Nº</th>' +
            '<th colspan="2">COMPLEMENTO</th>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="4">RUA ROBERTO SIMONSEN</td>' +
            '<td>305</td>' +
            '<td colspan="2">-</td>' +
          '</tr>' +
          '<tr>' +
            '<th colspan="2">BAIRRO</th>' +
            '<th colspan="3">CIDADE</th>' +
            '<th>UF</th>' +
            '<th>CEP</th>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="2">CENTRO EDUCACIONAL</td>' +
            '<td colspan="3">PRESIDENTE PRUDENTE</td>' +
            '<td>SP</td>' +
            '<td>19060-900</td>' +
          '</tr>' +
          '<tr>' +
            '<th colspan="4">CNPJ</th>' +
            '<th colspan="3">INSCRIÇÃO ESTADUAL</th>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="4" class="td-val-bold">48.031.918/0009-81</td>' +
            '<td colspan="3" class="td-val-bold">ISENTO</td>' +
          '</tr>' +
        '</table>' +
      '</div>' +
    '</body>' +
    '</html>';

  return html;
}

/**
 * Converte o HTML estruturado em Blob de PDF oficial para anexo de e-mail
 */
function gerarPdfDeclaracao(info) {
  var html = gerarHtmlDeclaracaoPdf(info);
  var blob = Utilities.newBlob(html, "text/html", "declaracao.html");
  var pdfBlob = blob.getAs("application/pdf");
  pdfBlob.setName("Declaracao_Dependentes_" + info.codigoAutenticidade + ".pdf");
  return pdfBlob;
}

/**
 * Função de Teste e Autorização Única de Envio de E-mails
 * Execute esta função manualmente no Editor do Apps Script para conceder a permissão do Gmail e Drive!
 */
function testarPermissaoEmail() {
  var meuEmail = Session.getActiveUser().getEmail() || CONFIG.EMAIL_NOTIFICACAO;
  Logger.log("Iniciando teste de e-mail com anexo PDF para: " + meuEmail);
  Logger.log("Verificando aliases...");
  var aliases = GmailApp.getAliases();
  Logger.log("Aliases encontrados: " + JSON.stringify(aliases));

  try {
    UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo", { muteHttpExceptions: true });
    Logger.log("Permissão UrlFetchApp verificada.");
  } catch (eUrl) {
    Logger.log("Aviso UrlFetchApp: " + eUrl.toString());
  }

  enviarEmailsComprovante({
    nome: "Ana Paula Carneiro",
    email: meuEmail,
    cpf: "223.821.748-70",
    estadoCivil: "Solteiro",
    endereco: {
      tipoLogradouro: "Rua",
      logradouro: "Domingos Leonardo Ceravolo",
      numero: "493",
      complemento: "-",
      bairro: "Vila Líder",
      cidade: "Presidente Prudente",
      uf: "SP",
      cep: "19041-170"
    },
    codigoAutenticidade: "FCT-STGP-DEP-2026-TESTE01",
    dataHora: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"),
    tipoDeclaracao: "Com Dependentes",
    possuiDependentes: true,
    dependentes: [
      {
        nome: "Giulia Carneiro Munhoz",
        nascimento: "11/07/2005",
        parentesco: "Filho(a)",
        sexo: "F",
        responsabilidade: "Biológica",
        cpf: "458.716.938-22",
        finalidades: ["Imposto de Renda (IRRF)", "Salário-Família"]
      },
      {
        nome: "Tiago Francisco Munhoz",
        nascimento: "03/06/1978",
        parentesco: "União Estável",
        sexo: "M",
        responsabilidade: "-",
        cpf: "286.656.098-14",
        finalidades: ["Imposto de Renda (IRRF)", "Salário-Família"]
      },
      {
        nome: "Giovane Carneiro Munhoz",
        nascimento: "11/04/2012",
        parentesco: "Filho(a)",
        sexo: "M",
        responsabilidade: "Biológica",
        cpf: "453.891.638-26",
        finalidades: ["Imposto de Renda (IRRF)", "Salário-Família"]
      }
    ],
    hashAutenticidade: "079b480182744acb9a10eadc6d5bbca3e2cef16c450edd31b698b650103daf65"
  });
  Logger.log("Teste de e-mail e geração de PDF (Com Dependentes) concluído com sucesso!");
}

/**
 * Função de Teste para o modelo de Declaração de Ausência de Dependentes (Declaração Negativa)
 */
function testarDeclaracaoNegativa() {
  var meuEmail = Session.getActiveUser().getEmail() || CONFIG.EMAIL_NOTIFICACAO;
  Logger.log("Iniciando teste de Declaração Negativa com anexo PDF para: " + meuEmail);

  enviarEmailsComprovante({
    nome: "Marcelo Avelar do Nascimento",
    email: meuEmail,
    cpf: "122.845.867-75",
    estadoCivil: "Solteiro",
    endereco: {
      tipoLogradouro: "Rua",
      logradouro: "Bertioga",
      numero: "210",
      complemento: "Apto 14",
      bairro: "Jardim Paulista",
      cidade: "Presidente Prudente",
      uf: "SP",
      cep: "19023-580"
    },
    codigoAutenticidade: "FCT-STGP-DEP-2026-NEG01",
    dataHora: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"),
    tipoDeclaracao: "Declaração Negativa de Dependentes",
    possuiDependentes: false,
    dependentes: [],
    hashAutenticidade: "c8a698a75a56c8daf79a402c5794aae0eca38c3b16c8b67f8e64c463ae543d60"
  });
  Logger.log("Teste de Declaração Negativa concluído com sucesso!");
}

/**
 * Função auxiliar para retornar respostas em JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
