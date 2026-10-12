/**
 * Gerador de Memorando e Escala de Substituição - FCT UNESP
 * Lógica e Interatividade da Aplicação
 */

// Lista oficial de funções efetivas para substitutos (base oficial unificada UNESP de 77 funções)
window.LISTA_FUNCOES_EFETIVAS = (typeof CATALOGO_CARGOS_FUNCOES !== 'undefined')
  ? [
      ...CATALOGO_CARGOS_FUNCOES.tecnico.cargos,
      ...CATALOGO_CARGOS_FUNCOES.docente.cargos,
      ...CATALOGO_CARGOS_FUNCOES.pesquisador.cargos
    ].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  : [
      'Administrador', 'Advogado', 'Agente de Vigilância e Recepção', 'Analista de Informática I', 'Analista de Informática II',
      'Arquiteto', 'Assistente Administrativo II', 'Assistente de Informática II', 'Assistente de Suporte Acadêmico II',
      'Assistente de Suporte Acadêmico III', 'Assistente de Suporte Acadêmico IV', 'Assistente de Telefonia',
      'Assistente Operacional II', 'Assistente Operacional III', 'Assistente Social', 'Assistente Técnico Administrativo I',
      'Assistente Técnico Administrativo II', 'Auxiliar Agropecuário', 'Auxiliar de Ensino', 'Auxiliar em Saúde Bucal',
      'Bibliotecário', 'Biólogo', 'Biomédico', 'Cirurgião Dentista', 'Contador', 'Discotecário Programador',
      'Economista', 'Enfermeiro', 'Engenheiro', 'Engenheiro Agrônomo', 'Farmacêutico', 'Físico', 'Fisioterapeuta',
      'Fonoaudiólogo', 'Historiógrafo', 'Jornalista', 'Locutor', 'Médico', 'Médico Sanitarista', 'Médico Veterinário',
      'Meteorologista', 'Motorista', 'Nutricionista', 'Oficial de Serviços Gráficos', 'Oficial em Aparelhos de Precisão',
      'Operador de Forno Incinerador', 'Operador de Máquinas', 'Operador de Rádio', 'Pedagogo', 'Pesquisador I',
      'Pesquisador II', 'Pesquisador III', 'Pesquisador IV', 'Produtor', 'Professor Assistente', 'Professor Assistente Doutor',
      'Professor Associado', 'Professor Colaborador', 'Professor Substituto', 'Professor Titular', 'Psicólogo', 'Químico',
      'Regente de Coral', 'Relações Públicas', 'Revisor', 'Salva Vidas', 'Técnico Administrativo Substituto',
      'Técnico Agropecuário', 'Técnico de Contabilidade', 'Técnico de Necropsia', 'Técnico em Eletrônica',
      'Técnico em Radiologia', 'Técnico em Segurança do Trabalho', 'Tecnólogo', 'Terapeuta Ocupacional',
      'Topógrafo', 'Zootecnista'
    ];

// Lista oficial de escolaridades para substitutos
window.LISTA_ESCOLARIDADE = [
  'ENSINO FUNDAMENTAL INCOMPLETO',
  'ENSINO FUNDAMENTAL COMPLETO',
  'ENSINO MÉDIO COMPLETO',
  'ENSINO TÉCNICO',
  'SUPERIOR COMPLETO',
  'ESPECIALIZAÇÃO (LATO SENSU)',
  'MESTRADO (STRICTO SENSU)',
  'DOUTORADO (STRICTO SENSU)',
  'PÓS DOUTORADO'
];

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do Formulário
  const inputMemoNumero = document.getElementById('memo_numero');
  const inputMemoAno = document.getElementById('memo_ano');
  const inputMemoData = document.getElementById('memo_data');
  const inputMemoAssunto = document.getElementById('memo_assunto');
  const inputDataVigencia = document.getElementById('data_vigencia');
  
  const selectRemetente = document.getElementById('remetente_select');
  const selectFuncaoSubstituida = document.getElementById('funcao_substituida_select');
  const selectDestinatarioPessoa = document.getElementById('destinatario_pessoa_select');
  const inputDestinatario = document.getElementById('destinatario_input');
  const badgeDestinatario = document.getElementById('badge-destinatario-status');
  const alertDestinatarioBox = document.getElementById('alert-destinatario-box');
  const alertDestinatarioMsg = document.getElementById('alert-destinatario-msg');
  
  const inputSignatarioNome = document.getElementById('signatario_nome');
  const selectSignatarioCargo = document.getElementById('signatario_cargo');

  // Elementos do Formulário para Substitutos (Quadro Anexo)
  const inputSubst1Nome = document.getElementById('subst1_nome');
  const inputSubst1Matricula = document.getElementById('subst1_matricula');
  const inputSubst1Rg = document.getElementById('subst1_rg');
  const inputSubst1Cpf = document.getElementById('subst1_cpf');
  const selectSubst1Funcao = document.getElementById('subst1_funcao');
  const selectSubst1Escolaridade = document.getElementById('subst1_escolaridade');

  const checkPossuiSubst2 = document.getElementById('check_possui_subst2');
  const formSectionSubst2 = document.getElementById('form_section_subst2');
  const inputSubst2Nome = document.getElementById('subst2_nome');
  const inputSubst2Matricula = document.getElementById('subst2_matricula');
  const inputSubst2Rg = document.getElementById('subst2_rg');
  const inputSubst2Cpf = document.getElementById('subst2_cpf');
  const selectSubst2Funcao = document.getElementById('subst2_funcao');
  const selectSubst2Escolaridade = document.getElementById('subst2_escolaridade');

  // Elementos de Feedback de Validação dos Substitutos
  const feedbackSubst1Matricula = document.getElementById('feedback_subst1_matricula');
  const feedbackSubst1Cpf = document.getElementById('feedback_subst1_cpf');
  const feedbackSubst2Matricula = document.getElementById('feedback_subst2_matricula');
  const feedbackSubst2Cpf = document.getElementById('feedback_subst2_cpf');

  // Botões de Emissão
  const btnGerarMemoPdf = document.getElementById('btn-gerar-memo-pdf');
  const btnGerarQuadroPdf = document.getElementById('btn-gerar-quadro-pdf');
  const btnImprimirTudo = document.getElementById('btn-imprimir-tudo');

  // Abas de Pré-visualização
  const tabMemo = document.getElementById('tab-memo');
  const tabQuadro = document.getElementById('tab-quadro');
  const viewMemo = document.getElementById('view-memorando');
  const viewQuadro = document.getElementById('view-quadro');
  const labelDocPreview = document.getElementById('label-doc-preview');

  // Elementos da Pré-visualização do Memorando
  const prevMemoHeaderSetor = document.getElementById('prev-memo-header-setor');
  const prevMemoNum = document.getElementById('prev-memo-num');
  const prevMemoAno = document.getElementById('prev-memo-ano');
  const prevMemoSigla = document.getElementById('prev-memo-sigla');
  const prevMemoSiglaBlock = document.getElementById('prev-memo-sigla-block');
  const prevMemoDataExtenso = document.getElementById('prev-memo-data-extenso');
  const prevMemoDestNome = document.getElementById('prev-memo-dest-nome');
  const prevMemoDestFuncao = document.getElementById('prev-memo-dest-funcao');
  const prevMemoDestUA = document.getElementById('prev-memo-dest-ua');
  const prevMemoRemetente = document.getElementById('prev-memo-remetente');
  const prevMemoAssunto = document.getElementById('prev-memo-assunto');
  const prevMemoFuncaoAlvo = document.getElementById('prev-memo-funcao-alvo');
  const prevMemoDataVigencia = document.getElementById('prev-memo-data-vigencia');

  const prevMemoFecho = document.getElementById('prev-memo-fecho');
  const prevMemoSigNome = document.getElementById('prev-memo-sig-nome');
  const prevMemoSigCargo = document.getElementById('prev-memo-sig-cargo');
  const prevMemoSigDept = document.getElementById('prev-memo-sig-dept');

  // Elementos da Pré-visualização do Quadro Anexo (Modelo Oficial)
  const prevQuadroUa = document.getElementById('prev-quadro-ua');
  const prevQuadroFuncao = document.getElementById('prev-quadro-funcao');
  const prevQuadroAPartir = document.getElementById('prev-quadro-a-partir');

  const prevQuadroBlocoSubst1 = document.getElementById('prev-quadro-bloco-subst1');
  const prevQuadroSubst1Nome = document.getElementById('prev-quadro-subst1-nome');
  const prevQuadroSubst1Rg = document.getElementById('prev-quadro-subst1-rg');
  const prevQuadroSubst1Mat = document.getElementById('prev-quadro-subst1-mat');
  const prevQuadroSubst1Cpf = document.getElementById('prev-quadro-subst1-cpf');
  const prevQuadroSubst1Funcao = document.getElementById('prev-quadro-subst1-funcao');
  const prevQuadroSubst1Esc = document.getElementById('prev-quadro-subst1-esc');

  const prevQuadroBlocoSubst2 = document.getElementById('prev-quadro-bloco-subst2');
  const prevQuadroSubst2Nome = document.getElementById('prev-quadro-subst2-nome');
  const prevQuadroSubst2Rg = document.getElementById('prev-quadro-subst2-rg');
  const prevQuadroSubst2Mat = document.getElementById('prev-quadro-subst2-mat');
  const prevQuadroSubst2Cpf = document.getElementById('prev-quadro-subst2-cpf');
  const prevQuadroSubst2Funcao = document.getElementById('prev-quadro-subst2-funcao');
  const prevQuadroSubst2Esc = document.getElementById('prev-quadro-subst2-esc');

  // --------------------------------------------------------------------------
  // 1. INICIALIZAÇÃO DE DATAS AUTOMÁTICAS
  // --------------------------------------------------------------------------
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();

  // Formato YYYY-MM-DD para o input type="date"
  const anoStr = String(hoje.getFullYear());
  const mesStr = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaStr = String(hoje.getDate()).padStart(2, '0');
  inputMemoData.value = `${anoStr}-${mesStr}-${diaStr}`;
  if (inputDataVigencia) {
    inputDataVigencia.value = `${anoStr}-${mesStr}-${diaStr}`;
  }
  inputMemoAno.value = anoAtual;

  // Função para extrair o ano diretamente da data de emissão escolhida
  function extrairAnoDaData(dataIso) {
    if (!dataIso) return String(anoAtual);
    const partes = dataIso.split('-');
    if (partes.length === 3 && partes[0] && partes[0].length === 4) {
      return partes[0];
    }
    return String(anoAtual);
  }

  // Nomes dos meses em português
  const NOMES_MESES = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  function formatarDataExtenso(dataIso) {
    if (!dataIso) return 'Presidente Prudente, em data não informada.';
    const partes = dataIso.split('-');
    if (partes.length !== 3) return 'Presidente Prudente, em data não informada.';
    const ano = partes[0];
    const mesIndex = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);
    const mesNome = NOMES_MESES[mesIndex] || '';
    return `Presidente Prudente, ${dia} de ${mesNome} de ${ano}.`;
  }

  function formatarDataCurta(dataIso) {
    if (!dataIso) return '--/--/----';
    const partes = dataIso.split('-');
    if (partes.length !== 3) return '--/--/----';
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Formata o nome do destinatário com iniciais em maiúsculo (preservando preposições)
  function formatarNomeIniciaisMaiusculas(str) {
    if (!str) return '';
    const preposicoes = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);
    return str.toLowerCase().split(/\s+/).map((palavra, index) => {
      if (index > 0 && preposicoes.has(palavra)) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(' ');
  }

  // Formata a função do destinatário toda em maiúsculo com expansão de substitutos
  function formatarFuncaoDestinatarioMaiuscula(pessoa) {
    if (!pessoa || !pessoa.cargo) return '';
    let f = pessoa.cargo;
    if (f.includes('Subst')) {
      const isFem = (pessoa.nome || '').includes('PATRICIA') || (pessoa.nome || '').includes('ISABELA') || f.includes('ª') || f.includes('Supervisora') || f.includes('Diretora');
      f = f.replace(/-\s*Subst\.?ª?/i, isFem ? 'Substituta' : 'Substituto');
    }
    return f.toUpperCase();
  }

  // --------------------------------------------------------------------------
  // REGRAS DE VALIDAÇÃO: MATRÍCULA FUNCIONAL UNESP (MÓDULO 11 COM PESOS 7 A 2)
  // --------------------------------------------------------------------------
  /**
   * Calcula o Dígito Verificador (7º dígito) de uma matrícula UNESP de 6 dígitos base.
   * Algoritmo Oficial:
   * 1. Multiplicação pelos pesos: 1º*7, 2º*6, 3º*5, 4º*4, 5º*3, 6º*2.
   * 2. Soma dos produtos.
   * 3. Resto = Soma % 11.
   * 4. Se Resto == 10, DV = 0. Se Resto <= 9, DV = Resto.
   */
  function calcularDvMatriculaUnesp(base6Digitos) {
    const digits = String(base6Digitos || '').replace(/\D/g, '').slice(0, 6);
    if (digits.length !== 6) return null;
    const pesos = [7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 6; i++) {
      soma += parseInt(digits[i], 10) * pesos[i];
    }
    const resto = soma % 11;
    return resto === 10 ? 0 : resto;
  }

  /**
   * Valida a matrícula funcional no padrão XXXXXX-D.
   */
  function validarMatriculaUnesp(valor) {
    const limpo = String(valor || '').replace(/\D/g, '');
    if (!limpo) {
      return { valido: false, vazio: true, mensagem: 'Matrícula não informada.' };
    }
    if (limpo.length < 7) {
      return {
        valido: false,
        vazio: false,
        incompleto: true,
        mensagem: `Matrícula incompleta (${limpo.length}/7 dígitos). Formato: XXXXXX-D.`
      };
    }
    const base = limpo.slice(0, 6);
    const dvInformado = parseInt(limpo[6], 10);
    const dvEsperado = calcularDvMatriculaUnesp(base);

    if (dvInformado !== dvEsperado) {
      return {
        valido: false,
        vazio: false,
        incompleto: false,
        dvEsperado,
        dvInformado,
        mensagem: `Dígito verificador inválido: informado "${dvInformado}", esperado "${dvEsperado}".`
      };
    }

    return {
      valido: true,
      vazio: false,
      formatado: `${base}-${dvEsperado}`,
      mensagem: `✓ Matrícula válida (DV: ${dvEsperado})`
    };
  }

  function formatarMatricula(val) {
    if (!val) return '';
    const limpo = String(val).replace(/\D/g, '').slice(0, 7);
    if (limpo.length > 6) {
      return `${limpo.slice(0, 6)}-${limpo.slice(6)}`;
    }
    if (limpo.length === 6 && val.endsWith('-')) {
      return `${limpo}-`;
    }
    return limpo;
  }

  // --------------------------------------------------------------------------
  // REGRAS DE VALIDAÇÃO: CPF (RECEITA FEDERAL DO BRASIL - MÓDULO 11)
  // --------------------------------------------------------------------------
  /**
   * Valida o CPF conforme o algoritmo oficial da Receita Federal.
   * - 11 dígitos numéricos no total.
   * - Rejeita números com todos os dígitos repetidos.
   * - 1º DV calculado com pesos 10 a 2.
   * - 2º DV calculado com pesos 11 a 2.
   */
  function validarCpf(cpf) {
    const limpo = String(cpf || '').replace(/\D/g, '');
    if (!limpo) {
      return { valido: false, vazio: true, mensagem: 'CPF não informado.' };
    }
    if (limpo.length < 11) {
      return {
        valido: false,
        vazio: false,
        incompleto: true,
        mensagem: `CPF incompleto (${limpo.length}/11 dígitos).`
      };
    }
    if (limpo.length > 11) {
      return { valido: false, vazio: false, mensagem: 'CPF contém mais de 11 dígitos.' };
    }

    // Rejeita sequências com todos os dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(limpo)) {
      return {
        valido: false,
        vazio: false,
        mensagem: 'CPF inválido (dígitos repetidos).'
      };
    }

    // 1º Dígito Verificador (pesos de 10 a 2)
    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
      soma1 += parseInt(limpo[i], 10) * (10 - i);
    }
    let resto1 = soma1 % 11;
    let dv1Esperado = resto1 < 2 ? 0 : 11 - resto1;
    let dv1Informado = parseInt(limpo[9], 10);

    if (dv1Informado !== dv1Esperado) {
      return {
        valido: false,
        vazio: false,
        mensagem: 'CPF inválido (1º dígito verificador não confere).'
      };
    }

    // 2º Dígito Verificador (pesos de 11 a 2)
    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
      soma2 += parseInt(limpo[i], 10) * (11 - i);
    }
    let resto2 = soma2 % 11;
    let dv2Esperado = resto2 < 2 ? 0 : 11 - resto2;
    let dv2Informado = parseInt(limpo[10], 10);

    if (dv2Informado !== dv2Esperado) {
      return {
        valido: false,
        vazio: false,
        mensagem: 'CPF inválido (2º dígito verificador não confere).'
      };
    }

    const formatado = `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
    return {
      valido: true,
      vazio: false,
      formatado,
      mensagem: '✓ CPF válido (Receita Federal)'
    };
  }

  function formatarCpf(val) {
    if (!val) return '';
    const limpo = String(val).replace(/\D/g, '').slice(0, 11);
    if (limpo.length > 9) {
      return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
    }
    if (limpo.length === 9 && val.endsWith('-')) {
      return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-`;
    }
    if (limpo.length > 6) {
      return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6)}`;
    }
    if (limpo.length === 6 && val.endsWith('.')) {
      return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.`;
    }
    if (limpo.length > 3) {
      return `${limpo.slice(0, 3)}.${limpo.slice(3)}`;
    }
    if (limpo.length === 3 && val.endsWith('.')) {
      return `${limpo.slice(0, 3)}.`;
    }
    return limpo;
  }

  function atualizarFeedbackCampo(inputEl, feedbackEl, resValidacao, obrigatorio, isBlur) {
    if (!inputEl || !feedbackEl) return;

    if (resValidacao.vazio) {
      if (obrigatorio && isBlur) {
        inputEl.classList.add('input-invalid');
        inputEl.classList.remove('input-valid');
        feedbackEl.className = 'field-feedback invalid';
        feedbackEl.textContent = '⚠ Campo obrigatório.';
      } else {
        inputEl.classList.remove('input-invalid', 'input-valid');
        feedbackEl.className = 'field-feedback';
        feedbackEl.textContent = '';
      }
      return;
    }

    if (resValidacao.valido) {
      inputEl.classList.remove('input-invalid');
      inputEl.classList.add('input-valid');
      feedbackEl.className = 'field-feedback valid';
      feedbackEl.textContent = resValidacao.mensagem;
    } else {
      if (resValidacao.incompleto && !isBlur) {
        inputEl.classList.remove('input-invalid', 'input-valid');
        feedbackEl.className = 'field-feedback';
        feedbackEl.textContent = '';
      } else {
        inputEl.classList.add('input-invalid');
        inputEl.classList.remove('input-valid');
        feedbackEl.className = 'field-feedback invalid';
        feedbackEl.textContent = `⚠ ${resValidacao.mensagem}`;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. CONFIGURAÇÃO DE AUTORIDADES DESTINATÁRIAS (DTAd E STGP)
  // --------------------------------------------------------------------------
  const PESSOAS_DESTINATARIO = {
    DTAd: [
      {
        id: 'dtad_titular',
        tipo: 'Titular',
        nome: 'ELIENE RIBEIRO SPOLADOR',
        cargo: 'Diretora Técnica de Divisão',
        cargoAssinatura: 'Diretora Técnica de Divisão',
        setorAssinatura: 'DTAd — FCT UNESP',
        orgaoNome: 'Divisão Técnica Administrativa (DTAd)',
        orgaoExtenso: 'Divisão Técnica Administrativa',
        vocativo: 'À Senhora Diretora Técnica de Divisão da Divisão Técnica Administrativa,',
        label: 'Titular: ELIENE RIBEIRO SPOLADOR (Diretora Técnica de Divisão)'
      },
      {
        id: 'dtad_subst1',
        tipo: '1º Substituto',
        nome: 'ISABELA DA SILVA ULTRAMARI',
        cargo: 'Diretora Técnica de Divisão - Subst.ª',
        cargoAssinatura: 'Diretora Técnica de Divisão - Subst.ª',
        setorAssinatura: 'DTAd — FCT UNESP',
        orgaoNome: 'Divisão Técnica Administrativa (DTAd)',
        orgaoExtenso: 'Divisão Técnica Administrativa',
        vocativo: 'À Senhora Diretora Técnica de Divisão Substituta da Divisão Técnica Administrativa,',
        label: '1º Substituto: ISABELA DA SILVA ULTRAMARI (Diretora Técnica de Divisão - Subst.ª)'
      },
      {
        id: 'dtad_subst2',
        tipo: '2º Substituto',
        nome: 'FERNANDO HENRIQUE UEMURA SIQUEIRA',
        cargo: 'Diretor Técnico de Divisão - Subst.',
        cargoAssinatura: 'Diretor Técnico de Divisão - Subst.',
        setorAssinatura: 'DTAd — FCT UNESP',
        orgaoNome: 'Divisão Técnica Administrativa (DTAd)',
        orgaoExtenso: 'Divisão Técnica Administrativa',
        vocativo: 'Ao Senhor Diretor Técnico de Divisão Substituto da Divisão Técnica Administrativa,',
        label: '2º Substituto: FERNANDO HENRIQUE UEMURA SIQUEIRA (Diretor Técnico de Divisão - Subst.)'
      }
    ],
    STGP: [
      {
        id: 'stgp_titular',
        tipo: 'Titular',
        nome: 'ANDERSON LUIZ ROS DE SOUSA',
        cargo: 'Supervisor Técnico de Seção',
        cargoAssinatura: 'Supervisor Técnico de Seção',
        setorAssinatura: 'STGP — FCT UNESP',
        orgaoNome: 'Seção Técnica de Gestão de Pessoas (STGP)',
        orgaoExtenso: 'Seção Técnica de Gestão de Pessoas',
        vocativo: 'Ao Senhor Supervisor Técnico de Seção da Seção Técnica de Gestão de Pessoas,',
        label: 'Titular: ANDERSON LUIZ ROS DE SOUSA (Supervisor Técnico de Seção)'
      },
      {
        id: 'stgp_subst1',
        tipo: '1º Substituto',
        nome: 'PATRICIA DO NASCIMENTO PESSATTO GODOY DE SOUZA',
        cargo: 'Supervisora Técnica de Seção - Subst.ª',
        cargoAssinatura: 'Supervisora Técnica de Seção - Subst.ª',
        setorAssinatura: 'STGP — FCT UNESP',
        orgaoNome: 'Seção Técnica de Gestão de Pessoas (STGP)',
        orgaoExtenso: 'Seção Técnica de Gestão de Pessoas',
        vocativo: 'À Senhora Supervisora Técnica de Seção Substituta da Seção Técnica de Gestão de Pessoas,',
        label: '1º Substituto: PATRICIA DO NASCIMENTO PESSATTO GODOY DE SOUZA (Supervisora Técnica de Seção - Subst.ª)'
      },
      {
        id: 'stgp_subst2',
        tipo: '2º Substituto',
        nome: 'ANDRÉ TRINDADE MEIRA',
        cargo: 'Supervisor Técnico de Seção - Subst.',
        cargoAssinatura: 'Supervisor Técnico de Seção - Subst.',
        setorAssinatura: 'STGP — FCT UNESP',
        orgaoNome: 'Seção Técnica de Gestão de Pessoas (STGP)',
        orgaoExtenso: 'Seção Técnica de Gestão de Pessoas',
        vocativo: 'Ao Senhor Supervisor Técnico de Seção Substituto da Seção Técnica de Gestão de Pessoas,',
        label: '2º Substituto: ANDRÉ TRINDADE MEIRA (Supervisor Técnico de Seção - Subst.)'
      }
    ]
  };

  let orgaoDestinatarioAtual = '';

  // --------------------------------------------------------------------------
  // 2. VINCULAÇÃO DINÂMICA: UAs, FUNÇÕES EM CONFIANÇA E ASSINATURAS
  // --------------------------------------------------------------------------
  function normalizarFuncaoMasculino(funcao) {
    if (!funcao) return '';
    return funcao
      .replace(/Supervisora\s+T[eé]cnica\s+de\s+Se[cç][aã]o/gi, 'Supervisor Técnico de Seção')
      .replace(/Diretora\s+T[eé]cnica\s+de\s+Divis[aã]o/gi, 'Diretor Técnico de Divisão')
      .replace(/Diretora\s+T[eé]cnica\s+de\s+Servi[cç]o/gi, 'Diretor Técnico de Serviço')
      .replace(/Assessora\s+Administrativa\s+I\b/gi, 'Assessor Administrativo I')
      .replace(/Assessora\s+Administrativa\s+II\b/gi, 'Assessor Administrativo II')
      .replace(/Supervisora\s+de\s+CEI/gi, 'Supervisor de CEI')
      .replace(/Motorista\s+de\s+Diretor\s+de\s+Unidade\/Repres\./gi, 'Motorista de Diretor de Unidade/Representação')
      .replace(/\bSupervisora\b/gi, 'Supervisor')
      .replace(/\bDiretora\b/gi, 'Diretor')
      .replace(/\bAssessora\b/gi, 'Assessor');
  }

  function popularCamposVinculadosAUA(uaNome) {
    if (typeof CATALOGO_UAS === 'undefined') return;
    const dadosUA = CATALOGO_UAS[uaNome];

    // 1. Popular Função em Confiança a ser substituída (apenas os nomes das funções no masculino)
    if (selectFuncaoSubstituida) {
      selectFuncaoSubstituida.innerHTML = '';
      if (dadosUA && dadosUA.funcoesConfianca && dadosUA.funcoesConfianca.length > 0) {
        dadosUA.funcoesConfianca.forEach(fc => {
          const nomeMasc = normalizarFuncaoMasculino(fc.funcao);
          const opt = document.createElement('option');
          opt.value = nomeMasc;
          opt.textContent = nomeMasc;
          opt.dataset.titular = fc.titular || '';
          opt.dataset.uaNum = fc.uaNum || '';
          selectFuncaoSubstituida.appendChild(opt);
        });
      } else {
        const opt = document.createElement('option');
        opt.value = 'Função em Confiança';
        opt.textContent = 'Função em Confiança a designar';
        selectFuncaoSubstituida.appendChild(opt);
      }
      selectFuncaoSubstituida.selectedIndex = 0;
    }

    // 2. Popular Função do Emitente (apenas os nomes das funções, sem termos entre parênteses)
    if (selectSignatarioCargo) {
      const valorAnterior = selectSignatarioCargo.value;
      selectSignatarioCargo.innerHTML = '';
      const valoresInseridos = new Set();

      if (dadosUA && dadosUA.funcoesAssinante && dadosUA.funcoesAssinante.length > 0) {
        dadosUA.funcoesAssinante.forEach(fa => {
          const valorLimpo = (fa.valor || '').trim();
          if (valorLimpo && !valoresInseridos.has(valorLimpo)) {
            valoresInseridos.add(valorLimpo);
            const opt = document.createElement('option');
            opt.value = valorLimpo;
            opt.textContent = valorLimpo;
            selectSignatarioCargo.appendChild(opt);
          }
        });
      } else {
        const opt = document.createElement('option');
        opt.value = 'Responsável pelo Setor';
        opt.textContent = 'Responsável pelo Setor';
        selectSignatarioCargo.appendChild(opt);
      }

      // Manter valor anterior se compatível
      let indexMatch = -1;
      for (let i = 0; i < selectSignatarioCargo.options.length; i++) {
        if (selectSignatarioCargo.options[i].value === valorAnterior) {
          indexMatch = i;
          break;
        }
      }
      selectSignatarioCargo.selectedIndex = indexMatch >= 0 ? indexMatch : 0;
    }

    // 3. Deixar campo de identificação do signatário em branco para digitação do assinante
    inputSignatarioNome.value = '';
  }

  function verificarSeRemetenteEDTAd() {
    const val = selectRemetente.value;
    if (typeof CATALOGO_UAS !== 'undefined' && CATALOGO_UAS[val]) {
      return !!CATALOGO_UAS[val].isDTAd;
    }
    const optionSelecionada = selectRemetente.options[selectRemetente.selectedIndex];
    if (!optionSelecionada) return false;
    const isDtadAttr = optionSelecionada.getAttribute('data-is-dtad') === 'true';
    const ua = optionSelecionada.getAttribute('data-ua') || '';
    const sigla = optionSelecionada.getAttribute('data-sigla') || '';
    return isDtadAttr || ua === '31200' || ua === '31.200' || sigla === 'DTADM' || sigla === 'DTAd' || val.includes('Divisão Técnica Administrativa');
  }

  function popularSelectDestinatarioPessoas(orgaoChave) {
    if (!selectDestinatarioPessoa) return;
    const pessoas = PESSOAS_DESTINATARIO[orgaoChave] || PESSOAS_DESTINATARIO.DTAd;
    const valorAnterior = selectDestinatarioPessoa.value;

    selectDestinatarioPessoa.innerHTML = '';
    pessoas.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.label;
      selectDestinatarioPessoa.appendChild(opt);
    });

    if (pessoas.some(p => p.id === valorAnterior)) {
      selectDestinatarioPessoa.value = valorAnterior;
    } else {
      selectDestinatarioPessoa.selectedIndex = 0;
    }
  }

  function atualizarDestinatarioPorRegra() {
    const isDTAd = verificarSeRemetenteEDTAd();
    const orgaoAlvo = isDTAd ? 'STGP' : 'DTAd';

    const boxAlert = document.getElementById('info-box-destinatario') || alertDestinatarioBox;
    const msgAlert = document.getElementById('destinatario-info-desc') || alertDestinatarioMsg;

    if (isDTAd) {
      // REGRA: Se o remetente for a DTAd, o destinatário é a STGP
      inputDestinatario.value = 'Seção Técnica de Gestão de Pessoas (STGP)';
      
      if (badgeDestinatario) {
        badgeDestinatario.textContent = '⚡ STGP (Remetente DTAd)';
        badgeDestinatario.className = 'field-dynamic-badge active-rule';
      }
      
      if (boxAlert) {
        boxAlert.style.backgroundColor = '#eff6ff';
        boxAlert.style.borderLeftColor = '#1e3a8a';
      }
      if (msgAlert) {
        msgAlert.innerHTML = '<strong>Regra Aplicada:</strong> Como a <strong>Divisão Técnica Administrativa (DTAd)</strong> é o setor remetente, o memorando é automaticamente endereçado à <strong>Seção Técnica de Gestão de Pessoas (STGP)</strong>.';
      }
    } else {
      // REGRA PADRÃO: Para todos os demais, o destinatário é a DTAd
      inputDestinatario.value = 'Divisão Técnica Administrativa (DTAd)';
      
      if (badgeDestinatario) {
        badgeDestinatario.textContent = '⚡ DTAd Padrão';
        badgeDestinatario.className = 'field-dynamic-badge';
      }
      
      if (boxAlert) {
        boxAlert.style.backgroundColor = '';
        boxAlert.style.borderLeftColor = '';
      }
      if (msgAlert) {
        msgAlert.innerHTML = 'O destinatário será sempre a <strong>Divisão Técnica Administrativa (DTAd)</strong>, exceto quando o remetente for a própria DTAd — situação em que o documento é automaticamente endereçado à <strong>Seção Técnica de Gestão de Pessoas (STGP)</strong>.';
      }
    }

    // Atualizar dropdown de pessoas caso mude o órgão
    if (orgaoAlvo !== orgaoDestinatarioAtual) {
      orgaoDestinatarioAtual = orgaoAlvo;
      popularSelectDestinatarioPessoas(orgaoAlvo);
    }
  }

  function obterPessoaDestinatariaSelecionada() {
    const chave = orgaoDestinatarioAtual || (verificarSeRemetenteEDTAd() ? 'STGP' : 'DTAd');
    const lista = PESSOAS_DESTINATARIO[chave] || PESSOAS_DESTINATARIO.DTAd;
    const idSel = selectDestinatarioPessoa ? selectDestinatarioPessoa.value : '';
    return lista.find(p => p.id === idSel) || lista[0];
  }

  // --------------------------------------------------------------------------
  // 3. ATUALIZAÇÃO REATIVA DE TODOS OS DOCUMENTOS (LIVE PREVIEW)
  // --------------------------------------------------------------------------
  function atualizarDocumentos() {
    // 1. Dados Básicos do Memorando
    const numero = inputMemoNumero.value.trim() || 'XX';
    const dataIso = inputMemoData.value;
    
    // O ano é travado, mas coincide rigorosamente com o ano da data de emissão escolhida
    const ano = extrairAnoDaData(dataIso);
    inputMemoAno.value = ano;

    const assunto = inputMemoAssunto.value.trim() || 'ALTERAÇÃO DA ESCALA DE SUBSTITUIÇÃO';

    // 2. Remetente e Sigla
    const optionSelecionada = selectRemetente.options[selectRemetente.selectedIndex];
    const nomeSetorRemetente = optionSelecionada ? optionSelecionada.value : (selectRemetente.value || 'Setor Solicitante');
    const siglaSetor = optionSelecionada ? (optionSelecionada.getAttribute('data-sigla') || '') : '';

    // 3. Atualizar Destinatário pela regra institucional
    atualizarDestinatarioPorRegra();
    const isDTAdRemetente = verificarSeRemetenteEDTAd();
    const pessoaDestinataria = obterPessoaDestinatariaSelecionada();

    // 4. Signatário Remetente e Função do Emitente
    const signatarioNome = inputSignatarioNome.value.trim();
    const signatarioCargo = selectSignatarioCargo ? selectSignatarioCargo.value.trim() : 'Função do Emitente';

    // 4.1. Função em Confiança Substituída e Titular (para tabela do Quadro)
    let funcaoSubstituida = 'Função em Confiança';
    let titularSubstituido = 'Nome do Servidor Titular';
    if (selectFuncaoSubstituida && selectFuncaoSubstituida.selectedIndex >= 0) {
      const optFc = selectFuncaoSubstituida.options[selectFuncaoSubstituida.selectedIndex];
      funcaoSubstituida = optFc.value || 'Função em Confiança';
    }

    // 5. Aplicar ao Documento 1: Memorando (Conforme Manual da UNESP: MEMORANDO Nº [num]/[ano] [sigla]/FCT/PP)
    const siglaFinal = siglaSetor || 'UNIDADE';

    if (prevMemoHeaderSetor) prevMemoHeaderSetor.textContent = nomeSetorRemetente;
    if (prevMemoNum) prevMemoNum.textContent = numero;
    if (prevMemoAno) prevMemoAno.textContent = ano;
    if (prevMemoSigla) prevMemoSigla.textContent = siglaFinal;

    if (prevMemoDataExtenso) prevMemoDataExtenso.textContent = formatarDataExtenso(dataIso);

    // Destinatário do Memorando (abaixo da data, conforme formato oficial UNESP):
    // A(o) Senhor(a)
    // [nome do destinatário] com iniciais em maiúsculo
    // [função do destinatário] todo em maiúsculo
    // [nome da UA do destinatário] toda em maiúsculo
    // FACULDADE DE CIÊNCIAS E TECNOLOGIA - CÂMPUS DE PRESIDENTE PRUDENTE
    if (pessoaDestinataria) {
      if (prevMemoDestNome) {
        prevMemoDestNome.textContent = formatarNomeIniciaisMaiusculas(pessoaDestinataria.nome);
      }
      if (prevMemoDestFuncao) {
        prevMemoDestFuncao.textContent = formatarFuncaoDestinatarioMaiuscula(pessoaDestinataria);
      }
      if (prevMemoDestUA) {
        const uaNome = pessoaDestinataria.orgaoExtenso || (isDTAdRemetente ? 'Seção Técnica de Gestão de Pessoas' : 'Divisão Técnica Administrativa');
        prevMemoDestUA.textContent = uaNome.toUpperCase();
      }
    }
    if (prevMemoRemetente) prevMemoRemetente.textContent = nomeSetorRemetente;
    if (prevMemoAssunto) prevMemoAssunto.textContent = assunto;

    // Atualizar dados da Função em Confiança Substituída e Data de Vigência no corpo do Memorando
    const dataVigenciaIso = inputDataVigencia ? inputDataVigencia.value : '';
    const dataVigenciaFormatada = formatarDataCurta(dataVigenciaIso);
    if (prevMemoFuncaoAlvo) {
      prevMemoFuncaoAlvo.textContent = funcaoSubstituida;
    }
    if (prevMemoDataVigencia) {
      prevMemoDataVigencia.textContent = dataVigenciaFormatada;
    }

    // Item g do Manual: Fecho com recuo padrão oficial
    // "Atenciosamente" para mesma ou inferior hierarquia, "Respeitosamente" para hierarquia superior
    if (prevMemoFecho) {
      if (isDTAdRemetente) {
        prevMemoFecho.textContent = 'Atenciosamente,';
      } else {
        prevMemoFecho.textContent = 'Respeitosamente,';
      }
    }



    // Identificação do Signatário no Memorando:
    // Nome com iniciais em maiúsculas, Função toda em maiúsculo, sem linha divisória
    if (prevMemoSigNome) {
      prevMemoSigNome.textContent = signatarioNome ? formatarNomeIniciaisMaiusculas(signatarioNome) : '[Nome do(a) Emitente]';
    }
    if (prevMemoSigCargo) {
      prevMemoSigCargo.textContent = signatarioCargo ? signatarioCargo.toUpperCase() : '';
    }
    if (prevMemoSigDept) prevMemoSigDept.textContent = nomeSetorRemetente;

    // 6. Aplicar ao Documento 2: Quadro Anexo (Modelo Oficial)
    if (prevQuadroUa) prevQuadroUa.textContent = nomeSetorRemetente;
    if (prevQuadroFuncao) prevQuadroFuncao.textContent = funcaoSubstituida;
    if (prevQuadroAPartir) prevQuadroAPartir.textContent = dataVigenciaFormatada;

    // Dados do 1º Substituto
    if (prevQuadroSubst1Nome) prevQuadroSubst1Nome.textContent = inputSubst1Nome ? inputSubst1Nome.value.trim() : '';
    if (prevQuadroSubst1Mat) prevQuadroSubst1Mat.textContent = inputSubst1Matricula ? inputSubst1Matricula.value.trim() : '';
    if (prevQuadroSubst1Rg) prevQuadroSubst1Rg.textContent = inputSubst1Rg ? inputSubst1Rg.value.trim() : '';
    if (prevQuadroSubst1Cpf) prevQuadroSubst1Cpf.textContent = inputSubst1Cpf ? inputSubst1Cpf.value.trim() : '';
    if (prevQuadroSubst1Funcao) prevQuadroSubst1Funcao.textContent = selectSubst1Funcao ? selectSubst1Funcao.value : '';
    if (prevQuadroSubst1Esc) prevQuadroSubst1Esc.textContent = selectSubst1Escolaridade ? selectSubst1Escolaridade.value : '';

    // Dados do 2º Substituto (se ativo)
    const temSubst2 = checkPossuiSubst2 && checkPossuiSubst2.checked;
    if (prevQuadroBlocoSubst2) {
      prevQuadroBlocoSubst2.style.display = temSubst2 ? 'block' : 'none';
    }
    if (temSubst2) {
      if (prevQuadroSubst2Nome) prevQuadroSubst2Nome.textContent = inputSubst2Nome ? inputSubst2Nome.value.trim() : '';
      if (prevQuadroSubst2Mat) prevQuadroSubst2Mat.textContent = inputSubst2Matricula ? inputSubst2Matricula.value.trim() : '';
      if (prevQuadroSubst2Rg) prevQuadroSubst2Rg.textContent = inputSubst2Rg ? inputSubst2Rg.value.trim() : '';
      if (prevQuadroSubst2Cpf) prevQuadroSubst2Cpf.textContent = inputSubst2Cpf ? inputSubst2Cpf.value.trim() : '';
      if (prevQuadroSubst2Funcao) prevQuadroSubst2Funcao.textContent = selectSubst2Funcao ? selectSubst2Funcao.value : '';
      if (prevQuadroSubst2Esc) prevQuadroSubst2Esc.textContent = selectSubst2Escolaridade ? selectSubst2Escolaridade.value : '';
    }
  }

  // --------------------------------------------------------------------------
  // 4. ALTERNÂNCIA DE ABAS DE VISUALIZAÇÃO
  // --------------------------------------------------------------------------
  function alternarAba(aba) {
    if (aba === 'memo') {
      tabMemo.classList.add('active');
      tabQuadro.classList.remove('active');
      viewMemo.classList.add('active');
      viewQuadro.classList.remove('active');
      if (labelDocPreview) {
        labelDocPreview.textContent = 'Visualizando: Memorando (PDF 1)';
      }
    } else if (aba === 'quadro') {
      tabQuadro.classList.add('active');
      tabMemo.classList.remove('active');
      viewQuadro.classList.add('active');
      viewMemo.classList.remove('active');
      if (labelDocPreview) {
        labelDocPreview.textContent = 'Visualizando: Quadro Anexo (PDF 2)';
      }
    }
  }

  tabMemo.addEventListener('click', () => alternarAba('memo'));
  tabQuadro.addEventListener('click', () => alternarAba('quadro'));

  // --------------------------------------------------------------------------
  // 5. EVENT LISTENERS PARA ATUALIZAÇÃO EM TEMPO REAL
  // --------------------------------------------------------------------------
  const camposMonitorados = [
    inputMemoNumero,
    inputMemoAno,
    inputMemoData,
    inputMemoAssunto,
    inputDataVigencia,
    selectRemetente,
    selectFuncaoSubstituida,
    selectDestinatarioPessoa,
    inputSignatarioNome,
    selectSignatarioCargo,
    inputSubst1Nome,
    inputSubst1Rg,
    selectSubst1Funcao,
    selectSubst1Escolaridade,
    inputSubst2Nome,
    inputSubst2Rg,
    selectSubst2Funcao,
    selectSubst2Escolaridade
  ];

  camposMonitorados.forEach(campo => {
    if (campo) {
      campo.addEventListener('input', atualizarDocumentos);
      campo.addEventListener('change', atualizarDocumentos);
    }
  });

  // Validação e formatação reativa: Matrícula Funcional e CPF do 1º Substituto
  if (inputSubst1Matricula) {
    inputSubst1Matricula.addEventListener('input', () => {
      const formatted = formatarMatricula(inputSubst1Matricula.value);
      inputSubst1Matricula.value = formatted;
      const res = validarMatriculaUnesp(formatted);
      atualizarFeedbackCampo(inputSubst1Matricula, feedbackSubst1Matricula, res, true, false);
      atualizarDocumentos();
    });
    inputSubst1Matricula.addEventListener('blur', () => {
      const formatted = formatarMatricula(inputSubst1Matricula.value);
      inputSubst1Matricula.value = formatted;
      const res = validarMatriculaUnesp(formatted);
      atualizarFeedbackCampo(inputSubst1Matricula, feedbackSubst1Matricula, res, true, true);
      atualizarDocumentos();
    });
  }

  if (inputSubst1Cpf) {
    inputSubst1Cpf.addEventListener('input', () => {
      const formatted = formatarCpf(inputSubst1Cpf.value);
      inputSubst1Cpf.value = formatted;
      const res = validarCpf(formatted);
      atualizarFeedbackCampo(inputSubst1Cpf, feedbackSubst1Cpf, res, true, false);
      atualizarDocumentos();
    });
    inputSubst1Cpf.addEventListener('blur', () => {
      const formatted = formatarCpf(inputSubst1Cpf.value);
      inputSubst1Cpf.value = formatted;
      const res = validarCpf(formatted);
      atualizarFeedbackCampo(inputSubst1Cpf, feedbackSubst1Cpf, res, true, true);
      atualizarDocumentos();
    });
  }

  // Validação e formatação reativa: Matrícula Funcional e CPF do 2º Substituto
  if (inputSubst2Matricula) {
    inputSubst2Matricula.addEventListener('input', () => {
      const ativo = !!(checkPossuiSubst2 && checkPossuiSubst2.checked);
      const formatted = formatarMatricula(inputSubst2Matricula.value);
      inputSubst2Matricula.value = formatted;
      const res = validarMatriculaUnesp(formatted);
      atualizarFeedbackCampo(inputSubst2Matricula, feedbackSubst2Matricula, res, ativo, false);
      atualizarDocumentos();
    });
    inputSubst2Matricula.addEventListener('blur', () => {
      const ativo = !!(checkPossuiSubst2 && checkPossuiSubst2.checked);
      const formatted = formatarMatricula(inputSubst2Matricula.value);
      inputSubst2Matricula.value = formatted;
      const res = validarMatriculaUnesp(formatted);
      atualizarFeedbackCampo(inputSubst2Matricula, feedbackSubst2Matricula, res, ativo, true);
      atualizarDocumentos();
    });
  }

  if (inputSubst2Cpf) {
    inputSubst2Cpf.addEventListener('input', () => {
      const ativo = !!(checkPossuiSubst2 && checkPossuiSubst2.checked);
      const formatted = formatarCpf(inputSubst2Cpf.value);
      inputSubst2Cpf.value = formatted;
      const res = validarCpf(formatted);
      atualizarFeedbackCampo(inputSubst2Cpf, feedbackSubst2Cpf, res, ativo, false);
      atualizarDocumentos();
    });
    inputSubst2Cpf.addEventListener('blur', () => {
      const ativo = !!(checkPossuiSubst2 && checkPossuiSubst2.checked);
      const formatted = formatarCpf(inputSubst2Cpf.value);
      inputSubst2Cpf.value = formatted;
      const res = validarCpf(formatted);
      atualizarFeedbackCampo(inputSubst2Cpf, feedbackSubst2Cpf, res, ativo, true);
      atualizarDocumentos();
    });
  }

  // Função geral para validar todos os dados do Quadro Anexo antes de emissão
  function validarDadosQuadroSubstituicao() {
    const erros = [];

    // 1º Substituto
    const mat1Val = inputSubst1Matricula ? inputSubst1Matricula.value : '';
    const resMat1 = validarMatriculaUnesp(mat1Val);
    if (!resMat1.valido) {
      erros.push({
        campo: inputSubst1Matricula,
        feedback: feedbackSubst1Matricula,
        msg: `Matrícula do 1º Substituto: ${resMat1.mensagem}`
      });
    }

    const cpf1Val = inputSubst1Cpf ? inputSubst1Cpf.value : '';
    const resCpf1 = validarCpf(cpf1Val);
    if (!resCpf1.valido) {
      erros.push({
        campo: inputSubst1Cpf,
        feedback: feedbackSubst1Cpf,
        msg: `CPF do 1º Substituto: ${resCpf1.mensagem}`
      });
    }

    // 2º Substituto (se ativado)
    if (checkPossuiSubst2 && checkPossuiSubst2.checked) {
      const mat2Val = inputSubst2Matricula ? inputSubst2Matricula.value : '';
      const resMat2 = validarMatriculaUnesp(mat2Val);
      if (!resMat2.valido) {
        erros.push({
          campo: inputSubst2Matricula,
          feedback: feedbackSubst2Matricula,
          msg: `Matrícula do 2º Substituto: ${resMat2.mensagem}`
        });
      }

      const cpf2Val = inputSubst2Cpf ? inputSubst2Cpf.value : '';
      const resCpf2 = validarCpf(cpf2Val);
      if (!resCpf2.valido) {
        erros.push({
          campo: inputSubst2Cpf,
          feedback: feedbackSubst2Cpf,
          msg: `CPF do 2º Substituto: ${resCpf2.mensagem}`
        });
      }
    }

    return erros;
  }

  // Controle de ativação do 2º Substituto
  if (checkPossuiSubst2) {
    checkPossuiSubst2.addEventListener('change', () => {
      const ativo = checkPossuiSubst2.checked;
      if (formSectionSubst2) {
        formSectionSubst2.style.display = ativo ? 'block' : 'none';
      }
      if (inputSubst2Nome) inputSubst2Nome.required = ativo;
      if (inputSubst2Matricula) inputSubst2Matricula.required = ativo;
      if (inputSubst2Rg) inputSubst2Rg.required = ativo;
      if (inputSubst2Cpf) inputSubst2Cpf.required = ativo;
      if (selectSubst2Funcao) selectSubst2Funcao.required = ativo;
      if (selectSubst2Escolaridade) selectSubst2Escolaridade.required = ativo;

      if (!ativo) {
        if (inputSubst2Matricula) {
          inputSubst2Matricula.classList.remove('input-invalid', 'input-valid');
        }
        if (feedbackSubst2Matricula) {
          feedbackSubst2Matricula.className = 'field-feedback';
          feedbackSubst2Matricula.textContent = '';
        }
        if (inputSubst2Cpf) {
          inputSubst2Cpf.classList.remove('input-invalid', 'input-valid');
        }
        if (feedbackSubst2Cpf) {
          feedbackSubst2Cpf.className = 'field-feedback';
          feedbackSubst2Cpf.textContent = '';
        }
      } else {
        if (inputSubst2Matricula && inputSubst2Matricula.value.trim()) {
          const res = validarMatriculaUnesp(inputSubst2Matricula.value);
          atualizarFeedbackCampo(inputSubst2Matricula, feedbackSubst2Matricula, res, true, true);
        }
        if (inputSubst2Cpf && inputSubst2Cpf.value.trim()) {
          const res = validarCpf(inputSubst2Cpf.value);
          atualizarFeedbackCampo(inputSubst2Cpf, feedbackSubst2Cpf, res, true, true);
        }
      }

      atualizarDocumentos();
    });
  }

  // Atualização dinâmica ao selecionar a Unidade Administrativa de Procedência
  selectRemetente.addEventListener('change', () => {
    popularCamposVinculadosAUA(selectRemetente.value);
    atualizarDocumentos();
  });

  if (selectFuncaoSubstituida) {
    selectFuncaoSubstituida.addEventListener('change', atualizarDocumentos);
  }

  if (selectSignatarioCargo) {
    selectSignatarioCargo.addEventListener('change', atualizarDocumentos);
  }

  // --------------------------------------------------------------------------
  // 6. GERAÇÃO DE PDFS VETORIAIS COM TEXTO PURO (jsPDF + Tipografia Raleway)
  // --------------------------------------------------------------------------
  function compilarPdf(tipoDocumento) {
    const numMemo = (inputMemoNumero.value.trim() || '01').padStart(2, '0');
    const ano = inputMemoAno.value.trim() || String(anoAtual);

    const optionSel = selectRemetente.options[selectRemetente.selectedIndex];
    const siglaRaw = optionSel ? (optionSel.getAttribute('data-sigla') || 'FCT') : 'FCT';
    const siglaLimpa = siglaRaw.replace(/[^a-zA-Z0-9_-]/g, '_');

    let btnAlvo = null;
    let nomeArquivo = '';

    if (tipoDocumento === 'memo') {
      alternarAba('memo');
      btnAlvo = btnGerarMemoPdf;
      nomeArquivo = `Memorando_N${numMemo}_${ano}_${siglaLimpa}_FCT_PP.pdf`;
    } else if (tipoDocumento === 'quadro') {
      alternarAba('quadro');
      btnAlvo = btnGerarQuadroPdf;
      nomeArquivo = `Quadro_Anexo_Memorando_N${numMemo}_${ano}_${siglaLimpa}_FCT_PP.pdf`;

      // Verificação de validação antes de prosseguir com a emissão do Quadro
      const erros = validarDadosQuadroSubstituicao();
      if (erros.length > 0) {
        erros.forEach(e => {
          if (e.campo) {
            e.campo.classList.add('input-invalid');
            e.campo.classList.remove('input-valid');
          }
          if (e.feedback) {
            e.feedback.className = 'field-feedback invalid';
            e.feedback.textContent = `⚠ ${e.msg.split(': ')[1] || e.msg}`;
          }
        });
        if (erros[0] && erros[0].campo) {
          erros[0].campo.focus();
        }
        alert('Atenção: Não é possível gerar o Quadro de Alteração da Escala com erros de validação:\n\n' +
              erros.map(e => `• ${e.msg}`).join('\n') +
              '\n\nPor favor, corrija os campos indicados.');
        return;
      }
    }

    const textoOriginal = btnAlvo.innerHTML;
    btnAlvo.disabled = true;
    btnAlvo.innerHTML = '⏳ Gerando PDF Vetorial...';

    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        throw new Error('jsPDF não está disponível no ambiente.');
      }

      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      });

      // Incorporação da fonte oficial Raleway (Normal e Negrito)
      let fontName = 'helvetica';
      if (window.RALEWAY_REGULAR_BASE64 && window.RALEWAY_BOLD_BASE64) {
        doc.addFileToVFS('Raleway-Regular.ttf', window.RALEWAY_REGULAR_BASE64);
        doc.addFont('Raleway-Regular.ttf', 'Raleway', 'normal');
        doc.addFileToVFS('Raleway-Bold.ttf', window.RALEWAY_BOLD_BASE64);
        doc.addFont('Raleway-Bold.ttf', 'Raleway', 'bold');
        fontName = 'Raleway';
      }

      // 1. Imagem de Fundo Oficial do Papel Timbrado (único elemento rasterizado)
      if (window.PAPEL_TIMBRADO_BASE64) {
        doc.addImage(window.PAPEL_TIMBRADO_BASE64, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      }

      doc.setTextColor(0, 0, 0);

      // ==========================================
      // DOCUMENTO 1: MEMORANDO OFICIAL (VETORIAL)
      // ==========================================
      if (tipoDocumento === 'memo') {
        const textoId = `MEMORANDO Nº ${numMemo}/${ano} ${siglaRaw}/FCT/PP`;
        doc.setFont(fontName, 'normal');
        doc.setFontSize(11);
        doc.text(textoId, 25, 48);

        // Data de emissão à direita
        const dataExtenso = prevMemoDataExtenso ? prevMemoDataExtenso.textContent : formatarDataExtenso(inputMemoData.value);
        doc.text(dataExtenso, 188, 55, { align: 'right' });

        // Bloco do Destinatário (11pt, lineHeight ~1.35)
        const destLinhas = [
          'A(o) Senhor(a)',
          prevMemoDestNome ? prevMemoDestNome.textContent : '',
          prevMemoDestFuncao ? prevMemoDestFuncao.textContent : '',
          prevMemoDestUA ? prevMemoDestUA.textContent : '',
          'FACULDADE DE CIÊNCIAS E TECNOLOGIA - CÂMPUS DE PRESIDENTE PRUDENTE'
        ].filter(Boolean);

        let yDest = 65;
        destLinhas.forEach(l => {
          doc.text(l, 25, yDest);
          yDest += 4.8;
        });

        // Linha de Assunto (3 quebras de linha abaixo do bloco de destinatário)
        let yAssunto = yDest + 10;
        doc.setFont(fontName, 'bold');
        doc.text('Assunto: ', 25, yAssunto);
        const wAssunto = doc.getTextWidth('Assunto: ');
        doc.setFont(fontName, 'normal');
        const assuntoTxt = inputMemoAssunto.value.trim() || 'ALTERAÇÃO DA ESCALA DE SUBSTITUIÇÃO';
        doc.text(assuntoTxt, 25 + wAssunto, yAssunto);

        // Corpo do Texto Oficial (3 quebras abaixo do assunto, recuo de 2.5cm na 1ª linha e alinhamento justificado)
        let yCorpo = yAssunto + 14;
        const funcaoAlvo = prevMemoFuncaoAlvo ? prevMemoFuncaoAlvo.textContent : 'Função em Confiança';
        const dataVig = prevMemoDataVigencia ? prevMemoDataVigencia.textContent : '--/--/----';

        // Tokenização estruturada para aplicar negrito exclusivamente na Função em Confiança
        const parte1 = 'Encaminhamos a Vossa Senhoria, para as providências cabíveis, o Quadro de Alteração da Escala de Substituição constante em anexo, da função de ';
        const parte2 = ` referente a esta unidade administrativa, para vigência a partir de ${dataVig}.`;

        const tokens = [];
        parte1.trim().split(/\s+/).forEach(w => tokens.push({ text: w, isBold: false }));
        funcaoAlvo.trim().split(/\s+/).forEach(w => tokens.push({ text: w, isBold: true }));
        parte2.trim().split(/\s+/).forEach(w => tokens.push({ text: w, isBold: false }));

        // Medição milimétrica de cada token com o respectivo peso da fonte
        tokens.forEach(t => {
          doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
          t.width = doc.getTextWidth(t.text);
        });

        doc.setFont(fontName, 'normal');
        const normalSpaceWidth = doc.getTextWidth(' ');

        // Quebra e distribuição das linhas considerando recuo de 2,5 cm (25 mm) na primeira linha
        const leftMargin = 25;
        const rightMargin = 188;
        const fullWidth = rightMargin - leftMargin; // 163mm
        const indent = 25; // 2,5cm
        const firstLineWidth = fullWidth - indent; // 138mm

        const lines = [];
        let currentLine = [];
        let currentLineWidth = 0;
        let isFirstLine = true;

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const maxW = isFirstLine ? firstLineWidth : fullWidth;
          const spaceNeeded = currentLine.length > 0 ? normalSpaceWidth : 0;

          if (currentLine.length > 0 && (currentLineWidth + spaceNeeded + token.width > maxW)) {
            lines.push({ tokens: currentLine, isFirst: isFirstLine });
            currentLine = [token];
            currentLineWidth = token.width;
            isFirstLine = false;
          } else {
            currentLine.push(token);
            currentLineWidth += spaceNeeded + token.width;
          }
        }
        if (currentLine.length > 0) {
          lines.push({ tokens: currentLine, isFirst: isFirstLine, isLast: true });
        }

        // Renderização com alinhamento justificado rigoroso
        let yLinha = yCorpo;
        const lineHeight = 6.5;

        lines.forEach((lineObj, lineIndex) => {
          const isLast = (lineIndex === lines.length - 1);
          const lineTokens = lineObj.tokens;
          const startX = lineObj.isFirst ? (leftMargin + indent) : leftMargin;
          const availableW = lineObj.isFirst ? firstLineWidth : fullWidth;

          if (isLast || lineTokens.length === 1) {
            // Última linha: alinhada à esquerda sem esticar espaços
            let curX = startX;
            lineTokens.forEach(t => {
              doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
              doc.text(t.text, curX, yLinha);
              curX += t.width + normalSpaceWidth;
            });
          } else {
            // Linhas intermediárias: justificadas com cálculo exato de espaçamento entre palavras
            const sumTokensWidth = lineTokens.reduce((sum, t) => sum + t.width, 0);
            const spaceDist = (availableW - sumTokensWidth) / (lineTokens.length - 1);
            let curX = startX;
            lineTokens.forEach(t => {
              doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
              doc.text(t.text, curX, yLinha);
              curX += t.width + spaceDist;
            });
          }
          yLinha += lineHeight;
        });

        // Fecho Oficial (recuo de 2.5cm)
        const fecho = prevMemoFecho ? prevMemoFecho.textContent : 'Respeitosamente,';
        let yFecho = yLinha + 4;
        doc.setFont(fontName, 'normal');
        doc.text(fecho, 50, yFecho);

        // Signatário (3 quebras de linha abaixo do fecho, centralizado com indent 2.5cm = x: 119)
        const sigNome = prevMemoSigNome ? prevMemoSigNome.textContent : '';
        const sigCargo = prevMemoSigCargo ? prevMemoSigCargo.textContent : '';
        let ySig = yFecho + 18;
        doc.text(sigNome, 119, ySig, { align: 'center' });
        doc.text(sigCargo, 119, ySig + 4.5, { align: 'center' });

        // Indicador de Anexo no rodapé
        doc.setFontSize(9.5);
        doc.text('Anexo: 1. Quadro de Alteração da Escala de Substituição.', 25, 268);
      }

      // ==========================================
      // DOCUMENTO 2: QUADRO ANEXO (VETORIAL)
      // ==========================================
      else if (tipoDocumento === 'quadro') {
        doc.setFont(fontName, 'bold');
        doc.setFontSize(12);
        doc.text('QUADRO DE ALTERAÇÃO DE ESCALA DE SUBSTITUIÇÃO', 105, 48, { align: 'center' });

        // Metadados Gerais
        const ua = prevQuadroUa ? prevQuadroUa.textContent : '';
        const fc = prevQuadroFuncao ? prevQuadroFuncao.textContent : '';
        const ap = prevQuadroAPartir ? prevQuadroAPartir.textContent : '';

        doc.setFontSize(9.5);
        doc.setFont(fontName, 'bold');
        doc.text('UNIDADE ADMINISTRATIVA: ', 25, 57);
        doc.setFont(fontName, 'normal');
        doc.text(ua, 25 + doc.getTextWidth('UNIDADE ADMINISTRATIVA: '), 57);

        doc.setFont(fontName, 'bold');
        doc.text('FUNÇÃO EM CONFIANÇA: ', 25, 63);
        doc.setFont(fontName, 'normal');
        doc.text(fc, 25 + doc.getTextWidth('FUNÇÃO EM CONFIANÇA: '), 63);

        doc.setFont(fontName, 'bold');
        doc.text('A PARTIR DE: ', 25, 69);
        doc.setFont(fontName, 'normal');
        doc.text(ap, 25 + doc.getTextWidth('A PARTIR DE: '), 69);

        // Função de desenho estruturado da caixa de substituto
        const drawSubstituteBox = (yStart, titulo, subst, numSubst) => {
          const boxX = 25;
          const boxW = 160;
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.25);

          // Cabeçalho da Seção
          doc.setFillColor(203, 213, 225);
          doc.rect(boxX, yStart, boxW, 6.5, 'FD');
          doc.setFont(fontName, 'bold');
          doc.setFontSize(9.5);
          doc.text(titulo, 105, yStart + 4.5, { align: 'center' });

          // Linha 1: Apenas o Nome (Largura total 160mm)
          const y1 = yStart + 6.5;
          doc.rect(boxX, y1, boxW, 6.5);
          doc.setFont(fontName, 'bold'); doc.setFontSize(8.5);
          doc.text('NOME: ', boxX + 2, y1 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.nome || '', boxX + 2 + doc.getTextWidth('NOME: '), y1 + 4.5);

          // Linha 2: Matrícula, RG e CPF (3 colunas: 50mm, 50mm, 60mm)
          const y2 = y1 + 6.5;
          const col1W = 50;
          const col2W = 50;
          const col3W = 60; // 50 + 50 + 60 = 160mm

          doc.rect(boxX, y2, col1W, 6.5);
          doc.rect(boxX + col1W, y2, col2W, 6.5);
          doc.rect(boxX + col1W + col2W, y2, col3W, 6.5);

          // Coluna 1: Matrícula
          doc.setFont(fontName, 'bold');
          doc.text('MATRÍCULA: ', boxX + 2, y2 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.matricula || '', boxX + 2 + doc.getTextWidth('MATRÍCULA: '), y2 + 4.5);

          // Coluna 2: RG
          const xRg = boxX + col1W;
          doc.setFont(fontName, 'bold');
          doc.text('RG: ', xRg + 2, y2 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.rg || '', xRg + 2 + doc.getTextWidth('RG: '), y2 + 4.5);

          // Coluna 3: CPF
          const xCpf = boxX + col1W + col2W;
          doc.setFont(fontName, 'bold');
          doc.text('CPF: ', xCpf + 2, y2 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.cpf || '', xCpf + 2 + doc.getTextWidth('CPF: '), y2 + 4.5);

          // Linha 3: Apenas a Função (Largura total 160mm)
          const y3 = y2 + 6.5;
          doc.rect(boxX, y3, boxW, 6.5);
          doc.setFont(fontName, 'bold');
          doc.text('FUNÇÃO: ', boxX + 2, y3 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.funcao || '', boxX + 2 + doc.getTextWidth('FUNÇÃO: '), y3 + 4.5);

          // Linha 4: Escolaridade
          const y4 = y3 + 6.5;
          doc.rect(boxX, y4, boxW, 6.5);
          doc.setFont(fontName, 'bold');
          doc.text('ESCOLARIDADE: ', boxX + 2, y4 + 4.5);
          doc.setFont(fontName, 'normal');
          doc.text(subst.escolaridade || '', boxX + 2 + doc.getTextWidth('ESCOLARIDADE: '), y4 + 4.5);

          // Bloco De Acordo
          const y5 = y4 + 6.5;
          doc.rect(boxX, y5, boxW, 26);
          doc.setFont(fontName, 'normal');
          doc.setFontSize(9);
          doc.text('De acordo.', boxX + 2.5, y5 + 4.5);

          // Identificação do Superior Imediato (sem linha para assinatura, com quebra de linha adicional)
          doc.setFontSize(7.5);
          doc.text(`Identificação e assinatura do superior imediato do ${numSubst} substituto`, 105, y5 + 22, { align: 'center' });
        };

        const s1 = {
          nome: prevQuadroSubst1Nome ? prevQuadroSubst1Nome.textContent : '',
          rg: prevQuadroSubst1Rg ? prevQuadroSubst1Rg.textContent : '',
          matricula: prevQuadroSubst1Mat ? prevQuadroSubst1Mat.textContent : '',
          cpf: prevQuadroSubst1Cpf ? prevQuadroSubst1Cpf.textContent : '',
          funcao: prevQuadroSubst1Funcao ? prevQuadroSubst1Funcao.textContent : '',
          escolaridade: prevQuadroSubst1Esc ? prevQuadroSubst1Esc.textContent : ''
        };

        const temSubst2 = checkPossuiSubst2 && checkPossuiSubst2.checked;
        drawSubstituteBox(75, '1º SUBSTITUTO', s1, '1º');

        if (temSubst2) {
          const s2 = {
            nome: prevQuadroSubst2Nome ? prevQuadroSubst2Nome.textContent : '',
            rg: prevQuadroSubst2Rg ? prevQuadroSubst2Rg.textContent : '',
            matricula: prevQuadroSubst2Mat ? prevQuadroSubst2Mat.textContent : '',
            cpf: prevQuadroSubst2Cpf ? prevQuadroSubst2Cpf.textContent : '',
            funcao: prevQuadroSubst2Funcao ? prevQuadroSubst2Funcao.textContent : '',
            escolaridade: prevQuadroSubst2Esc ? prevQuadroSubst2Esc.textContent : ''
          };
          // Espaço de 3 quebras de linha (15mm) entre a 1ª tabela (termina em y=133.5) e a 2ª tabela (inicia em y=148.5)
          drawSubstituteBox(148.5, '2º SUBSTITUTO', s2, '2º');
        }
      }

      // Salva o PDF vetorial nativo
      doc.save(nomeArquivo);

      setTimeout(() => {
        btnAlvo.disabled = false;
        btnAlvo.innerHTML = textoOriginal;
      }, 500);

    } catch (err) {
      console.error('Erro ao gerar PDF vetorial:', err);
      alert('Houve um problema ao compilar o PDF vetorial. Utilize a opção "Visualizar Impressão" e selecione "Salvar como PDF".');
      btnAlvo.disabled = false;
      btnAlvo.innerHTML = textoOriginal;
    }
  }

  btnGerarMemoPdf.addEventListener('click', () => compilarPdf('memo'));
  btnGerarQuadroPdf.addEventListener('click', () => compilarPdf('quadro'));

  // --------------------------------------------------------------------------
  // 7. BOTÃO DE IMPRESSÃO NATIVA
  // --------------------------------------------------------------------------
  btnImprimirTudo.addEventListener('click', () => {
    const abaQuadroAtiva = viewQuadro && viewQuadro.classList.contains('active');
    if (abaQuadroAtiva) {
      const erros = validarDadosQuadroSubstituicao();
      if (erros.length > 0) {
        erros.forEach(e => {
          if (e.campo) {
            e.campo.classList.add('input-invalid');
            e.campo.classList.remove('input-valid');
          }
          if (e.feedback) {
            e.feedback.className = 'field-feedback invalid';
            e.feedback.textContent = `⚠ ${e.msg.split(': ')[1] || e.msg}`;
          }
        });
        if (erros[0] && erros[0].campo) {
          erros[0].campo.focus();
        }
        alert('Atenção: Não é possível imprimir o Quadro de Alteração da Escala com erros de validação:\n\n' +
              erros.map(e => `• ${e.msg}`).join('\n') +
              '\n\nPor favor, corrija os campos indicados.');
        return;
      }
    }
    window.print();
  });

  // Função para popular os selects de funções efetivas e escolaridade
  function popularListasSubstitutos() {
    const popularSelect = (sel, itens, placeholder) => {
      if (!sel) return;
      const valAtual = sel.value;
      sel.innerHTML = `<option value="">${placeholder}</option>`;
      itens.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        sel.appendChild(opt);
      });
      if (valAtual && itens.includes(valAtual)) {
        sel.value = valAtual;
      }
    };

    popularSelect(selectSubst1Funcao, window.LISTA_FUNCOES_EFETIVAS, 'Selecione a função efetiva...');
    popularSelect(selectSubst2Funcao, window.LISTA_FUNCOES_EFETIVAS, 'Selecione a função efetiva...');
    popularSelect(selectSubst1Escolaridade, window.LISTA_ESCOLARIDADE, 'Selecione a escolaridade...');
    popularSelect(selectSubst2Escolaridade, window.LISTA_ESCOLARIDADE, 'Selecione a escolaridade...');
  }

  // Inicialização no carregamento
  const bgImgInit = document.querySelector('.papel-timbrado-bg');
  if (bgImgInit && window.PAPEL_TIMBRADO_BASE64) {
    bgImgInit.src = window.PAPEL_TIMBRADO_BASE64;
  }

  popularListasSubstitutos();
  popularCamposVinculadosAUA(selectRemetente.value);
  atualizarDocumentos();
});
