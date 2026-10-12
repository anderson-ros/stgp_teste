/**
 * Orquestrador Principal da Aplicação — Portal de Requerimentos STGP
 * Faculdade de Ciências e Tecnologia — UNESP Presidente Prudente
 */

document.addEventListener('DOMContentLoaded', () => {
  // Resolução de Módulos e Catálogos
  const STGP = window.PortalSTGP || {};
  const funcoesCatalogo = STGP.catalog?.funcoes || window.FUNCOES_POR_CATEGORIA || {};
  const requerimentosCatalogo = STGP.catalog?.requerimentos || window.REQUERIMENTOS_CATALOGO || {};
  const validators = STGP.validators || {};
  const masks = STGP.masks || {};
  const formatters = STGP.formatters || {};
  const previewTemplates = STGP.previewTemplates || {};
  const pdfTemplates = STGP.pdfTemplates || {};
  const cepService = STGP.cepService || window.PortalSTGP?.cepService || {};

  // Elementos do Formulário
  const radioTipos = document.querySelectorAll('input[name="tipoRequerimento"]');
  const fieldsContagemTempo = document.getElementById('fields-contagem-tempo');
  const checkContagemDocOutro = document.getElementById('contagem_doc_outro');
  const grupoContagemDocOutroTexto = document.getElementById('grupo-contagem-doc-outro-texto');
  const inputContagemDocOutroTexto = document.getElementById('contagem_doc_outro_texto');
  const fieldsSaude = document.getElementById('fields-saude');
  const fieldsGestanteAntes = document.getElementById('fields-gestante-antes');
  const fieldsGestanteApos = document.getElementById('fields-gestante-apos');
  const fieldsBanco = document.getElementById('fields-banco');
  const fieldsIsencaoIr = document.getElementById('fields-isencao-ir');
  const fieldsInsalubridade = document.getElementById('fields-insalubridade');
  const campoInsalubridadeMotivo = document.getElementById('insalubridade_motivo');
  const campoInsalubridadeDataInicio = document.getElementById('insalubridade_data_inicio');
  const grupoAnexoLaudoAnt = document.getElementById('grupo-anexo-laudo-ant');
  const fieldsAuxilioFuneral = document.getElementById('fields-auxilio-funeral');
  const fieldsLpBeneficiario = document.getElementById('fields-lp-beneficiario');
  const lpBlocosContainer = document.getElementById('lp-blocos-container');
  const btnAdicionarBlocoLP = document.getElementById('btn-adicionar-bloco-lp');
  const externoEnderecoContainer = document.getElementById('externo-endereco-container');
  const cardChefia = document.getElementById('card-chefia');
  const especificoTitle = document.getElementById('especifico-title');
  const especificoSubtitle = document.getElementById('especifico-subtitle');

  // Abas de Perfil
  const tabBtnServidor = document.getElementById('tab-btn-servidor');
  const tabBtnExterno = document.getElementById('tab-btn-externo');
  const gridServidor = document.getElementById('grid-servidor');
  const gridExterno = document.getElementById('grid-externo');
  const blocoIdServidor = document.getElementById('bloco-identificacao-servidor');
  const blocoIdExterno = document.getElementById('bloco-identificacao-externo');
  const identificacaoTitle = document.getElementById('identificacao-title');
  const identificacaoSubtitle = document.getElementById('identificacao-subtitle');
  const docQualifServidor = document.getElementById('doc-qualificacao-servidor');
  const docQualifExterno = document.getElementById('doc-qualificacao-externo');

  // Identificação do Servidor
  const selectCategoria = document.getElementById('categoria');
  const selectFuncao = document.getElementById('funcao');
  const inputMatricula = document.getElementById('matricula');
  const matriculaStatus = document.getElementById('matricula-status');
  const inputCpf = document.getElementById('cpf');
  const cpfStatus = document.getElementById('cpf-status');
  const servidorEnderecoContainer = document.getElementById('servidor-endereco-container');
  const inputSrvCep = document.getElementById('srv_end_cep');
  const srvCepStatus = document.getElementById('srv_end_cep-status');
  const lblEmail = document.getElementById('lbl-email');
  const inputEmail = document.getElementById('email');

  // Identificação do Solicitante Externo
  const inputExtCpf = document.getElementById('ext_cpf');
  const extCpfStatus = document.getElementById('ext_cpf-status');
  const selectExtVinculo = document.getElementById('ext_vinculo');
  const grupoExtVinculo = document.getElementById('grupo-ext-vinculo');
  const inputExtCep = document.getElementById('ext_end_cep');
  const extCepStatus = document.getElementById('ext_end_cep-status');

  // Botões de Ação
  const btnGerarPdf = document.getElementById('btn-gerar-pdf');
  const btnImprimir = document.getElementById('btn-imprimir');
  const btnPreencherExemplo = document.getElementById('btn-preencher-exemplo');

  // Inicializar datas padrão (Hoje)
  const hoje = new Date().toISOString().split('T')[0];
  const campoSaudeInicio = document.getElementById('saude_data_inicio');
  const campoSaudeFim = document.getElementById('saude_data_fim');
  const campoSaudeDias = document.getElementById('saude_dias');
  if (campoSaudeInicio) campoSaudeInicio.value = hoje;

  const campoGestanteAntesInicio = document.getElementById('gestante_antes_inicio');
  const campoGestanteAntesDpp = document.getElementById('gestante_antes_dpp');
  if (campoGestanteAntesInicio) campoGestanteAntesInicio.value = hoje;
  if (campoGestanteAntesDpp) {
    const dppPadrao = new Date();
    dppPadrao.setDate(dppPadrao.getDate() + 28);
    campoGestanteAntesDpp.value = dppPadrao.toISOString().split('T')[0];
  }

  const campoGestanteAposNasc = document.getElementById('gestante_apos_nascimento');
  if (campoGestanteAposNasc) campoGestanteAposNasc.value = hoje;

  if (campoInsalubridadeDataInicio) campoInsalubridadeDataInicio.value = hoje;

  const campoFuneralData = document.getElementById('funeral_falecido_data');
  if (campoFuneralData) campoFuneralData.value = hoje;

  const campoLpFalecidoData = document.getElementById('lp_falecido_data');
  if (campoLpFalecidoData) campoLpFalecidoData.value = hoje;

  // Gerenciador Dinâmico de Blocos de Licença-Prêmio (Modelo 03)
  let contadorBlocosLP = 0;

  function criarBlocoLP(dados = {}) {
    if (!lpBlocosContainer) return;
    contadorBlocosLP++;
    const blocoId = `lp-bloco-${Date.now()}-${contadorBlocosLP}`;

    const card = document.createElement('div');
    card.className = 'lp-bloco-card';
    card.id = blocoId;

    const numBloco = lpBlocosContainer.children.length + 1;

    card.innerHTML = `
      <div class="lp-bloco-header">
        <span class="lp-bloco-title">
          <span>📋</span> Bloco de Licença-Prêmio <span class="lp-bloco-num">#${numBloco}</span>
        </span>
        <button type="button" class="btn-remover-bloco" title="Excluir este bloco">
          🗑️ Excluir Bloco
        </button>
      </div>

      <div class="form-grid" style="gap: 10px;">
        <div class="form-group">
          <label>Quantidade de Dias *</label>
          <input type="number" class="lp-input-dias" min="1" max="365" placeholder="Ex: 60" value="${dados.dias || ''}">
        </div>

        <div class="form-group">
          <label>Total de Dias por Extenso *</label>
          <input type="text" class="lp-input-extenso" placeholder="Ex: sessenta" value="${dados.extenso || ''}">
        </div>

        <div class="form-group">
          <label>Período Aquisitivo — Data Inicial *</label>
          <input type="date" class="lp-input-inicio" value="${dados.inicio || ''}">
        </div>

        <div class="form-group">
          <label>Período Aquisitivo — Data Final *</label>
          <input type="date" class="lp-input-fim" value="${dados.fim || ''}">
        </div>

        <div class="form-group col-span-2">
          <label>Portaria de concessão publicada no DOE de * <span style="font-weight: normal; font-size: 0.8rem; color: #64748b;">(ex: 22/09/2009)</span></label>
          <input type="text" class="lp-input-doe" placeholder="Ex: 22/09/2009" value="${dados.doe || ''}">
        </div>

        <div class="col-span-2 lp-bloco-preview">
          <strong>Texto Padronizado da Linha:</strong>
          <div class="lp-bloco-preview-texto"></div>
        </div>
      </div>
    `;

    const inputDias = card.querySelector('.lp-input-dias');
    const inputExtenso = card.querySelector('.lp-input-extenso');
    const inputInicio = card.querySelector('.lp-input-inicio');
    const inputFim = card.querySelector('.lp-input-fim');
    const inputDoe = card.querySelector('.lp-input-doe');
    const previewTexto = card.querySelector('.lp-bloco-preview-texto');
    const btnRemover = card.querySelector('.btn-remover-bloco');

    function atualizarPreviewBloco() {
      const d = inputDias.value.trim();
      const ext = inputExtenso.value.trim();
      const ini = inputInicio.value;
      const fim = inputFim.value;
      const doe = inputDoe.value.trim();

      if (formatters.formatarLinhaBlocoLP) {
        previewTexto.textContent = `"${formatters.formatarLinhaBlocoLP(d, ext, ini, fim, doe)}"`;
      }
    }

    inputDias.addEventListener('input', () => {
      const val = parseInt(inputDias.value, 10);
      if (val && formatters.numeroPorExtenso) {
        inputExtenso.value = formatters.numeroPorExtenso(val);
      }
      atualizarPreviewBloco();
      atualizarDocumento();
    });

    [inputExtenso, inputInicio, inputFim, inputDoe].forEach(inp => {
      inp.addEventListener('input', () => {
        atualizarPreviewBloco();
        atualizarDocumento();
      });
      inp.addEventListener('change', () => {
        atualizarPreviewBloco();
        atualizarDocumento();
      });
    });

    btnRemover.addEventListener('click', () => {
      card.remove();
      renumerarBlocosLP();
      atualizarDocumento();
    });

    lpBlocosContainer.appendChild(card);
    atualizarPreviewBloco();
    renumerarBlocosLP();
  }

  function renumerarBlocosLP() {
    if (!lpBlocosContainer) return;
    const cards = lpBlocosContainer.querySelectorAll('.lp-bloco-card');
    cards.forEach((c, idx) => {
      const spanNum = c.querySelector('.lp-bloco-num');
      if (spanNum) spanNum.textContent = `#${idx + 1}`;
      const btnRemover = c.querySelector('.btn-remover-bloco');
      if (btnRemover) {
        btnRemover.style.display = cards.length > 1 ? 'inline-block' : 'none';
      }
    });

    // Controle de página única A4: Limite preventivo de até 8 blocos
    if (btnAdicionarBlocoLP) {
      if (cards.length >= 8) {
        btnAdicionarBlocoLP.disabled = true;
        btnAdicionarBlocoLP.innerHTML = '<span>⚠️ Limite máximo de 8 blocos atingido (controle de página única A4)</span>';
        btnAdicionarBlocoLP.style.opacity = '0.65';
        btnAdicionarBlocoLP.style.cursor = 'not-allowed';
      } else {
        btnAdicionarBlocoLP.disabled = false;
        btnAdicionarBlocoLP.innerHTML = '<span>➕ Adicionar Outro Bloco de Licença-Prêmio</span>';
        btnAdicionarBlocoLP.style.opacity = '1';
        btnAdicionarBlocoLP.style.cursor = 'pointer';
      }
    }
  }

  btnAdicionarBlocoLP?.addEventListener('click', () => {
    const cards = lpBlocosContainer ? lpBlocosContainer.querySelectorAll('.lp-bloco-card') : [];
    if (cards.length >= 8) {
      alert('Limite de 8 blocos atingido para assegurar a emissão rigorosa em 1 página A4 oficial.');
      return;
    }
    criarBlocoLP();
    atualizarDocumento();
  });

  // Inicialização de Funções por Categoria
  if (selectFuncao && !selectCategoria.value) {
    selectFuncao.disabled = true;
    selectFuncao.innerHTML = '<option value="" disabled selected>Selecione primeiro a categoria...</option>';
  }

  selectCategoria?.addEventListener('change', (e) => {
    atualizarOpcoesFuncao(e.target.value);
    atualizarDocumento();
  });

  function atualizarOpcoesFuncao(categoria, funcaoPreSelecionada = null) {
    if (!selectFuncao) return;
    selectFuncao.innerHTML = '';

    if (!categoria || !funcoesCatalogo[categoria]) {
      selectFuncao.disabled = true;
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Selecione primeiro a categoria...';
      opt.disabled = true;
      opt.selected = true;
      selectFuncao.appendChild(opt);
      return;
    }

    selectFuncao.disabled = false;
    const optPlaceholder = document.createElement('option');
    optPlaceholder.value = '';
    optPlaceholder.textContent = 'Selecione a função correspondente...';
    optPlaceholder.disabled = true;
    optPlaceholder.selected = !funcaoPreSelecionada;
    selectFuncao.appendChild(optPlaceholder);

    funcoesCatalogo[categoria].forEach(funcaoNome => {
      const opt = document.createElement('option');
      opt.value = funcaoNome;
      opt.textContent = funcaoNome;
      if (funcaoPreSelecionada && funcaoNome === funcaoPreSelecionada) {
        opt.selected = true;
      }
      selectFuncao.appendChild(opt);
    });
  }

  // Alternância de abas de perfil (Servidor vs Familiar/Terceiro)
  function alternarAbaPerfil(aba) {
    if (aba === 'servidor') {
      tabBtnServidor.classList.add('active');
      tabBtnExterno.classList.remove('active');
      gridServidor.style.display = 'block';
      gridExterno.style.display = 'none';

      blocoIdServidor.style.display = 'grid';
      blocoIdExterno.style.display = 'none';
      identificacaoTitle.textContent = '2. Identificação do(a) Servidor(a)';
      identificacaoSubtitle.textContent = 'Insira seus dados funcionais completos para constar no documento oficial.';

      docQualifServidor.style.display = 'block';
      docQualifExterno.style.display = 'none';

      let radioMarcado = gridServidor.querySelector('input[name="tipoRequerimento"]:checked');
      if (!radioMarcado) {
        const primeiroServidor = gridServidor.querySelector('input[name="tipoRequerimento"]');
        if (primeiroServidor) {
          primeiroServidor.checked = true;
          alternarTipo(primeiroServidor.value);
        }
      } else {
        alternarTipo(radioMarcado.value);
      }
    } else {
      tabBtnExterno.classList.add('active');
      tabBtnServidor.classList.remove('active');
      gridExterno.style.display = 'block';
      gridServidor.style.display = 'none';

      blocoIdExterno.style.display = 'grid';
      blocoIdServidor.style.display = 'none';
      identificacaoTitle.textContent = '2. Identificação do(a) Requerente (Familiar / Terceiro)';
      identificacaoSubtitle.textContent = 'Informe seus dados pessoais, endereço residencial e vínculo com o(a) servidor(a) falecido(a).';

      docQualifExterno.style.display = 'block';
      docQualifServidor.style.display = 'none';

      let radioMarcado = gridExterno.querySelector('input[name="tipoRequerimento"]:checked');
      if (!radioMarcado) {
        const primeiroExterno = gridExterno.querySelector('input[name="tipoRequerimento"]');
        if (primeiroExterno) {
          primeiroExterno.checked = true;
          alternarTipo(primeiroExterno.value);
        }
      } else {
        alternarTipo(radioMarcado.value);
      }
    }
  }

  tabBtnServidor?.addEventListener('click', () => alternarAbaPerfil('servidor'));
  tabBtnExterno?.addEventListener('click', () => alternarAbaPerfil('externo'));

  // Alternância de dados bancários BB vs Cheque para Auxílio Funeral
  const radiosFuneralBB = document.querySelectorAll('input[name="funeral_tem_bb"]');
  const containerDadosBB = document.getElementById('funeral-dados-bb');
  const containerAvisoCheque = document.getElementById('funeral-aviso-cheque');

  radiosFuneralBB.forEach(r => {
    r.addEventListener('change', () => {
      if (r.value === 'sim') {
        if (containerDadosBB) containerDadosBB.style.display = 'grid';
        if (containerAvisoCheque) containerAvisoCheque.style.display = 'none';
      } else {
        if (containerDadosBB) containerDadosBB.style.display = 'none';
        if (containerAvisoCheque) containerAvisoCheque.style.display = 'block';
      }
      atualizarDocumento();
    });
  });

  // Alternância de dados bancários BB para Indenização de Licença-Prêmio (Beneficiários)
  const radiosLpBB = document.querySelectorAll('input[name="lp_tem_bb"]');
  const containerLpDadosBB = document.getElementById('lp-dados-bb');
  const grupoLpAnexoBanco = document.getElementById('grupo-lp-anexo-banco');

  function atualizarVisibilidadeLpBB() {
    const temBB = document.querySelector('input[name="lp_tem_bb"]:checked')?.value === 'sim';
    if (containerLpDadosBB) {
      containerLpDadosBB.style.display = temBB ? 'grid' : 'none';
    }
    if (grupoLpAnexoBanco) {
      grupoLpAnexoBanco.style.display = temBB ? 'block' : 'none';
    }
  }

  radiosLpBB.forEach(r => {
    r.addEventListener('change', () => {
      atualizarVisibilidadeLpBB();
      atualizarDocumento();
    });
  });

  // Ajuste dinâmico de anexos conforme o vínculo com o falecido (Portaria UNESP 281/97)
  function ajustarAnexosPorVinculo() {
    if (!selectExtVinculo) return;
    const vinculo = selectExtVinculo.value;
    const isConjuge = (vinculo === 'Cônjuge' || vinculo === 'Companheiro(a) em união estável');

    const grupoCasamento = document.getElementById('grupo-anexo-casamento');
    const checkCasamento = document.getElementById('funeral_anexo_casamento');
    const grupoNf = document.getElementById('grupo-anexo-nf');
    const checkNf = document.getElementById('funeral_anexo_nf');
    const grupoAlvara = document.getElementById('grupo-anexo-alvara');
    const checkAlvara = document.getElementById('funeral_anexo_alvara');

    if (isConjuge) {
      if (grupoCasamento) grupoCasamento.style.display = 'block';
      if (checkCasamento) checkCasamento.checked = true;
      if (grupoAlvara) grupoAlvara.style.display = 'none';
      if (checkAlvara) checkAlvara.checked = false;
      if (grupoNf) grupoNf.style.display = 'none';
      if (checkNf) checkNf.checked = false;
    } else {
      if (grupoCasamento) grupoCasamento.style.display = 'none';
      if (checkCasamento) checkCasamento.checked = false;
      if (grupoAlvara) grupoAlvara.style.display = 'block';
      if (grupoNf) grupoNf.style.display = 'block';
      if (checkNf && !checkAlvara?.checked) checkNf.checked = true;
    }
  }

  selectExtVinculo?.addEventListener('change', () => {
    ajustarAnexosPorVinculo();
    atualizarDocumento();
  });

  // Campos mutuamente excludentes no Auxílio Funeral: Comprovante de despesas vs Alvará Judicial
  const checkFuneralNf = document.getElementById('funeral_anexo_nf');
  const checkFuneralAlvara = document.getElementById('funeral_anexo_alvara');

  checkFuneralNf?.addEventListener('change', () => {
    if (checkFuneralNf.checked && checkFuneralAlvara) {
      checkFuneralAlvara.checked = false;
    }
    atualizarDocumento();
  });

  checkFuneralAlvara?.addEventListener('change', () => {
    if (checkFuneralAlvara.checked && checkFuneralNf) {
      checkFuneralNf.checked = false;
    }
    atualizarDocumento();
  });

  // Exibição condicional de especificação de Outro Documento Comprovatório
  checkContagemDocOutro?.addEventListener('change', () => {
    if (grupoContagemDocOutroTexto) {
      grupoContagemDocOutroTexto.style.display = checkContagemDocOutro.checked ? 'block' : 'none';
    }
    if (checkContagemDocOutro.checked && inputContagemDocOutroTexto) {
      inputContagemDocOutroTexto.focus();
    }
    atualizarDocumento();
  });

  // Troca de tipo de requerimento
  radioTipos.forEach(radio => {
    radio.addEventListener('change', (e) => {
      alternarTipo(e.target.value);
    });
  });

  // Eventos de digitação e alteração em tempo real
  const formSection = document.querySelector('.form-section');
  if (formSection) {
    formSection.addEventListener('input', (e) => {
      if (e.target.id === 'cpf') {
        masks.aplicarMascaraEValidarCPFGeneric?.(inputCpf, cpfStatus);
      } else if (e.target.id === 'ext_cpf') {
        masks.aplicarMascaraEValidarCPFGeneric?.(inputExtCpf, extCpfStatus);
      } else if (e.target.id === 'matricula') {
        masks.aplicarMascaraEValidarMatriculaGeneric?.(inputMatricula, matriculaStatus);
      } else if (e.target.id === 'srv_telefone' || e.target.id === 'ext_telefone') {
        masks.aplicarMascaraTelefone?.(e.target);
      } else if (e.target.id === 'srv_end_cep' || e.target.id === 'ext_end_cep') {
        masks.aplicarMascaraCep?.(e.target);
      } else if (e.target.id === 'saude_dias' || e.target.id === 'saude_data_inicio') {
        if (formatters.calcularDataFimSaude && campoSaudeInicio && campoSaudeFim && campoSaudeDias) {
          campoSaudeFim.value = formatters.calcularDataFimSaude(campoSaudeInicio.value, campoSaudeDias.value);
        }
      }
      atualizarDocumento();
    });

    formSection.addEventListener('change', () => {
      atualizarDocumento();
    });
  }

  // Vinculação da busca inteligente de CEP com redundância
  if (cepService.vincularBuscaCep) {
    if (inputExtCep) {
      cepService.vincularBuscaCep(inputExtCep, 'ext_end_', extCepStatus, () => {
        atualizarDocumento();
      });
    }
    if (inputSrvCep) {
      cepService.vincularBuscaCep(inputSrvCep, 'srv_end_', srvCepStatus, () => {
        atualizarDocumento();
      });
    }
  }

  // Alternar visibilidade e regras específicas de cada tipo
  function alternarTipo(tipo) {
    // Esconde todos os containers específicos (atuais e futuros com padrão fields-)
    document.querySelectorAll('[id^="fields-"]').forEach(el => { el.style.display = 'none'; });

    // Restaura o checkbox de chefia para habilitado
    const checkChefia = document.getElementById('chefia_obrigatoria');
    const lblChefia = document.getElementById('txt-chefia-label');
    const hintChefia = document.getElementById('hint-chefia');
    if (checkChefia) {
      checkChefia.disabled = false;
      checkChefia.checked = true;
    }
    if (lblChefia) {
      lblChefia.innerHTML = '<strong>É obrigatória a ciência / visto da chefia imediata neste requerimento</strong>';
    }
    if (hintChefia) {
      hintChefia.textContent = 'Se selecionado, o documento incluirá o campo formal de visto ("Ciente") da chefia imediata da lotação indicada.';
    }

    // Restaura opções de regime
    const selectRegime = document.getElementById('regime');
    const hintIsencao = document.getElementById('regime-hint-isencao');
    const hintInsalubridade = document.getElementById('regime-hint-insalubridade');
    if (hintIsencao) hintIsencao.style.display = 'none';
    if (hintInsalubridade) hintInsalubridade.style.display = 'none';
    if (selectRegime) {
      Array.from(selectRegime.options).forEach(opt => { opt.disabled = false; });
    }

    const meta = requerimentosCatalogo[tipo];
    if (!meta) return;

    // Título e subtítulo do card específico
    if (especificoTitle) especificoTitle.textContent = meta.cardTitle;
    if (especificoSubtitle) especificoSubtitle.textContent = meta.cardSubtitle;

    // Exibe o container de campos correspondente
    const targetField = document.getElementById(meta.fieldId);
    if (targetField) targetField.style.display = 'grid';

    // Regras de Chefia e Regime por tipo
    if (cardChefia) cardChefia.style.display = 'block';
    if (servidorEnderecoContainer) servidorEnderecoContainer.style.display = meta.temEnderecoResidencial ? 'grid' : 'none';

    if (tipo === 'banco') {
      if (checkChefia) {
        checkChefia.checked = false;
        checkChefia.disabled = true;
      }
      if (lblChefia) lblChefia.innerHTML = '<span style="color: #64748b;">Dispensa de ciência / visto da chefia imediata</span>';
      if (hintChefia) hintChefia.textContent = meta.chefia.hint;
    } else if (tipo === 'contagem_tempo') {
      if (lblEmail) lblEmail.textContent = 'E-mail Institucional *';
      if (inputEmail) inputEmail.placeholder = 'nome.sobrenome@unesp.br';
      if (checkChefia) {
        checkChefia.checked = false;
        checkChefia.disabled = false;
      }
      if (lblChefia) lblChefia.innerHTML = `<strong>${meta.chefia.label}</strong>`;
      if (hintChefia) hintChefia.textContent = meta.chefia.hint;
    } else if (tipo === 'isencao_ir') {
      if (hintIsencao) hintIsencao.style.display = 'inline';
      if (selectRegime) {
        const optClt = Array.from(selectRegime.options).find(o => o.value === 'CLT');
        if (optClt) optClt.disabled = true;
        if (selectRegime.value === 'CLT') selectRegime.value = 'Autárquico';
      }
      if (lblEmail) lblEmail.textContent = 'E-mail para Contato *';
      if (inputEmail) inputEmail.placeholder = 'exemplo@email.com';
      if (checkChefia) {
        checkChefia.checked = false;
        checkChefia.disabled = true;
      }
      if (lblChefia) lblChefia.innerHTML = '<span style="color: #64748b;">Dispensa de visto da chefia (Servidor(a) Aposentado(a))</span>';
      if (hintChefia) hintChefia.textContent = meta.chefia.hint;
    } else if (tipo === 'insalubridade' || tipo === 'saude') {
      if (hintInsalubridade) hintInsalubridade.style.display = 'inline';
      if (selectRegime) {
        Array.from(selectRegime.options).forEach(opt => {
          if (opt.value && opt.value !== 'CLT') opt.disabled = true;
        });
        selectRegime.value = 'CLT';
      }
      if (checkChefia) {
        checkChefia.checked = true;
        checkChefia.disabled = true;
      }
      if (lblChefia) lblChefia.innerHTML = `<strong>${meta.chefia.label}</strong>`;
      if (hintChefia) hintChefia.textContent = meta.chefia.hint;

      if (tipo === 'insalubridade') {
        const motivo = campoInsalubridadeMotivo?.value;
        if (grupoAnexoLaudoAnt) {
          grupoAnexoLaudoAnt.style.display = (motivo === 'Pedido de revisão de grau de insalubridade') ? 'block' : 'none';
        }
      }
    } else if (tipo === 'licenca_premio_beneficiario') {
      if (cardChefia) cardChefia.style.display = 'none';
      if (checkChefia) checkChefia.checked = false;
      if (externoEnderecoContainer) externoEnderecoContainer.style.display = 'none';
      if (grupoExtVinculo) grupoExtVinculo.style.display = 'none';
      identificacaoTitle.textContent = '2. Identificação do(a) Beneficiário(a) (Requerente)';
      identificacaoSubtitle.textContent = 'Informe os dados pessoais (familiar / herdeiro legal) e CPF para constar no requerimento oficial.';
      if (lpBlocosContainer && lpBlocosContainer.children.length === 0) {
        criarBlocoLP();
      }
      atualizarVisibilidadeLpBB();
    } else if (tipo === 'auxilio_funeral') {
      if (cardChefia) cardChefia.style.display = 'none';
      if (checkChefia) checkChefia.checked = false;
      if (externoEnderecoContainer) externoEnderecoContainer.style.display = 'grid';
      if (grupoExtVinculo) grupoExtVinculo.style.display = 'block';
      identificacaoTitle.textContent = '2. Identificação do(a) Requerente (Familiar / Terceiro)';
      identificacaoSubtitle.textContent = 'Informe seus dados pessoais, endereço residencial e vínculo com o(a) servidor(a) falecido(a).';
      ajustarAnexosPorVinculo();
    } else {
      // Gestante antes ou após
      if (grupoExtVinculo) grupoExtVinculo.style.display = 'none';
      if (lblEmail) lblEmail.textContent = 'E-mail Institucional *';
      if (inputEmail) inputEmail.placeholder = 'nome.sobrenome@unesp.br';
      if (checkChefia) {
        checkChefia.checked = true;
        checkChefia.disabled = false;
      }
    }

    // Atualização dinâmica do banner de requerimento selecionado e botões de navegação
    const bannerReqIcon = document.getElementById('banner-req-icon');
    const bannerReqTitle = document.getElementById('banner-req-title');
    const bannerReqProfile = document.getElementById('banner-req-profile');
    const btnTrocarReq = document.getElementById('btn-trocar-requerimento');
    const btnNavBackCatalog = document.getElementById('btn-nav-back-catalog');
    const btnNavBackText = document.getElementById('btn-nav-back-text');

    if (bannerReqIcon && meta.icone) bannerReqIcon.textContent = meta.icone;
    if (bannerReqTitle && meta.titulo) bannerReqTitle.textContent = meta.titulo;

    const isServidor = meta.perfil === 'servidor';
    if (bannerReqProfile) {
      bannerReqProfile.textContent = isServidor
        ? 'Perfil: Servidor(a) / Aposentado(a)'
        : 'Perfil: Familiar / Terceiro (Externo)';
    }

    if (btnTrocarReq) {
      btnTrocarReq.href = isServidor ? 'servidor.html' : 'externo.html';
      btnTrocarReq.innerHTML = isServidor
        ? '<span>← Escolher Outro Modelo (Servidor)</span>'
        : '<span>← Escolher Outro Modelo (Externo)</span>';
    }

    if (btnNavBackCatalog) {
      btnNavBackCatalog.href = isServidor ? 'servidor.html' : 'externo.html';
    }
    if (btnNavBackText) {
      btnNavBackText.textContent = isServidor
        ? 'Voltar aos Requerimentos de Servidores'
        : 'Voltar aos Requerimentos de Familiares';
    }

    // Atualização do Breadcrumb Modelo B
    const breadcrumbPerfilLink = document.getElementById('breadcrumb-perfil-link');
    const breadcrumbDocTitle = document.getElementById('breadcrumb-doc-title');
    if (breadcrumbPerfilLink) {
      breadcrumbPerfilLink.href = isServidor ? 'servidor.html' : 'externo.html';
      breadcrumbPerfilLink.textContent = isServidor ? 'Servidores e Aposentados' : 'Familiares e Terceiros';
      breadcrumbPerfilLink.title = isServidor ? 'Voltar aos requerimentos de servidores' : 'Voltar aos requerimentos de familiares';
    }
    if (breadcrumbDocTitle && meta.titulo) {
      breadcrumbDocTitle.textContent = meta.titulo;
    }

    atualizarDocumento();
  }

  // Alerta dinâmico de regras para Licença Saúde conforme regime e dias
  function atualizarAlertaRegimeSaude() {
    const alerta = document.getElementById('saude-alerta-regime');
    if (!alerta) return;
    const regime = document.getElementById('regime')?.value;
    const dias = parseInt(document.getElementById('saude_dias')?.value, 10) || 0;

    if (regime === 'CLT') {
      alerta.style.display = 'block';
      if (dias <= 15) {
        alerta.style.backgroundColor = '#f0fdf4';
        alerta.style.border = '1px solid #86efac';
        alerta.style.color = '#15803d';
        alerta.innerHTML = `✅ <strong>Afastamento de até 15 dias:</strong> Salário 100% pago pela UNESP (Ofício Circular nº 31/2008 - PRAd). Sem necessidade de perícia do INSS. Apresentar requerimento na STGP em até 24h úteis.`;
      } else {
        alerta.style.backgroundColor = '#fff7ed';
        alerta.style.border = '1px solid #fdba74';
        alerta.style.color = '#c2410c';
        alerta.innerHTML = `⚠️ <strong>Afastamento superior a 15 dias (${dias} dias):</strong> Primeiros 15 dias pagos pela UNESP. Do 16º dia em diante: encaminhamento obrigatório ao INSS para concessão de <em>Auxílio por Incapacidade Temporária</em>.${dias >= 30 ? '<br><strong>Atenção:</strong> Afastamento ≥ 30 dias exige <em>Exame Médico de Retorno</em> junto à STS no primeiro dia de volta (NR-7).' : ''}`;
      }
    } else {
      alerta.style.display = 'none';
    }
  }

  // Atualizar o documento oficial em tempo real
  function atualizarDocumento() {
    const radioMarcado = document.querySelector('input[name="tipoRequerimento"]:checked');
    const tipo = radioMarcado ? radioMarcado.value : 'banco';
    const meta = requerimentosCatalogo[tipo] || {};

    const docPdf = document.getElementById('documento-pdf');
    if (docPdf) {
      // Remove dinamicamente qualquer classe doc-* anterior para não acumular estilos de outros modelos
      Array.from(docPdf.classList)
        .filter(cls => cls.startsWith('doc-'))
        .forEach(cls => docPdf.classList.remove(cls));
      if (meta.classeDoc) {
        docPdf.classList.add(meta.classeDoc);
      }
    }

    atualizarAlertaRegimeSaude();

    // Destinatário
    const elDestinatario = document.getElementById('doc-destinatario-texto');
    if (elDestinatario && meta.destinatario) {
      elDestinatario.textContent = meta.destinatario;
    }

    const regime = document.getElementById('regime')?.value || '[Regime Jurídico]';

    if (tipo === 'auxilio_funeral') {
      const extNome = document.getElementById('ext_nome')?.value.trim() || '[Nome do(a) Requerente]';
      const extCpfVal = formatters.formatarCPFParaDocumento?.(document.getElementById('ext_cpf')?.value) || '[000.000.000-00]';
      const extVinculo = document.getElementById('ext_vinculo')?.value || '[Vínculo com o(a) falecido(a)]';
      const extTelefone = document.getElementById('ext_telefone')?.value.trim() || '[Telefone de Contato]';
      const extEmail = document.getElementById('ext_email')?.value.trim();
      const extEndereco = formatters.obterEnderecoCompletoExterno ? formatters.obterEnderecoCompletoExterno() : '[Endereço Residencial Completo]';

      document.getElementById('prev-ext-nome').textContent = extNome;
      document.getElementById('prev-ext-cpf').textContent = extCpfVal;
      document.getElementById('prev-ext-endereco').textContent = extEndereco;
      document.getElementById('prev-ext-telefone').textContent = extTelefone;
      document.getElementById('prev-ext-vinculo').textContent = extVinculo;

      const emailContainer = document.getElementById('prev-ext-email-container');
      const prevExtEmail = document.getElementById('prev-ext-email');
      if (extEmail) {
        if (emailContainer) emailContainer.style.display = 'inline';
        if (prevExtEmail) prevExtEmail.textContent = extEmail;
      } else {
        if (emailContainer) emailContainer.style.display = 'none';
      }

      document.getElementById('prev-assinatura-nome').textContent = extNome;
      const prevAssinaturaCargoExt = document.getElementById('prev-assinatura-cargo');
      if (prevAssinaturaCargoExt) {
        prevAssinaturaCargoExt.textContent = extVinculo !== '[Vínculo com o(a) falecido(a)]' ? `Requerente (${extVinculo})` : 'Requerente';
        prevAssinaturaCargoExt.style.display = 'block';
      }
      const prevAssinaturaContatoExt = document.getElementById('prev-assinatura-contato');
      if (prevAssinaturaContatoExt) prevAssinaturaContatoExt.style.display = 'none';

      if (docQualifExterno) docQualifExterno.style.display = 'block';
      if (docQualifServidor) docQualifServidor.style.display = 'none';

      const blocoChefia = document.getElementById('doc-bloco-chefia');
      if (blocoChefia) blocoChefia.style.display = 'none';

    } else if (tipo === 'licenca_premio_beneficiario') {
      const extNome = document.getElementById('ext_nome')?.value.trim() || '[Nome do(a) Beneficiário(a)]';
      const extTelefone = document.getElementById('ext_telefone')?.value.trim();
      const extEmail = document.getElementById('ext_email')?.value.trim();
      const prevAssinaturaNome = document.getElementById('prev-assinatura-nome');
      const prevAssinaturaCargo = document.getElementById('prev-assinatura-cargo');
      const prevAssinaturaContato = document.getElementById('prev-assinatura-contato');
      const prevAssinaturaTelefone = document.getElementById('prev-assinatura-telefone');
      const prevAssinaturaEmail = document.getElementById('prev-assinatura-email');

      if (prevAssinaturaNome) prevAssinaturaNome.textContent = extNome;
      if (prevAssinaturaCargo) {
        prevAssinaturaCargo.textContent = '';
        prevAssinaturaCargo.style.display = 'none';
      }

      if (prevAssinaturaContato) {
        prevAssinaturaContato.style.display = 'block';
        if (prevAssinaturaTelefone) {
          prevAssinaturaTelefone.textContent = extTelefone ? `Telefone(s): ${extTelefone}` : 'Telefone(s): [Telefone de Contato]';
        }
        if (prevAssinaturaEmail) {
          if (extEmail) {
            prevAssinaturaEmail.textContent = `E-mail: ${extEmail}`;
            prevAssinaturaEmail.style.display = 'block';
          } else {
            prevAssinaturaEmail.textContent = '';
            prevAssinaturaEmail.style.display = 'none';
          }
        }
      }

      if (docQualifExterno) docQualifExterno.style.display = 'block';
      if (docQualifServidor) docQualifServidor.style.display = 'none';

      const blocoChefia = document.getElementById('doc-bloco-chefia');
      if (blocoChefia) blocoChefia.style.display = 'none';

    } else {
      // Qualificação de Servidor
      const nome = document.getElementById('nome')?.value.trim() || '[Nome do(a) Servidor(a)]';
      const matricula = formatters.formatarMatriculaParaDocumento?.(document.getElementById('matricula')?.value) || '[Matrícula]';
      const cpf = formatters.formatarCPFParaDocumento?.(document.getElementById('cpf')?.value) || '[000.000.000-00]';
      const funcao = document.getElementById('funcao')?.value || '[Função]';
      const lotacao = document.getElementById('lotacao')?.value || '[Lotação / Departamento]';
      const email = document.getElementById('email')?.value.trim() || '[e-mail institucional]';

      if (tipo === 'isencao_ir') {
        const srvEndereco = formatters.obterEnderecoCompletoServidor ? formatters.obterEnderecoCompletoServidor() : '[Endereço Residencial Completo]';
        const srvTelefone = document.getElementById('srv_telefone')?.value.trim() || '[Telefone de Contato]';

        docQualifServidor.innerHTML = `
          Eu, <strong class="doc-val">${nome}</strong>, 
          matrícula funcional nº <strong class="doc-val">${matricula}</strong>, 
          inscrito(a) no CPF sob o nº <strong class="doc-val">${cpf}</strong>, 
          servidor(a) <strong>aposentado(a)</strong> da UNESP no regime jurídico <span class="doc-val">${regime}</span>, 
          no cargo/função de <span class="doc-val">${funcao}</span>, 
          última lotação no(a) <span class="doc-val">${lotacao}</span>, 
          residente e domiciliado(a) em <span class="doc-val">${srvEndereco}</span>, 
          telefone(s) <span class="doc-val">${srvTelefone}</span>, 
          e-mail <span class="doc-val">${email}</span>, 
          venho respeitosamente à presença de Vossa Senhoria requerer:
        `;
        document.getElementById('prev-assinatura-nome').textContent = nome;
        document.getElementById('prev-assinatura-cargo').textContent = (funcao && funcao !== '[Função]') ? `${funcao} - Aposentado(a)` : 'Servidor(a) Aposentado(a)';
      } else {
        docQualifServidor.innerHTML = `
          Eu, <strong class="doc-val">${nome}</strong>, 
          matrícula funcional nº <strong class="doc-val">${matricula}</strong>, 
          inscrito(a) no CPF sob o nº <strong class="doc-val">${cpf}</strong>, 
          regime jurídico <span class="doc-val">${regime}</span>, 
          <span class="doc-val">${funcao}</span>, 
          lotado(a) no(a) <span class="doc-val">${lotacao}</span>, 
          e-mail institucional <span class="doc-val">${email}</span>, 
          venho respeitosamente à presença de Vossa Senhoria requerer:
        `;
        document.getElementById('prev-assinatura-nome').textContent = nome;
        document.getElementById('prev-assinatura-cargo').textContent = (funcao && funcao !== '[Função]') ? funcao : '[Função]';
      }

      const prevAssinaturaCargoSrv = document.getElementById('prev-assinatura-cargo');
      if (prevAssinaturaCargoSrv) prevAssinaturaCargoSrv.style.display = 'block';
      const prevAssinaturaContatoSrv = document.getElementById('prev-assinatura-contato');
      if (prevAssinaturaContatoSrv) prevAssinaturaContatoSrv.style.display = 'none';

      if (docQualifServidor) docQualifServidor.style.display = 'block';
      if (docQualifExterno) docQualifExterno.style.display = 'none';

      // Bloco de Ciência da Chefia Imediata
      const checkChefia = document.getElementById('chefia_obrigatoria');
      const blocoChefia = document.getElementById('doc-bloco-chefia');
      const prevChefiaLotacao = document.getElementById('prev-chefia-lotacao');

      const chefiaObrigatoria = meta.chefia ? !!meta.chefia.obrigatoria : (tipo === 'gestante_antes' || tipo === 'gestante_apos' || tipo === 'saude' || tipo === 'insalubridade');
      if (chefiaObrigatoria && checkChefia) {
        checkChefia.checked = true;
        checkChefia.disabled = true;
      }

      const chefiaDispensada = meta.chefia ? (!meta.chefia.obrigatoria && !!meta.chefia.bloqueada) : (tipo === 'banco' || tipo === 'isencao_ir');
      if (!chefiaDispensada && (chefiaObrigatoria || (checkChefia && checkChefia.checked))) {
        if (blocoChefia) blocoChefia.style.display = 'block';
        const lotacaoNome = (lotacao && lotacao !== '[Lotação / Departamento]') ? lotacao : '[Lotação / Departamento]';
        if (prevChefiaLotacao) prevChefiaLotacao.textContent = `Responsável pelo(a) ${lotacaoNome}`;
      } else {
        if (blocoChefia) blocoChefia.style.display = 'none';
      }
    }

    // Renderização do corpo do documento e anexos via template
    const corpoEl = document.getElementById('doc-especificacao-corpo');
    const anexosLista = document.getElementById('doc-anexos-lista');
    if (previewTemplates.renderPreview) {
      previewTemplates.renderPreview(tipo, regime, corpoEl, anexosLista);
    }

    // Controle em tempo real para não ultrapassar 1 página A4
    if (tipo === 'licenca_premio_beneficiario') {
      const previewHint = document.querySelector('.preview-hint');
      if (docPdf && previewHint) {
        // Tolerância de 4px para subpixel rendering de fontes
        if (docPdf.scrollHeight > docPdf.clientHeight + 4) {
          previewHint.innerHTML = '<strong style="color: #dc2626;">⚠️ Atenção: O conteúdo está ultrapassando 1 página A4. Remova blocos ou reduza anexos.</strong>';
        } else {
          previewHint.textContent = 'Simulação exata de impressão oficial em folha A4 única (210mm x 297mm)';
        }
      }
    }

    // Ajusta a escala da folha A4 no mobile caso o modo Fit esteja ativo
    if (typeof ajustarEscalaA4 === 'function') {
      ajustarEscalaA4();
    }
  }

  // Preencher Exemplo
  btnPreencherExemplo?.addEventListener('click', () => {
    const radioMarcado = document.querySelector('input[name="tipoRequerimento"]:checked');
    const tipo = radioMarcado ? radioMarcado.value : 'banco';

    if (tipo === 'auxilio_funeral') {
      document.getElementById('ext_nome').value = 'Carlos Eduardo de Oliveira';
      document.getElementById('ext_cpf').value = '529.982.247-25';
      masks.aplicarMascaraEValidarCPFGeneric?.(inputExtCpf, extCpfStatus);

      document.getElementById('ext_vinculo').value = 'Cônjuge';
      ajustarAnexosPorVinculo();

      document.getElementById('ext_end_tipo_logradouro').value = 'Rua';
      document.getElementById('ext_end_logradouro').value = 'das Flores';
      document.getElementById('ext_end_numero').value = '120';
      document.getElementById('ext_end_complemento').value = 'Apto 32';
      document.getElementById('ext_end_bairro').value = 'Jardim das Rosas';
      document.getElementById('ext_end_cidade').value = 'Presidente Prudente/SP';
      document.getElementById('ext_end_cep').value = '19060-900';
      if (extCepStatus) {
        extCepStatus.textContent = '✓ Endereço localizado via ViaCEP';
        extCepStatus.className = 'field-feedback valid';
      }
      document.getElementById('ext_end_cep')?.classList.remove('input-invalid');
      document.getElementById('ext_end_cep')?.classList.add('input-valid');
      document.getElementById('ext_telefone').value = '(18) 99876-5432';
      document.getElementById('ext_email').value = 'carlos.oliveira@email.com';

      document.getElementById('funeral_falecido_nome').value = 'Antônio Marcos de Oliveira';
      document.getElementById('funeral_falecido_data').value = hoje;

      const radioBB = document.getElementById('funeral_bb_sim');
      if (radioBB) {
        radioBB.checked = true;
        if (containerDadosBB) containerDadosBB.style.display = 'grid';
        if (containerAvisoCheque) containerAvisoCheque.style.display = 'none';
      }
      document.getElementById('funeral_agencia').value = '0098-1';
      document.getElementById('funeral_conta').value = '12345-6';

    } else if (tipo === 'licenca_premio_beneficiario') {
      document.getElementById('ext_nome').value = 'Maria de Lourdes Ferreira Santos';
      document.getElementById('ext_cpf').value = '529.982.247-25';
      masks.aplicarMascaraEValidarCPFGeneric?.(inputExtCpf, extCpfStatus);

      document.getElementById('ext_telefone').value = '(18) 99712-3456';
      document.getElementById('ext_email').value = 'maria.lourdes@email.com';

      document.getElementById('lp_falecido_nome').value = 'José Carlos dos Santos';
      document.getElementById('lp_falecido_data').value = '2026-03-15';

      const radioLpBBSim = document.getElementById('lp_bb_sim');
      if (radioLpBBSim) {
        radioLpBBSim.checked = true;
        atualizarVisibilidadeLpBB();
      }
      const selLpTipoConta = document.getElementById('lp_tipo_conta');
      if (selLpTipoConta) selLpTipoConta.value = 'Conta Corrente';
      const inpLpAgencia = document.getElementById('lp_agencia');
      if (inpLpAgencia) inpLpAgencia.value = '0098-1';
      const inpLpConta = document.getElementById('lp_conta');
      if (inpLpConta) inpLpConta.value = '12345-6';

      if (lpBlocosContainer) {
        lpBlocosContainer.innerHTML = '';
        criarBlocoLP({
          dias: 60,
          extenso: 'sessenta',
          inicio: '2000-05-27',
          fim: '2005-05-25',
          doe: '22/09/2009'
        });
        criarBlocoLP({
          dias: 90,
          extenso: 'noventa',
          inicio: '2005-05-26',
          fim: '2010-05-24',
          doe: '15/10/2010'
        });
      }

      const anexoId = document.getElementById('lp_anexo_identidade');
      const anexoObito = document.getElementById('lp_anexo_obito');
      const anexoAlvara = document.getElementById('lp_anexo_alvara');
      if (anexoId) anexoId.checked = true;
      if (anexoObito) anexoObito.checked = true;
      if (anexoAlvara) anexoAlvara.checked = true;
    } else {
      document.getElementById('nome').value = 'Maria da Silva Souza';
      document.getElementById('matricula').value = '102345-7';
      masks.aplicarMascaraEValidarMatriculaGeneric?.(inputMatricula, matriculaStatus);

      document.getElementById('cpf').value = '529.982.247-25';
      masks.aplicarMascaraEValidarCPFGeneric?.(inputCpf, cpfStatus);

      selectCategoria.value = 'Técnico Administrativo';
      atualizarOpcoesFuncao('Técnico Administrativo', 'Assistente Administrativo II');

      const selectRegime = document.getElementById('regime');
      if (tipo === 'isencao_ir') {
        selectRegime.value = 'Autárquico';
      } else if (tipo === 'insalubridade' || tipo === 'saude') {
        selectRegime.value = 'CLT';
      } else {
        selectRegime.value = 'Efetivo';
      }

      document.getElementById('lotacao').value = 'Seção Técnica de Gestão de Pessoas';
      document.getElementById('email').value = 'maria.silva@unesp.br';

      if (tipo === 'isencao_ir') {
        document.getElementById('srv_end_tipo_logradouro').value = 'Avenida';
        document.getElementById('srv_end_logradouro').value = 'da Saudade';
        document.getElementById('srv_end_numero').value = '450';
        document.getElementById('srv_end_complemento').value = 'Apto 12';
        document.getElementById('srv_end_bairro').value = 'Vila Santa Helena';
        document.getElementById('srv_end_cidade').value = 'Presidente Prudente/SP';
        document.getElementById('srv_end_cep').value = '19015-010';
        if (srvCepStatus) {
          srvCepStatus.textContent = '✓ Endereço localizado via ViaCEP';
          srvCepStatus.className = 'field-feedback valid';
        }
        document.getElementById('srv_end_cep')?.classList.remove('input-invalid');
        document.getElementById('srv_end_cep')?.classList.add('input-valid');
        document.getElementById('srv_telefone').value = '(18) 99876-5432';
      } else if (tipo === 'saude') {
        document.getElementById('saude_dias').value = '5';
        document.getElementById('saude_medico_nome').value = 'Dr. Roberto Silveira';
        document.getElementById('saude_medico_crm').value = 'CRM/SP 123456';
        if (formatters.calcularDataFimSaude && campoSaudeInicio && campoSaudeFim) {
          campoSaudeFim.value = formatters.calcularDataFimSaude(campoSaudeInicio.value, 5);
        }
      } else if (tipo === 'gestante_antes') {
        document.getElementById('gestante_antes_medico_nome').value = 'Dra. Ana Costa';
        document.getElementById('gestante_antes_medico_crm').value = 'CRM/SP 987654';
      } else if (tipo === 'gestante_apos') {
        document.getElementById('gestante_apos_nome_crianca').value = 'Lucas da Silva Souza';
      } else if (tipo === 'banco') {
        document.getElementById('banco_tipo_conta').value = 'Conta Corrente';
        document.getElementById('banco_agencia').value = '0098-1';
        document.getElementById('banco_conta').value = '12345-6';
      } else if (tipo === 'contagem_tempo') {
        document.getElementById('contagem_orgao_origem').value = 'Prefeitura Municipal de Presidente Prudente';
        document.getElementById('contagem_tipo_orgao').value = 'Outro Estado/Município';
        document.getElementById('contagem_data_inicio').value = '2018-02-01';
        document.getElementById('contagem_data_fim').value = '2022-12-31';
        document.getElementById('contagem_doc_ctc_inss').checked = true;
        document.getElementById('contagem_doc_certidao_orgao').checked = true;
        document.getElementById('contagem_doc_dtci').checked = false;
        document.getElementById('contagem_doc_outro').checked = false;
        if (grupoContagemDocOutroTexto) grupoContagemDocOutroTexto.style.display = 'none';
        document.getElementById('contagem_observacoes').value = 'Período sob Regime Próprio de Previdência Social (RPPS) com certidão original homologada em anexo.';
      } else if (tipo === 'insalubridade') {
        document.getElementById('insalubridade_motivo').value = 'Pedido inicial';
        document.getElementById('insalubridade_local').value = 'Laboratório de Bioquímica e Toxicologia - Bloco Didático II';
      }
    }

    atualizarDocumento();
  });

  // Geração e Download em PDF vetorial via pdfMake
  btnGerarPdf?.addEventListener('click', () => {
    const radioMarcado = document.querySelector('input[name="tipoRequerimento"]:checked');
    const tipo = radioMarcado ? radioMarcado.value : 'banco';

    // Validação estrita antes de baixar
    if (tipo === 'auxilio_funeral') {
      const extNome = document.getElementById('ext_nome')?.value.trim();
      const extCpf = document.getElementById('ext_cpf')?.value.replace(/\D/g, '');
      const extVinculo = document.getElementById('ext_vinculo')?.value;

      if (!extNome) {
        alert('Por favor, preencha o Nome Completo do(a) requerente antes de gerar o PDF.');
        document.getElementById('ext_nome')?.focus();
        return;
      }
      if (!extCpf || extCpf.length !== 11 || (validators.validarCPFReceitaFederal && !validators.validarCPFReceitaFederal(extCpf))) {
        alert('Por favor, preencha um CPF válido com 11 dígitos perante a Receita Federal antes de gerar o PDF.');
        document.getElementById('ext_cpf')?.focus();
        return;
      }
      if (!extVinculo) {
        alert('Por favor, selecione o vínculo com o(a) servidor(a) falecido(a) antes de gerar o PDF.');
        document.getElementById('ext_vinculo')?.focus();
        return;
      }
    } else if (tipo === 'licenca_premio_beneficiario') {
      const extNome = document.getElementById('ext_nome')?.value.trim();
      const extCpf = document.getElementById('ext_cpf')?.value.replace(/\D/g, '');
      const falecidoNome = document.getElementById('lp_falecido_nome')?.value.trim();
      const falecidoData = document.getElementById('lp_falecido_data')?.value;

      if (!extNome) {
        alert('Por favor, preencha o Nome Completo do(a) beneficiário(a) requerente antes de gerar o PDF.');
        document.getElementById('ext_nome')?.focus();
        return;
      }
      if (!extCpf || extCpf.length !== 11 || (validators.validarCPFReceitaFederal && !validators.validarCPFReceitaFederal(extCpf))) {
        alert('Por favor, preencha um CPF válido com 11 dígitos perante a Receita Federal antes de gerar o PDF.');
        document.getElementById('ext_cpf')?.focus();
        return;
      }
      if (!falecidoNome) {
        alert('Por favor, preencha o Nome Completo do(a) Servidor(a) Falecido(a) antes de gerar o PDF.');
        document.getElementById('lp_falecido_nome')?.focus();
        return;
      }
      if (!falecidoData) {
        alert('Por favor, preencha a Data do Falecimento do(a) servidor(a).');
        document.getElementById('lp_falecido_data')?.focus();
        return;
      }

      const temBB = document.querySelector('input[name="lp_tem_bb"]:checked')?.value === 'sim';
      if (temBB) {
        const lpAgencia = document.getElementById('lp_agencia')?.value.trim();
        const lpConta = document.getElementById('lp_conta')?.value.trim();

        if (!lpAgencia) {
          alert('Por favor, preencha o número da Agência do Banco do Brasil com dígito.');
          document.getElementById('lp_agencia')?.focus();
          return;
        }
        if (!lpConta) {
          alert('Por favor, preencha o número da Conta do Banco do Brasil com dígito.');
          document.getElementById('lp_conta')?.focus();
          return;
        }
      }

      const blocos = lpBlocosContainer ? lpBlocosContainer.querySelectorAll('.lp-bloco-card') : [];
      if (blocos.length === 0) {
        alert('Por favor, inclua pelo menos um Bloco de Licença-Prêmio com as informações da Área de Gestão de Pessoas.');
        return;
      }

      for (let i = 0; i < blocos.length; i++) {
        const c = blocos[i];
        const numBloco = i + 1;
        const d = c.querySelector('.lp-input-dias')?.value.trim();
        const ext = c.querySelector('.lp-input-extenso')?.value.trim();
        const ini = c.querySelector('.lp-input-inicio')?.value;
        const fim = c.querySelector('.lp-input-fim')?.value;
        const doe = c.querySelector('.lp-input-doe')?.value.trim();

        if (!d || parseInt(d, 10) <= 0) {
          alert(`No Bloco #${numBloco}, informe uma quantidade válida de dias.`);
          c.querySelector('.lp-input-dias')?.focus();
          return;
        }
        if (!ext) {
          alert(`No Bloco #${numBloco}, preencha o total de dias por extenso.`);
          c.querySelector('.lp-input-extenso')?.focus();
          return;
        }
        if (!ini) {
          alert(`No Bloco #${numBloco}, informe a Data Inicial do período aquisitivo.`);
          c.querySelector('.lp-input-inicio')?.focus();
          return;
        }
        if (!fim) {
          alert(`No Bloco #${numBloco}, informe a Data Final do período aquisitivo.`);
          c.querySelector('.lp-input-fim')?.focus();
          return;
        }
        if (ini > fim) {
          alert(`No Bloco #${numBloco}, a Data Inicial não pode ser posterior à Data Final.`);
          c.querySelector('.lp-input-inicio')?.focus();
          return;
        }
        if (!doe) {
          alert(`No Bloco #${numBloco}, informe a data de publicação no DOE.`);
          c.querySelector('.lp-input-doe')?.focus();
          return;
        }
      }
    } else {
      const nome = document.getElementById('nome')?.value.trim();
      const cpf = document.getElementById('cpf')?.value.replace(/\D/g, '');
      const matricula = document.getElementById('matricula')?.value.replace(/\D/g, '');
      const categoria = selectCategoria?.value;
      const funcao = selectFuncao?.value;
      const lotacao = document.getElementById('lotacao')?.value;

      if (!nome) {
        alert('Por favor, preencha o Nome Completo antes de gerar o PDF.');
        document.getElementById('nome')?.focus();
        return;
      }
      if (!categoria) {
        alert('Por favor, selecione a Categoria do Servidor antes de gerar o PDF.');
        selectCategoria?.focus();
        return;
      }
      if (!funcao) {
        alert('Por favor, selecione a Função do Servidor antes de gerar o PDF.');
        selectFuncao?.focus();
        return;
      }
      if (!matricula || matricula.length < 7) {
        alert('Por favor, preencha a Matrícula Funcional completa (6 dígitos + dígito verificador).');
        document.getElementById('matricula')?.focus();
        return;
      }
      if (validators.validarMatriculaUNESP) {
        const checkMatricula = validators.validarMatriculaUNESP(matricula);
        if (!checkMatricula.valido) {
          alert(`A Matrícula Funcional informada é inválida conforme o algoritmo oficial da UNESP.\n\nDígito correto calculado: ${checkMatricula.digitoCalculado}.\nPor favor, corrija o número antes de gerar o requerimento oficial.`);
          document.getElementById('matricula')?.focus();
          return;
        }
      }
      if (!cpf || cpf.length !== 11 || (validators.validarCPFReceitaFederal && !validators.validarCPFReceitaFederal(cpf))) {
        alert('Por favor, preencha um CPF válido com 11 dígitos perante a Receita Federal antes de gerar o PDF.');
        document.getElementById('cpf')?.focus();
        return;
      }
      if (!lotacao) {
        alert('Por favor, selecione a Lotação / Departamento antes de gerar o PDF.');
        document.getElementById('lotacao')?.focus();
        return;
      }

      if (tipo === 'contagem_tempo') {
        const orgao = document.getElementById('contagem_orgao_origem')?.value.trim();
        const tipoOrgao = document.getElementById('contagem_tipo_orgao')?.value;
        const dtInicio = document.getElementById('contagem_data_inicio')?.value;
        const dtFim = document.getElementById('contagem_data_fim')?.value;

        if (!orgao) {
          alert('Por favor, informe o Nome do Órgão Empregador / Empresa de Origem antes de gerar o PDF.');
          document.getElementById('contagem_orgao_origem')?.focus();
          return;
        }
        if (!tipoOrgao) {
          alert('Por favor, selecione o Tipo de Órgão antes de gerar o PDF.');
          document.getElementById('contagem_tipo_orgao')?.focus();
          return;
        }
        if (!dtInicio) {
          alert('Por favor, preencha a Data Inicial do período a ser averbado.');
          document.getElementById('contagem_data_inicio')?.focus();
          return;
        }
        if (!dtFim) {
          alert('Por favor, preencha a Data Final do período a ser averbado.');
          document.getElementById('contagem_data_fim')?.focus();
          return;
        }
        if (dtInicio > dtFim) {
          alert('A Data Inicial do período não pode ser posterior à Data Final informada.');
          document.getElementById('contagem_data_inicio')?.focus();
          return;
        }
      }
    }

    if (!window.pdfMake) {
      alert('A biblioteca pdfMake ainda está sendo carregada. Aguarde 2 segundos e tente novamente.');
      return;
    }

    const textoOriginal = btnGerarPdf.innerHTML;
    btnGerarPdf.innerHTML = '<span class="btn-icon">⏳</span> Gerando PDF vetorial...';
    btnGerarPdf.disabled = true;

    try {
      const docDef = pdfTemplates.gerarDefinicaoPdfMake ? pdfTemplates.gerarDefinicaoPdfMake(tipo) : null;
      if (!docDef) {
        throw new Error('Não foi possível gerar a definição do documento.');
      }

      const nomeLimpo = (tipo === 'auxilio_funeral' || tipo === 'licenca_premio_beneficiario' ? document.getElementById('ext_nome')?.value : document.getElementById('nome')?.value)
        ?.trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_') || 'requerimento';

      const nomeArquivo = `requerimento_${tipo}_${nomeLimpo}_unesp.pdf`;
      window.pdfMake.createPdf(docDef).download(nomeArquivo);
    } catch (err) {
      console.error('Erro na geração do PDF com pdfMake:', err);
      alert('Ocorreu um erro ao gerar o PDF vetorial. Verifique o console para mais detalhes.');
    } finally {
      btnGerarPdf.disabled = false;
      btnGerarPdf.innerHTML = textoOriginal;
    }
  });

  // Imprimir
  btnImprimir?.addEventListener('click', () => {
    if (typeof atualizarDocumento === 'function') {
      atualizarDocumento();
    }
    window.print();
  });

  // Gatilhos globais de impressão nativa do navegador (Ctrl+P / Menu Imprimir)
  window.addEventListener('beforeprint', () => {
    if (typeof atualizarDocumento === 'function') {
      atualizarDocumento();
    }
  });

  window.addEventListener('afterprint', () => {
    if (typeof ajustarEscalaA4 === 'function') {
      ajustarEscalaA4();
    }
  });

  // Ordenação dos cards de requerimento em ordem alfabética
  function ordenarCardsRequerimento() {
    [gridServidor, gridExterno].forEach(container => {
      if (!container) return;
      const grid = container.querySelector('.tipo-grid');
      if (!grid) return;
      const cards = Array.from(grid.children);
      cards.sort((a, b) => {
        const titleA = a.querySelector('.tipo-title')?.textContent.trim() || '';
        const titleB = b.querySelector('.tipo-title')?.textContent.trim() || '';
        return titleA.localeCompare(titleB, 'pt-BR');
      });
      cards.forEach(card => grid.appendChild(card));
    });
  }

  // ============================================================
  // GERENCIAMENTO RESPONSIVO MOBILE E CONTROLE DE VISUALIZAÇÃO A4
  // ============================================================
  const tabViewForm = document.getElementById('tab-view-form');
  const tabViewPreview = document.getElementById('tab-view-preview');
  const btnVerPreviaMobile = document.getElementById('btn-ver-previa-mobile');
  const btnVoltarFormMobile = document.getElementById('btn-voltar-form-mobile');
  const btnGerarPdfPreview = document.getElementById('btn-gerar-pdf-preview');
  const btnImprimirPreview = document.getElementById('btn-imprimir-preview');

  const a4Wrapper = document.getElementById('a4-wrapper');
  const a4ScaleContainer = document.getElementById('a4-scale-container');
  const documentoPdf = document.getElementById('documento-pdf');
  const btnZoomFit = document.getElementById('btn-zoom-fit');
  const btnZoom100 = document.getElementById('btn-zoom-100');

  let modoZoomA4 = 'fit'; // 'fit' (ajustado à largura da tela) ou '100' (escala real 1:1)

  function alternarModoVisualizacaoMobile(modo) {
    if (modo === 'preview') {
      document.body.classList.remove('view-mode-form');
      document.body.classList.add('view-mode-preview');
      tabViewForm?.classList.remove('active');
      tabViewPreview?.classList.add('active');
      
      // Dupla execução com rAF e timeout curto para aguardar o reflow do display:flex
      requestAnimationFrame(() => {
        ajustarEscalaA4();
        setTimeout(ajustarEscalaA4, 60);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.classList.remove('view-mode-preview');
      document.body.classList.add('view-mode-form');
      tabViewPreview?.classList.remove('active');
      tabViewForm?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Inicializa o modo de visualização padrão
  document.body.classList.add('view-mode-form');

  tabViewForm?.addEventListener('click', () => alternarModoVisualizacaoMobile('form'));
  tabViewPreview?.addEventListener('click', () => alternarModoVisualizacaoMobile('preview'));
  btnVerPreviaMobile?.addEventListener('click', () => alternarModoVisualizacaoMobile('preview'));
  btnVoltarFormMobile?.addEventListener('click', () => alternarModoVisualizacaoMobile('form'));

  // Ações rápidas da pré-visualização no celular
  btnGerarPdfPreview?.addEventListener('click', () => {
    btnGerarPdf?.click();
  });

  btnImprimirPreview?.addEventListener('click', () => {
    btnImprimir?.click();
  });

  // Ajuste inteligente da escala da folha A4 no celular
  function ajustarEscalaA4() {
    if (!a4Wrapper || !a4ScaleContainer || !documentoPdf) return;

    if (modoZoomA4 === '100') {
      a4Wrapper.classList.remove('mode-fit-screen');
      a4Wrapper.classList.add('mode-100');

      a4ScaleContainer.style.width = '794px';
      a4ScaleContainer.style.minWidth = '794px';
      a4ScaleContainer.style.maxWidth = 'none';
      a4ScaleContainer.style.height = 'auto';
      a4ScaleContainer.style.position = 'relative';
      a4ScaleContainer.style.margin = '0 auto';
      a4ScaleContainer.style.marginBottom = '0';
      a4ScaleContainer.style.overflow = 'visible';
      a4ScaleContainer.style.borderRadius = '0';

      documentoPdf.style.transform = 'none';
      documentoPdf.style.position = 'static';
      documentoPdf.style.width = '794px';
      documentoPdf.style.minWidth = '794px';
      documentoPdf.style.maxWidth = 'none';
      documentoPdf.style.margin = '0 auto';
      return;
    }

    // Modo 'fit' (Ajustar à Tela)
    a4Wrapper.classList.add('mode-fit-screen');
    a4Wrapper.classList.remove('mode-100');
    a4Wrapper.scrollLeft = 0;
    if (window.scrollX > 0) {
      window.scrollTo({ left: 0 });
    }

    // Obter dimensões reais e disponíveis dentro do a4Wrapper
    const styleWrapper = window.getComputedStyle(a4Wrapper);
    const padLeft = parseFloat(styleWrapper.paddingLeft) || 8;
    const padRight = parseFloat(styleWrapper.paddingRight) || 8;

    // clientWidth do wrapper desconta bordas e scrollbars
    const wrapperClientWidth = a4Wrapper.clientWidth;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 360;
    // Margem de segurança de 24px em relação à tela cheia
    const maxSafeWidth = Math.max(260, viewportWidth - 24);

    let larguraDisponivel = wrapperClientWidth > 0
      ? wrapperClientWidth - (padLeft + padRight)
      : maxSafeWidth;

    larguraDisponivel = Math.min(larguraDisponivel, maxSafeWidth);
    larguraDisponivel = Math.max(260, larguraDisponivel);

    const larguraPadraoA4 = 794; // ~210mm a 96 DPI padrão do navegador
    const alturaPadraoA4 = 1123; // ~297mm a 96 DPI padrão do navegador

    const escala = Math.min(1, Math.max(0.2, larguraDisponivel / larguraPadraoA4));

    if (escala < 0.99) {
      const scaledWidth = Math.floor(larguraPadraoA4 * escala);
      const scaledHeight = Math.ceil(alturaPadraoA4 * escala);

      // O container de escala assume o tamanho visual exato, centralizado por margin: 0 auto
      a4ScaleContainer.style.width = `${scaledWidth}px`;
      a4ScaleContainer.style.minWidth = `${scaledWidth}px`;
      a4ScaleContainer.style.maxWidth = `${scaledWidth}px`;
      a4ScaleContainer.style.height = `${scaledHeight}px`;
      a4ScaleContainer.style.position = 'relative';
      a4ScaleContainer.style.margin = '0 auto';
      a4ScaleContainer.style.marginBottom = '0.75rem';
      a4ScaleContainer.style.overflow = 'hidden';
      a4ScaleContainer.style.borderRadius = '4px';

      // O documento A4 é escalado a partir de (0, 0) preenchendo exatamente o container
      documentoPdf.style.position = 'absolute';
      documentoPdf.style.top = '0';
      documentoPdf.style.left = '0';
      documentoPdf.style.width = `${larguraPadraoA4}px`;
      documentoPdf.style.minWidth = `${larguraPadraoA4}px`;
      documentoPdf.style.maxWidth = 'none';
      documentoPdf.style.transformOrigin = 'top left';
      documentoPdf.style.transform = `scale(${escala})`;
      documentoPdf.style.margin = '0';
    } else {
      // Telas desktop onde a folha cabe normalmente
      a4ScaleContainer.style.width = 'auto';
      a4ScaleContainer.style.minWidth = 'auto';
      a4ScaleContainer.style.maxWidth = 'none';
      a4ScaleContainer.style.height = 'auto';
      a4ScaleContainer.style.position = 'static';
      a4ScaleContainer.style.margin = '0 auto';
      a4ScaleContainer.style.marginBottom = '0';
      a4ScaleContainer.style.overflow = 'visible';
      a4ScaleContainer.style.borderRadius = '0';

      documentoPdf.style.transform = 'none';
      documentoPdf.style.position = 'static';
      documentoPdf.style.width = '210mm';
      documentoPdf.style.minWidth = 'auto';
      documentoPdf.style.maxWidth = 'none';
      documentoPdf.style.margin = '0 auto';
    }
  }

  // Alternância de botões de zoom na toolbar
  btnZoomFit?.addEventListener('click', () => {
    modoZoomA4 = 'fit';
    btnZoomFit.classList.add('active');
    btnZoom100?.classList.remove('active');
    ajustarEscalaA4();
    requestAnimationFrame(ajustarEscalaA4);
  });

  btnZoom100?.addEventListener('click', () => {
    modoZoomA4 = '100';
    btnZoom100.classList.add('active');
    btnZoomFit?.classList.remove('active');
    ajustarEscalaA4();
  });

  // Reajuste automático ao redimensionar ou rotacionar a tela
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ajustarEscalaA4();
    }, 80);
  });

  // Observador de mutação de dimensões no container A4
  if (window.ResizeObserver && a4Wrapper) {
    const resizeObserver = new ResizeObserver(() => {
      if (document.body.classList.contains('view-mode-preview')) {
        ajustarEscalaA4();
      }
    });
    resizeObserver.observe(a4Wrapper);
  }

  // Inicialização
  ordenarCardsRequerimento();
  if (formatters.obterDataExtenso) {
    const elDataExtenso = document.getElementById('prev-data-extenso');
    if (elDataExtenso) elDataExtenso.textContent = formatters.obterDataExtenso();
  }

  // Inicialização e Leitura de Parâmetros de URL (?tipo=insalubridade ou ?perfil=externo)
  const urlParams = new URLSearchParams(window.location.search);
  const tipoParam = urlParams.get('tipo');
  const perfilParam = urlParams.get('perfil');

  if (tipoParam && requerimentosCatalogo[tipoParam]) {
    const metaParam = requerimentosCatalogo[tipoParam];
    alternarAbaPerfil(metaParam.perfil);
    const radioAlvo = document.querySelector(`input[name="tipoRequerimento"][value="${tipoParam}"]`);
    if (radioAlvo) {
      radioAlvo.checked = true;
    }
    alternarTipo(tipoParam);
  } else if (perfilParam && (perfilParam === 'servidor' || perfilParam === 'externo')) {
    alternarAbaPerfil(perfilParam);
  } else {
    const radioInicial = document.querySelector('input[name="tipoRequerimento"]:checked');
    if (radioInicial) {
      alternarTipo(radioInicial.value);
    } else {
      alternarTipo('banco');
    }
  }

  ajustarEscalaA4();

  // Expor no objeto global
  STGP.gerarDefinicaoPdfMake = pdfTemplates.gerarDefinicaoPdfMake;
  STGP.atualizarDocumento = atualizarDocumento;
});
