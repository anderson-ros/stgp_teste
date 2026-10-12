/**
 * ========================================================================
 * MEMORANDO-MOBILE.JS — Padronização e Responsividade Mobile dos Memorandos
 * Seção Técnica de Gestão de Pessoas (STGP) — FCT UNESP Presidente Prudente
 * ========================================================================
 * Este script é auto-inicializável e Plug & Play.
 * Ele detecta automaticamente a presença da estrutura de formulário e prévia A4,
 * injetando as abas mobile, controles de zoom e contêineres de escala de forma
 * padronizada e segura para TODOS os modelos de memorando atuais e futuros.
 */

(function () {
  'use strict';

  function inicializarResponsividadeMemorando() {
    const mainContainer = document.querySelector('.main-container');
    const formSection = document.querySelector('.form-section');
    const previewSection = document.querySelector('.preview-section');
    const a4Wrapper = document.getElementById('a4-wrapper') || document.querySelector('.a4-wrapper');
    const documentoPdf = document.getElementById('documento-pdf') || document.querySelector('.a4-page');

    // Se a página não tiver estrutura de memorando (ex: index/hub de navegação), encerra sem interferir
    if (!mainContainer || !formSection || !previewSection) {
      return;
    }

    // ========================================================================
    // 1. AUTO-PADRONIZAÇÃO DA BARRA DE RETORNO (Garante ordem acima das abas)
    // ========================================================================
    let topNavBackBar = document.querySelector('.top-nav-back-bar');
    const existingNavBack = document.querySelector('.nav-back-container');

    if (!topNavBackBar && existingNavBack) {
      topNavBackBar = document.createElement('div');
      topNavBackBar.className = 'top-nav-back-bar';
      const inner = document.createElement('div');
      inner.className = 'top-nav-back-inner';
      while (existingNavBack.firstChild) {
        inner.appendChild(existingNavBack.firstChild);
      }
      topNavBackBar.appendChild(inner);
      existingNavBack.remove();
      mainContainer.parentNode.insertBefore(topNavBackBar, mainContainer);
    }

    // ========================================================================
    // 2. INJEÇÃO AUTOMÁTICA DA BARRA DE ABAS MOBILE (se ausente no HTML)
    // ========================================================================
    let mobileViewTabs = document.querySelector('.mobile-view-tabs');
    let tabViewForm = document.getElementById('tab-view-form');
    let tabViewPreview = document.getElementById('tab-view-preview');

    if (!mobileViewTabs) {
      mobileViewTabs = document.createElement('nav');
      mobileViewTabs.className = 'mobile-view-tabs';
      mobileViewTabs.setAttribute('aria-label', 'Navegação mobile de visualização');
      mobileViewTabs.innerHTML = `
        <div class="mobile-view-tabs-inner">
          <button type="button" class="mobile-view-tab active" id="tab-view-form">
            <span>📝</span> Preenchimento
          </button>
          <button type="button" class="mobile-view-tab" id="tab-view-preview">
            <span>👁️</span> Ver Documento (A4)
          </button>
        </div>
      `;
      mainContainer.parentNode.insertBefore(mobileViewTabs, mainContainer);
      tabViewForm = mobileViewTabs.querySelector('#tab-view-form');
      tabViewPreview = mobileViewTabs.querySelector('#tab-view-preview');
    }

    // Garante que topNavBackBar fique estritamente ACIMA de mobileViewTabs no DOM
    if (topNavBackBar && mobileViewTabs && topNavBackBar.compareDocumentPosition(mobileViewTabs) & Node.DOCUMENT_POSITION_PRECEDING) {
      mobileViewTabs.parentNode.insertBefore(topNavBackBar, mobileViewTabs);
    }

    // ========================================================================
    // 3. ENVOLVER #documento-pdf NO #a4-scale-container (se ausente)
    // ========================================================================
    let a4ScaleContainer = document.getElementById('a4-scale-container');
    if (!a4ScaleContainer && a4Wrapper && documentoPdf) {
      a4ScaleContainer = document.createElement('div');
      a4ScaleContainer.id = 'a4-scale-container';
      a4ScaleContainer.className = 'a4-scale-container';
      documentoPdf.parentNode.insertBefore(a4ScaleContainer, documentoPdf);
      a4ScaleContainer.appendChild(documentoPdf);
    }

    // ========================================================================
    // 4. INJEÇÃO DOS CONTROLES DE ZOOM NA TOOLBAR (se ausentes)
    // ========================================================================
    let previewToolbar = document.querySelector('.preview-toolbar');
    let btnZoomFit = document.getElementById('btn-zoom-fit');
    let btnZoom100 = document.getElementById('btn-zoom-100');

    if (previewToolbar && (!btnZoomFit || !btnZoom100)) {
      let zoomContainer = previewToolbar.querySelector('.preview-zoom-controls');
      if (!zoomContainer) {
        zoomContainer = document.createElement('div');
        zoomContainer.className = 'preview-zoom-controls';
        zoomContainer.innerHTML = `
          <button type="button" class="btn-zoom active" id="btn-zoom-fit" title="Ajustar largura da folha à tela do celular">
            <span>📐</span> Ajustar à Tela
          </button>
          <button type="button" class="btn-zoom" id="btn-zoom-100" title="Exibir em tamanho real 100% (com rolagem lateral)">
            <span>🔍</span> 100%
          </button>
        `;
        previewToolbar.appendChild(zoomContainer);
      }
      btnZoomFit = document.getElementById('btn-zoom-fit');
      btnZoom100 = document.getElementById('btn-zoom-100');
    }

    // ========================================================================
    // 5. INJEÇÃO DOS BOTÕES DE AÇÃO RÁPIDA NO MOBILE (se ausentes)
    // ========================================================================
    let btnVerPreviaMobile = document.getElementById('btn-ver-previa-mobile');
    const actionButtonsCard = formSection.querySelector('.action-buttons-card');
    if (actionButtonsCard && !btnVerPreviaMobile) {
      btnVerPreviaMobile = document.createElement('button');
      btnVerPreviaMobile.id = 'btn-ver-previa-mobile';
      btnVerPreviaMobile.className = 'btn btn-secondary mobile-only';
      btnVerPreviaMobile.type = 'button';
      btnVerPreviaMobile.innerHTML = '<span class="btn-icon">👁️</span> Visualizar Documento (A4)';
      actionButtonsCard.appendChild(btnVerPreviaMobile);
    }

    let previewMobileActions = previewSection.querySelector('.preview-mobile-actions');
    let btnVoltarFormMobile = document.getElementById('btn-voltar-form-mobile');
    let btnGerarPdfPreview = document.getElementById('btn-gerar-pdf-preview');
    let btnImprimirPreview = document.getElementById('btn-imprimir-preview');

    if (!previewMobileActions && previewSection) {
      previewMobileActions = document.createElement('div');
      previewMobileActions.className = 'preview-mobile-actions mobile-only';
      previewMobileActions.innerHTML = `
        <button id="btn-voltar-form-mobile" class="btn btn-secondary" type="button">
          <span>📝</span> Voltar ao Formulário
        </button>
        <button id="btn-gerar-pdf-preview" class="btn btn-primary" type="button">
          <span>📄</span> Baixar PDF do Memorando
        </button>
        <button id="btn-imprimir-preview" class="btn btn-outline" type="button">
          <span>🖨️</span> Imprimir Documento
        </button>
      `;
      previewSection.appendChild(previewMobileActions);
      btnVoltarFormMobile = document.getElementById('btn-voltar-form-mobile');
      btnGerarPdfPreview = document.getElementById('btn-gerar-pdf-preview');
      btnImprimirPreview = document.getElementById('btn-imprimir-preview');
    }

    // ========================================================================
    // 6. ESTADO E LÓGICA DE ESCALA A4 INTELIGENTE
    // ========================================================================
    let modoZoomA4 = 'fit'; // 'fit' ou '100'

    function ajustarEscalaA4() {
      if (!a4Wrapper || !a4ScaleContainer || !documentoPdf) return;

      // Modo 100% (escala real 1:1, permitindo rolagem horizontal se necessário)
      if (modoZoomA4 === '100') {
        a4Wrapper.classList.remove('mode-fit-screen');
        a4Wrapper.classList.add('mode-100');

        a4ScaleContainer.style.width = '794px';
        a4ScaleContainer.style.minWidth = '794px';
        a4ScaleContainer.style.maxWidth = 'none';
        a4ScaleContainer.style.height = `${alturaPadraoA4}px`;
        a4ScaleContainer.style.flexShrink = '0';
        a4ScaleContainer.style.position = 'relative';
        a4ScaleContainer.style.margin = '0 auto';
        a4ScaleContainer.style.marginBottom = '1.5rem';
        a4ScaleContainer.style.overflow = 'visible';
        a4ScaleContainer.style.borderRadius = '0';

        documentoPdf.style.transform = 'none';
        documentoPdf.style.position = 'relative'; // CRÍTICO: Sempre relative para conter .papel-timbrado-bg
        documentoPdf.style.top = '0';
        documentoPdf.style.left = '0';
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

      const styleWrapper = window.getComputedStyle(a4Wrapper);
      const padLeft = parseFloat(styleWrapper.paddingLeft) || 16;
      const padRight = parseFloat(styleWrapper.paddingRight) || 16;

      const wrapperClientWidth = a4Wrapper.clientWidth;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 360;
      const isMobile = window.innerWidth <= 992;

      let larguraDisponivel;
      if (isMobile) {
        const maxSafeWidth = Math.max(260, viewportWidth - 24);
        larguraDisponivel = wrapperClientWidth > 0
          ? wrapperClientWidth - (padLeft + padRight)
          : maxSafeWidth;
        larguraDisponivel = Math.min(larguraDisponivel, maxSafeWidth);
      } else {
        // Desktop / Tablet (> 992px)
        larguraDisponivel = wrapperClientWidth > 0
          ? wrapperClientWidth - (padLeft + padRight)
          : 794;
      }
      larguraDisponivel = Math.max(260, larguraDisponivel);

      const larguraPadraoA4 = 794;  // ~210mm a 96 DPI
      const alturaPadraoA4 = 1123;  // ~297mm a 96 DPI

      const escala = Math.min(1, Math.max(0.2, larguraDisponivel / larguraPadraoA4));

      if (escala < 0.99) {
        const scaledWidth = Math.floor(larguraPadraoA4 * escala);
        const scaledHeight = Math.ceil(alturaPadraoA4 * escala);

        a4ScaleContainer.style.width = `${scaledWidth}px`;
        a4ScaleContainer.style.minWidth = `${scaledWidth}px`;
        a4ScaleContainer.style.maxWidth = `${scaledWidth}px`;
        a4ScaleContainer.style.height = `${scaledHeight}px`;
        a4ScaleContainer.style.flexShrink = '0'; // CRÍTICO: Impede que o flexbox reduza a altura, assegurando a barra de rolagem vertical
        a4ScaleContainer.style.position = 'relative';
        a4ScaleContainer.style.margin = '0 auto';
        a4ScaleContainer.style.marginBottom = '1.5rem';
        a4ScaleContainer.style.overflow = 'hidden';
        a4ScaleContainer.style.borderRadius = '4px';

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
        a4ScaleContainer.style.width = 'auto';
        a4ScaleContainer.style.minWidth = 'auto';
        a4ScaleContainer.style.maxWidth = 'none';
        a4ScaleContainer.style.height = `${alturaPadraoA4}px`;
        a4ScaleContainer.style.flexShrink = '0'; // CRÍTICO: Impede que o flexbox reduza a altura
        a4ScaleContainer.style.position = 'relative';
        a4ScaleContainer.style.margin = '0 auto';
        a4ScaleContainer.style.marginBottom = '1.5rem';
        a4ScaleContainer.style.overflow = 'visible';
        a4ScaleContainer.style.borderRadius = '0';

        documentoPdf.style.position = 'relative'; // CRÍTICO: Sempre relative para conter .papel-timbrado-bg
        documentoPdf.style.top = '0';
        documentoPdf.style.left = '0';
        documentoPdf.style.width = `${larguraPadraoA4}px`;
        documentoPdf.style.minWidth = `${larguraPadraoA4}px`;
        documentoPdf.style.maxWidth = 'none';
        documentoPdf.style.transformOrigin = 'top center';
        documentoPdf.style.transform = 'none';
        documentoPdf.style.margin = '0 auto';
      }
    }

    // ========================================================================
    // 7. ALTERNÂNCIA DE ABAS MOBILE (Formulário vs Prévia)
    // ========================================================================
    function alternarModoVisualizacaoMobile(modo) {
      if (modo === 'preview') {
        document.body.classList.remove('view-mode-form');
        document.body.classList.add('view-mode-preview');
        tabViewForm?.classList.remove('active');
        tabViewPreview?.classList.add('active');

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

    // Inicialização padrão no carregamento
    if (window.innerWidth <= 992) {
      if (document.body.classList.contains('view-mode-preview')) {
        tabViewForm?.classList.remove('active');
        tabViewPreview?.classList.add('active');
      } else {
        document.body.classList.add('view-mode-form');
        tabViewForm?.classList.add('active');
        tabViewPreview?.classList.remove('active');
      }
    } else {
      document.body.classList.remove('view-mode-form');
      document.body.classList.remove('view-mode-preview');
    }

    // Conecta eventos de troca de abas mobile
    tabViewForm?.addEventListener('click', () => alternarModoVisualizacaoMobile('form'));
    tabViewPreview?.addEventListener('click', () => alternarModoVisualizacaoMobile('preview'));
    btnVerPreviaMobile?.addEventListener('click', () => alternarModoVisualizacaoMobile('preview'));
    btnVoltarFormMobile?.addEventListener('click', () => alternarModoVisualizacaoMobile('form'));

    // Conecta controles de zoom
    btnZoomFit?.addEventListener('click', () => {
      modoZoomA4 = 'fit';
      btnZoomFit.classList.add('active');
      btnZoom100?.classList.remove('active');
      ajustarEscalaA4();
    });

    btnZoom100?.addEventListener('click', () => {
      modoZoomA4 = '100';
      btnZoom100.classList.add('active');
      btnZoomFit?.classList.remove('active');
      ajustarEscalaA4();
    });

    // Conecta botões rápidos de download e impressão na prévia mobile
    btnGerarPdfPreview?.addEventListener('click', () => {
      const btnGerarPdf = document.getElementById('btn-gerar-memo-pdf') ||
                          document.getElementById('btn-gerar-pdf') ||
                          document.getElementById('btn-imprimir-tudo');
      if (btnGerarPdf) {
        btnGerarPdf.click();
      }
    });

    btnImprimirPreview?.addEventListener('click', () => {
      const btnImprimir = document.getElementById('btn-imprimir-tudo') ||
                          document.getElementById('btn-imprimir');
      if (btnImprimir) {
        btnImprimir.click();
      } else {
        window.print();
      }
    });

    // Reatividade com ResizeObserver e troca de abas de documentos
    if (window.ResizeObserver && a4Wrapper) {
      const ro = new ResizeObserver(() => {
        if (document.body.classList.contains('view-mode-preview')) {
          ajustarEscalaA4();
        }
      });
      ro.observe(a4Wrapper);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        // No desktop, remove classes mobile restritivas
        document.body.classList.remove('view-mode-form');
        document.body.classList.remove('view-mode-preview');
        ajustarEscalaA4();
      } else {
        if (!document.body.classList.contains('view-mode-form') &&
            !document.body.classList.contains('view-mode-preview')) {
          document.body.classList.add('view-mode-form');
        }
        if (document.body.classList.contains('view-mode-preview')) {
          ajustarEscalaA4();
        }
      }
    });

    // Observador para alternância de documentos internos (ex: Memorando vs Quadro Anexo)
    const profileTabs = document.querySelectorAll('.profile-tab');
    profileTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        setTimeout(ajustarEscalaA4, 50);
      });
    });

    // ========================================================================
    // 8. OTIMIZAÇÃO RIGOROSA PARA IMPRESSÃO NATIVA (Ctrl+P / Imprimir / PDF)
    // Neutraliza transformações e dimensões inline durante a impressão para garantir
    // que apenas a folha A4 pura seja impressa com fidelidade institucional 100%
    // ========================================================================
    window.addEventListener('beforeprint', () => {
      if (a4ScaleContainer && documentoPdf) {
        a4ScaleContainer.style.width = '210mm';
        a4ScaleContainer.style.height = '297mm';
        a4ScaleContainer.style.maxWidth = '210mm';
        a4ScaleContainer.style.minWidth = '210mm';
        a4ScaleContainer.style.transform = 'none';
        documentoPdf.style.transform = 'none';
        documentoPdf.style.width = '210mm';
        documentoPdf.style.maxWidth = '210mm';
        documentoPdf.style.minWidth = '210mm';
        documentoPdf.style.height = '297mm';
        documentoPdf.style.position = 'relative';
        documentoPdf.style.top = '0';
        documentoPdf.style.left = '0';
      }
    });

    window.addEventListener('afterprint', () => {
      if (a4ScaleContainer && documentoPdf) {
        ajustarEscalaA4();
      }
    });

    // Ajuste inicial
    setTimeout(ajustarEscalaA4, 100);

    // Exporta globalmente para interoperabilidade se necessário
    window.MemorandoMobile = {
      ajustarEscalaA4,
      alternarModoVisualizacaoMobile
    };
  }

  // Auto-execução garantida em qualquer momento de carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarResponsividadeMemorando);
  } else {
    inicializarResponsividadeMemorando();
  }
})();
