# Portal de Memorandos — STGP FCT UNESP

Sistema web institucional desenvolvido para a **Seção Técnica de Gestão de Pessoas (STGP)** da **Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente (UNESP)**, voltado à elaboração, parametrização assistida, pré-visualização em tempo real e emissão dos memorandos oficiais em papel timbrado institucional (padrão 2026) com exportação vetorial de alta definição para PDF.

O portal opera 100% no navegador (client-side) e adota arquitetura modular com uma página central (Hub) e páginas dedicadas para cada modalidade de expediente.

---

## 📌 Memorandos Contemplados no Portal

| Documento | Categoria | Status | Saídas Oficiais |
| :--- | :--- | :--- | :--- |
| **Alteração da Escala de Substituição** | Escala & Afastamentos | ✅ **Disponível** | Memorando Oficial (A4) + Quadro Anexo de Substituição (A4) |
| **Início de Exercício de Novos Servidores** | Admissão & Provimento | ✅ **Disponível** | Memorando Oficial de Comunicação de Exercício à STGP (A4) |
| **Envio das Avaliações Especiais de Desempenho** | Estágio Probatório | ⏳ *Em Estruturação* | Memorando Oficial de Encaminhamento às Chefias (A4) |

---

## ⚙️ Regras e Recursos do Sistema

### 1. Integração Conceitual com o SIGAD UNESP
- O número sequencial de cada memorando deve ser reservado previamente no **[SIGAD (Sistema Informatizado de Gestão Arquivística de Documentos)](https://sistemas.unesp.br/sigad/)**.
- Atalhos diretos e avisos normativos orientam o usuário em todas as telas.

### 2. Catálogo Oficial de Unidades Administrativas (UAs)
- Integração com catálogo de **85+ Unidades Administrativas da FCT UNESP** (`uas_catalogo.js`).
- Preenchimento e ajuste automático dos nomes e cargos/funções dos assinantes (masculino, feminino, titulares e substitutos).

### 3. Automatismos Institucionais
- Preenchimento automático do ano de exercício (`2026`) e data por extenso no padrão de expediente oficial da UNESP (`Presidente Prudente, [dia] de [mês] de [ano]`).
- Regra inteligente de destinatário (ex: DTAd padrão vs. STGP quando a DTAd for a remetente; STGP fixa para Início de Exercício).
- Regras normativas por categoria de servidor: controle e parametrização de horário/escala para técnico-administrativos; supressão de horário para docentes e pesquisadores.

### 4. Catálogo Oficial Unificado de Cargos e Funções (77 funções)
- Base de dados padronizada obrigatória para todos os formulários com campos de categoria e cargo/função (`cargos_catalogo.js`):
  - **Técnico-administrativo (66 funções):** Cargos efetivos do Plano de Carreiras UNESP + *Técnico Administrativo Substituto*.
  - **Docente (7 funções):** Cargos da Carreira Docente UNESP + *Professor Substituto* e *Professor Colaborador*.
  - **Pesquisador (4 funções):** Cargos da Carreira de Pesquisador UNESP (*Pesquisador I* a *IV*).

### 5. Alta Fidelidade em PDF e Impressão Nativa
- Incorporação do papel timbrado oficial da UNESP em alta resolução.
- Fontes tipográficas oficiais (*Raleway* e *Merriweather*) incorporadas de modo offline via vetores no `jsPDF`.
- Compatibilidade com impressão direta (`window.print()` / `Ctrl+P`).

---

## 📂 Estrutura de Arquivos

```
memorandos/
├── index.html                  # Hub / Painel Principal com busca, filtros e cards dos memorandos
├── alteracao-escala.html       # Página dedicada: Gerador de Alteração da Escala de Substituição
├── inicio-exercicio.html       # Página dedicada: Gerador de Início de Exercício de Novos Servidores
├── styles.css                  # Folha de estilos unificada (identidade UNESP FCT, cards, formulários, A4 e print)
├── app.js                      # Lógica reativa da escala, cálculos de regras e gerador de PDFs
├── inicio-exercicio.js         # Lógica reativa de início de exercício, regras docentes/técnicos e PDF
├── memorando-mobile.js         # Script padronizado e autônomo (Plug & Play) de responsividade mobile e escala A4
├── uas_catalogo.js             # Base oficial com as 85+ UAs da FCT UNESP e funções dos assinantes
├── cargos_catalogo.js          # Base unificada oficial de Cargos e Funções por Categoria (77 funções)
├── papel_timbrado_data.js      # Papel timbrado oficial da UNESP vetorizado em Base64
├── raleway_fonts_data.js       # Tipografia oficial Raleway incorporada para jsPDF
├── jspdf.umd.min.js            # Biblioteca local jsPDF
├── html2pdf.bundle.min.js      # Biblioteca local html2pdf
├── fct-logo.png                # Logotipo oficial FCT UNESP
├── unesp-logo.svg              # Logotipo oficial UNESP colorido
├── unesp-logo-white.svg        # Logotipo oficial UNESP branco para barra superior
├── unesp.ico                   # Favicon institucional
└── README.md                   # Documentação técnica do sistema
```

---

## 📱 Padrão de Responsividade PC e Mobile para Novos Modelos

Para garantir compatibilidade 100% tanto em computadores/laptops (PC) quanto em smartphones e tablets, qualquer novo modelo de memorando adicionado ao portal segue a arquitetura padronizada:

### 1. Inclusão dos Arquivos Padrão
Basta vincular a folha de estilos unificada e o script `memorando-mobile.js`:
```html
<link rel="stylesheet" href="styles.css">
...
<!-- No final do body: -->
<script src="memorando-mobile.js"></script>
```

### 2. Estrutura Padrão de Navegação e Conteúdo
Para que os botões de retorno fiquem sempre no topo (acima das abas no celular e acima das duas colunas no PC):
```html
  <header class="app-header">...</header>

  <!-- 1. Barra Superior de Retorno (Fica ACIMA das abas mobile e do grid no PC) -->
  <div class="top-nav-back-bar">
    <div class="top-nav-back-inner">
      <a href="index.html" class="btn-back-stgp">Voltar aos Memorandos</a>
      <a href="https://stgp.fct.unesp.br/" target="_blank" class="btn-back-subtle">Portal STGP Digital ↗</a>
    </div>
  </div>

  <!-- 2. Seletor de Abas Mobile (Oculto no PC, visível em telas <= 992px) -->
  <nav class="mobile-view-tabs" aria-label="Navegação mobile de visualização">
    <div class="mobile-view-tabs-inner">
      <button type="button" class="mobile-view-tab active" id="tab-view-form">
        <span>📝</span> Preenchimento
      </button>
      <button type="button" class="mobile-view-tab" id="tab-view-preview">
        <span>👁️</span> Ver Documento (A4)
      </button>
    </div>
  </nav>

  <!-- 3. Grid Principal (Formulário + Prévia A4) -->
  <main class="main-container">
    <section class="form-section">...</section>
    <section class="preview-section">...</section>
  </main>
```

### 3. Auto-Inicialização Plug & Play (`memorando-mobile.js`)
Mesmo que um desenvolvedor esqueça ou estruture diferentemente no HTML de um novo modelo, o script `memorando-mobile.js`:
- **Auto-padroniza a barra de retorno:** se detectar `.nav-back-container` dentro do formulário, extrai e insere automaticamente em `.top-nav-back-bar` antes das abas.
- **Injeta automaticamente** a barra de abas mobile (`📝 Preenchimento` e `👁️ Ver Documento (A4)`) se ausente no HTML.
- **Envolve automaticamente** o documento `#documento-pdf` no contêiner de escala inteligente (`#a4-scale-container`).
- **Injeta automaticamente** os controles de zoom (`📐 Ajustar à Tela` e `🔍 100%`) na `.preview-toolbar`.
- **Preserva o contexto de posicionamento:** `#documento-pdf` e `.a4-page` mantêm `position: relative !important`, impedindo que a imagem timbrada oficial (`.papel-timbrado-bg`) se desloque ou sobreponha outros elementos.
- **Calcula a escala A4** proporcional tanto em celulares quanto em telas de laptop (1100px - 1400px), impedindo qualquer extrapolação para fora do container `.a4-wrapper`.
- **Monitora redimensionamentos e rotações** via `ResizeObserver` e eventos reativos.

### 4. Padrão de Impressão Nativa (Ctrl+P / Imprimir / Salvar em PDF)
Para que a impressão nativa do navegador (`window.print()`) ou salvamento via "Imprimir como PDF" saia **rigorosamente apenas com a folha A4 oficial** e sem qualquer elemento da página web:
- **`styles.css` (@media print):** Oculta rigorosamente a barra superior (`.unesp-top-bar`), o cabeçalho (`.app-header`), os botões de navegação (`.top-nav-back-bar`), as abas mobile (`.mobile-view-tabs`), as seções de formulário (`.form-section`), as ferramentas de prévia (`.preview-toolbar`, `.preview-mobile-actions`) e o rodapé (`.app-footer`).
- **Folha A4 Exata:** Força a `.a4-page` em dimensões exatas de 1 folha A4 (`210mm x 297mm`), margens de página zeradas (`@page { size: A4 portrait; margin: 0 !important; }`), fundo branco institucional e retenção do papel timbrado (`print-color-adjust: exact !important;`).
- **`memorando-mobile.js` (beforeprint / afterprint):** Intercepta o evento `beforeprint` para neutralizar transformações e escalas inline de tela (`transform: none`, `width: 210mm`), e restaura o dimensionamento responsivo automaticamente no `afterprint`.

