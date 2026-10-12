/**
 * Módulo de Máscaras de Entrada e Feedback Visual em Tempo Real
 * Portal de Requerimentos STGP
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./validators'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./validators'));
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    const val = (root.PortalSTGP && root.PortalSTGP.validators) || root;
    root.PortalSTGP.masks = factory(val);
    // Atalhos globais diretos
    root.aplicarMascaraTelefone = root.PortalSTGP.masks.aplicarMascaraTelefone;
    root.aplicarMascaraCep = root.PortalSTGP.masks.aplicarMascaraCep;
    root.aplicarMascaraEValidarCPFGeneric = root.PortalSTGP.masks.aplicarMascaraEValidarCPFGeneric;
    root.aplicarMascaraEValidarMatriculaGeneric = root.PortalSTGP.masks.aplicarMascaraEValidarMatriculaGeneric;
  }
})(typeof self !== 'undefined' ? self : this, function (validators) {
  'use strict';

  const validarCPFReceitaFederal = (validators && validators.validarCPFReceitaFederal) ||
    (typeof window !== 'undefined' && window.validarCPFReceitaFederal);

  const validarMatriculaUNESP = (validators && validators.validarMatriculaUNESP) ||
    (typeof window !== 'undefined' && window.validarMatriculaUNESP);

  /**
   * Aplica máscara de telefone fixo ou celular: (18) 99999-9999 ou (18) 3222-2222
   * @param {HTMLInputElement} input 
   */
  function aplicarMascaraTelefone(input) {
    if (!input) return;
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);

    if (v.length > 10) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 6) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else if (v.length > 2) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      input.value = `(${v}`;
    }
  }

  /**
   * Aplica máscara de CEP: 00000-000
   * @param {HTMLInputElement} input 
   */
  function aplicarMascaraCep(input) {
    if (!input) return;
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) {
      input.value = `${v.slice(0, 5)}-${v.slice(5)}`;
    } else {
      input.value = v;
    }
  }

  /**
   * Aplica máscara de CPF com feedback visual em tempo real (válido/inválido/incompleto).
   * 
   * @param {HTMLInputElement} inputElement 
   * @param {HTMLElement} [statusElement] 
   */
  function aplicarMascaraEValidarCPFGeneric(inputElement, statusElement) {
    if (!inputElement) return;
    let v = inputElement.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);

    // Formatar no campo conforme digita
    let formatado = v;
    if (v.length > 9) {
      formatado = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      formatado = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      formatado = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    inputElement.value = formatado;

    // Feedback visual
    if (statusElement) {
      if (v.length === 0) {
        statusElement.textContent = '';
        statusElement.className = 'field-feedback';
        inputElement.classList.remove('input-valid', 'input-invalid');
      } else if (v.length < 11) {
        statusElement.textContent = `Preencha os 11 dígitos (${v.length}/11)`;
        statusElement.className = 'field-feedback info';
        inputElement.classList.remove('input-valid', 'input-invalid');
      } else {
        const isValido = validarCPFReceitaFederal ? validarCPFReceitaFederal(v) : true;
        if (isValido) {
          statusElement.textContent = '✓ CPF válido (Receita Federal)';
          statusElement.className = 'field-feedback valid';
          inputElement.classList.add('input-valid');
          inputElement.classList.remove('input-invalid');
        } else {
          statusElement.textContent = '⚠️ CPF inválido (dígitos verificadores incorretos)';
          statusElement.className = 'field-feedback invalid';
          inputElement.classList.add('input-invalid');
          inputElement.classList.remove('input-valid');
        }
      }
    }
  }

  /**
   * Aplica máscara de Matrícula funcional UNESP com feedback visual em tempo real.
   * 
   * @param {HTMLInputElement} inputElement 
   * @param {HTMLElement} [statusElement] 
   */
  function aplicarMascaraEValidarMatriculaGeneric(inputElement, statusElement) {
    if (!inputElement) return;
    let v = inputElement.value.replace(/[^\d-]/g, '');
    const digitos = v.replace(/\D/g, '');

    // Formatar no campo: se atingir 7 dígitos, separa com hífen
    if (digitos.length >= 7) {
      v = `${digitos.slice(0, 6)}-${digitos.slice(6, 7)}`;
    }
    inputElement.value = v;

    // Feedback visual
    if (statusElement) {
      if (digitos.length === 0) {
        statusElement.textContent = '';
        statusElement.className = 'field-feedback';
        inputElement.classList.remove('input-valid', 'input-invalid');
      } else if (digitos.length < 7) {
        statusElement.textContent = `Preencha os 6 dígitos + dígito (${digitos.length}/7)`;
        statusElement.className = 'field-feedback info';
        inputElement.classList.remove('input-valid', 'input-invalid');
      } else {
        const res = validarMatriculaUNESP ? validarMatriculaUNESP(digitos) : { valido: true };
        if (res.valido) {
          statusElement.textContent = '✓ Matrícula válida (dígito correto)';
          statusElement.className = 'field-feedback valid';
          inputElement.classList.add('input-valid');
          inputElement.classList.remove('input-invalid');
        } else {
          statusElement.textContent = `⚠️ Matrícula inválida (dígito correto: ${res.digitoCalculado})`;
          statusElement.className = 'field-feedback invalid';
          inputElement.classList.add('input-invalid');
          inputElement.classList.remove('input-valid');
        }
      }
    }
  }

  return {
    aplicarMascaraTelefone,
    aplicarMascaraCep,
    aplicarMascaraEValidarCPFGeneric,
    aplicarMascaraEValidarMatriculaGeneric
  };
});
