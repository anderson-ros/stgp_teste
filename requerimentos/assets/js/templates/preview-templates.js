/**
 * Templates de Pré-visualização em Tempo Real (Folha A4)
 * Portal de Requerimentos STGP — FCT UNESP
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../modules/formatters'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../modules/formatters'));
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    const fmt = (root.PortalSTGP && root.PortalSTGP.formatters) || root;
    root.PortalSTGP.previewTemplates = factory(fmt);
    root.renderPreviewCorpo = root.PortalSTGP.previewTemplates.renderPreviewCorpo;
    root.renderPreviewAnexos = root.PortalSTGP.previewTemplates.renderPreviewAnexos;
  }
})(typeof self !== 'undefined' ? self : this, function (formatters) {
  'use strict';

  const formatarDataPtBr = (formatters && formatters.formatarDataPtBr) ||
    (typeof window !== 'undefined' && window.formatarDataPtBr) ||
    (d => d || '');

  /**
   * Renderiza o corpo do requerimento e a lista de anexos no espelho A4 da tela.
   * 
   * @param {string} tipo - Identificador do requerimento (ex: 'saude', 'banco', etc.)
   * @param {string} regime - Regime jurídico atual do servidor ('CLT', 'Autárquico', 'Efetivo')
   * @param {HTMLElement} corpoEl - Elemento container #doc-especificacao-corpo
   * @param {HTMLElement} anexosLista - Elemento container #doc-anexos-lista
   */
  function renderPreview(tipo, regime, corpoEl, anexosLista) {
    if (!corpoEl || !anexosLista) return;
    anexosLista.innerHTML = '';

    // Elementos específicos do Modelo 03 (Licença-Prêmio Beneficiários)
    const elBlocoDeAcordo = document.getElementById('doc-bloco-de-acordo');
    const elBlocoGp = document.getElementById('doc-bloco-gestao-pessoas');
    const elDocBoxPedido = document.querySelector('.doc-box-pedido');
    const elDocAnexosBloco = document.querySelector('.doc-anexos-bloco');
    const elDocBancoExterno = document.getElementById('doc-banco-externo');
    const elAssinaturaCargo = document.getElementById('prev-assinatura-cargo');

    if (elAssinaturaCargo && tipo !== 'licenca_premio_beneficiario') {
      elAssinaturaCargo.style.display = 'block';
    }

    if (tipo === 'licenca_premio_beneficiario') {
      if (elBlocoDeAcordo) elBlocoDeAcordo.style.display = 'block';
      if (elBlocoGp) elBlocoGp.style.display = 'block';
      if (elDocBoxPedido) elDocBoxPedido.style.display = 'none';
      if (elDocAnexosBloco) elDocAnexosBloco.style.display = 'block';
      if (elDocBancoExterno) elDocBancoExterno.style.display = 'block';
    } else {
      if (elBlocoDeAcordo) elBlocoDeAcordo.style.display = 'none';
      if (elBlocoGp) elBlocoGp.style.display = 'none';
      if (elDocBoxPedido) elDocBoxPedido.style.display = 'block';
      if (elDocAnexosBloco) elDocAnexosBloco.style.display = 'block';
      if (elDocBancoExterno) elDocBancoExterno.style.display = 'none';
    }

    const elDocA4 = document.getElementById('documento-pdf');
    if (elDocA4 && tipo !== 'licenca_premio_beneficiario') {
      elDocA4.classList.remove('lp-compacto', 'lp-muito-compacto');
    }

    if (tipo === 'contagem_tempo') {
      const orgaoOrigem = document.getElementById('contagem_orgao_origem')?.value.trim() || '[órgão/empresa de origem]';
      const tipoOrgao = document.getElementById('contagem_tipo_orgao')?.value || '';
      const complementoTipoOrgao = tipoOrgao ? ` (${tipoOrgao})` : '';
      const dataInicio = formatarDataPtBr(document.getElementById('contagem_data_inicio')?.value);
      const dataFim = formatarDataPtBr(document.getElementById('contagem_data_fim')?.value);

      const docsSelecionados = [];
      if (document.getElementById('contagem_doc_ctc_inss')?.checked) {
        docsSelecionados.push('Certidão de Tempo de Contribuição (CTC) emitida pelo INSS');
        const li = document.createElement('li');
        li.textContent = 'Certidão de Tempo de Contribuição (CTC) emitida pelo INSS.';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('contagem_doc_certidao_orgao')?.checked) {
        docsSelecionados.push('Certidão de Tempo de Serviço / Frequência emitida pelo Órgão de Origem');
        const li = document.createElement('li');
        li.textContent = 'Certidão de Tempo de Serviço / Frequência emitida pelo Órgão de Origem.';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('contagem_doc_dtci')?.checked) {
        docsSelecionados.push('Declaração de Tempo de Contribuição Intrarregime (DTCI)');
        const li = document.createElement('li');
        li.textContent = 'Declaração de Tempo de Contribuição Intrarregime (DTCI).';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('contagem_doc_outro')?.checked) {
        const outroTexto = document.getElementById('contagem_doc_outro_texto')?.value.trim() || 'Outro documento comprobatório';
        docsSelecionados.push(outroTexto);
        const li = document.createElement('li');
        li.textContent = `${outroTexto}.`;
        anexosLista.appendChild(li);
      }

      const textoDocs = docsSelecionados.length > 0
        ? docsSelecionados.join('; ')
        : '[documentos comprobatórios a serem apresentados]';

      const obs = document.getElementById('contagem_observacoes')?.value.trim();
      const blocoObs = obs ? `<p><strong>Observações / Informações Adicionais:</strong> ${obs}</p>` : '';

      corpoEl.innerHTML = `
        <p>A contagem e averbação do tempo de serviço/contribuição prestado junto ao órgão/empresa <strong>${orgaoOrigem}</strong>${complementoTipoOrgao}, no período de <strong>${dataInicio}</strong> a <strong>${dataFim}</strong>, para os fins de direito cabíveis (adicional por tempo de serviço, sexta-parte, licença-prêmio e/ou aposentadoria), conforme análise da legislação vigente.</p>
        <p>Para fins de instrução do processo, apresento em anexo os seguintes documentos comprobatórios: <em>${textoDocs}</em>.</p>
        ${blocoObs}
        <p>Declaro estar ciente de que a contagem e a produção de efeitos pecuniários dependem da conferência da autenticidade e deferimento pelo setor competente, sendo vedada a contagem concomitante ou em duplicidade.</p>
      `;

    } else if (tipo === 'saude') {
      const dias = document.getElementById('saude_dias')?.value || '0';
      const numDias = parseInt(dias, 10) || 0;
      const inicio = formatarDataPtBr(document.getElementById('saude_data_inicio')?.value);
      const fim = formatarDataPtBr(document.getElementById('saude_data_fim')?.value);
      const medicoNome = document.getElementById('saude_medico_nome')?.value.trim() || '';
      const medicoCrm = document.getElementById('saude_medico_crm')?.value.trim() || '';

      let infoMedico = '';
      if (medicoNome && medicoCrm) {
        infoMedico = `<p><strong>Profissional Assistente (Médico/Dentista):</strong> ${medicoNome} — <strong>CRM/CRO:</strong> ${medicoCrm}</p>`;
      } else if (medicoNome) {
        infoMedico = `<p><strong>Profissional Assistente (Médico/Dentista):</strong> ${medicoNome}</p>`;
      } else if (medicoCrm) {
        infoMedico = `<p><strong>CRM/CRO do Profissional Assistente:</strong> ${medicoCrm}</p>`;
      }

      if (regime === 'CLT') {
        if (numDias <= 15) {
          corpoEl.innerHTML = `
            <p>A concessão de <strong>LICENÇA PARA TRATAMENTO DE SAÚDE</strong> (regime Celetista - CLT), pelo período de <strong>${dias} dia(s)</strong>, com início em <strong>${inicio}</strong> e término previsto em <strong>${fim}</strong>, com pagamento integral dos correspondentes salários sob a responsabilidade da UNESP, nos termos da <strong>Consolidação das Leis do Trabalho (CLT)</strong>, do <strong>Ofício Circular nº 31/2008 - PRAd</strong> e do <strong>Ofício Circular nº 10/2005 - CRH/PRAd</strong>.</p>
            <p>Declaro estar ciente da obrigatoriedade de apresentação do atestado médico à Área de Gestão de Pessoas no prazo de até <strong>24 horas úteis</strong> (primeiro dia útil subsequente à emissão), dispensada a perícia médica previdenciária por tratar-se de período igual ou inferior a 15 dias.</p>
            ${infoMedico}
          `;
          const li = document.createElement('li');
          li.textContent = 'Atestado Médico original ou cópia digital emitido por profissional assistente com CRM/CRO legível (sem obrigatoriedade de código CID).';
          anexosLista.appendChild(li);
        } else {
          let notaExameRetorno = '';
          if (numDias >= 30) {
            notaExameRetorno = ' Outrossim, declaro ciência de que, por tratar-se de ausência igual ou superior a 30 dias consecutivos, deverei realizar o obrigatório Exame Médico de Retorno junto à Seção Técnica de Saúde no primeiro dia de regresso à atividade (NR-7).';
          }
          corpoEl.innerHTML = `
            <p>A concessão de <strong>LICENÇA PARA TRATAMENTO DE SAÚDE / ENCAMINHAMENTO AO INSS</strong> (regime Celetista - CLT), pelo período de <strong>${dias} dia(s)</strong>, com início em <strong>${inicio}</strong> e término previsto em <strong>${fim}</strong>, com fundamento na <strong>Consolidação das Leis do Trabalho (CLT)</strong>, nos <strong>Artigos 59 e 60 da Lei Federal nº 8.213/1991</strong>, no <strong>Decreto Federal nº 3.048/1999</strong> e no <strong>Ofício Circular nº 31/2008 - PRAd</strong>.</p>
            <p>Declaro ciência de que os primeiros 15 (quinze) dias de afastamento serão pagos pela UNESP e que, a contar do 16º dia, serei encaminhado(a) à perícia médica da Previdência Social (INSS) para concessão e pagamento do <strong>Auxílio por Incapacidade Temporária</strong> (antigo auxílio-doença), ficando suspenso o contrato de trabalho a partir de então.${notaExameRetorno}</p>
            ${infoMedico}
          `;
          const li1 = document.createElement('li');
          li1.textContent = 'Atestado Médico original ou cópia digital emitido por profissional assistente com indicação legível do período de dispensa.';
          anexosLista.appendChild(li1);
          const li2 = document.createElement('li');
          li2.textContent = 'Documentação médica comprobatória para apresentação na perícia médica do INSS / Comunicação de Decisão do INSS.';
          anexosLista.appendChild(li2);
        }
      } else {
        // Servidor Estatutário (Autárquico / Efetivo) - Não necessita requerimento
        corpoEl.innerHTML = `
          <div style="background-color: #fefce8; border: 2px dashed #ca8a04; padding: 14px 16px; border-radius: 6px; color: #713f12; line-height: 1.45; font-size: 0.92rem;">
            <p style="margin-top: 0; margin-bottom: 8px; font-weight: 700; color: #854d0e; font-size: 0.98rem; text-align: center;">
              📢 ORIENTAÇÃO OFICIAL: DISPENSA DE REQUERIMENTO PARA SERVIDORES ESTATUTÁRIOS
            </p>
            <p style="margin-bottom: 6px;">Conforme as diretrizes institucionais da UNESP e da legislação estadual aplicável, o(a) servidor(a) público(a) estatutário(a) <strong>não precisa apresentar requerimento junto com os atestados médicos</strong>:</p>
            <p style="margin-bottom: 6px;"><strong>1. Falta médica de apenas 1 dia de ausência:</strong> limitada a 1 por mês e 6 por ano. O pedido é feito <strong>diretamente via SisRH (<a href="https://sistemas.unesp.br/rh/" target="_blank" style="color: #1e3a8a; text-decoration: underline;">https://sistemas.unesp.br/rh/</a>)</strong>, que já está preparado para esse lançamento diretamente por lá, <u>sendo desnecessária a apresentação de requerimento</u>.</p>
            <p style="margin-bottom: 6px;"><strong>2. Atestados de 2 ou mais dias:</strong> são entregues diretamente na STGP no prazo legal de até um dia útil. Para cumprir esse prazo, os estatutários podem digitalizar e enviar pelos canais oficiais:</p>
            <p style="text-align: center; font-weight: 600; margin: 8px 0; background: rgba(255,255,255,0.7); padding: 6px 10px; border-radius: 4px;">
              📱 <strong>WhatsApp STGP:</strong> (18) 3229-5452 / (18) 3229-5454 / (18) 3229-5453<br>
              ✉️ <strong>E-mail STGP:</strong> rh.fct@unesp.br
            </p>
            <div style="margin-top: 8px; margin-bottom: 8px; padding: 6px 10px; background: #fef08a; border-left: 3px solid #ca8a04; border-radius: 4px; font-size: 0.83rem; color: #854d0e;">
              <strong>⚠️ Apresentação do Documento Original:</strong> O envio do atestado via WhatsApp ou e-mail <strong>NÃO dispensa a apresentação posterior do documento original</strong> na STGP. Ficam dispensados da apresentação do original <u>apenas os atestados médicos emitidos com assinatura digital válida, enviados em formato PDF</u>.
            </div>
            <p style="margin-bottom: 0; font-style: italic; text-align: center; color: #854d0e; font-size: 0.85rem;">
              * O requerimento formal de Licença para Tratamento de Saúde destina-se <u>exclusivamente a servidores celetistas (CLT)</u>.
            </p>
          </div>
        `;
        const li = document.createElement('li');
        li.textContent = 'Dispensada a apresentação de requerimento para servidores estatutários (Efetivo / Autárquico).';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'gestante_antes') {
      const inicio = formatarDataPtBr(document.getElementById('gestante_antes_inicio')?.value);
      const dpp = formatarDataPtBr(document.getElementById('gestante_antes_dpp')?.value);
      const medicoNome = document.getElementById('gestante_antes_medico_nome')?.value.trim() || '';
      const medicoCrm = document.getElementById('gestante_antes_medico_crm')?.value.trim() || '';
      const anexoMarcado = document.getElementById('gestante_antes_anexo')?.checked;

      let infoMedico = '';
      if (medicoNome && medicoCrm) {
        infoMedico = `<p><strong>Médico(a) Assistente:</strong> ${medicoNome} — CRM: ${medicoCrm}</p>`;
      } else if (medicoNome) {
        infoMedico = `<p><strong>Médico(a) Assistente:</strong> ${medicoNome}</p>`;
      } else if (medicoCrm) {
        infoMedico = `<p><strong>CRM do(a) Médico(a) Assistente:</strong> ${medicoCrm}</p>`;
      }

      let justificativaGestacao = 'em decorrência de encontrar-me a partir da <strong>32ª semana de gestação</strong> ou por recomendação médica expressa';
      let textoProrrogacaoAntes = `<p>Requeiro, outrossim, a <strong>ampliação da LICENÇA GESTANTE/MATERNIDADE para 180 (cento e oitenta) dias</strong>, fundamentada na <strong>Lei Complementar Estadual nº 1.054, de 7 de julho de 2008</strong> (que alterou o Artigo 198 da Lei nº 10.261/1968 - Estatuto dos Funcionários Públicos Civis do Estado de São Paulo).</p>`;

      if (regime === 'CLT') {
        justificativaGestacao = 'em decorrência de encontrar-me a partir de <strong>28 dias antes da data provável do parto (ou 8º mês)</strong> ou por recomendação médica expressa';
        textoProrrogacaoAntes = `<p>Requeiro, outrossim, a <strong>extensão da LICENÇA GESTANTE/MATERNIDADE para 180 (cento e oitenta) dias</strong>, regulamentada na UNESP pelo <strong>Ofício Circular nº 16/2008 - PRAd</strong> (120 dias via INSS + 60 dias custeados pela UNESP).</p>`;
      }

      corpoEl.innerHTML = `
        <p>A concessão de <strong>LICENÇA GESTANTE/MATERNIDADE</strong>, com início a partir de <strong>${inicio}</strong>, ${justificativaGestacao}, sendo a <strong>Data Prevista para o Parto (DPP)</strong> fixada em <strong>${dpp}</strong>.</p>
        ${textoProrrogacaoAntes}
        ${infoMedico}
      `;

      if (anexoMarcado) {
        const li = document.createElement('li');
        li.textContent = 'Atestado/Laudo Médico com a indicação da idade gestacional e Data Provável do Parto (DPP).';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'gestante_apos') {
      const parto = formatarDataPtBr(document.getElementById('gestante_apos_nascimento')?.value);
      const nomeCrianca = document.getElementById('gestante_apos_nome_crianca')?.value.trim() || '[Nome da Criança]';
      const anexoMarcado = document.getElementById('gestante_apos_anexo')?.checked;

      let textoProrrogacaoApos = '';
      if (regime === 'CLT') {
        textoProrrogacaoApos = `<p>Requeiro, outrossim, a <strong>extensão da LICENÇA GESTANTE/MATERNIDADE para 180 (cento e oitenta) dias</strong>, regulamentada na UNESP pelo <strong>Ofício Circular nº 16/2008 - PRAd</strong> (120 dias via INSS + 60 dias custeados pela UNESP).</p>`;
      } else {
        textoProrrogacaoApos = `<p>Requeiro, com base na legislação vigente, a <strong>ampliação da LICENÇA GESTANTE/MATERNIDADE para 180 (cento e oitenta) dias</strong> (totalizando o período ininterrupto de afastamento remunerado), fundamentada na <strong>Lei Complementar Estadual nº 1.054, de 7 de julho de 2008</strong> (que alterou o Artigo 198 da Lei nº 10.261/1968 - Estatuto dos Funcionários Públicos Civis do Estado de São Paulo).</p>`;
      }

      corpoEl.innerHTML = `
        <p>A concessão de <strong>LICENÇA GESTANTE/MATERNIDADE</strong>, a contar de <strong>${parto}</strong>, data em que ocorreu o nascimento de meu(minha) filho(a) <strong>${nomeCrianca}</strong>, conforme Certidão de Nascimento anexa.</p>
        ${textoProrrogacaoApos}
      `;

      if (anexoMarcado) {
        const li = document.createElement('li');
        li.textContent = 'Cópia legível da Certidão de Nascimento do(a) filho(a).';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'banco') {
      const tipoConta = document.getElementById('banco_tipo_conta')?.value || 'Conta Corrente';
      const agencia = document.getElementById('banco_agencia')?.value.trim() || '[Agência com Dígito]';
      const conta = document.getElementById('banco_conta')?.value.trim() || '[Conta com Dígito]';
      const anexoMarcado = document.getElementById('banco_anexo_comprovante')?.checked;

      corpoEl.innerHTML = `
        <p>A <strong>ALTERAÇÃO DE DADOS BANCÁRIOS</strong> para fins de crédito e pagamento de meus vencimentos, salários, proventos e demais vantagens pecuniárias decorrentes de meu vínculo funcional junto à UNESP, solicitando que os depósitos passem a ser efetuados na conta de minha exclusiva titularidade mantida junto ao <strong>Banco do Brasil (001)</strong>, com vigência imediata ou conforme o cronograma de fechamento da folha de pagamento, conforme as especificações a seguir:</p>
        <p style="margin-left: 1.5rem; line-height: 1.6;">
          • <strong>Instituição Bancária:</strong> Banco do Brasil (001)<br>
          • <strong>Tipo de Conta:</strong> ${tipoConta}<br>
          • <strong>Agência:</strong> ${agencia}<br>
          • <strong>Conta:</strong> ${conta}
        </p>
        <p>Declaro, outrossim, sob as penas da lei, que sou o(a) legítimo(a) e exclusivo(a) titular da referida conta bancária, responsabilizando-me pela veracidade e exatidão das informações prestadas.</p>
      `;

      if (anexoMarcado) {
        const li = document.createElement('li');
        li.textContent = 'Comprovante dos dados bancários e titularidade da conta (extrato bancário, cópia do cartão ou comprovante emitido pelo Banco do Brasil).';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'isencao_ir') {
      corpoEl.innerHTML = `
        <p>A <strong>ISENÇÃO DO IMPOSTO DE RENDA RETIDO NA FONTE (IRRF)</strong> incidente sobre os proventos de minha <strong>aposentadoria</strong>, por ser portador(a) de moléstia grave especificada em lei, com fundamento no <strong>Artigo 6º, inciso XIV, da Lei Federal nº 7.713, de 22 de dezembro de 1988</strong> (com as alterações das Leis nº 8.541/1992 e nº 11.052/2004), no <strong>Artigo 30 da Lei Federal nº 9.250/1995</strong> e na <strong>Instrução Normativa RFB nº 1.500/2014</strong>.</p>
        <p>Para fins de comprovação da patologia e em estrita observância ao <strong>sigilo médico</strong>, a documentação clínica comprobatória será apresentada diretamente à <strong>perícia em saúde da UNESP</strong> no momento da avaliação pericial. Para tanto, solicito o devido agendamento e encaminhamento.</p>
        <p>Declaro estar ciente de que a presente isenção tributária restringe-se exclusivamente aos proventos de aposentadoria e pensão, responsabilizando-me pela veracidade e exatidão das informações prestadas.</p>
      `;

      if (document.getElementById('ir_anexo_documento')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia legível de documento oficial de identificação com foto e CPF (RG / CPF / CNH / CIN) do(a) servidor(a) aposentado(a).';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('ir_anexo_aposentadoria')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia legível da publicação da aposentadoria no DOE.';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'insalubridade') {
      const motivo = document.getElementById('insalubridade_motivo')?.value || 'Pedido inicial';
      const dataInicio = formatarDataPtBr(document.getElementById('insalubridade_data_inicio')?.value);
      const localTrab = document.getElementById('insalubridade_local')?.value.trim() || '[Local/Ambiente Específico de Trabalho]';

      corpoEl.innerHTML = `
        <p>A concessão ou revisão de <strong>ADICIONAL DE INSALUBRIDADE</strong>, com fulcro nos <strong>Artigos 189 e 192 da Consolidação das Leis do Trabalho (CLT)</strong>, na <strong>Norma Regulamentadora nº 15 (NR-15)</strong> do Ministério do Trabalho e Emprego, e na <strong>Portaria UNESP nº 490/2015, com redação alterada pela Portaria UNESP nº 86/2026</strong>, para fins de encaminhamento à avaliação pericial da <strong>Coordenadoria de Saúde da UNESP (CSUNESP)</strong>, conforme as especificações a seguir:</p>
        <p style="margin-left: 1.2rem; line-height: 1.5;">
          • <strong>Motivo da Solicitação:</strong> ${motivo}<br>
          • <strong>Início do Exercício na Atividade/Local Insalubre:</strong> ${dataInicio}<br>
          • <strong>Local / Ambiente Específico de Atuação:</strong> ${localTrab}
        </p>
        <p>Requeiro que, após a avaliação e homologação do laudo técnico pericial pela CSUNESP, os correspondentes <strong>efeitos pecuniários sejam apurados com retroatividade à data de início do efetivo exercício na atividade ou local insalubre (${dataInicio})</strong>, nos termos do Artigo 2º da Portaria UNESP nº 490/2015, com redação dada pela <strong>Portaria UNESP nº 86/2026</strong>.</p>
        <p>Declaro estar ciente de que o adicional de insalubridade e o adicional de periculosidade não são acumuláveis (Artigo 193, § 2º da CLT), responsabilizando-me pela veracidade das informações prestadas.</p>
      `;

      if (document.getElementById('insalubridade_anexo_rol')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Rol de Atividades do(a) servidor(a), devidamente preenchido e assinado.';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('insalubridade_anexo_riscos')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Formulário de Reconhecimento dos Riscos Ambientais no Trabalho, preenchido, datado, assinado e carimbado conjuntamente com o(a) superior imediato(a).';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('insalubridade_anexo_laudo_ant')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia do Laudo Técnico Pericial anterior (pedido de revisão de grau de insalubridade).';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('insalubridade_anexo_opcao')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Termo de Opção entre Adicional de Insalubridade e Periculosidade (Artigo 193, § 2º da CLT).';
        anexosLista.appendChild(li);
      }

    } else if (tipo === 'auxilio_funeral') {
      const falecidoNome = document.getElementById('funeral_falecido_nome')?.value.trim() || '[Nome do(a) Servidor(a) Falecido(a)]';
      const falecidoData = formatarDataPtBr(document.getElementById('funeral_falecido_data')?.value);
      const temBB = document.querySelector('input[name="funeral_tem_bb"]:checked')?.value === 'sim';
      const agencia = document.getElementById('funeral_agencia')?.value.trim() || '[Agência com Dígito]';
      const conta = document.getElementById('funeral_conta')?.value.trim() || '[Conta Corrente com Dígito]';
      const extVinculo = document.getElementById('ext_vinculo')?.value || '';
      const isConjuge = extVinculo === 'Cônjuge' || extVinculo === 'Companheiro(a) em união estável';
      const anexoAlvara = document.getElementById('funeral_anexo_alvara')?.checked;
      const anexoNf = document.getElementById('funeral_anexo_nf')?.checked;

      let textoComprovacaoDespesa = '';
      if (isConjuge) {
        textoComprovacaoDespesa = `<p>Declaro que, na qualidade de <strong>${extVinculo}</strong> do(a) servidor(a) falecido(a), encontro-me <strong>dispensado(a) da comprovação da despesa de funeral</strong>, na conformidade expressa do <strong>Parágrafo único do Artigo 2º da Portaria UNESP nº 281/1997</strong>, fazendo a juntada da respectiva Certidão de Casamento ou Comprovação de União Estável.</p>`;
      } else if (anexoAlvara) {
        textoComprovacaoDespesa = `<p>Declaro que, tendo as despesas fúnebres sido custeadas por terceiros em virtude da contratação de plano funerário, apresento em anexo o competente <strong>Alvará Judicial</strong> para fins de liberação e pagamento do benefício, na conformidade da Portaria UNESP nº 281/1997.</p>`;
      } else if (anexoNf) {
        textoComprovacaoDespesa = `<p>Declaro que as despesas com o funeral e sepultamento foram realizadas a minhas expensas, razão pela qual procedo à juntada dos respectivos comprovantes e notas fiscais/recibos fúnebres originais emitidos em meu nome, nos termos do Artigo 95 do ESUNESP e Artigo 2º da Portaria UNESP nº 281/1997.</p>`;
      }

      let textoPagamento = '';
      if (temBB) {
        textoPagamento = `
          <p>Solicito que o respectivo pagamento, se deferido, seja creditado em minha conta corrente mantida junto ao <strong>Banco do Brasil (001)</strong>: Agência <strong>${agencia}</strong>, Conta Corrente <strong>${conta}</strong> (titularidade exclusiva do(a) requerente).</p>
        `;
      } else {
        textoPagamento = `
          <p><strong>Forma de Pagamento (Cheque Nominal):</strong> Declaro ciência de que, por não possuir conta corrente no Banco do Brasil, o pagamento do auxílio, se deferido, será efetuado por meio de cheque nominal a ser retirado presencialmente na Seção Técnica de Finanças da FCT UNESP.</p>
        `;
      }

      corpoEl.innerHTML = `
        <p>A concessão e o pagamento de <strong>AUXÍLIO FUNERAL</strong>, benefício assistencial correspondente a <strong>1 (um) mês da respectiva remuneração ou provento</strong> a que fazia jus o(a) servidor(a) público(a) estatutário(a) da UNESP <strong>${falecidoNome}</strong>, falecido(a) em <strong>${falecidoData}</strong>, com fundamento no <strong>Artigo 95 do Estatuto dos Servidores da UNESP (ESUNESP)</strong>, no <strong>Artigo 168 da Lei Estadual nº 10.261/1968</strong> e na <strong>Portaria UNESP nº 281, de 17 de outubro de 1997</strong>.</p>
        ${textoComprovacaoDespesa}
        ${textoPagamento}
        <p>Declaro, outrossim, sob as penas da lei, serem autênticas e verdadeiras todas as declarações e documentos comprobatórios ora acostados ao presente requerimento.</p>
      `;

      if (document.getElementById('funeral_anexo_certidao')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia legível da Certidão de Óbito do(a) servidor(a) falecido(a).';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('funeral_anexo_documento')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia legível de documento oficial de identificação com foto e CPF (RG / CPF / CNH / CIN) do(a) requerente.';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('funeral_anexo_casamento')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Cópia da Certidão de Casamento ou Declaração/Escritura de União Estável.';
        anexosLista.appendChild(li);
      }
      if (document.getElementById('funeral_anexo_nf')?.checked) {
        const li = document.createElement('li');
        li.textContent = 'Comprovante das despesas de funeral (notas fiscais/recibos originais emitidos expressamente em nome do(a) requerente).';
        anexosLista.appendChild(li);
      }
      if (anexoAlvara) {
        const li = document.createElement('li');
        li.textContent = 'Alvará Judicial para liberação do benefício decorrente de plano funerário.';
        anexosLista.appendChild(li);
      }
      if (temBB && agencia !== '[Agência com Dígito]' && conta !== '[Conta Corrente com Dígito]') {
        const li = document.createElement('li');
        li.textContent = 'Comprovante dos dados da conta corrente no Banco do Brasil em nome do(a) requerente.';
        anexosLista.appendChild(li);
      }
    } else if (tipo === 'licenca_premio_beneficiario') {
      const elQualifExterno = document.getElementById('doc-qualificacao-externo');
      const elDocQualifServidor = document.getElementById('doc-qualificacao-servidor');

      if (elDocQualifServidor) elDocQualifServidor.style.display = 'none';
      if (elQualifExterno) elQualifExterno.style.display = 'block';

      // Dados do Requerente (Beneficiário)
      const reqNome = document.getElementById('ext_nome')?.value.trim() || '[Nome do(a) Beneficiário(a)]';
      const reqCpf = (formatters.formatarCPFParaDocumento && formatters.formatarCPFParaDocumento(document.getElementById('ext_cpf')?.value)) || '[000.000.000-00]';
      const falecidoNome = document.getElementById('lp_falecido_nome')?.value.trim() || '[Nome do(a) Ex-Servidor(a)]';
      const falecidoData = formatarDataPtBr(document.getElementById('lp_falecido_data')?.value) || '[Data do Óbito]';

      // Coleta dos blocos de Licença-Prêmio cadastrados
      const containerBlocos = document.getElementById('lp-blocos-container');
      const cards = containerBlocos ? Array.from(containerBlocos.querySelectorAll('.lp-bloco-card')) : [];
      const blocos = [];

      cards.forEach(card => {
        const dias = card.querySelector('.lp-input-dias')?.value.trim() || '';
        const extenso = card.querySelector('.lp-input-extenso')?.value.trim() || '';
        const inicio = card.querySelector('.lp-input-inicio')?.value || '';
        const fim = card.querySelector('.lp-input-fim')?.value || '';
        const doe = card.querySelector('.lp-input-doe')?.value.trim() || '';

        if (dias || inicio || fim || doe) {
          blocos.push({ dias, extenso, inicio, fim, doe });
        }
      });

      // Calibração responsiva da folha A4 em função da quantidade de blocos
      const elDocA4LP = document.getElementById('documento-pdf');
      if (elDocA4LP) {
        elDocA4LP.classList.toggle('lp-compacto', blocos.length >= 4);
        elDocA4LP.classList.toggle('lp-muito-compacto', blocos.length >= 6);
      }

      // Renderizar linhas no Quadro de Gestão de Pessoas
      const elGpLinhas = document.getElementById('doc-gp-linhas');
      if (elGpLinhas) {
        elGpLinhas.innerHTML = '';
        if (blocos.length === 0) {
          const div = document.createElement('div');
          div.className = 'doc-gp-linha-item';
          div.textContent = '• (número de dias) (escrever número de dias por extenso) dias – concessão D.O.E. de ___/___/___;';
          elGpLinhas.appendChild(div);
        } else {
          blocos.forEach(b => {
            const linhaFormatada = (formatters.formatarLinhaBlocoLP)
              ? formatters.formatarLinhaBlocoLP(b.dias, b.extenso, b.inicio, b.fim, b.doe)
              : `${b.dias} (${b.extenso}) dias correspondentes ao período aquisitivo de ${formatarDataPtBr(b.inicio)} a ${formatarDataPtBr(b.fim)}, conforme Portaria publicada no DOE de ${b.doe};`;
            const div = document.createElement('div');
            div.className = 'doc-gp-linha-item';
            div.textContent = `• ${linhaFormatada}`;
            elGpLinhas.appendChild(div);
          });
        }
      }

      // Montar o parágrafo de requisição superior
      let textoPedidoIndenizacao = '';
      if (blocos.length === 0) {
        textoPedidoIndenizacao = `indenização <strong>____ dias</strong> de licença-prêmio, correspondente ao período de <strong>(início do bloco)</strong> a <strong>(término do bloco)</strong>, conforme Portaria publicada no D.O.E. de <strong>____/____/____</strong>, não usufruídos pelo “de cujus”.`;
      } else {
        // Total de dias acumulado de todos os blocos
        let somaDias = 0;
        let temDiasValidos = false;
        blocos.forEach(b => {
          const val = parseInt(b.dias, 10);
          if (!isNaN(val) && val > 0) {
            somaDias += val;
            temDiasValidos = true;
          }
        });

        let diasFormatados = '';
        if (temDiasValidos && somaDias > 0) {
          const extSoma = (formatters.numeroPorExtenso) ? formatters.numeroPorExtenso(somaDias) : '';
          diasFormatados = `<strong>${somaDias}${extSoma ? ` (${extSoma})` : ''} dias</strong>`;
        } else {
          diasFormatados = '<strong>____ dias</strong>';
        }

        // Prefixo: no singular para 1 bloco, no plural ("aos períodos") para 2 ou mais blocos
        const prefixoPeriodo = (blocos.length > 1) ? 'correspondente aos períodos de' : 'correspondente ao período de';

        // Informação de cada bloco de licença-prêmio, separados por ponto e vírgula (;) se houver mais de um bloco
        const listaTrechos = blocos.map(b => {
          const ini = b.inicio ? formatarDataPtBr(b.inicio) : '(início do bloco)';
          const fim = b.fim ? formatarDataPtBr(b.fim) : '(término do bloco)';
          let doe = b.doe ? b.doe.trim() : '';
          if (doe.toLowerCase().startsWith('doe de ')) doe = doe.slice(7).trim();
          else if (doe.toLowerCase().startsWith('d.o.e. de ')) doe = doe.slice(10).trim();
          if (doe && !doe.includes('/') && doe.length === 10 && doe.includes('-')) {
            doe = formatarDataPtBr(doe);
          }
          const doeFormatado = doe || '____/____/____';

          return `<strong>${ini}</strong> a <strong>${fim}</strong>, conforme Portaria publicada no D.O.E. de <strong>${doeFormatado}</strong>`;
        });

        const trechoPeriodos = `${prefixoPeriodo} ${listaTrechos.join('; ')}`;
        textoPedidoIndenizacao = `indenização de ${diasFormatados} de licença-prêmio, ${trechoPeriodos}, não usufruídos pelo “de cujus”.`;
      }

      if (elQualifExterno) {
        elQualifExterno.innerHTML = `
          <strong class="doc-val">${reqNome}</strong>, inscrito(a) no CPF sob o nº <strong class="doc-val">${reqCpf}</strong>, Beneficiário(a) de <strong class="doc-val">${falecidoNome}</strong>, ex-servidor(a) falecido(a) em <strong class="doc-val">${falecidoData}</strong>, vem requerer a Vossa Senhoria, ${textoPedidoIndenizacao}
        `;
      }

      // Dados Bancários do(a) Requerente para Pagamento
      const temBB = document.querySelector('input[name="lp_tem_bb"]:checked')?.value === 'sim';
      const lpTipoConta = document.getElementById('lp_tipo_conta')?.value || 'Conta Corrente';
      const lpAgencia = document.getElementById('lp_agencia')?.value.trim() || '[Agência com Dígito]';
      const lpConta = document.getElementById('lp_conta')?.value.trim() || '[Conta com Dígito]';

      if (elDocBancoExterno) {
        if (temBB) {
          elDocBancoExterno.style.display = 'block';
          elDocBancoExterno.innerHTML = `Solicito que o respectivo pagamento, se deferido, seja creditado em minha <strong>${lpTipoConta.toLowerCase()}</strong> mantida junto ao <strong>Banco do Brasil (001)</strong>: Agência <strong>${lpAgencia}</strong>, ${lpTipoConta} <strong>${lpConta}</strong> (titularidade exclusiva do(a) requerente).`;
        } else {
          elDocBancoExterno.style.display = 'none';
          elDocBancoExterno.innerHTML = '';
        }
      }

      // Documentos Comprobatórios Anexos
      const anexosTemp = [];
      if (document.getElementById('lp_anexo_identidade')?.checked) {
        anexosTemp.push('Cópia de documento de identidade (RG com CPF / CIN / CNH)');
      }
      if (document.getElementById('lp_anexo_obito')?.checked) {
        anexosTemp.push('Cópia da certidão de óbito do servidor falecido');
      }
      if (document.getElementById('lp_anexo_alvara')?.checked) {
        anexosTemp.push('Alvará Judicial, Escritura Pública de Inventário/Adjudicação, Formal de Partilha ou documento jurídico equivalente que conceda poderes específicos ao(s) beneficiário(s) para o recebimento da indenização da licença-prêmio não usufruída pelo(a) ex-servidor(a)');
      }
      if (temBB && document.getElementById('lp_anexo_banco')?.checked) {
        anexosTemp.push(`Comprovante dos dados da ${lpTipoConta.toLowerCase()} no Banco do Brasil em nome do(a) requerente`);
      }

      anexosTemp.forEach((texto, idx) => {
        const li = document.createElement('li');
        const pontuacao = (idx === anexosTemp.length - 1) ? '.' : ';';
        li.textContent = `${texto}${pontuacao}`;
        anexosLista.appendChild(li);
      });

      if (elDocAnexosBloco) {
        elDocAnexosBloco.style.display = (anexosLista.children.length > 0) ? 'block' : 'none';
      }

      // Assinatura
      const prevAssinaturaNome = document.getElementById('prev-assinatura-nome');
      const prevAssinaturaCargo = document.getElementById('prev-assinatura-cargo');
      const prevAssinaturaContato = document.getElementById('prev-assinatura-contato');
      const prevAssinaturaTelefone = document.getElementById('prev-assinatura-telefone');
      const prevAssinaturaEmail = document.getElementById('prev-assinatura-email');

      if (prevAssinaturaNome) prevAssinaturaNome.textContent = reqNome;
      if (prevAssinaturaCargo) {
        prevAssinaturaCargo.textContent = '';
        prevAssinaturaCargo.style.display = 'none';
      }

      const extTelefone = document.getElementById('ext_telefone')?.value.trim();
      const extEmail = document.getElementById('ext_email')?.value.trim();

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
    } else {
      const prevAssinaturaContato = document.getElementById('prev-assinatura-contato');
      if (prevAssinaturaContato) prevAssinaturaContato.style.display = 'none';
    }

    if (anexosLista.children.length === 0 && tipo !== 'licenca_premio_beneficiario') {
      const li = document.createElement('li');
      li.textContent = 'Nenhum anexo adicional declarado.';
      anexosLista.appendChild(li);
    }
  }

  return {
    renderPreview
  };
});
