/**
 * Módulo de Formatadores e Utilitários — Portal de Requerimentos STGP
 * 
 * Funções para formatação de dados para documentos oficiais:
 * - CPF e Matrícula
 * - CEP e Telefones
 * - Datas (numérica pt-BR e por extenso)
 * - Cálculo de término de afastamento médico
 * - Montagem de endereços residenciais completos
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.formatters = factory();
    // Atalhos globais diretos para retrocompatibilidade
    root.formatarCPFParaDocumento = root.PortalSTGP.formatters.formatarCPFParaDocumento;
    root.formatarMatriculaParaDocumento = root.PortalSTGP.formatters.formatarMatriculaParaDocumento;
    root.formatarCep = root.PortalSTGP.formatters.formatarCep;
    root.formatarDataPtBr = root.PortalSTGP.formatters.formatarDataPtBr;
    root.obterDataExtenso = root.PortalSTGP.formatters.obterDataExtenso;
    root.calcularDataFimSaude = root.PortalSTGP.formatters.calcularDataFimSaude;
    root.obterEnderecoCompletoExterno = root.PortalSTGP.formatters.obterEnderecoCompletoExterno;
    root.obterEnderecoCompletoServidor = root.PortalSTGP.formatters.obterEnderecoCompletoServidor;
    root.numeroPorExtenso = root.PortalSTGP.formatters.numeroPorExtenso;
    root.formatarLinhaBlocoLP = root.PortalSTGP.formatters.formatarLinhaBlocoLP;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Formata o CPF para exibição oficial no documento (000.000.000-00).
   * 
   * @param {string} valor 
   * @returns {string}
   */
  function formatarCPFParaDocumento(valor) {
    if (!valor) return '[000.000.000-00]';
    const digitos = valor.replace(/\D/g, '');
    if (digitos.length === 11) {
      return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return valor;
  }

  /**
   * Formata a Matrícula funcional para exibição oficial no requerimento (123456-7).
   * 
   * @param {string} valor 
   * @returns {string}
   */
  function formatarMatriculaParaDocumento(valor) {
    if (!valor) return '[Matrícula]';
    const digitos = valor.replace(/\D/g, '');
    if (digitos.length === 7) {
      return `${digitos.slice(0, 6)}-${digitos.slice(6)}`;
    } else if (digitos.length > 1 && !valor.includes('-')) {
      return `${digitos.slice(0, -1)}-${digitos.slice(-1)}`;
    }
    return valor;
  }

  /**
   * Formata CEP (00000-000).
   * 
   * @param {string} cep 
   * @returns {string}
   */
  function formatarCep(cep) {
    const limpo = (cep || '').replace(/\D/g, '');
    if (limpo.length === 8) {
      return `${limpo.slice(0, 5)}-${limpo.slice(5)}`;
    }
    return cep || '';
  }

  /**
   * Formata data ISO (AAAA-MM-DD) para padrão brasileiro (DD/MM/AAAA).
   * 
   * @param {string} isoStr 
   * @returns {string}
   */
  function formatarDataPtBr(isoStr) {
    if (!isoStr) return '[data não informada]';
    const [ano, mes, dia] = isoStr.split('-');
    if (!dia || !mes || !ano) return isoStr;
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Gera a data atual por extenso no padrão de expediente da UNESP:
   * "07 de setembro de 2026"
   * 
   * @param {Date} [dataObj=new Date()]
   * @returns {string}
   */
  function obterDataExtenso(dataObj = new Date()) {
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();
    return `${dia} de ${mes} de ${ano}`;
  }

  /**
   * Calcula a data de término de um afastamento a partir da data de início e quantidade de dias.
   * Regra legal: Início dia 01 com 3 dias termina em 03 (dias - 1).
   * 
   * @param {string} inicioStr - Data ISO (AAAA-MM-DD)
   * @param {number|string} diasQtd - Quantidade de dias de afastamento
   * @returns {string} Data ISO calculada (AAAA-MM-DD) ou string vazia
   */
  function calcularDataFimSaude(inicioStr, diasQtd) {
    const dias = parseInt(diasQtd, 10);
    if (inicioStr && dias && dias > 0) {
      const partes = inicioStr.split('-');
      const dataInicio = new Date(partes[0], partes[1] - 1, partes[2]);
      dataInicio.setDate(dataInicio.getDate() + dias - 1);

      const ano = dataInicio.getFullYear();
      const mes = String(dataInicio.getMonth() + 1).padStart(2, '0');
      const dia = String(dataInicio.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }
    return '';
  }

  /**
   * Monta a linha estruturada de endereço residencial completo a partir de elementos do DOM.
   * 
   * @param {string} prefixo - 'ext_end_' ou 'srv_end_'
   * @returns {string}
   */
  function montarEnderecoPorPrefixo(prefixo) {
    const cidade = document.getElementById(`${prefixo}cidade`)?.value.trim() || '';
    const tipoLogr = document.getElementById(`${prefixo}tipo_logradouro`)?.value.trim() || '';
    const logr = document.getElementById(`${prefixo}logradouro`)?.value.trim() || '';
    const num = document.getElementById(`${prefixo}numero`)?.value.trim() || '';
    const compl = document.getElementById(`${prefixo}complemento`)?.value.trim() || '';
    const bairro = document.getElementById(`${prefixo}bairro`)?.value.trim() || '';
    const cep = document.getElementById(`${prefixo}cep`)?.value.trim() || '';

    let partes = [];
    if (tipoLogr && tipoLogr !== '-' && tipoLogr !== 'Outros' && logr) {
      if (logr.toLowerCase().startsWith(tipoLogr.toLowerCase() + ' ')) {
        partes.push(logr);
      } else {
        partes.push(`${tipoLogr} ${logr}`);
      }
    } else if (logr) {
      partes.push(logr);
    }

    if (num) partes.push(`nº ${num}`);
    if (compl) partes.push(compl);
    if (bairro) partes.push(`Bairro ${bairro}`);
    if (cidade) partes.push(cidade);
    if (cep) partes.push(`CEP ${formatarCep(cep)}`);

    return partes.length > 0 ? partes.join(', ') : '[Endereço Residencial Completo]';
  }

  function obterEnderecoCompletoExterno() {
    return montarEnderecoPorPrefixo('ext_end_');
  }

  function obterEnderecoCompletoServidor() {
    return montarEnderecoPorPrefixo('srv_end_');
  }

  /**
   * Converte número inteiro de 1 a 999 em palavras por extenso em português.
   * Útil para números de dias (ex: 60 -> "sessenta", 90 -> "noventa").
   * 
   * @param {number|string} n 
   * @returns {string}
   */
  function numeroPorExtenso(n) {
    const num = parseInt(n, 10);
    if (isNaN(num) || num <= 0) return '';
    if (num === 100) return 'cem';

    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    let partes = [];
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;

    if (c > 0) {
      partes.push(centenas[c]);
    }

    const resto = num % 100;
    if (resto >= 10 && resto <= 19) {
      partes.push(especiais[resto - 10]);
    } else {
      if (d > 0) partes.push(dezenas[d]);
      if (u > 0) partes.push(unidades[u]);
    }

    return partes.join(' e ');
  }

  /**
   * Formata a linha de saldo de bloco de licença-prêmio conforme o padrão do Modelo 03:
   * Ex: "60 (sessenta) dias correspondentes ao período aquisitivo de 27/05/2000 a 25/05/2005, conforme Portaria publicada no DOE de 22/09/2009;"
   * 
   * @param {number|string} dias 
   * @param {string} extenso 
   * @param {string} inicioStr 
   * @param {string} fimStr 
   * @param {string} doeStr 
   * @returns {string}
   */
  function formatarLinhaBlocoLP(dias, extenso, inicioStr, fimStr, doeStr) {
    const d = dias || '[dias]';
    const ext = extenso || (dias ? numeroPorExtenso(dias) : '[extenso]');
    const ini = formatarDataPtBr(inicioStr);
    const fim = formatarDataPtBr(fimStr);
    let doe = doeStr ? (doeStr.includes('/') ? doeStr : formatarDataPtBr(doeStr)) : '[data DOE]';
    if (doe.startsWith('DOE de ')) {
      doe = doe.replace('DOE de ', '');
    }
    return `${d} (${ext}) dias correspondentes ao período aquisitivo de ${ini} a ${fim}, conforme Portaria publicada no DOE de ${doe};`;
  }

  return {
    formatarCPFParaDocumento,
    formatarMatriculaParaDocumento,
    formatarCep,
    formatarDataPtBr,
    obterDataExtenso,
    calcularDataFimSaude,
    montarEnderecoPorPrefixo,
    obterEnderecoCompletoExterno,
    obterEnderecoCompletoServidor,
    numeroPorExtenso,
    formatarLinhaBlocoLP
  };
});
