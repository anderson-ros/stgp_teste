/**
 * Módulo de Validações — Portal de Requerimentos STGP
 * 
 * Regras estritas de validação de documentos oficiais:
 * 1. CPF (Receita Federal do Brasil)
 * 2. Matrícula Funcional UNESP (cálculo oficial em Módulo 11 com pesos [7, 6, 5, 4, 3, 2])
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.validators = factory();
    // Atalhos globais diretos para conveniência
    root.validarCPFReceitaFederal = root.PortalSTGP.validators.validarCPFReceitaFederal;
    root.calcularDigitoMatriculaExcel = root.PortalSTGP.validators.calcularDigitoMatriculaExcel;
    root.validarMatriculaUNESP = root.PortalSTGP.validators.validarMatriculaUNESP;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Validação oficial do CPF conforme regras da Receita Federal do Brasil.
   * Rejeita sequências de 11 dígitos repetidos (ex: 111.111.111-11)
   * e valida os dois dígitos verificadores via módulo 11.
   * 
   * @param {string} cpfLimpo - CPF contendo apenas números ou formatado
   * @returns {boolean}
   */
  function validarCPFReceitaFederal(cpfLimpo) {
    const str = (cpfLimpo || '').replace(/\D/g, '');
    if (str.length !== 11) return false;

    // Descartar sequências conhecidas de dígitos iguais
    if (/^(\d)\1{10}$/.test(str)) return false;

    // 1º Dígito Verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(str.charAt(i), 10) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dig1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (dig1 !== parseInt(str.charAt(9), 10)) return false;

    // 2º Dígito Verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(str.charAt(i), 10) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dig2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (dig2 !== parseInt(str.charAt(10), 10)) return false;

    return true;
  }

  /**
   * Cálculo do 7º dígito da Matrícula funcional UNESP.
   * Conversão exata da fórmula padrão da Seção de Pessoal:
   * Multiplicadores das posições 1 a 6: [7, 6, 5, 4, 3, 2]
   * Se Resto(Soma / 11) == 10, o dígito é 0; caso contrário, é o próprio resto.
   * 
   * @param {string|number} base - Base de 6 dígitos numéricos da matrícula
   * @returns {number|null} Dígito verificador (0-9) ou null se inválido
   */
  function calcularDigitoMatriculaExcel(base) {
    const limpo = String(base || '').replace(/\D/g, '');
    if (!limpo) return null;

    // Completa com zeros à esquerda se tiver menos de 6 dígitos
    const pad = limpo.padStart(6, '0').slice(-6);
    const d1 = parseInt(pad.charAt(0), 10);
    const d2 = parseInt(pad.charAt(1), 10);
    const d3 = parseInt(pad.charAt(2), 10);
    const d4 = parseInt(pad.charAt(3), 10);
    const d5 = parseInt(pad.charAt(4), 10);
    const d6 = parseInt(pad.charAt(5), 10);

    const soma = (d1 * 7) + (d2 * 6) + (d3 * 5) + (d4 * 4) + (d5 * 3) + (d6 * 2);
    const resto = soma % 11;
    return resto === 10 ? 0 : resto;
  }

  /**
   * Validação da Matrícula completa da UNESP (6 dígitos base + 1 dígito verificador).
   * 
   * @param {string} valor - Matrícula completa (ex: "123456-7" ou "1234567")
   * @returns {{ valido: boolean, incompleto: boolean, digitoCalculado?: number, digitoInformado?: number }}
   */
  function validarMatriculaUNESP(valor) {
    const limpo = (valor || '').replace(/\D/g, '');
    if (limpo.length < 2) return { valido: false, incompleto: true };

    const base = limpo.slice(0, -1);
    const digitoInformado = parseInt(limpo.slice(-1), 10);
    const digitoCalculado = calcularDigitoMatriculaExcel(base);

    if (limpo.length < 7) {
      return { valido: false, incompleto: true, digitoCalculado };
    }

    return {
      valido: digitoCalculado !== null && digitoInformado === digitoCalculado,
      incompleto: false,
      digitoCalculado,
      digitoInformado
    };
  }

  return {
    validarCPFReceitaFederal,
    calcularDigitoMatriculaExcel,
    validarMatriculaUNESP
  };
});
