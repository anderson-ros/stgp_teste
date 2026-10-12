/**
 * Templates e Engine do pdfMake para Geração de PDF Vetorial
 * Portal de Requerimentos STGP — FCT UNESP
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.pdfTemplates = factory();
    root.extrairInlines = root.PortalSTGP.pdfTemplates.extrairInlines;
    root.extrairBlocoCorpo = root.PortalSTGP.pdfTemplates.extrairBlocoCorpo;
    root.gerarDefinicaoPdfMake = root.PortalSTGP.pdfTemplates.gerarDefinicaoPdfMake;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Extrai nós de texto com estilos em linha (bold, italic, underline, link) para o pdfMake.
   * @param {HTMLElement} element 
   * @returns {Array} Array de inlines do pdfMake
   */
  function extrairInlines(element) {
    const inlines = [];

    function processarNode(node, format = {}) {
      if (node.nodeType === Node.TEXT_NODE) {
        let txt = node.textContent.replace(/[\r\n\t]+/g, ' ');
        txt = txt.replace(/ {2,}/g, ' ');

        // Ignora nós iniciais que contêm apenas espaços em branco
        if (inlines.length === 0 && txt.trim() === '') {
          return;
        }

        if (txt.length > 0) {
          // Se o texto começa com pontuação (vírgula, ponto e vírgula, ponto, etc.),
          // anexa essa pontuação ao final do texto inline imediatamente anterior.
          // Isso evita que o pdfMake trate a pontuação como um token de palavra isolada
          // e insira um espaço esticado antes dela ao justificar as linhas do documento.
          const pontuacaoMatch = txt.match(/^\s*([,;.:!?\)]+)([\s\S]*)$/);
          if (pontuacaoMatch && inlines.length > 0) {
            const pontuacao = pontuacaoMatch[1];
            let resto = pontuacaoMatch[2];

            // Anexa a pontuação ao último inline que possua texto válido
            for (let i = inlines.length - 1; i >= 0; i--) {
              if (inlines[i].text && inlines[i].text.trim().length > 0) {
                inlines[i].text = inlines[i].text.trimEnd() + pontuacao;
                break;
              }
            }

            // Normaliza o restante do texto após a pontuação
            if (resto.length > 0) {
              txt = resto.startsWith(' ') ? resto : (' ' + resto);
            } else {
              txt = '';
            }
          }

          if (inlines.length > 0 && txt.length > 0) {
            const ultimo = inlines[inlines.length - 1];
            if (ultimo.text && ultimo.text.endsWith(' ') && txt.startsWith(' ')) {
              txt = txt.slice(1);
            }
          }

          if (txt.length > 0) {
            inlines.push({ text: txt, ...format });
          }
        }
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.style && node.style.display === 'none') return;

        const tag = node.tagName.toLowerCase();
        const novoFormat = { ...format };

        if (tag === 'strong' || tag === 'b') novoFormat.bold = true;
        if (tag === 'em' || tag === 'i') novoFormat.italics = true;
        if (tag === 'u') novoFormat.decoration = 'underline';
        if (tag === 'br') {
          inlines.push({ text: '\n' });
          return;
        }
        if (tag === 'a') {
          novoFormat.link = node.getAttribute('href');
          novoFormat.color = '#1e3a8a';
          novoFormat.decoration = 'underline';
        }

        node.childNodes.forEach(child => processarNode(child, novoFormat));
      }
    }

    element.childNodes.forEach(child => processarNode(child));

    // Limpeza final de espaços redundantes nas pontas dos inlines
    if (inlines.length > 0 && inlines[0].text === ' ') {
      inlines.shift();
    }
    if (inlines.length > 0) {
      const ultimo = inlines[inlines.length - 1];
      if (ultimo.text && ultimo.text.endsWith(' ')) {
        ultimo.text = ultimo.text.trimEnd();
      }
    }

    return inlines;
  }

  /**
   * Extrai parágrafos, tabelas e caixas destacadas do corpo do pedido para o pdfMake.
   * @param {HTMLElement} container 
   * @param {Object} cfg 
   * @returns {Array} Array de blocos estruturados do pdfMake
   */
  function extrairBlocoCorpo(container, cfg) {
    const itens = [];

    Array.from(container.children).forEach(el => {
      if (el.style && el.style.display === 'none') return;

      const tag = el.tagName.toLowerCase();

      if (tag === 'p') {
        const inlines = extrairInlines(el);
        if (inlines.length === 0) return;

        const styleAttr = el.getAttribute('style') || '';
        const isCenter = styleAttr.includes('text-align: center') || styleAttr.includes('text-align:center');
        const hasMarginLeft = styleAttr.includes('margin-left');

        itens.push({
          text: inlines,
          alignment: isCenter ? 'center' : 'justify',
          lineHeight: cfg.lineHeight,
          fontSize: cfg.boxFontSize || cfg.fontSize,
          margin: hasMarginLeft ? [16, 2, 0, 3] : [0, 0, 0, 3]
        });
      } else if (tag === 'div') {
        const subItens = extrairBlocoCorpo(el, cfg);
        const isDestacado = el.style && (el.style.border || el.style.backgroundColor);
        if (isDestacado) {
          itens.push({
            table: {
              widths: ['*'],
              body: [[{ stack: subItens, fillColor: '#fefce8', margin: [8, 6, 8, 6] }]]
            },
            layout: {
              hLineWidth: () => 0.75,
              vLineWidth: () => 0.75,
              hLineColor: () => '#ca8a04',
              vLineColor: () => '#ca8a04'
            },
            margin: [0, 4, 0, 6]
          });
        } else {
          itens.push(...subItens);
        }
      } else if (tag === 'ul') {
        const lis = Array.from(el.querySelectorAll('li')).map(li => ({
          text: extrairInlines(li),
          alignment: 'justify',
          margin: [0, 1, 0, 1]
        }));
        itens.push({
          ul: lis,
          alignment: 'justify',
          fontSize: cfg.boxFontSize || cfg.fontSize,
          lineHeight: cfg.lineHeight,
          margin: [14, 2, 0, 4]
        });
      }
    });

    return itens;
  }

  /**
   * Construtor completo do documento PDF vetorial para o pdfMake.
   * 
   * @param {string} tipo - Tipo do requerimento
   * @returns {Object} Definição docDefinition do pdfMake
   */
  function gerarDefinicaoPdfMake(tipo) {
    const docPdf = document.getElementById('documento-pdf');
    if (!docPdf) return null;

    const usaRoboto = !!(window.pdfMake && window.pdfMake.vfs && window.pdfMake.vfs['Roboto-Regular.ttf']);
    if (!usaRoboto && window.pdfMake) {
      window.pdfMake.fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        }
      };
    }
    const nomeFonte = usaRoboto ? 'Roboto' : 'Helvetica';

    let cfg = {
      fontSize: 10.5,
      lineHeight: 1.3,
      destinatarioFontSize: 11,
      destinatarioMarginBottom: 30,
      qualifLeadingIndent: 70.87,
      qualifMarginBottom: 10,
      boxPaddingH: 12,
      boxPaddingV: 8,
      boxMarginTop: 10,
      boxMarginBottom: 10,
      anexosFontSize: 10,
      anexosMarginTop: 8,
      anexosMarginBottom: 6,
      fechoMarginTop: 14,
      fechoMarginBottom: 10,
      dataMarginBottom: 18,
      assinaturaMarginTop: 16,
      chefiaMarginTop: 14
    };

    if (tipo === 'insalubridade') {
      cfg.fontSize = 11;
      cfg.lineHeight = 1.20;
      cfg.destinatarioFontSize = 11;
      cfg.boxFontSize = 10;
      cfg.qualifMarginBottom = 6;
      cfg.boxPaddingH = 8;
      cfg.boxPaddingV = 5;
      cfg.boxMarginTop = 6;
      cfg.boxMarginBottom = 6;
      cfg.anexosFontSize = 8.5;
      cfg.anexosMarginTop = 4;
      cfg.anexosMarginBottom = 4;
      cfg.fechoMarginTop = 8;
      cfg.fechoMarginBottom = 18;
      cfg.dataMarginBottom = 10;
      cfg.assinaturaMarginTop = 10;
      cfg.chefiaMarginTop = 24;
    } else if (tipo === 'banco') {
      cfg.fechoMarginBottom = 24;
    } else if (tipo === 'gestante_antes' || tipo === 'gestante_apos') {
      cfg.fechoMarginBottom = 24;
      cfg.chefiaMarginTop = 24;
    } else if (tipo === 'isencao_ir') {
      cfg.fontSize = 11;
      cfg.lineHeight = 1.25;
      cfg.destinatarioFontSize = 11;
      cfg.qualifMarginBottom = 8;
      cfg.boxPaddingH = 10;
      cfg.boxPaddingV = 6;
      cfg.boxMarginTop = 6;
      cfg.boxMarginBottom = 6;
      cfg.anexosFontSize = 9.5;
      cfg.anexosMarginTop = 6;
      cfg.anexosMarginBottom = 6;
      cfg.fechoMarginTop = 10;
      cfg.fechoMarginBottom = 22;
      cfg.dataMarginBottom = 14;
      cfg.assinaturaMarginTop = 16;
    } else if (tipo === 'auxilio_funeral') {
      cfg.fontSize = 10;
      cfg.lineHeight = 1.25;
      cfg.destinatarioFontSize = 10.5;
      cfg.qualifMarginBottom = 8;
      cfg.boxPaddingH = 10;
      cfg.boxPaddingV = 6;
      cfg.boxMarginTop = 8;
      cfg.boxMarginBottom = 8;
      cfg.anexosFontSize = 9.2;
      cfg.anexosMarginTop = 6;
      cfg.anexosMarginBottom = 6;
      cfg.fechoMarginTop = 10;
      cfg.fechoMarginBottom = 8;
      cfg.dataMarginBottom = 14;
      cfg.assinaturaMarginTop = 16;
    } else if (tipo === 'contagem_tempo') {
      cfg.fontSize = 10.5;
      cfg.lineHeight = 1.25;
      cfg.destinatarioFontSize = 11;
      cfg.destinatarioMarginBottom = 22;
      cfg.qualifMarginBottom = 6;
      cfg.boxPaddingH = 10;
      cfg.boxPaddingV = 6;
      cfg.boxMarginTop = 6;
      cfg.boxMarginBottom = 6;
      cfg.anexosFontSize = 9.2;
      cfg.anexosMarginTop = 4;
      cfg.anexosMarginBottom = 4;
      cfg.fechoMarginTop = 8;
      cfg.fechoMarginBottom = 16;
      cfg.dataMarginBottom = 12;
      cfg.assinaturaMarginTop = 12;
      cfg.chefiaMarginTop = 18;
    } else if (tipo === 'saude') {
      cfg.fontSize = 11;
      cfg.lineHeight = 1.20;
      cfg.destinatarioFontSize = 11;
      cfg.boxFontSize = 11;
      cfg.qualifMarginBottom = 6;
      cfg.boxPaddingH = 10;
      cfg.boxPaddingV = 6;
      cfg.boxMarginTop = 6;
      cfg.boxMarginBottom = 6;
      cfg.anexosFontSize = 10;
      cfg.anexosMarginTop = 5;
      cfg.anexosMarginBottom = 5;
      cfg.fechoMarginTop = 8;
      cfg.fechoMarginBottom = 18;
      cfg.dataMarginBottom = 10;
      cfg.assinaturaMarginTop = 10;
      cfg.chefiaMarginTop = 22;
    } else if (tipo === 'licenca_premio_beneficiario') {
      const elLinhas = Array.from(docPdf.querySelectorAll('#doc-gp-linhas .doc-gp-linha-item'));
      const numBlocos = elLinhas.length || 1;

      if (numBlocos >= 6) {
        cfg.fontSize = 9.8;
        cfg.lineHeight = 1.22;
        cfg.destinatarioFontSize = 10.5;
        cfg.destinatarioMarginBottom = 16;
        cfg.qualifMarginBottom = 4;
        cfg.anexosFontSize = 8.5;
        cfg.anexosMarginTop = 3;
        cfg.anexosMarginBottom = 3;
        cfg.fechoMarginTop = 5;
        cfg.fechoMarginBottom = 5;
        cfg.dataMarginBottom = 8;
        cfg.assinaturaMarginTop = 8;
      } else if (numBlocos >= 4) {
        cfg.fontSize = 10.2;
        cfg.lineHeight = 1.25;
        cfg.destinatarioFontSize = 11;
        cfg.destinatarioMarginBottom = 20;
        cfg.qualifMarginBottom = 5;
        cfg.anexosFontSize = 8.8;
        cfg.anexosMarginTop = 3;
        cfg.anexosMarginBottom = 3;
        cfg.fechoMarginTop = 6;
        cfg.fechoMarginBottom = 6;
        cfg.dataMarginBottom = 10;
        cfg.assinaturaMarginTop = 10;
      } else {
        cfg.fontSize = 10.5;
        cfg.lineHeight = 1.3;
        cfg.destinatarioFontSize = 11;
        cfg.destinatarioMarginBottom = 28;
        cfg.qualifMarginBottom = 6;
        cfg.anexosFontSize = 9.2;
        cfg.anexosMarginTop = 4;
        cfg.anexosMarginBottom = 4;
        cfg.fechoMarginTop = 8;
        cfg.fechoMarginBottom = 8;
        cfg.dataMarginBottom = 12;
        cfg.assinaturaMarginTop = 12;
      }
    }

    // 1. Destinatário Oficial
    const elDestinatario = docPdf.querySelector('#doc-destinatario-texto') || docPdf.querySelector('.doc-destinatario');
    let fallbackDest = 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE';
    if (tipo === 'insalubridade') {
      fallbackDest = 'ILMO(A) SENHOR(A) DIRETOR(A) TÉCNICO(A) ADMINISTRATIVO(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE';
    } else if (tipo === 'banco' || tipo === 'contagem_tempo') {
      fallbackDest = 'ILMO(A) SENHOR(A) SUPERVISOR(A) DA SEÇÃO TÉCNICA DE GESTÃO DE PESSOAS DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE';
    } else if (tipo === 'licenca_premio_beneficiario') {
      fallbackDest = 'ILMO(A) SENHOR(A) DIRETOR(A) DA DIVISÃO TÉCNICA ADMINISTRATIVA DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE';
    }
    const destinatarioTexto = elDestinatario ? elDestinatario.innerText.trim() : fallbackDest;

    const destinatarioItem = {
      text: destinatarioTexto,
      bold: true,
      fontSize: cfg.destinatarioFontSize,
      alignment: 'justify',
      margin: [0, 0, 0, cfg.destinatarioMarginBottom]
    };

    // 2. Qualificação do Requerente
    const elQualif = (tipo === 'auxilio_funeral' || tipo === 'licenca_premio_beneficiario')
      ? docPdf.querySelector('#doc-qualificacao-externo')
      : docPdf.querySelector('#doc-qualificacao-servidor');
    const inlinesQualif = elQualif ? extrairInlines(elQualif) : [];

    const qualificacaoItem = {
      text: inlinesQualif,
      alignment: 'justify',
      leadingIndent: cfg.qualifLeadingIndent,
      fontSize: cfg.fontSize,
      lineHeight: cfg.lineHeight,
      margin: [0, 0, 0, cfg.qualifMarginBottom]
    };

    // 2.1 Dados Bancários do Requerente para Crédito (se aplicável, ex: licenca_premio_beneficiario)
    let bancoItem = [];
    if (tipo === 'licenca_premio_beneficiario') {
      const elBanco = docPdf.querySelector('#doc-banco-externo');
      if (elBanco && window.getComputedStyle(elBanco).display !== 'none') {
        const inlinesBanco = extrairInlines(elBanco);
        if (inlinesBanco.length > 0) {
          bancoItem = [
            {
              text: inlinesBanco,
              alignment: 'justify',
              leadingIndent: cfg.qualifLeadingIndent,
              fontSize: cfg.fontSize,
              lineHeight: cfg.lineHeight,
              margin: [0, 0, 0, cfg.qualifMarginBottom]
            }
          ];
        }
      }
    }

    // 3. Especificação do Pedido (Caixa do Requerimento)
    const elCorpo = docPdf.querySelector('#doc-especificacao-corpo');
    const itensCorpo = elCorpo ? extrairBlocoCorpo(elCorpo, cfg) : [];

    const boxPedidoItem = {
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: itensCorpo,
              fillColor: '#fcfcfc',
              margin: [cfg.boxPaddingH, cfg.boxPaddingV, cfg.boxPaddingH, cfg.boxPaddingV]
            }
          ]
        ]
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#cbd5e1',
        vLineColor: () => '#cbd5e1'
      },
      margin: [0, cfg.boxMarginTop, 0, cfg.boxMarginBottom]
    };

    // 4. Documentos Comprobatórios Anexos
    const listaLis = Array.from(docPdf.querySelectorAll('#doc-anexos-lista li'));
    const anexosBloco = [];
    if (listaLis.length > 0) {
      anexosBloco.push({
        text: 'Documentos Comprobatórios Anexos:',
        bold: true,
        fontSize: cfg.anexosFontSize,
        margin: [0, cfg.anexosMarginTop, 0, 2]
      });

      const ulItems = listaLis.map(li => ({
        text: extrairInlines(li),
        alignment: 'justify',
        margin: [0, 1, 0, 1]
      }));

      anexosBloco.push({
        ul: ulItems,
        alignment: 'justify',
        fontSize: cfg.anexosFontSize,
        lineHeight: 1.2,
        margin: [12, 0, 0, cfg.anexosMarginBottom]
      });
    }

    // 5. Fecho Oficial (recuo de 2.5cm)
    const fechoBloco = [
      {
        text: 'Nestes termos,',
        leadingIndent: cfg.qualifLeadingIndent,
        fontSize: cfg.fontSize,
        lineHeight: cfg.lineHeight,
        margin: [0, cfg.fechoMarginTop, 0, 2]
      },
      {
        text: 'Pede deferimento.',
        leadingIndent: cfg.qualifLeadingIndent,
        fontSize: cfg.fontSize,
        lineHeight: cfg.lineHeight,
        margin: [0, 0, 0, cfg.fechoMarginBottom]
      }
    ];

    // 6. Data e Local
    const dataTexto = docPdf.querySelector('#prev-data-extenso')?.innerText.trim() || '';
    const dataItem = {
      text: `Presidente Prudente - SP, ${dataTexto}.`,
      alignment: 'center',
      fontSize: cfg.fontSize,
      margin: [0, 0, 0, cfg.dataMarginBottom]
    };

    // 7. Assinatura do Requerente (sem linha horizontal)
    const nomeAssinatura = docPdf.querySelector('#prev-assinatura-nome')?.innerText.trim() || '';
    const cargoAssinatura = docPdf.querySelector('#prev-assinatura-cargo')?.innerText.trim() || '';

    const assinaturaItem = [
      {
        text: nomeAssinatura,
        bold: true,
        alignment: 'center',
        fontSize: cfg.fontSize,
        lineHeight: 1.0,
        margin: [0, cfg.assinaturaMarginTop, 0, (tipo === 'licenca_premio_beneficiario' ? 3 : 1)]
      }
    ];

    if (tipo === 'licenca_premio_beneficiario') {
      const telAssinatura = docPdf.querySelector('#prev-assinatura-telefone')?.innerText.trim();
      const emailEl = docPdf.querySelector('#prev-assinatura-email');
      const emailAssinatura = (emailEl && window.getComputedStyle(emailEl).display !== 'none') ? emailEl.innerText.trim() : '';

      if (telAssinatura) {
        assinaturaItem.push({
          text: telAssinatura,
          alignment: 'center',
          fontSize: 9.5,
          lineHeight: 1.2,
          color: '#334155',
          margin: [0, 1, 0, 1]
        });
      }
      if (emailAssinatura) {
        assinaturaItem.push({
          text: emailAssinatura,
          alignment: 'center',
          fontSize: 9.5,
          lineHeight: 1.2,
          color: '#334155',
          margin: [0, 1, 0, 1]
        });
      }
    } else {
      assinaturaItem.push({
        text: cargoAssinatura,
        alignment: 'center',
        fontSize: (tipo === 'insalubridade' || tipo === 'saude') ? 11 : cfg.fontSize - 0.8,
        lineHeight: 1.0,
        color: '#334155'
      });
    }

    // 7.1 Bloco De Acordo/Visto para Modelo 03
    let deAcordoItem = [];
    if (tipo === 'licenca_premio_beneficiario') {
      const elLinhas = Array.from(docPdf.querySelectorAll('#doc-gp-linhas .doc-gp-linha-item'));
      const numBlocos = elLinhas.length || 1;

      let marginVisto = 16;
      let distanciaDiretorParaGP = 30;
      if (numBlocos >= 6) {
        marginVisto = 10;
        distanciaDiretorParaGP = 14;
      } else if (numBlocos >= 4) {
        marginVisto = 12;
        distanciaDiretorParaGP = 20;
      }

      // Medição e cálculo dinâmico para posicionar De Acordo e o Quadro conjuntamente no final da folha A4 no PDF
      const minMargin = (numBlocos >= 6) ? 6 : (numBlocos >= 4 ? 8 : 12);
      let marginAssinaturaParaDeAcordo = minMargin;

      const elAssinatura = docPdf.querySelector('.doc-assinatura-area');
      const elDeAcordo = docPdf.querySelector('#doc-bloco-de-acordo');
      if (elAssinatura && elDeAcordo) {
        const rectDoc = docPdf.getBoundingClientRect();
        const rectAssinatura = elAssinatura.getBoundingClientRect();
        const rectDeAcordo = elDeAcordo.getBoundingClientRect();
        const gapPx = rectDeAcordo.top - rectAssinatura.bottom;
        if (rectDoc.height > 0 && gapPx > 0) {
          const scale = 841.89 / rectDoc.height;
          const gapPt = gapPx * scale;
          marginAssinaturaParaDeAcordo = Math.max(minMargin, Math.floor(gapPt - 10));
        }
      }

      // Trava de segurança contra estouro de página (área imprimível: 756.84 pt)
      const estimativaQuadro = (numBlocos >= 6) ? (20 + numBlocos * 18) : (numBlocos >= 4 ? (24 + numBlocos * 21) : (28 + numBlocos * 24));
      const estimativaDeAcordoFixa = (cfg.fontSize * 2) + marginVisto + distanciaDiretorParaGP;
      const estimativaTopo = 420;
      const orcamentoRestante = 756.84 - (estimativaTopo + estimativaQuadro + estimativaDeAcordoFixa);
      if (orcamentoRestante > minMargin) {
        marginAssinaturaParaDeAcordo = Math.min(marginAssinaturaParaDeAcordo, Math.floor(orcamentoRestante));
      } else {
        marginAssinaturaParaDeAcordo = minMargin;
      }

      deAcordoItem = [
        {
          text: 'De Acordo/Visto.',
          bold: true,
          fontSize: cfg.fontSize,
          color: '#000000',
          margin: [0, marginAssinaturaParaDeAcordo, 0, marginVisto] // espaço para visto ou rubrica
        },
        {
          text: 'Diretor da Unidade',
          bold: false,
          fontSize: cfg.fontSize, // Mesma fonte e mesmo tamanho
          color: '#000000',
          margin: [0, 0, 0, distanciaDiretorParaGP] // Distância adaptada até o quadro de Gestão de Pessoas
        }
      ];
    }

    // 7.2 Quadro Oficial: Informações da Área de Gestão de Pessoas
    let blocoGestaoPessoasItem = [];
    if (tipo === 'licenca_premio_beneficiario') {
      const elLinhas = Array.from(docPdf.querySelectorAll('#doc-gp-linhas .doc-gp-linha-item'));
      const numBlocos = elLinhas.length || 1;
      const fonteQuadro = (numBlocos >= 6) ? 8.0 : 8.5;
      const lineHeightQuadro = (numBlocos >= 6) ? 1.15 : 1.18;
      const marginItemV = (numBlocos >= 6) ? 0.5 : 0.75;

      const itensLinhas = elLinhas.map(item => ({
        text: extrairInlines(item),
        alignment: 'justify',
        lineHeight: lineHeightQuadro,
        fontSize: fonteQuadro,
        margin: [0, marginItemV, 0, marginItemV]
      }));

      blocoGestaoPessoasItem = [
        {
          text: 'Informações da Área de Gestão de Pessoas',
          italics: true,
          bold: true,
          fontSize: (numBlocos >= 6) ? 8.5 : 9.0,
          margin: [0, 0, 0, 2]
        },
        {
          table: {
            widths: ['*'],
            dontBreakRows: true,
            body: [
              [
                {
                  stack: [
                    {
                      text: 'O ex-servidor conta com os seguintes saldos de Licença-Prêmio:',
                      bold: true,
                      fontSize: fonteQuadro,
                      alignment: 'justify',
                      margin: [0, 0, 0, 2]
                    },
                    ...itensLinhas
                  ],
                  margin: [6, 4, 6, 4]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0.75,
            vLineWidth: () => 0.75,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000'
          }
        }
      ];
    }

    // 8. Ciência da Chefia Imediata (se selecionado/visível)
    const blocoChefia = docPdf.querySelector('#doc-bloco-chefia');
    const chefiaObrigatoria = (tipo === 'gestante_antes' || tipo === 'gestante_apos' || tipo === 'saude' || tipo === 'insalubridade');
    const chefiaAtiva = chefiaObrigatoria || (blocoChefia && window.getComputedStyle(blocoChefia).display !== 'none');
    let chefiaItems = [];

    if (chefiaAtiva && tipo !== 'banco' && tipo !== 'isencao_ir' && tipo !== 'auxilio_funeral' && tipo !== 'licenca_premio_beneficiario') {
      const lotacaoChefia = docPdf.querySelector('#prev-chefia-lotacao')?.innerText.trim() || 'Responsável pela Lotação';
      chefiaItems = [
        {
          text: 'Ciente.',
          bold: true,
          alignment: 'center',
          fontSize: cfg.fontSize,
          margin: [0, cfg.chefiaMarginTop, 0, 32]
        },
        {
          text: lotacaoChefia,
          alignment: 'center',
          fontSize: (tipo === 'insalubridade' || tipo === 'saude') ? 11 : cfg.fontSize - 0.8,
          lineHeight: 1.0,
          color: '#334155'
        }
      ];
    }

    const content = (tipo === 'licenca_premio_beneficiario')
      ? [
          destinatarioItem,
          qualificacaoItem,
          ...bancoItem,
          ...anexosBloco,
          ...fechoBloco,
          dataItem,
          ...assinaturaItem,
          ...deAcordoItem,
          ...blocoGestaoPessoasItem
        ]
      : [
          destinatarioItem,
          qualificacaoItem,
          boxPedidoItem,
          ...anexosBloco,
          ...fechoBloco,
          dataItem,
          ...assinaturaItem,
          ...chefiaItems
        ];

    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [56.7, 56.7, 56.7, 28.3],
      defaultStyle: {
        font: nomeFonte,
        fontSize: cfg.fontSize,
        lineHeight: cfg.lineHeight,
        color: '#111827'
      },
      content: content
    };
  }

  return {
    extrairInlines,
    extrairBlocoCorpo,
    gerarDefinicaoPdfMake
  };
});
