/**
 * Gerador de Memorando — Início de Exercício de Novos Servidores
 * STGP FCT UNESP — Câmpus de Presidente Prudente
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. MAPEAMENTO DOS ELEMENTOS DO FORMULÁRIO
  // ==========================================================================
  
  // Card 1: Identificação do Memorando
  const inputMemoNumero = document.getElementById('memo_numero');
  const inputMemoAno = document.getElementById('memo_ano');
  const inputMemoData = document.getElementById('memo_data');
  const inputMemoAssunto = document.getElementById('memo_assunto');

  // Card 2: Remetente e Destinatário
  const selectRemetente = document.getElementById('remetente_select');
  const inputDestinatario = document.getElementById('destinatario_input');
  const selectDestinatarioPessoa = document.getElementById('destinatario_pessoa_select');
  const inputSignatarioNome = document.getElementById('signatario_nome');
  const selectSignatarioCargo = document.getElementById('signatario_cargo');

  // Card 3: Dados do Servidor e Categoria
  const radiosCategoria = document.querySelectorAll('input[name="categoria_servidor"]');
  const infoCategoriaBox = document.getElementById('info_categoria_box');
  const inputServidorNome = document.getElementById('servidor_nome');
  const inputServidorCpf = document.getElementById('servidor_cpf');
  const feedbackServidorCpf = document.getElementById('feedback_servidor_cpf');
  const inputDataExercicio = document.getElementById('data_exercicio');
  const feedbackDataExercicio = document.getElementById('feedback_data_exercicio');
  const inputServidorCargo = document.getElementById('servidor_cargo');
  const selectServidorJornada = document.getElementById('servidor_jornada');
  const hintServidorJornada = document.getElementById('hint_servidor_jornada');
  const selectServidorRegime = document.getElementById('servidor_regime');

  // Dados Bancários
  const inputBancoAgencia = document.getElementById('banco_agencia');
  const inputBancoConta = document.getElementById('banco_conta');

  // Card 4: Horário de Trabalho
  const cardHorarioTrabalho = document.getElementById('card_horario_trabalho');
  const radiosTipoHorario = document.querySelectorAll('input[name="tipo_horario"]');
  const blocoHorarioFixo = document.getElementById('bloco_horario_fixo');
  const blocoHorarioEscala = document.getElementById('bloco_horario_escala');
  const selectCargaSemanal = document.getElementById('carga_semanal_select');

  // Tabela Semanal de Horários
  const tabelaHorarioSemanal = document.getElementById('tabela_horario_semanal');
  const totalHorasSemanais = document.getElementById('total_horas_semanais');
  const alertaExcessoHoras = document.getElementById('alerta_excesso_horas');
  const textoExcessoHoras = document.getElementById('texto_excesso_horas');

  // Botões de Presets
  const btnPreset40hPadrao = document.getElementById('preset_40h_padrao');
  const btnPreset40h13h = document.getElementById('preset_40h_13h');
  const btnPreset36h = document.getElementById('preset_36h');
  const btnPreset30h = document.getElementById('preset_30h');
  const btnPreset20h = document.getElementById('preset_20h');
  const btnPresetLimpar = document.getElementById('preset_limpar');

  // Opção Escala de Trabalho
  const selectEscala = document.getElementById('escala_select');
  const inputEscalaTurno = document.getElementById('escala_turno_horario');

  // Painel de Conformidade Trabalhista (CLT / TST)
  const painelConformidadeClt = document.getElementById('painel_conformidade_clt');
  const tituloPainelConformidade = document.getElementById('titulo_painel_conformidade');
  const badgeStatusClt = document.getElementById('badge_status_clt');
  const checkCltIntrajornada = document.getElementById('check_clt_intrajornada');
  const titleCltIntrajornada = document.getElementById('title_clt_intrajornada');
  const iconCltIntrajornada = document.getElementById('icon_clt_intrajornada');
  const descCltIntrajornada = document.getElementById('desc_clt_intrajornada');
  const checkCltInterjornada = document.getElementById('check_clt_interjornada');
  const titleCltInterjornada = document.getElementById('title_clt_interjornada');
  const iconCltInterjornada = document.getElementById('icon_clt_interjornada');
  const descCltInterjornada = document.getElementById('desc_clt_interjornada');
  const checkCltSemanal35h = document.getElementById('check_clt_semanal35h');
  const titleCltSemanal35h = document.getElementById('title_clt_semanal35h');
  const iconCltSemanal35h = document.getElementById('icon_clt_semanal35h');
  const descCltSemanal35h = document.getElementById('desc_clt_semanal35h');
  const textoRodapeConformidade = document.getElementById('texto_rodape_conformidade');

  // Botões de Ação
  const btnGerarMemoPdf = document.getElementById('btn-gerar-memo-pdf');
  const btnImprimirTudo = document.getElementById('btn-imprimir-tudo');

  // ==========================================================================
  // 2. MAPEAMENTO DOS ELEMENTOS DA PRÉ-VISUALIZAÇÃO A4
  // ==========================================================================
  const prevMemoNum = document.getElementById('prev-memo-num');
  const prevMemoAno = document.getElementById('prev-memo-ano');
  const prevMemoSigla = document.getElementById('prev-memo-sigla');
  const prevMemoDataExtenso = document.getElementById('prev-memo-data-extenso');
  const prevMemoDestNome = document.getElementById('prev-memo-dest-nome');
  const prevMemoDestFuncao = document.getElementById('prev-memo-dest-funcao');
  const prevMemoAssunto = document.getElementById('prev-memo-assunto');

  const prevServidorNome = document.getElementById('prev-servidor-nome');
  const prevServidorCpf = document.getElementById('prev-servidor-cpf');
  const prevDataExercicio = document.getElementById('prev-data-exercicio');
  const prevServidorCargo = document.getElementById('prev-servidor-cargo');
  const prevServidorJornadaWrapper = document.getElementById('prev-servidor-jornada-wrapper');
  const prevServidorJornada = document.getElementById('prev-servidor-jornada');

  const prevMemoCorpoP2 = document.getElementById('prev-memo-corpo-p2');
  const prevBancoAgencia = document.getElementById('prev-banco-agencia');
  const prevBancoConta = document.getElementById('prev-banco-conta');

  const prevBlocoHorario = document.getElementById('prev-bloco-horario');
  const prevConteudoHorario = document.getElementById('prev-conteudo-horario');
  const memoTabelaHorarioCorpo = document.getElementById('memo_tabela_horario_corpo');
  const memoTabelaTotalSemanal = document.getElementById('memo_tabela_total_semanal');

  const prevSigNome = document.getElementById('prev-memo-sig-nome');
  const prevSigCargo = document.getElementById('prev-memo-sig-cargo');

  // ==========================================================================
  // 3. AUTORIDADES DESTINATÁRIAS DA STGP
  // ==========================================================================
  const AUTORIDADES_STGP = [
    {
      id: 'stgp_titular',
      nome: 'ANDERSON LUIZ ROS DE SOUSA',
      cargo: 'SUPERVISOR TÉCNICO DE SEÇÃO',
      label: 'Titular: ANDERSON LUIZ ROS DE SOUSA (Supervisor Técnico de Seção)'
    },
    {
      id: 'stgp_subst1',
      nome: 'PATRICIA DO NASCIMENTO PESSATTO GODOY DE SOUZA',
      cargo: 'SUPERVISORA TÉCNICA DE SEÇÃO - SUBST.ª',
      label: '1ª Substituta: PATRICIA DO NASCIMENTO PESSATTO GODOY DE SOUZA (Supervisora Técnica de Seção - Subst.ª)'
    },
    {
      id: 'stgp_subst2',
      nome: 'ANDRÉ TRINDADE MEIRA',
      cargo: 'SUPERVISOR TÉCNICO DE SEÇÃO - SUBST.',
      label: '2º Substituto: ANDRÉ TRINDADE MEIRA (Supervisor Técnico de Seção - Subst.)'
    }
  ];

  // ==========================================================================
  // 4. INICIALIZAÇÃO DE DATAS E DESTINATÁRIOS
  // ==========================================================================
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const anoStr = String(anoAtual);
  const mesStr = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaStr = String(hoje.getDate()).padStart(2, '0');
  const dataHojeFormatada = `${anoStr}-${mesStr}-${diaStr}`;

  inputMemoData.value = dataHojeFormatada;
  inputMemoAno.value = anoStr;
  inputDataExercicio.value = dataHojeFormatada;

  // Popular o select de Autoridades da STGP
  selectDestinatarioPessoa.innerHTML = '';
  AUTORIDADES_STGP.forEach(aut => {
    const opt = document.createElement('option');
    opt.value = aut.id;
    opt.textContent = aut.label;
    selectDestinatarioPessoa.appendChild(opt);
  });

  // Popular o catálogo de Unidades Administrativas (UAs) em ordem alfabética
  function popularCatalogoUAs() {
    if (typeof CATALOGO_UAS === 'undefined') return;
    const nomesUas = Object.keys(CATALOGO_UAS).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    selectRemetente.innerHTML = '';
    nomesUas.forEach(nome => {
      const ua = CATALOGO_UAS[nome];
      const opt = document.createElement('option');
      opt.value = nome;
      opt.textContent = nome;
      opt.setAttribute('data-sigla', ua.sigla || 'FCT');
      selectRemetente.appendChild(opt);
    });

    // Pré-selecionar Departamento de Cartografia ou a primeira UA
    if (CATALOGO_UAS['Departamento de Cartografia']) {
      selectRemetente.value = 'Departamento de Cartografia';
    }
    atualizarFuncoesAssinante();
  }

  // Atualizar cargos do assinante com base na UA selecionada
  function atualizarFuncoesAssinante() {
    const uaNome = selectRemetente.value;
    if (typeof CATALOGO_UAS === 'undefined' || !CATALOGO_UAS[uaNome]) return;
    const ua = CATALOGO_UAS[uaNome];

    selectSignatarioCargo.innerHTML = '';
    if (ua.funcoesAssinante && ua.funcoesAssinante.length > 0) {
      ua.funcoesAssinante.forEach(fa => {
        const opt = document.createElement('option');
        opt.value = fa.valor;
        opt.textContent = fa.valor;
        selectSignatarioCargo.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = 'Responsável pelo Expediente';
      opt.textContent = 'Responsável pelo Expediente';
      selectSignatarioCargo.appendChild(opt);
    }

    if (ua.titularPadrao && !inputSignatarioNome.value) {
      inputSignatarioNome.value = ua.titularPadrao;
    }
  }

  // ==========================================================================
  // 5. MÁSCARAS E VALIDAÇÕES (CPF, DATAS, CONTAS)
  // ==========================================================================
  
  // Máscara e Validação de CPF
  function formatarCpf(v) {
    v = v.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function validarCpf(cpfLimpo) {
    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i), 10) * (10 - i);
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    if (digito1 !== parseInt(cpfLimpo.charAt(9), 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo.charAt(i), 10) * (11 - i);
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    return digito2 === parseInt(cpfLimpo.charAt(10), 10);
  }

  inputServidorCpf.addEventListener('input', (e) => {
    e.target.value = formatarCpf(e.target.value);
    const apenasDigitos = e.target.value.replace(/\D/g, '');
    if (apenasDigitos.length === 11) {
      if (validarCpf(apenasDigitos)) {
        feedbackServidorCpf.className = 'field-feedback valid';
        feedbackServidorCpf.textContent = '✓ CPF válido';
        e.target.classList.remove('input-invalid');
        e.target.classList.add('input-valid');
      } else {
        feedbackServidorCpf.className = 'field-feedback invalid';
        feedbackServidorCpf.textContent = '⚠ CPF com dígitos verificadores inválidos';
        e.target.classList.add('input-invalid');
        e.target.classList.remove('input-valid');
      }
    } else {
      feedbackServidorCpf.className = 'field-feedback';
      feedbackServidorCpf.textContent = '';
      e.target.classList.remove('input-invalid', 'input-valid');
    }
    atualizarDocumento();
  });

  // Data por extenso oficial (Presidente Prudente, DD de MÊS de AAAA.)
  function formatarDataExtenso(dataStr) {
    if (!dataStr) return 'Presidente Prudente, data não informada.';
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      const dia = parseInt(partes[2], 10);
      const mesIndex = parseInt(partes[1], 10) - 1;
      const ano = partes[0];
      const mesNome = meses[mesIndex] || '';
      return `Presidente Prudente, ${dia} de ${mesNome} de ${ano}.`;
    }
    return `Presidente Prudente, ${dataStr}.`;
  }

  function formatarDataDDMMAAAA(dataStr) {
    if (!dataStr) return '[data]';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  }

  // ==========================================================================
  // TRAVA DE DATA: DATA DE INÍCIO DE EXERCÍCIO NÃO PODE SER POSTERIOR À DATA ATUAL
  // NEM POSTERIOR À DATA DO MEMORANDO
  // ==========================================================================
  function validarDataExercicio() {
    const valExercicio = inputDataExercicio.value;
    const valMemo = inputMemoData.value;
    
    // Define a data limite: menor entre hoje e a data do memorando (se preenchida)
    let dataLimite = dataHojeFormatada;
    if (valMemo && valMemo < dataHojeFormatada) {
      dataLimite = valMemo;
    }
    inputDataExercicio.max = dataLimite;

    if (!valExercicio) {
      if (feedbackDataExercicio) {
        feedbackDataExercicio.className = 'field-feedback';
        feedbackDataExercicio.textContent = '';
      }
      inputDataExercicio.classList.remove('input-invalid', 'input-valid');
      return true;
    }

    if (valExercicio > dataHojeFormatada) {
      if (feedbackDataExercicio) {
        feedbackDataExercicio.className = 'field-feedback invalid';
        feedbackDataExercicio.textContent = '⚠ A data do início do exercício não pode ser posterior à data atual.';
      }
      inputDataExercicio.classList.add('input-invalid');
      inputDataExercicio.classList.remove('input-valid');
      return false;
    }

    if (valMemo && valExercicio > valMemo) {
      if (feedbackDataExercicio) {
        feedbackDataExercicio.className = 'field-feedback invalid';
        feedbackDataExercicio.textContent = '⚠ A data do início do exercício deve ser igual ou anterior à data do memorando.';
      }
      inputDataExercicio.classList.add('input-invalid');
      inputDataExercicio.classList.remove('input-valid');
      return false;
    }

    if (feedbackDataExercicio) {
      feedbackDataExercicio.className = 'field-feedback valid';
      feedbackDataExercicio.textContent = '✓ Data de exercício válida';
    }
    inputDataExercicio.classList.remove('input-invalid');
    inputDataExercicio.classList.add('input-valid');
    return true;
  }

  inputDataExercicio.addEventListener('input', () => {
    validarDataExercicio();
    atualizarDocumento();
  });

  inputDataExercicio.addEventListener('change', () => {
    validarDataExercicio();
    atualizarDocumento();
  });

  // ==========================================================================
  // 6. CONTROLE DE CATEGORIA DO SERVIDOR E CARGOS/FUNÇÕES OFICIAIS (UNESP)
  // ==========================================================================
  // Fallback seguro caso cargos_catalogo.js não tenha sido carregado
  const CATALOGO_CARGOS = (typeof CATALOGO_CARGOS_FUNCOES !== 'undefined') ? CATALOGO_CARGOS_FUNCOES : {
    tecnico: {
      categoriaNome: 'Técnico-administrativo',
      cargos: [
        'Administrador', 'Advogado', 'Agente de Vigilância e Recepção', 'Analista de Informática I', 'Analista de Informática II',
        'Arquiteto', 'Assistente Administrativo II', 'Assistente de Informática II', 'Assistente de Suporte Acadêmico II',
        'Assistente de Suporte Acadêmico III', 'Assistente de Suporte Acadêmico IV', 'Assistente de Telefonia',
        'Assistente Operacional II', 'Assistente Operacional III', 'Assistente Social', 'Assistente Técnico Administrativo I',
        'Assistente Técnico Administrativo II', 'Auxiliar Agropecuário', 'Auxiliar em Saúde Bucal', 'Bibliotecário',
        'Biólogo', 'Biomédico', 'Cirurgião Dentista', 'Contador', 'Discotecário Programador', 'Economista', 'Enfermeiro',
        'Engenheiro', 'Engenheiro Agrônomo', 'Farmacêutico', 'Físico', 'Fisioterapeuta', 'Fonoaudiólogo', 'Historiógrafo',
        'Jornalista', 'Locutor', 'Médico', 'Médico Sanitarista', 'Médico Veterinário', 'Meteorologista', 'Motorista',
        'Nutricionista', 'Oficial de Serviços Gráficos', 'Oficial em Aparelhos de Precisão', 'Operador de Forno Incinerador',
        'Operador de Máquinas', 'Operador de Rádio', 'Pedagogo', 'Produtor', 'Psicólogo', 'Químico', 'Regente de Coral',
        'Relações Públicas', 'Revisor', 'Salva Vidas', 'Técnico Administrativo Substituto', 'Técnico Agropecuário',
        'Técnico de Contabilidade', 'Técnico de Necropsia', 'Técnico em Eletrônica', 'Técnico em Radiologia',
        'Técnico em Segurança do Trabalho', 'Tecnólogo', 'Terapeuta Ocupacional', 'Topógrafo', 'Zootecnista'
      ]
    },
    docente: {
      categoriaNome: 'Docente',
      cargos: [
        'Auxiliar de Ensino', 'Professor Assistente', 'Professor Assistente Doutor', 'Professor Associado',
        'Professor Colaborador', 'Professor Substituto', 'Professor Titular'
      ]
    },
    pesquisador: {
      categoriaNome: 'Pesquisador',
      cargos: [
        'Pesquisador I', 'Pesquisador II', 'Pesquisador III', 'Pesquisador IV'
      ]
    }
  };

  function popularCargosPorCategoria(cat, cargoSelecionado = null) {
    if (!inputServidorCargo) return;
    const catData = CATALOGO_CARGOS[cat] || CATALOGO_CARGOS['tecnico'];
    const cargos = catData.cargos || [];

    const valorAnterior = (cargoSelecionado !== null) ? cargoSelecionado : inputServidorCargo.value;

    inputServidorCargo.innerHTML = '';

    const optPlaceholder = document.createElement('option');
    optPlaceholder.value = '';
    optPlaceholder.textContent = '-- Selecione o cargo / função --';
    inputServidorCargo.appendChild(optPlaceholder);

    cargos.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      inputServidorCargo.appendChild(opt);
    });

    if (valorAnterior && cargos.includes(valorAnterior)) {
      inputServidorCargo.value = valorAnterior;
    } else {
      let padrao = '';
      if (cat === 'tecnico') padrao = 'Assistente Administrativo II';
      else if (cat === 'docente') padrao = 'Professor Assistente Doutor';
      else if (cat === 'pesquisador') padrao = 'Pesquisador I';

      if (padrao && cargos.includes(padrao)) {
        inputServidorCargo.value = padrao;
      } else if (cargos.length > 0) {
        inputServidorCargo.value = cargos[0];
      }
    }
  }

  function obterCategoriaSelecionada() {
    const radio = document.querySelector('input[name="categoria_servidor"]:checked');
    return radio ? radio.value : 'tecnico';
  }

  function atualizarVisibilidadeCategoria() {
    const cat = obterCategoriaSelecionada();

    // Atualizar labels dos radios
    document.querySelectorAll('.category-toggle-label').forEach(lbl => lbl.classList.remove('active'));
    const radioAtivo = document.querySelector(`input[name="categoria_servidor"][value="${cat}"]`);
    if (radioAtivo && radioAtivo.parentElement) {
      radioAtivo.parentElement.classList.add('active');
    }

    // Atualizar opções do campo Cargo/Função conforme a categoria selecionada
    popularCargosPorCategoria(cat);

    if (cat === 'docente') {
      // Docente: 12, 24 ou 40 horas
      cardHorarioTrabalho.style.display = 'none';
      infoCategoriaBox.innerHTML = `<strong>ℹ️ Categoria Docente:</strong> Jornadas possíveis: <strong>12, 24 ou 40 horas semanais</strong>. Conforme as normas institucionais, <strong>não há controle de horário de trabalho</strong> (a jornada selecionada constará no 1º parágrafo e o controle de ponto/horário diário é suprimido).`;

      if (selectServidorJornada) {
        selectServidorJornada.innerHTML = `
          <option value="40 horas semanais" selected>40 horas semanais (RDIDP — Dedicação Integral)</option>
          <option value="24 horas semanais">24 horas semanais (RTP — Turno Parcial)</option>
          <option value="12 horas semanais">12 horas semanais (RTC — Turno Completo)</option>
        `;
      }
      if (hintServidorJornada) {
        hintServidorJornada.textContent = 'Jornadas docentes da UNESP: 12, 24 ou 40 horas semanais (sem controle de ponto).';
      }

    } else if (cat === 'pesquisador') {
      // Pesquisador: 40 horas
      cardHorarioTrabalho.style.display = 'none';
      infoCategoriaBox.innerHTML = `<strong>ℹ️ Categoria Pesquisador:</strong> Jornada regulamentar única: <strong>40 horas semanais</strong>. Conforme as normas institucionais, <strong>não há controle de horário de trabalho</strong> (a jornada constará no 1º parágrafo e o controle de ponto/horário diário é suprimido).`;

      if (selectServidorJornada) {
        selectServidorJornada.innerHTML = `
          <option value="40 horas semanais" selected>40 horas semanais (Dedicação Integral)</option>
        `;
      }
      if (hintServidorJornada) {
        hintServidorJornada.textContent = 'Jornada regulamentar do pesquisador: 40 horas semanais (sem controle de ponto).';
      }

    } else {
      // Técnico-Administrativo: 20, 30, 36 ou 40 horas semanais
      cardHorarioTrabalho.style.display = 'block';
      infoCategoriaBox.innerHTML = `<strong>ℹ️ Categoria Técnico-Administrativo:</strong> Jornadas regulamentares: <strong>20, 30, 36 ou 40 horas semanais</strong>. É obrigatório o preenchimento e controle do horário de trabalho (jornada de horário fixo ou escala de revezamento).`;

      const valAtual = selectServidorJornada ? selectServidorJornada.value : '40 horas semanais';
      if (selectServidorJornada) {
        selectServidorJornada.innerHTML = `
          <option value="40 horas semanais" ${valAtual.includes('40') ? 'selected' : ''}>40 horas semanais</option>
          <option value="36 horas semanais" ${valAtual.includes('36') ? 'selected' : ''}>36 horas semanais</option>
          <option value="30 horas semanais" ${valAtual.includes('30') ? 'selected' : ''}>30 horas semanais</option>
          <option value="20 horas semanais" ${valAtual.includes('20') ? 'selected' : ''}>20 horas semanais</option>
        `;
      }
      if (hintServidorJornada) {
        hintServidorJornada.textContent = 'Jornadas regulamentares técnico-administrativas: 20, 30, 36 ou 40 horas semanais.';
      }
    }

    atualizarCamposHorarioAutomatico();
    atualizarDocumento();
  }

  radiosCategoria.forEach(r => {
    r.addEventListener('change', atualizarVisibilidadeCategoria);
  });

  // ==========================================================================
  // 7. CONTROLE DO TIPO DE HORÁRIO (Fixo vs Escala)
  // ==========================================================================
  function obterTipoHorarioSelecionado() {
    const radio = document.querySelector('input[name="tipo_horario"]:checked');
    return radio ? radio.value : 'fixo';
  }

  function atualizarVisibilidadeTipoHorario() {
    const tipo = obterTipoHorarioSelecionado();
    document.querySelectorAll('.schedule-type-btn').forEach(btn => btn.classList.remove('active'));
    const radioAtivo = document.querySelector(`input[name="tipo_horario"][value="${tipo}"]`);
    if (radioAtivo && radioAtivo.parentElement) {
      radioAtivo.parentElement.classList.add('active');
    }

    if (tipo === 'escala') {
      blocoHorarioFixo.style.display = 'none';
      blocoHorarioEscala.style.display = 'block';
    } else {
      blocoHorarioFixo.style.display = 'block';
      blocoHorarioEscala.style.display = 'none';
    }

    atualizarCamposHorarioAutomatico();
  }

  radiosTipoHorario.forEach(r => {
    r.addEventListener('change', atualizarVisibilidadeTipoHorario);
  });

  // ==========================================================================
  // 8. PREENCHIMENTO AUTOMÁTICO DOS CAMPOS DE HORÁRIO DE TRABALHO
  //    (Dias da semana *, Jornada diária *, Carga horária semanal *)
  // ==========================================================================
  function calcularMinutosEntreHorarios(hInicio, hFim) {
    if (!hInicio || !hFim) return 0;
    const [h1, m1] = hInicio.split(':').map(Number);
    const [h2, m2] = hFim.split(':').map(Number);
    const min1 = h1 * 60 + m1;
    const min2 = h2 * 60 + m2;
    return min2 >= min1 ? min2 - min1 : 0;
  }

  function formatarMinutosEmHoras(totalMin) {
    const horas = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${horas}h${String(mins).padStart(2, '0')}`;
  }

  function obterMinutosCargaContratual() {
    if (!selectCargaSemanal) return 40 * 60;
    const val = selectCargaSemanal.value;
    if (val.includes('40')) return 40 * 60;
    if (val.includes('36')) return 36 * 60;
    if (val.includes('30')) return 30 * 60;
    if (val.includes('20')) return 20 * 60;
    return 40 * 60;
  }

  function validarCargaHorariaSemanal() {
    const cat = obterCategoriaSelecionada();
    if (cat !== 'tecnico') return true;
    const tipo = obterTipoHorarioSelecionado();
    if (tipo !== 'fixo') return true;

    let minutosSemana = 0;
    const linhas = tabelaHorarioSemanal.querySelectorAll('tbody tr');
    linhas.forEach(tr => {
      const inE1 = tr.querySelector('input[data-col="e1"]').value;
      const inS1 = tr.querySelector('input[data-col="s1"]').value;
      const inE2 = tr.querySelector('input[data-col="e2"]').value;
      const inS2 = tr.querySelector('input[data-col="s2"]').value;
      if (inE1 && inS1) minutosSemana += calcularMinutosEntreHorarios(inE1, inS1);
      if (inE2 && inS2) minutosSemana += calcularMinutosEntreHorarios(inE2, inS2);
    });

    const minutosMax = obterMinutosCargaContratual();
    return minutosSemana <= minutosMax;
  }

  function ehCeletista() {
    if (!selectServidorRegime) return true;
    return selectServidorRegime.value.trim().toLowerCase() === 'clt';
  }

  function obterTextoJornadaSemanal() {
    const jVal = selectServidorJornada ? selectServidorJornada.value : '40 horas semanais';
    const match = jVal.match(/(\d+)\s*horas?\s*semanais/i);
    if (match) {
      return `${match[1]} horas semanais`;
    }
    return '40 horas semanais';
  }

  function auditarConformidadeTrabalhistaCLT() {
    const cat = obterCategoriaSelecionada();
    if (cat !== 'tecnico') {
      return { valido: true, erros: [] };
    }

    const regimeCeletista = ehCeletista();
    const tipo = obterTipoHorarioSelecionado();
    const errosIntrajornada = [];
    const errosInterjornada = [];
    const errosSemanal35h = [];

    const nomesDias = {
      seg: 'Segunda-feira',
      ter: 'Terça-feira',
      qua: 'Quarta-feira',
      qui: 'Quinta-feira',
      sex: 'Sexta-feira',
      sab: 'Sábado',
      dom: 'Domingo'
    };

    // Atualização dos títulos e textos do painel conforme o regime jurídico
    if (tituloPainelConformidade) {
      tituloPainelConformidade.textContent = regimeCeletista
        ? '⚖️ Auditoria de Conformidade Trabalhista (CLT / TST)'
        : '🏛️ Auditoria de Conformidade Estatutária (ESUNESP / UNESP)';
    }
    if (titleCltIntrajornada) {
      titleCltIntrajornada.textContent = regimeCeletista
        ? 'Intervalo para Repouso e Alimentação (Art. 71 CLT)'
        : 'Intervalo Intrajornada — Alimentação e Descanso (ESUNESP)';
    }
    if (titleCltInterjornada) {
      titleCltInterjornada.textContent = regimeCeletista
        ? 'Intervalo entre Jornadas (Art. 66 CLT — Mínimo 11h consecutivas)'
        : 'Intervalo Interjornadas — Descanso entre Jornadas (ESUNESP — Mínimo 11h)';
    }
    if (titleCltSemanal35h) {
      titleCltSemanal35h.textContent = regimeCeletista
        ? 'Descanso Semanal e Interjornada de 35h (Art. 67 CLT / Súmula 110 TST)'
        : 'Regime de Plantão e Repouso Semanal (ESUNESP)';
    }
    if (textoRodapeConformidade) {
      textoRodapeConformidade.innerHTML = regimeCeletista
        ? '<strong>📌 Acompanhamento pela STGP:</strong> A Área de Gestão de Pessoas deverá acompanhar as escalas de trabalho elaboradas, para estrito cumprimento à legislação. O descumprimento ao intervalo entre jornadas acarretará o pagamento das horas respectivas como extraordinárias, nos termos da <strong>Súmula nº 110 do TST</strong>.'
        : '<strong>📌 Observância Estatutária:</strong> As escalas de trabalho devem cumprir expressamente as disposições do <strong>Estatuto dos Servidores da UNESP (ESUNESP)</strong> e da legislação regulamentar de pessoal, garantindo os intervalos intrajornada e interjornadas obrigatórios.';
    }

    if (tipo === 'escala') {
      // Regime de Escala: 12x36, 18x36 ou 24x48
      if (checkCltIntrajornada) {
        checkCltIntrajornada.className = 'clt-check-item ok';
        if (iconCltIntrajornada) iconCltIntrajornada.textContent = '✓';
        if (descCltIntrajornada) {
          descCltIntrajornada.textContent = regimeCeletista
            ? 'Conforme: intervalo de 1h para repouso/alimentação previsto normativamente no plantão.'
            : 'Conforme: intervalo mínimo de 1h para alimentação e descanso assegurado durante o plantão de 12 horas (ESUNESP).';
        }
      }
      if (checkCltInterjornada) {
        checkCltInterjornada.className = 'clt-check-item ok';
        if (iconCltInterjornada) iconCltInterjornada.textContent = '✓';
        if (descCltInterjornada) {
          descCltInterjornada.textContent = regimeCeletista
            ? 'Conforme: período de descanso entre plantões (36h/48h) atende com folga ao mínimo de 11h consecutivas (Art. 66 CLT).'
            : 'Conforme: concessão obrigatória de 36 horas contínuas de descanso subsequente ao plantão de 12 horas (ESUNESP).';
        }
      }
      if (checkCltSemanal35h) {
        checkCltSemanal35h.className = 'clt-check-item ok';
        if (iconCltSemanal35h) iconCltSemanal35h.textContent = '✓';
        if (descCltSemanal35h) {
          descCltSemanal35h.textContent = regimeCeletista
            ? 'Conforme: paralisação de 36h/48h cumpre com segurança o descanso semanal de 35h (Art. 67 CLT e Súmula 110 TST).'
            : 'Conforme: regime de plantão atende plenamente às normas de repouso e descanso contínuo do ESUNESP.';
        }
      }
      if (badgeStatusClt) {
        badgeStatusClt.className = 'clt-badge clt-badge-ok';
        badgeStatusClt.textContent = regimeCeletista ? '✓ Escala Conforme CLT/TST' : '✓ Escala Conforme ESUNESP';
      }
      if (painelConformidadeClt) painelConformidadeClt.classList.remove('inconforme');
      return { valido: true, erros: [] };
    }

    // =========================================================================
    // JORNADA FIXA: AUDITORIA DIA A DIA NA GRADE
    // =========================================================================
    const ordemDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    const dadosDias = [];
    const minutosCargaContratual = obterMinutosCargaContratual();

    ordemDias.forEach((diaCod, idx) => {
      const tr = tabelaHorarioSemanal.querySelector(`tbody tr[data-dia="${diaCod}"]`);
      if (!tr) return;
      const inE1 = tr.querySelector('input[data-col="e1"]').value;
      const inS1 = tr.querySelector('input[data-col="s1"]').value;
      const inE2 = tr.querySelector('input[data-col="e2"]').value;
      const inS2 = tr.querySelector('input[data-col="s2"]').value;

      let dur1 = 0, dur2 = 0, intervalo = 0;
      let temP1 = false, temP2 = false;

      if (inE1 && inS1) {
        dur1 = calcularMinutosEntreHorarios(inE1, inS1);
        temP1 = true;
      }
      if (inE2 && inS2) {
        dur2 = calcularMinutosEntreHorarios(inE2, inS2);
        temP2 = true;
      }
      if (temP1 && temP2) {
        intervalo = calcularMinutosEntreHorarios(inS1, inE2);
      }

      const totalDia = dur1 + dur2;
      const trabalhou = (totalDia > 0);

      let inicioDiaMin = null;
      let fimDiaMin = null;
      if (trabalhou) {
        const [hE, mE] = (temP1 ? inE1 : inE2).split(':').map(Number);
        inicioDiaMin = hE * 60 + mE;
        const [hS, mS] = (temP2 ? inS2 : inS1).split(':').map(Number);
        fimDiaMin = hS * 60 + mS;
      }

      dadosDias.push({
        idx,
        diaCod,
        nome: nomesDias[diaCod],
        trabalhou,
        dur1,
        dur2,
        totalDia,
        intervalo,
        temP1,
        temP2,
        inicioDiaMin,
        fimDiaMin
      });

      // 1. Verificação de Intervalo Intrajornada
      if (trabalhou) {
        if (regimeCeletista) {
          // ==================== REGRAS CLT ====================
          if (totalDia > 360) {
            // Jornada > 6h: intervalo mínimo obrigatório de 1h (60 min)
            if (!temP2 || intervalo < 60) {
              const intStr = temP2 ? `${intervalo} min` : 'nenhum';
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada de ${formatarMinutosEmHoras(totalDia)} (> 6h) exige intervalo intrajornada de no mínimo 1 hora (Art. 71 CLT; intervalo concedido: ${intStr})`);
            }
          } else if (totalDia > 240) {
            // Jornada > 4h e <= 6h: intervalo mínimo obrigatório de 15 min
            if (!temP2 || intervalo < 15) {
              const intStr = temP2 ? `${intervalo} min` : 'nenhum';
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada de ${formatarMinutosEmHoras(totalDia)} (> 4h) exige intervalo de no mínimo 15 minutos (Art. 71 CLT; intervalo concedido: ${intStr})`);
            }
          }
        } else {
          // ==================== REGRAS ESUNESP (ESTATUTÁRIOS) ====================
          // Regra 1: Jornada de 40 horas semanais (ou dias com 8 horas)
          if (minutosCargaContratual === 2400 || totalDia >= 480) {
            if (!temP2) {
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada de 40h deve ser obrigatoriamente cumprida em dois períodos com intervalo para alimentação e descanso (ESUNESP)`);
            } else if (intervalo < 60) {
              errosIntrajornada.push(`${nomesDias[diaCod]}: intervalo de ${intervalo} min é inferior ao mínimo de 1 hora para alimentação e descanso (padrão de 2 horas) (ESUNESP)`);
            }
          } else if (totalDia > 360) {
            // Regra 2: Jornadas superiores a 6 horas diárias
            if (!temP2) {
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada superior a 6 horas (${formatarMinutosEmHoras(totalDia)}) deve ser dividida em dois períodos (ESUNESP)`);
            } else if (intervalo < 60) {
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada superior a 6 horas (${formatarMinutosEmHoras(totalDia)}) exige intervalo de no mínimo 1 hora (intervalo concedido: ${intervalo} min) (ESUNESP)`);
            }
          } else if (totalDia === 360 || minutosCargaContratual === 1800) {
            // Regra 3: Jornada de 30 horas semanais (6 horas diárias)
            if (!temP2 || intervalo < 15) {
              const intStr = temP2 ? `${intervalo} min` : 'nenhum';
              errosIntrajornada.push(`${nomesDias[diaCod]}: jornada de 6 horas diárias (30h semanais) exige intervalo mínimo de 15 minutos para alimentação e descanso (ESUNESP; intervalo concedido: ${intStr})`);
            }
          }
        }
      }
    });

    // 2. Verificação de Intervalo Interjornadas (Mínimo 11h consecutivas)
    for (let i = 0; i < 7; i++) {
      const diaAtual = dadosDias[i];
      const diaSeguinte = dadosDias[(i + 1) % 7];

      if (diaAtual && diaSeguinte && diaAtual.trabalhou && diaSeguinte.trabalhou) {
        const descansoMin = (1440 - diaAtual.fimDiaMin) + diaSeguinte.inicioDiaMin;
        if (descansoMin < 660) { // 11 horas = 660 min
          const descStr = formatarMinutosEmHoras(descansoMin);
          const refLegal = regimeCeletista ? 'Art. 66 da CLT' : 'normas do ESUNESP';
          errosInterjornada.push(`Entre ${diaAtual.nome} e ${diaSeguinte.nome}: descanso de ${descStr}, inferior ao mínimo legal de 11h consecutivas (${refLegal})`);
        }
      }
    }

    // 3. Verificação de Descanso Semanal
    const diasTrabalhados = dadosDias.filter(d => d.trabalhou);
    if (diasTrabalhados.length === 7) {
      const refLegal = regimeCeletista ? 'Art. 67 da CLT e Súmula nº 110 do TST' : 'normas do ESUNESP';
      errosSemanal35h.push(`Trabalho em todos os 7 dias da semana: é obrigatório ao menos 1 repouso semanal regulamentar (${refLegal})`);
    } else if (diasTrabalhados.length > 0) {
      if (regimeCeletista) {
        // Regra de 35h da Súmula 110 TST / Art. 67 CLT
        let maiorDescanso = 0;
        for (let i = 0; i < diasTrabalhados.length; i++) {
          const d1 = diasTrabalhados[i];
          const d2 = diasTrabalhados[(i + 1) % diasTrabalhados.length];
          
          let diasEntre = (d2.idx - d1.idx - 1);
          if (diasEntre < 0) diasEntre += 7;

          const descanso = (1440 - d1.fimDiaMin) + (diasEntre * 1440) + d2.inicioDiaMin;
          if (descanso > maiorDescanso) {
            maiorDescanso = descanso;
          }
        }

        if (maiorDescanso < 2100) { // 35 horas = 2100 min
          const descStr = formatarMinutosEmHoras(maiorDescanso);
          errosSemanal35h.push(`O maior descanso semanal concedido é de ${descStr}, inferior ao mínimo legal de 35 horas consecutivas (Súmula nº 110 do TST)`);
        }
      }
    }

    // =========================================================================
    // ATUALIZAÇÃO DO PAINEL DE CONFORMIDADE
    // =========================================================================
    const todosErros = [...errosIntrajornada, ...errosInterjornada, ...errosSemanal35h];
    const ehValido = (todosErros.length === 0);

    // Item 1: Intrajornada
    if (checkCltIntrajornada) {
      if (errosIntrajornada.length === 0) {
        checkCltIntrajornada.className = 'clt-check-item ok';
        if (iconCltIntrajornada) iconCltIntrajornada.textContent = '✓';
        if (descCltIntrajornada) {
          descCltIntrajornada.textContent = regimeCeletista
            ? 'Conforme: todos os dias com jornada > 6h possuem intervalo >= 1h (e > 4h possuem >= 15min).'
            : 'Conforme: intervalos de alimentação e descanso atendem ao ESUNESP (padrão 2h/mín. 1h para 40h e 15min para 30h).';
        }
      } else {
        checkCltIntrajornada.className = 'clt-check-item inconforme';
        if (iconCltIntrajornada) iconCltIntrajornada.textContent = '✕';
        if (descCltIntrajornada) descCltIntrajornada.textContent = errosIntrajornada.join('; ');
      }
    }

    // Item 2: Interjornada
    if (checkCltInterjornada) {
      if (errosInterjornada.length === 0) {
        checkCltInterjornada.className = 'clt-check-item ok';
        if (iconCltInterjornada) iconCltInterjornada.textContent = '✓';
        if (descCltInterjornada) {
          descCltInterjornada.textContent = regimeCeletista
            ? 'Conforme: há descanso mínimo de 11 horas consecutivas entre todas as jornadas consecutivas.'
            : 'Conforme: descanso mínimo regulamentar de 11 horas consecutivas entre jornadas atendido (ESUNESP).';
        }
      } else {
        checkCltInterjornada.className = 'clt-check-item inconforme';
        if (iconCltInterjornada) iconCltInterjornada.textContent = '✕';
        if (descCltInterjornada) descCltInterjornada.textContent = errosInterjornada.join('; ');
      }
    }

    // Item 3: Semanal / Plantão
    if (checkCltSemanal35h) {
      if (errosSemanal35h.length === 0) {
        checkCltSemanal35h.className = 'clt-check-item ok';
        if (iconCltSemanal35h) iconCltSemanal35h.textContent = '✓';
        if (descCltSemanal35h) {
          descCltSemanal35h.textContent = regimeCeletista
            ? 'Conforme: repouso semanal atende ou supera as 35 horas consecutivas (24h de folga + 11h de intervalo).'
            : 'Conforme: concessão regular de repouso semanal e descansos contínuos adequados (ESUNESP).';
        }
      } else {
        checkCltSemanal35h.className = 'clt-check-item inconforme';
        if (iconCltSemanal35h) iconCltSemanal35h.textContent = '✕';
        if (descCltSemanal35h) descCltSemanal35h.textContent = errosSemanal35h.join('; ');
      }
    }

    // Status Geral do Card
    if (painelConformidadeClt) {
      if (ehValido) {
        painelConformidadeClt.classList.remove('inconforme');
        if (badgeStatusClt) {
          badgeStatusClt.className = 'clt-badge clt-badge-ok';
          badgeStatusClt.textContent = regimeCeletista ? '✓ 100% Conforme CLT/TST' : '✓ 100% Conforme ESUNESP';
        }
      } else {
        painelConformidadeClt.classList.add('inconforme');
        if (badgeStatusClt) {
          badgeStatusClt.className = 'clt-badge clt-badge-danger';
          badgeStatusClt.textContent = regimeCeletista
            ? `⚠ ${todosErros.length} Inconformidade(s) CLT`
            : `⚠ ${todosErros.length} Inconformidade(s) ESUNESP`;
        }
      }
    }

    return {
      valido: ehValido,
      erros: todosErros,
      errosIntrajornada,
      errosInterjornada,
      errosSemanal35h
    };
  }

  function atualizarCamposHorarioAutomatico() {
    const tipo = obterTipoHorarioSelecionado();

    if (tipo === 'fixo') {
      const linhas = tabelaHorarioSemanal.querySelectorAll('tbody tr');
      let minutosSemana = 0;

      linhas.forEach(tr => {
        const diaCod = tr.getAttribute('data-dia');
        const inE1 = tr.querySelector('input[data-col="e1"]').value;
        const inS1 = tr.querySelector('input[data-col="s1"]').value;
        const inE2 = tr.querySelector('input[data-col="e2"]').value;
        const inS2 = tr.querySelector('input[data-col="s2"]').value;
        const badgeDur = tr.querySelector(`[data-dia-dur="${diaCod}"]`);

        let minDia = 0;
        let temHorario = false;

        // Período 1: Entrada 1 -> Saída 1
        if (inE1 && inS1) {
          minDia += calcularMinutosEntreHorarios(inE1, inS1);
          temHorario = true;
        }
        // Período 2: Entrada 2 -> Saída 2
        if (inE2 && inS2) {
          minDia += calcularMinutosEntreHorarios(inE2, inS2);
          temHorario = true;
        }

        if (temHorario && minDia > 0) {
          badgeDur.textContent = formatarMinutosEmHoras(minDia);
          badgeDur.classList.add('active');
          minutosSemana += minDia;
        } else {
          badgeDur.textContent = '-';
          badgeDur.classList.remove('active');
        }
      });

      // Controle de Limite: total de horas semanais x carga contratual
      const minutosMax = obterMinutosCargaContratual();
      const horasContratuaisStr = `${Math.round(minutosMax / 60)}h00`;
      const horasCalculadasStr = formatarMinutosEmHoras(minutosSemana);

      totalHorasSemanais.textContent = horasCalculadasStr;

      if (minutosSemana > minutosMax) {
        totalHorasSemanais.classList.add('excedido');
        totalHorasSemanais.classList.remove('conforme');
        if (alertaExcessoHoras) {
          alertaExcessoHoras.style.display = 'flex';
          if (textoExcessoHoras) {
            textoExcessoHoras.textContent = `Atenção: A soma das cargas diárias (${horasCalculadasStr}) ultrapassa a carga horária semanal contratual permitida (${horasContratuaisStr}).`;
          }
        }
      } else {
        totalHorasSemanais.classList.remove('excedido');
        if (minutosSemana === minutosMax && minutosSemana > 0) {
          totalHorasSemanais.classList.add('conforme');
        } else {
          totalHorasSemanais.classList.remove('conforme');
        }
        if (alertaExcessoHoras) {
          alertaExcessoHoras.style.display = 'none';
        }
      }

    } else if (tipo === 'escala') {
      if (alertaExcessoHoras) alertaExcessoHoras.style.display = 'none';
      if (totalHorasSemanais) {
        totalHorasSemanais.classList.remove('excedido');
        totalHorasSemanais.classList.remove('conforme');
      }
    }

    // Auditoria de Conformidade Trabalhista (CLT / Súmula nº 110 do TST)
    auditarConformidadeTrabalhistaCLT();

    atualizarDocumento();
  }

  // Eventos na tabela de horários
  tabelaHorarioSemanal.querySelectorAll('input[type="time"]').forEach(input => {
    input.addEventListener('input', atualizarCamposHorarioAutomatico);
    input.addEventListener('change', atualizarCamposHorarioAutomatico);
  });

  // Presets de Preenchimento Rápido
  function aplicarPresetHorario(diasUteis, e1, s1, e2, s2) {
    const linhas = tabelaHorarioSemanal.querySelectorAll('tbody tr');
    linhas.forEach(tr => {
      const diaCod = tr.getAttribute('data-dia');
      const inE1 = tr.querySelector('input[data-col="e1"]');
      const inS1 = tr.querySelector('input[data-col="s1"]');
      const inE2 = tr.querySelector('input[data-col="e2"]');
      const inS2 = tr.querySelector('input[data-col="s2"]');

      if (diasUteis.includes(diaCod)) {
        inE1.value = e1;
        inS1.value = s1;
        inE2.value = e2;
        inS2.value = s2;
      } else {
        inE1.value = '';
        inS1.value = '';
        inE2.value = '';
        inS2.value = '';
      }
    });
    atualizarCamposHorarioAutomatico();
  }

  btnPreset40hPadrao.addEventListener('click', () => {
    selectCargaSemanal.value = '40 HORAS SEMANAIS';
    if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
      selectServidorJornada.value = '40 horas semanais';
    }
    aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '14:00', '18:00');
  });

  btnPreset40h13h.addEventListener('click', () => {
    selectCargaSemanal.value = '40 HORAS SEMANAIS';
    if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
      selectServidorJornada.value = '40 horas semanais';
    }
    aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '13:00', '17:00');
  });

  if (btnPreset36h) {
    btnPreset36h.addEventListener('click', () => {
      selectCargaSemanal.value = '36 HORAS SEMANAIS';
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '36 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex', 'sab'], '07:00', '10:00', '10:15', '13:15');
    });
  }

  btnPreset30h.addEventListener('click', () => {
    selectCargaSemanal.value = '30 HORAS SEMANAIS';
    if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
      selectServidorJornada.value = '30 horas semanais';
    }
    aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '11:00', '11:15', '14:15');
  });

  if (btnPreset20h) {
    btnPreset20h.addEventListener('click', () => {
      selectCargaSemanal.value = '20 HORAS SEMANAIS';
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '20 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '', '');
    });
  }

  btnPresetLimpar.addEventListener('click', () => {
    aplicarPresetHorario([], '', '', '', '');
  });

  // Mudança no select de Carga Horária Semanal aplica o preset correspondente
  selectCargaSemanal.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === '40 HORAS SEMANAIS') {
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '40 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '14:00', '18:00');
    } else if (val === '36 HORAS SEMANAIS') {
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '36 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex', 'sab'], '07:00', '10:00', '10:15', '13:15');
    } else if (val === '30 HORAS SEMANAIS') {
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '30 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '11:00', '11:15', '14:15');
    } else if (val === '20 HORAS SEMANAIS') {
      if (selectServidorJornada && obterCategoriaSelecionada() === 'tecnico') {
        selectServidorJornada.value = '20 horas semanais';
      }
      aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '', '');
    }
  });

  // Mudança no select de Jornada do Servidor (Card 3) sincroniza com a grade quando técnico
  if (selectServidorJornada) {
    selectServidorJornada.addEventListener('change', (e) => {
      const val = e.target.value;
      if (obterCategoriaSelecionada() === 'tecnico') {
        if (val.includes('40')) {
          selectCargaSemanal.value = '40 HORAS SEMANAIS';
          aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '14:00', '18:00');
        } else if (val.includes('36')) {
          selectCargaSemanal.value = '36 HORAS SEMANAIS';
          aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex', 'sab'], '07:00', '10:00', '10:15', '13:15');
        } else if (val.includes('30')) {
          selectCargaSemanal.value = '30 HORAS SEMANAIS';
          aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '11:00', '11:15', '14:15');
        } else if (val.includes('20')) {
          selectCargaSemanal.value = '20 HORAS SEMANAIS';
          aplicarPresetHorario(['seg', 'ter', 'qua', 'qui', 'sex'], '08:00', '12:00', '', '');
        }
      }
      atualizarDocumento();
    });
  }

  // Mudança no select de Regime Jurídico revalida a conformidade imediatamente
  if (selectServidorRegime) {
    selectServidorRegime.addEventListener('change', () => {
      auditarConformidadeTrabalhistaCLT();
      atualizarDocumento();
    });
  }

  // Mudança na Escala de Trabalho ou Turno atualiza os campos automaticamente
  selectEscala.addEventListener('change', atualizarCamposHorarioAutomatico);
  inputEscalaTurno.addEventListener('input', atualizarCamposHorarioAutomatico);


  // ==========================================================================
  // 9. ATUALIZAÇÃO REATIVA DA PRÉ-VISUALIZAÇÃO A4
  // ==========================================================================
  function atualizarDocumento() {
    // 1. Identificação
    const numMemo = (inputMemoNumero.value.trim() || '01').padStart(2, '0');
    const ano = inputMemoAno.value.trim() || String(anoAtual);
    const optionSel = selectRemetente.options[selectRemetente.selectedIndex];
    const siglaRaw = optionSel ? (optionSel.getAttribute('data-sigla') || 'FCT') : 'DCART';

    if (prevMemoNum) prevMemoNum.textContent = numMemo;
    if (prevMemoAno) prevMemoAno.textContent = ano;
    if (prevMemoSigla) prevMemoSigla.textContent = siglaRaw;
    if (prevMemoDataExtenso) prevMemoDataExtenso.textContent = formatarDataExtenso(inputMemoData.value);
    if (prevMemoAssunto) prevMemoAssunto.textContent = inputMemoAssunto.value.trim() || 'INÍCIO DE EXERCÍCIO';

    // 2. Destinatário (STGP)
    const autSelId = selectDestinatarioPessoa.value;
    const autObj = AUTORIDADES_STGP.find(a => a.id === autSelId) || AUTORIDADES_STGP[0];
    if (prevMemoDestNome) prevMemoDestNome.textContent = autObj.nome;
    if (prevMemoDestFuncao) prevMemoDestFuncao.textContent = autObj.cargo;

    // 3. Servidor e Dados Pessoais
    const nomeServidor = inputServidorNome.value.trim() || '[Nome completo do servidor]';
    const cpfServidor = inputServidorCpf.value.trim() || '[Número do CPF]';
    const dataEx = formatarDataDDMMAAAA(inputDataExercicio.value);
    const cargoServidor = inputServidorCargo.value.trim() || '[nome do cargo/função]';
    const textoJornada = obterTextoJornadaSemanal();

    if (prevServidorNome) prevServidorNome.textContent = nomeServidor;
    if (prevServidorCpf) prevServidorCpf.textContent = cpfServidor;
    if (prevDataExercicio) prevDataExercicio.textContent = dataEx;
    if (prevServidorCargo) prevServidorCargo.textContent = cargoServidor;
    if (prevServidorJornada) prevServidorJornada.textContent = textoJornada;
    if (prevServidorJornadaWrapper) prevServidorJornadaWrapper.style.display = 'inline';

    // 4. Dados Bancários
    const agencia = inputBancoAgencia.value.trim() || '----';
    const conta = inputBancoConta.value.trim() || '----';
    if (prevBancoAgencia) prevBancoAgencia.textContent = agencia;
    if (prevBancoConta) prevBancoConta.textContent = conta;

    // 5. Regra de Categoria e Horário de Trabalho
    const cat = obterCategoriaSelecionada();
    const ehTecnico = (cat === 'tecnico');

    if (ehTecnico) {
      // Técnico-Administrativo: exibe menção ao horário e o bloco correspondente
      if (prevMemoCorpoP2) {
        prevMemoCorpoP2.textContent = 'Para os devidos fins de cadastro e pagamento de remuneração, informamos abaixo os dados bancários apresentados pelo(a) servidor(a), bem como o seu horário de trabalho estabelecido:';
      }
      if (prevBlocoHorario) prevBlocoHorario.style.display = 'block';

      const tipo = obterTipoHorarioSelecionado();
      if (tipo === 'fixo') {
        const nomesDias = {
          seg: 'Segunda-feira',
          ter: 'Terça-feira',
          qua: 'Quarta-feira',
          qui: 'Quinta-feira',
          sex: 'Sexta-feira',
          sab: 'Sábado',
          dom: 'Domingo'
        };
        const linhasTabela = tabelaHorarioSemanal.querySelectorAll('tbody tr');
        let htmlLinhas = '';
        let minTotalSemana = 0;
        let diasComHorario = 0;

        linhasTabela.forEach(tr => {
          const diaCod = tr.getAttribute('data-dia');
          const inE1 = tr.querySelector('input[data-col="e1"]').value;
          const inS1 = tr.querySelector('input[data-col="s1"]').value;
          const inE2 = tr.querySelector('input[data-col="e2"]').value;
          const inS2 = tr.querySelector('input[data-col="s2"]').value;

          let minDia = 0;
          if (inE1 && inS1) minDia += calcularMinutosEntreHorarios(inE1, inS1);
          if (inE2 && inS2) minDia += calcularMinutosEntreHorarios(inE2, inS2);

          if (minDia > 0) {
            diasComHorario++;
            minTotalSemana += minDia;
            const durStr = formatarMinutosEmHoras(minDia);

            let ent1 = inE1 || '-';
            let sai1 = inS1 || '-';
            let ent2 = inE2 || '-';
            let sai2 = inS2 || '-';

            // Se apenas 1 período preenchido (sem intervalo, ex: 08:00 às 12:00)
            if (inE1 && inS1 && !inE2 && !inS2) {
              sai1 = '-';
              ent2 = '-';
              sai2 = inS1;
            }

            htmlLinhas += `
              <tr>
                <td style="font-weight: 600;">${nomesDias[diaCod] || diaCod}</td>
                <td>${ent1}</td>
                <td>${sai1}</td>
                <td>${ent2}</td>
                <td>${sai2}</td>
                <td class="carga-diaria-col">${durStr}</td>
              </tr>
            `;
          }
        });

        if (diasComHorario === 0) {
          htmlLinhas = `
            <tr>
              <td colspan="6" style="text-align: center; color: #64748b; font-style: italic; padding: 6px;">Nenhum horário preenchido na grade semanal.</td>
            </tr>
          `;
        }

        if (memoTabelaHorarioCorpo) memoTabelaHorarioCorpo.innerHTML = htmlLinhas;
        if (memoTabelaTotalSemanal) memoTabelaTotalSemanal.textContent = formatarMinutosEmHoras(minTotalSemana);

      } else {
        // Escala de Revezamento
        const escalaOpt = selectEscala.options[selectEscala.selectedIndex];
        const escalaTexto = escalaOpt ? escalaOpt.text : '12x36';
        const escalaValor = selectEscala.value || '12x36';
        const turno = inputEscalaTurno.value.trim();
        const descTurno = turno ? `${turno} — ${escalaTexto}` : escalaTexto;

        const htmlLinhaEscala = `
          <tr>
            <td style="font-weight: 600;">Escala (${escalaValor.toUpperCase()})</td>
            <td colspan="4" style="text-align: left; padding-left: 10px;">${descTurno}</td>
            <td class="carga-diaria-col">40h00</td>
          </tr>
        `;

        if (memoTabelaHorarioCorpo) memoTabelaHorarioCorpo.innerHTML = htmlLinhaEscala;
        if (memoTabelaTotalSemanal) memoTabelaTotalSemanal.textContent = '40h00';
      }

    } else {
      // Docente ou Pesquisador: horário diário suprimido
      if (prevMemoCorpoP2) {
        prevMemoCorpoP2.textContent = 'Para os devidos fins de cadastro e pagamento de remuneração, informamos abaixo os dados bancários apresentados pelo(a) servidor(a):';
      }
      if (prevBlocoHorario) prevBlocoHorario.style.display = 'none';
    }

    // 6. Signatário
    const sigNome = inputSignatarioNome.value.trim() || 'Nome do Emitente';
    const sigCargo = selectSignatarioCargo.value.trim() || 'FUNÇÃO DO EMITENTE';
    if (prevSigNome) prevSigNome.textContent = sigNome;
    if (prevSigCargo) prevSigCargo.textContent = sigCargo.toUpperCase();
  }

  // Ouvintes de eventos gerais para atualização instantânea
  [
    inputMemoNumero, inputMemoAno, inputMemoData, inputMemoAssunto,
    selectRemetente, selectDestinatarioPessoa, inputSignatarioNome, selectSignatarioCargo,
    inputServidorNome, inputDataExercicio, inputServidorCargo, selectServidorJornada, selectServidorRegime,
    inputBancoAgencia, inputBancoConta,
    selectEscala, inputEscalaTurno, selectCargaSemanal
  ].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', atualizarDocumento);
      elem.addEventListener('change', atualizarDocumento);
    }
  });

  selectRemetente.addEventListener('change', () => {
    atualizarFuncoesAssinante();
    atualizarDocumento();
  });

  inputMemoData.addEventListener('change', (e) => {
    if (e.target.value) {
      const p = e.target.value.split('-');
      if (p.length === 3) inputMemoAno.value = p[0];
    }
    validarDataExercicio();
    atualizarDocumento();
  });

  inputMemoData.addEventListener('input', () => {
    validarDataExercicio();
  });

  // ==========================================================================
  // 10. GERAÇÃO DE PDF VETORIAL NATIVO (jsPDF)
  // ==========================================================================
  async function compilarPdf() {
    const numMemo = (inputMemoNumero.value.trim() || '01').padStart(2, '0');
    const ano = inputMemoAno.value.trim() || String(anoAtual);
    const optionSel = selectRemetente.options[selectRemetente.selectedIndex];
    const siglaRaw = optionSel ? (optionSel.getAttribute('data-sigla') || 'FCT') : 'FCT';
    const siglaLimpa = siglaRaw.replace(/[^a-zA-Z0-9_-]/g, '_');

    const nomeArquivo = `Memorando_Exercicio_N${numMemo}_${ano}_${siglaLimpa}_FCT_PP.pdf`;

    // Validação de campos essenciais
    const erros = [];
    if (!inputServidorNome.value.trim()) erros.push('Nome completo do servidor');
    if (!inputServidorCpf.value.trim()) erros.push('CPF do servidor');
    if (!inputServidorCargo.value.trim()) erros.push('Cargo/função do servidor');
    if (!inputBancoAgencia.value.trim()) erros.push('Agência bancária');
    if (!inputBancoConta.value.trim()) erros.push('Conta corrente bancária');

    if (erros.length > 0) {
      alert('Por favor, preencha os seguintes campos obrigatórios antes de gerar o PDF:\n\n• ' + erros.join('\n• '));
      return;
    }

    // Trava de Data: Não permitir se data de exercício for posterior a hoje ou à data do memo
    if (!validarDataExercicio()) {
      alert('Atenção: A Data do Início do Exercício / Admissão não pode ser posterior à data atual nem posterior à data do memorando.\n\nPor favor, ajuste a data para prosseguir com a emissão.');
      inputDataExercicio.focus();
      return;
    }

    // Controle de Carga Horária: Não permitir se soma das cargas diárias ultrapassar a carga semanal contratual
    if (!validarCargaHorariaSemanal()) {
      const minMax = obterMinutosCargaContratual();
      const hMax = Math.round(minMax / 60);
      alert(`Atenção: A soma das cargas diárias na tabela ultrapassa a carga horária semanal contratual permitida (${hMax} horas semanais).\n\nPor favor, ajuste a grade semanal para que a carga horária total não exceda o limite contratual antes de gerar o PDF.`);
      return;
    }

    // Controle de Conformidade Regulamentar (CLT / ESUNESP) para servidores técnico-administrativos
    if (obterCategoriaSelecionada() === 'tecnico') {
      const audit = auditarConformidadeTrabalhistaCLT();
      if (!audit.valido) {
        const regimeNome = ehCeletista() ? 'Trabalhista (CLT / Súmula nº 110 do TST)' : 'Estatutária (ESUNESP / UNESP)';
        alert(`Atenção: Foram detectadas inconformidades com a Legislação ${regimeNome} no horário de trabalho:\n\n• ` + audit.erros.join('\n• ') + '\n\nO memorando não pode ser emitido com irregularidades. Por favor, ajuste a grade de horários antes de gerar o PDF.');
        return;
      }
    }

    btnGerarMemoPdf.disabled = true;
    const textoOriginal = btnGerarMemoPdf.innerHTML;
    btnGerarMemoPdf.innerHTML = '⏳ Gerando PDF Vetorial...';

    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) throw new Error('Biblioteca jsPDF não encontrada.');

      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      });

      // Incorporação da fonte oficial Raleway
      let fontName = 'helvetica';
      if (window.RALEWAY_REGULAR_BASE64 && window.RALEWAY_BOLD_BASE64) {
        doc.addFileToVFS('Raleway-Regular.ttf', window.RALEWAY_REGULAR_BASE64);
        doc.addFont('Raleway-Regular.ttf', 'Raleway', 'normal');
        doc.addFileToVFS('Raleway-Bold.ttf', window.RALEWAY_BOLD_BASE64);
        doc.addFont('Raleway-Bold.ttf', 'Raleway', 'bold');
        fontName = 'Raleway';
      }

      // Imagem de Fundo Oficial do Papel Timbrado 2026
      if (window.PAPEL_TIMBRADO_BASE64) {
        doc.addImage(window.PAPEL_TIMBRADO_BASE64, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      }

      doc.setTextColor(0, 0, 0);

      // Identificação do Documento
      const textoId = `MEMORANDO Nº ${numMemo}/${ano} ${siglaRaw}/FCT/PP`;
      doc.setFont(fontName, 'normal');
      doc.setFontSize(11);
      doc.text(textoId, 25, 48);

      // Data à direita
      const dataExtenso = formatarDataExtenso(inputMemoData.value);
      doc.text(dataExtenso, 185, 55, { align: 'right' });

      // Destinatário
      const autSelId = selectDestinatarioPessoa.value;
      const autObj = AUTORIDADES_STGP.find(a => a.id === autSelId) || AUTORIDADES_STGP[0];
      const destLinhas = [
        'A(o) Senhor(a)',
        autObj.nome,
        autObj.cargo,
        'SEÇÃO TÉCNICA DE GESTÃO DE PESSOAS',
        'FACULDADE DE CIÊNCIAS E TECNOLOGIA - CÂMPUS DE PRESIDENTE PRUDENTE'
      ];

      let yDest = 65;
      destLinhas.forEach(l => {
        doc.text(l, 25, yDest);
        yDest += 5.2;
      });

      // Assunto
      let yAssunto = yDest + 4;
      doc.setFont(fontName, 'bold');
      doc.text('Assunto: ', 25, yAssunto);
      doc.setFont(fontName, 'normal');
      doc.text(inputMemoAssunto.value.trim() || 'INÍCIO DE EXERCÍCIO', 25 + doc.getTextWidth('Assunto: '), yAssunto);

      // 3 quebras de linha oficiais (~14mm)
      let yCorpo = yAssunto + 14;

      // Parágrafo 1 com dados do servidor
      const nomeServ = inputServidorNome.value.trim();
      const cpfServ = inputServidorCpf.value.trim();
      const dtExerc = formatarDataDDMMAAAA(inputDataExercicio.value);
      const cargoServ = inputServidorCargo.value.trim();

      // Montagem de tokens para renderização justificada com partes em negrito
      const cargoWords = cargoServ.split(/\s+/).filter(Boolean);
      const cargoTokens = cargoWords.map((w, idx) => ({
        text: (idx === cargoWords.length - 1) ? `${w},` : w,
        isBold: true
      }));

      const textoJornada = obterTextoJornadaSemanal();
      const jornadaWords = textoJornada.split(/\s+/).filter(Boolean);
      const jornadaTokens = [
        { text: 'em', isBold: false },
        { text: 'jornada', isBold: false },
        { text: 'de', isBold: false },
        ...jornadaWords.map((w, idx) => ({
          text: (idx === jornadaWords.length - 1) ? `${w},` : w,
          isBold: false
        }))
      ];

      const p1Tokens = [
        { text: 'Informamos', isBold: false },
        { text: 'a', isBold: false },
        { text: 'Vossa', isBold: false },
        { text: 'Senhoria,', isBold: false },
        { text: 'para', isBold: false },
        { text: 'as', isBold: false },
        { text: 'providências', isBold: false },
        { text: 'cabíveis,', isBold: false },
        { text: 'que', isBold: false },
        { text: 'o(a)', isBold: false },
        { text: 'servidor(a)', isBold: false },
        ...nomeServ.split(/\s+/).filter(Boolean).map(w => ({ text: w, isBold: true })),
        { text: 'inscrito', isBold: false },
        { text: 'no', isBold: false },
        { text: 'CPF', isBold: false },
        { text: 'sob', isBold: false },
        { text: 'nº', isBold: false },
        { text: cpfServ + ',', isBold: true },
        { text: 'entrou', isBold: false },
        { text: 'em', isBold: false },
        { text: 'exercício', isBold: false },
        { text: 'em', isBold: false },
        { text: dtExerc + ',', isBold: false },
        { text: 'no', isBold: false },
        { text: 'cargo/função', isBold: false },
        { text: 'de', isBold: false },
        ...cargoTokens,
        ...jornadaTokens,
        { text: 'junto', isBold: false },
        { text: 'a', isBold: false },
        { text: 'esta', isBold: false },
        { text: 'unidade', isBold: false },
        { text: 'administrativa.', isBold: false }
      ];

      // Função utilitária para renderizar parágrafo justificado com recuo padrão de 2,5 cm
      const renderizarParagrafoJustificado = (tokens, startY) => {
        const leftMargin = 25;
        const indent = 25; // 2.5cm
        const fullWidth = 160; // 185 - 25
        const firstLineWidth = fullWidth - indent;
        const lineHeight = 5.8;

        doc.setFontSize(11);
        doc.setFont(fontName, 'normal');
        const normalSpaceWidth = doc.getTextWidth(' ');

        // Medir tokens
        tokens.forEach(t => {
          doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
          t.width = doc.getTextWidth(t.text);
        });

        // Quebra em linhas
        const lines = [];
        let currentLine = [];
        let currentLineWidth = 0;
        let isFirstLine = true;

        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i];
          const maxW = isFirstLine ? firstLineWidth : fullWidth;
          const spaceNeeded = currentLine.length > 0 ? normalSpaceWidth : 0;

          if (currentLine.length > 0 && (currentLineWidth + spaceNeeded + t.width > maxW)) {
            lines.push({ tokens: currentLine, isFirst: isFirstLine });
            currentLine = [t];
            currentLineWidth = t.width;
            isFirstLine = false;
          } else {
            currentLine.push(t);
            currentLineWidth += spaceNeeded + t.width;
          }
        }
        if (currentLine.length > 0) {
          lines.push({ tokens: currentLine, isFirst: isFirstLine, isLast: true });
        }

        let curY = startY;
        lines.forEach((lineObj, idx) => {
          const isLast = (idx === lines.length - 1);
          const lineTokens = lineObj.tokens;
          const startX = lineObj.isFirst ? (leftMargin + indent) : leftMargin;
          const availableW = lineObj.isFirst ? firstLineWidth : fullWidth;

          if (isLast || lineTokens.length === 1) {
            let curX = startX;
            lineTokens.forEach(t => {
              doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
              doc.text(t.text, curX, curY);
              curX += t.width + normalSpaceWidth;
            });
          } else {
            const sumW = lineTokens.reduce((s, t) => s + t.width, 0);
            const spaceDist = (availableW - sumW) / (lineTokens.length - 1);
            let curX = startX;
            lineTokens.forEach(t => {
              doc.setFont(fontName, t.isBold ? 'bold' : 'normal');
              doc.text(t.text, curX, curY);
              curX += t.width + spaceDist;
            });
          }
          curY += lineHeight;
        });

        return curY;
      };

      let yAposP1 = renderizarParagrafoJustificado(p1Tokens, yCorpo);

      // Parágrafo 2: Introdução aos dados bancários e horário
      const cat = obterCategoriaSelecionada();
      const ehTecnico = (cat === 'tecnico');

      let p2Texto = '';
      if (ehTecnico) {
        p2Texto = 'Para os devidos fins de cadastro e pagamento de remuneração, informamos abaixo os dados bancários apresentados pelo(a) servidor(a), bem como o seu horário de trabalho estabelecido:';
      } else {
        p2Texto = 'Para os devidos fins de cadastro e pagamento de remuneração, informamos abaixo os dados bancários apresentados pelo(a) servidor(a):';
      }

      const p2Tokens = p2Texto.split(/\s+/).map(w => ({ text: w, isBold: false }));
      let yAposP2 = renderizarParagrafoJustificado(p2Tokens, yAposP1 + 3);

      // Bloco Dados Bancários
      let yBanco = yAposP2 + 3;
      doc.setFont(fontName, 'bold');
      doc.text('Dados Bancários:', 50, yBanco);
      doc.setFont(fontName, 'normal');
      doc.text('Banco: Banco do Brasil (001)', 50, yBanco + 5);
      const agVal = inputBancoAgencia.value.trim() || '----';
      const ccVal = inputBancoConta.value.trim() || '----';
      doc.text(`Agência: ${agVal} / Conta Corrente: ${ccVal}`, 50, yBanco + 10);

      let yFimSecoes = yBanco + 15;

      // Bloco Horário de Trabalho (apenas para Técnico-Administrativo)
      if (ehTecnico) {
        let yHorario = yBanco + 15;
        doc.setFont(fontName, 'bold');
        doc.setFontSize(11);
        doc.text('Horário de Trabalho:', 50, yHorario);
        doc.setFont(fontName, 'normal');

        const tipo = obterTipoHorarioSelecionado();
        const xTable = 25;
        const wTable = 160;
        let curY = yHorario + 4;

        if (tipo === 'fixo') {
          // Coletar dados da grade semanal
          const ordemDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
          const nomesDias = {
            seg: 'Segunda-feira',
            ter: 'Terça-feira',
            qua: 'Quarta-feira',
            qui: 'Quinta-feira',
            sex: 'Sexta-feira',
            sab: 'Sábado',
            dom: 'Domingo'
          };
          const dadosLinhas = [];
          let minTotalSemana = 0;

          ordemDias.forEach(diaCod => {
            const tr = tabelaHorarioSemanal.querySelector(`tbody tr[data-dia="${diaCod}"]`);
            if (!tr) return;
            const inE1 = tr.querySelector('input[data-col="e1"]').value;
            const inS1 = tr.querySelector('input[data-col="s1"]').value;
            const inE2 = tr.querySelector('input[data-col="e2"]').value;
            const inS2 = tr.querySelector('input[data-col="s2"]').value;

            let minDia = 0;
            if (inE1 && inS1) minDia += calcularMinutosEntreHorarios(inE1, inS1);
            if (inE2 && inS2) minDia += calcularMinutosEntreHorarios(inE2, inS2);

            if (minDia > 0) {
              minTotalSemana += minDia;
              let ent1 = inE1 || '-';
              let sai1 = inS1 || '-';
              let ent2 = inE2 || '-';
              let sai2 = inS2 || '-';
              if (inE1 && inS1 && !inE2 && !inS2) {
                sai1 = '-';
                ent2 = '-';
                sai2 = inS1;
              }
              dadosLinhas.push({
                dia: nomesDias[diaCod] || diaCod,
                e1: ent1,
                s1: sai1,
                e2: ent2,
                s2: sai2,
                dur: formatarMinutosEmHoras(minDia)
              });
            }
          });

          // Larguras das 6 colunas (total = 160 mm)
          const colW = [35, 25, 25, 25, 25, 25];
          const colX = [25];
          for (let i = 0; i < colW.length; i++) {
            colX.push(colX[i] + colW[i]);
          }

          // 1. Cabeçalho da Tabela
          const hHead = 5.2;
          doc.setFillColor(241, 245, 249); // #f1f5f9
          doc.rect(xTable, curY, wTable, hHead, 'F');

          doc.setFont(fontName, 'bold');
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42); // #0f172a

          const titulosHead = ['Dia da Semana', 'Entrada', 'Saída Intervalo', 'Retorno', 'Saída Final', 'Carga Diária'];
          titulosHead.forEach((tit, idx) => {
            if (idx === 0) {
              doc.text(tit, colX[idx] + 2.5, curY + 3.6);
            } else {
              doc.text(tit, colX[idx] + (colW[idx] / 2), curY + 3.6, { align: 'center' });
            }
          });

          // 2. Linhas de Dados
          const hRow = 4.8;
          let yRow = curY + hHead;
          doc.setFont(fontName, 'normal');
          doc.setFontSize(8.5);

          dadosLinhas.forEach((row, rIdx) => {
            if (rIdx % 2 === 1) {
              doc.setFillColor(248, 250, 252); // #f8fafc
              doc.rect(xTable, yRow, wTable, hRow, 'F');
            }

            // Dia
            doc.setFont(fontName, 'bold');
            doc.setTextColor(30, 41, 59);
            doc.text(row.dia, colX[0] + 2.5, yRow + 3.4);

            // Horários
            doc.setFont(fontName, 'normal');
            doc.setTextColor(15, 23, 42);
            doc.text(row.e1, colX[1] + (colW[1] / 2), yRow + 3.4, { align: 'center' });
            doc.text(row.s1, colX[2] + (colW[2] / 2), yRow + 3.4, { align: 'center' });
            doc.text(row.e2, colX[3] + (colW[3] / 2), yRow + 3.4, { align: 'center' });
            doc.text(row.s2, colX[4] + (colW[4] / 2), yRow + 3.4, { align: 'center' });

            // Carga
            doc.setFont(fontName, 'bold');
            doc.text(row.dur, colX[5] + (colW[5] / 2), yRow + 3.4, { align: 'center' });

            yRow += hRow;
          });

          // 3. Linha de Totalização Semanal (Footer)
          const hFoot = 5.2;
          doc.setFillColor(248, 250, 252);
          doc.rect(xTable, yRow, wTable, hFoot, 'F');

          doc.setFont(fontName, 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text('Carga Horária Semanal Total:', colX[5] - 3, yRow + 3.6, { align: 'right' });
          doc.setFontSize(9);
          doc.text(formatarMinutosEmHoras(minTotalSemana), colX[5] + (colW[5] / 2), yRow + 3.6, { align: 'center' });

          // 4. Linhas de Borda Vetorial
          doc.setLineWidth(0.2);
          doc.setDrawColor(203, 213, 225); // #cbd5e1

          // Linhas horizontais
          doc.line(xTable, curY, xTable + wTable, curY); // Topo
          doc.line(xTable, curY + hHead, xTable + wTable, curY + hHead); // Abaixo do cabeçalho
          for (let i = 1; i <= dadosLinhas.length; i++) {
            doc.line(xTable, curY + hHead + (i * hRow), xTable + wTable, curY + hHead + (i * hRow));
          }
          doc.setDrawColor(148, 163, 184); // Linha acima do total
          doc.line(xTable, yRow, xTable + wTable, yRow);
          doc.line(xTable, yRow + hFoot, xTable + wTable, yRow + hFoot); // Inferior

          // Linhas verticais
          doc.setDrawColor(203, 213, 225);
          for (let i = 0; i <= colW.length; i++) {
            if (i > 0 && i < 5) {
              doc.line(colX[i], curY, colX[i], yRow);
            } else {
              doc.line(colX[i], curY, colX[i], yRow + hFoot);
            }
          }

          yFimSecoes = yRow + hFoot + 3;

        } else {
          // Escala de Revezamento
          const escalaOpt = selectEscala.options[selectEscala.selectedIndex];
          const escalaTexto = escalaOpt ? escalaOpt.text : '12x36';
          const escalaValor = selectEscala.value || '12x36';
          const turno = inputEscalaTurno.value.trim();
          const descTurno = turno ? `${turno} — ${escalaTexto}` : escalaTexto;

          const colW = [45, 90, 25];
          const colX = [25, 70, 160, 185];

          const hHead = 5.2;
          doc.setFillColor(241, 245, 249);
          doc.rect(xTable, curY, wTable, hHead, 'F');
          doc.setFont(fontName, 'bold');
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);

          doc.text('Regime de Trabalho', colX[0] + 2.5, curY + 3.6);
          doc.text('Detalhamento da Escala e Turno', colX[1] + 2.5, curY + 3.6);
          doc.text('Carga Semanal', colX[2] + (colW[2] / 2), curY + 3.6, { align: 'center' });

          const hRow = 6.0;
          let yRow = curY + hHead;
          doc.setFont(fontName, 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(`Escala (${escalaValor.toUpperCase()})`, colX[0] + 2.5, yRow + 4.0);

          doc.setFont(fontName, 'normal');
          const linhasTurno = doc.splitTextToSize(descTurno, 85);
          doc.text(linhasTurno, colX[1] + 2.5, yRow + 4.0);

          doc.setFont(fontName, 'bold');
          doc.text('40h00', colX[2] + (colW[2] / 2), yRow + 4.0, { align: 'center' });

          const hFoot = 5.2;
          let yFoot = yRow + hRow;
          doc.setFillColor(248, 250, 252);
          doc.rect(xTable, yFoot, wTable, hFoot, 'F');

          doc.setFont(fontName, 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text('Carga Horária Semanal Total:', colX[2] - 3, yFoot + 3.6, { align: 'right' });
          doc.setFontSize(9);
          doc.text('40h00', colX[2] + (colW[2] / 2), yFoot + 3.6, { align: 'center' });

          // Bordas
          doc.setLineWidth(0.2);
          doc.setDrawColor(203, 213, 225);
          doc.line(xTable, curY, xTable + wTable, curY);
          doc.line(xTable, curY + hHead, xTable + wTable, curY + hHead);
          doc.setDrawColor(148, 163, 184);
          doc.line(xTable, yFoot, xTable + wTable, yFoot);
          doc.line(xTable, yFoot + hFoot, xTable + wTable, yFoot + hFoot);

          doc.setDrawColor(203, 213, 225);
          doc.line(colX[0], curY, colX[0], yFoot + hFoot);
          doc.line(colX[1], curY, colX[1], yFoot);
          doc.line(colX[2], curY, colX[2], yFoot + hFoot);
          doc.line(colX[3], curY, colX[3], yFoot + hFoot);

          yFimSecoes = yFoot + hFoot + 3;
        }
      }

      // Fecho Oficial (recuo de 2.5cm = x: 50) - Conexão direta sem parágrafo de encerramento
      let yFecho = yFimSecoes + 5;
      doc.setFont(fontName, 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Atenciosamente,', 50, yFecho);

      // Signatário (centralizado com indent de 2.5cm = x: 119)
      const sigNome = inputSignatarioNome.value.trim() || 'Nome do Emitente';
      const sigCargo = selectSignatarioCargo.value.trim() || 'FUNÇÃO DO EMITENTE';
      let ySig = yFecho + 18;
      doc.text(sigNome, 119, ySig, { align: 'center' });
      doc.setFont(fontName, 'normal');
      doc.text(sigCargo.toUpperCase(), 119, ySig + 4.5, { align: 'center' });

      // Salvar arquivo PDF
      doc.save(nomeArquivo);

      setTimeout(() => {
        btnGerarMemoPdf.disabled = false;
        btnGerarMemoPdf.innerHTML = textoOriginal;
      }, 500);

    } catch (err) {
      console.error('Erro ao compilar PDF:', err);
      alert('Houve um problema ao compilar o PDF vetorial. Utilize a opção "Visualizar Impressão" e selecione "Salvar como PDF".');
      btnGerarMemoPdf.disabled = false;
      btnGerarMemoPdf.innerHTML = textoOriginal;
    }
  }

  btnGerarMemoPdf.addEventListener('click', compilarPdf);

  // ==========================================================================
  // 11. IMPRESSÃO NATIVA
  // ==========================================================================
  btnImprimirTudo.addEventListener('click', () => {
    if (!validarDataExercicio()) {
      alert('Atenção: Não é possível imprimir o memorando com a Data do Início do Exercício inválida (não pode ser posterior à data atual nem à data do memorando).\n\nPor favor, corrija a data de início do exercício.');
      inputDataExercicio.focus();
      return;
    }
    if (!validarCargaHorariaSemanal()) {
      const minMax = obterMinutosCargaContratual();
      const hMax = Math.round(minMax / 60);
      alert(`Atenção: Não é possível imprimir o memorando porque a soma das cargas diárias ultrapassa a carga horária semanal contratual permitida (${hMax} horas semanais).\n\nPor favor, ajuste a grade semanal para que a carga horária total não exceda o limite contratual antes de imprimir.`);
      return;
    }
    if (obterCategoriaSelecionada() === 'tecnico') {
      const audit = auditarConformidadeTrabalhistaCLT();
      if (!audit.valido) {
        const regimeNome = ehCeletista() ? 'trabalhista (CLT / Súmula nº 110 do TST)' : 'estatutária (ESUNESP / UNESP)';
        alert(`Atenção: Não é possível imprimir o memorando com inconformidades na legislação ${regimeNome}:\n\n• ` + audit.erros.join('\n• ') + '\n\nPor favor, regularize a grade de horários antes de imprimir.');
        return;
      }
    }
    window.print();
  });

  // ==========================================================================
  // 12. INICIALIZAÇÃO NO CARREGAMENTO
  // ==========================================================================
  const bgImgInit = document.querySelector('.papel-timbrado-bg');
  if (bgImgInit && window.PAPEL_TIMBRADO_BASE64) {
    bgImgInit.src = window.PAPEL_TIMBRADO_BASE64;
  }

  popularCatalogoUAs();
  atualizarVisibilidadeCategoria();
  atualizarVisibilidadeTipoHorario();
  validarDataExercicio();
  atualizarCamposHorarioAutomatico();
  atualizarDocumento();
});
