# Portal de Requerimentos — STGP (FCT UNESP)

Sistema oficial cliente-side para geração e emissão de requerimentos administrativos da **Seção Técnica de Gestão de Pessoas (STGP)** da Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente (UNESP).

O sistema opera 100% no navegador (sem necessidade de backend), gerando pré-visualização em tempo real na folha A4 e documentos PDF vetoriais nítidos, com padrão tipográfico oficial e pesquisáveis via `pdfMake`.

---

## Estrutura Modular do Projeto

```
requerimentos/
├── index.html                      # Hub Inicial: Seleção de Perfil (Servidor vs Externo)
├── servidor.html                   # Catálogo de Cards: Requerimentos para Servidores e Aposentados
├── externo.html                    # Catálogo de Cards: Requerimentos para Familiares e Terceiros
├── formulario.html                 # Gerador e Emissor: Formulário assistido e Espelho A4 / PDF
├── styles.css                      # Ponto de entrada CSS raiz
├── README.md                       # Documentação técnica do sistema
│
└── assets/
    ├── css/
    │   ├── variables.css           # Tokens de design: cores oficiais UNESP, tipografia, espaçamentos
    │   ├── layout.css              # Barra institucional, cabeçalho, rodapé oficial e grid responsivo
    │   ├── form.css                # Formulários, inputs, feedbacks e botões
    │   ├── preview.css             # Estilos da folha A4 em tela, tipografia oficial e regras @media print
    │   ├── hub.css                 # Hub de seleção de perfil, toolbar de busca e cards de catálogo
    │   └── styles.css              # Consolidador mestre que importa todos os módulos CSS
    │
    ├── js/
    │   ├── catalog/
    │   │   ├── funcoes.js          # Catálogo oficial unificado de cargos/funções por categoria UNESP (77 funções)
    │   │   ├── lotacoes.js         # Lista oficial de departamentos e seções da FCT UNESP
    │   │   └── requerimentos.js    # Metadados e regras de negócio dos tipos de requerimentos
    │   │
    │   ├── modules/
    │   │   ├── validators.js       # Validação estrita de CPF (Receita Federal) e Matrícula UNESP (Módulo 11)
    │   │   ├── formatters.js       # Formatadores de data, documentos e montagem de endereços
    │   │   ├── masks.js            # Máscaras de entrada em tempo real com feedback visual
    │   │   └── cep-service.js      # Consulta assíncrona inteligente de CEP com redundância
    │   │
    │   ├── templates/
    │   │   ├── preview-templates.js # Construtor dos blocos de pedido e anexos para o espelho A4 no DOM
    │   │   └── pdf-templates.js     # Construtor da estrutura vetorial pdfMake e estilos do PDF oficial
    │   │
    │   └── app.js                  # Orquestrador reativo, parâmetros de URL (?tipo=), zoom e geração do PDF
    │
    └── images/
        ├── fct-logo.png
        ├── unesp-logo-white.svg
        ├── unesp-logo.svg
        └── unesp.ico
```

---

## Requerimentos Contemplados e Regras de Negócio

| Requerimento | Perfil | Regime Elegível | Visto da Chefia | Base Legal / Normativa |
| :--- | :--- | :--- | :--- | :--- |
| **Adicional de Insalubridade** | Servidor | Exclusivo CLT | Obrigatório | Portaria UNESP nº 490/2015 e nº 86/2026; CLT arts. 189 e 192; NR-15 |
| **Contagem e Averbação de Tempo de Serviço/Contribuição** | Servidor | Todos | Opcional | Legislação previdenciária e estatutária vigente (ATS, sexta-parte, licença-prêmio e aposentadoria) |
| **Alteração de Dados Bancários** | Servidor | Todos | Dispensado | Crédito exclusivo no Banco do Brasil (001); titularidade exclusiva |
| **Isenção de Imposto de Renda** | Aposentado | Autárquico ou Efetivo | Dispensado | Lei Federal nº 7.713/1988, art. 6º, XIV; Lei Federal nº 9.250/1995, art. 30 |
| **Licença Gestante (Antes do parto)** | Servidora | Todos | Opcional/Recomendado | 180 dias automáticos; LC nº 1.054/2008 (Estatutária) ou Ofício Circular nº 16/2008 - PRAd (CLT) |
| **Licença Gestante (Após o parto)** | Servidora | Todos | Opcional/Recomendado | 180 dias automáticos mediante juntada de Certidão de Nascimento |
| **Licença Tratamento de Saúde** | Servidor | Exclusivo CLT | Obrigatório | Até 15 dias: UNESP (Ofício Circular nº 31/2008 - PRAd). >15 dias: INSS (Lei nº 8.213/1991) |
| **Auxílio Funeral** | Externo | Servidor Falecido Estatutário | Dispensado | Portaria UNESP nº 281/1997; ESUNESP art. 95 (cônjuge dispensado de comprovação de despesa) |

---

## Como Adicionar um Novo Requerimento (Padrão Automático)

A arquitetura modular e o motor de impressão foram projetados para que **qualquer novo modelo herde automaticamente** todo o padrão oficial de pré-visualização e impressão nativa em folha A4 única (Ctrl+P / botão Imprimir), sem necessidade de configurações adicionais de CSS de mídia print:

1. **Cadastrar os Metadados** em `assets/js/catalog/requerimentos.js`:
   - Definir `id`, `titulo`, `perfil` (`servidor` ou `externo`), `icone`, `classeDoc`, `destinatario` e regras de `regimesPermitidos` e `chefia`.
   - *Nota:* As regras de visto da chefia imediata (`obrigatoria`, `bloqueada`, etc.) e visibilidade de containers são lidas dinamicamente a partir deste catálogo.
2. **Definir o Formulário Específico** em `index.html`:
   - Criar uma `<div id="fields-[id]" class="form-grid dynamic-fields" style="display: none;">` com os campos necessários. O orquestrador gerencia a alternância de exibição automaticamente pelo padrão `fields-[id]`.
3. **Implementar a Pré-visualização** em `assets/js/templates/preview-templates.js`:
   - Adicionar o bloco `else if (tipo === '[id]')` preenchendo o corpo (`corpoEl`) e a lista de anexos (`anexosLista`).
4. **Padrão de Impressão Herdado Automaticamente:**
   - A folha A4 oficial (`.a4-page`), margens oficiais UNESP (`@page 20mm 20mm 10mm 20mm`), tipografia (Merriweather 11pt), ocultação de elementos web (barras, botões, formulários, rodapés) e formatação de texto em preto nítido aplicam-se por herança estrutural direta a qualquer novo modelo.
5. **Ajustar Dimensões e PDF Vetorial** em `assets/js/templates/pdf-templates.js`:
   - Adicionar a estrutura de download do PDF vetorial equivalente na função `gerarDefinicaoPdfMake(tipo)`.

---

## 🏛️ Base Oficial Unificada de Cargos e Funções (77 funções)

Todos os requerimentos e memorandos da STGP utilizam a mesma base oficial institucional padronizada (`assets/js/catalog/funcoes.js`):
- **Técnico-administrativo (66 funções):** Todos os cargos do Plano de Carreiras UNESP + *Técnico Administrativo Substituto*.
- **Docente (7 funções):** Cargos da Carreira Docente UNESP + *Professor Substituto* e *Professor Colaborador*.
- **Pesquisador (4 funções):** Cargos da Carreira de Pesquisador UNESP (*Pesquisador I* a *IV*).

