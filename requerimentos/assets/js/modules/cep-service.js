/**
 * Módulo de Busca de CEP com Redundância — Portal de Requerimentos STGP
 * 
 * Integração:
 * 1. Provedor Primário: ViaCEP (https://viacep.com.br/)
 * 2. Provedor Redundante 1: BrasilAPI (https://brasilapi.com.br/)
 * 3. Provedor Redundante 2: AwesomeAPI (https://cep.awesomeapi.com.br/)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.cepService = factory();
    // Atalhos globais diretos
    root.buscarCepComRedundancia = root.PortalSTGP.cepService.buscarCepComRedundancia;
    root.extrairTipoELogradouro = root.PortalSTGP.cepService.extrairTipoELogradouro;
    root.vincularBuscaCep = root.PortalSTGP.cepService.vincularBuscaCep;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Tipos de logradouro reconhecidos no formulário oficial (ordenados do mais longo para o mais curto)
  const TIPOS_LOGRADOURO = [
    'Estrada Municipal', 'Estrada Vicinal', 'Via de Acesso',
    'Alameda', 'Avenida', 'Beco', 'Buraco', 'Chácara', 'Condomínio',
    'Estância', 'Estrada', 'Fazenda', 'Granja', 'Largo', 'Lote',
    'Passeio', 'Praça', 'Prolongamento', 'Quadra', 'Rodovia', 'Rua',
    'Sítio', 'Travessa', 'Via', 'Viela'
  ];

  // Abreviaturas comuns mapeadas para os tipos oficiais
  const ABREVIACOES_TIPO = {
    'r.': 'Rua',
    'r': 'Rua',
    'av.': 'Avenida',
    'av': 'Avenida',
    'pç.': 'Praça',
    'pc.': 'Praça',
    'pca.': 'Praça',
    'al.': 'Alameda',
    'alam.': 'Alameda',
    'rod.': 'Rodovia',
    'tv.': 'Travessa',
    'trav.': 'Travessa',
    'est.': 'Estrada',
    'estr.': 'Estrada'
  };

  /**
   * Separa o tipo de logradouro do nome da via.
   * Ex: "Rua Roberto Simonsen" -> { tipo: "Rua", logradouro: "Roberto Simonsen" }
   * Ex: "Praça da Sé" -> { tipo: "Praça", logradouro: "da Sé" }
   * Ex: "Av. Paulista" -> { tipo: "Avenida", logradouro: "Paulista" }
   * 
   * @param {string} logradouroCompleto 
   * @returns {{ tipo: string, logradouro: string }}
   */
  function extrairTipoELogradouro(logradouroCompleto) {
    if (!logradouroCompleto || typeof logradouroCompleto !== 'string') {
      return { tipo: '', logradouro: '' };
    }

    const texto = logradouroCompleto.trim();
    if (!texto) return { tipo: '', logradouro: '' };

    // 1. Tentar correspondência com a lista de tipos oficiais (case-insensitive)
    for (const tipo of TIPOS_LOGRADOURO) {
      const regex = new RegExp(`^${tipo}\\b[\\s,.-]*`, 'i');
      if (regex.test(texto)) {
        const resto = texto.replace(regex, '').trim();
        return {
          tipo: tipo,
          logradouro: resto || texto
        };
      }
    }

    // 2. Tentar correspondência com abreviações comuns
    const primeiraPalavraMatch = texto.match(/^([^\s]+)[\s,.-]+(.*)$/);
    if (primeiraPalavraMatch) {
      const possivelAbrev = primeiraPalavraMatch[1].toLowerCase();
      if (ABREVIACOES_TIPO[possivelAbrev]) {
        return {
          tipo: ABREVIACOES_TIPO[possivelAbrev],
          logradouro: primeiraPalavraMatch[2].trim()
        };
      }
    }

    // 3. Caso não identifique o prefixo, mantém o texto integral no logradouro
    return {
      tipo: '',
      logradouro: texto
    };
  }

  /**
   * Realiza fetch com timeout utilizando AbortController.
   * 
   * @param {string} url 
   * @param {number} timeoutMs 
   * @returns {Promise<Response>}
   */
  function fetchComTimeout(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } })
      .finally(() => clearTimeout(timeoutId));
  }

  /**
   * Consulta o CEP no ViaCEP (Provedor Primário).
   * 
   * @param {string} cepLimpo - 8 dígitos numéricos
   * @returns {Promise<Object|null>}
   */
  async function consultarViaCep(cepLimpo) {
    try {
      const resp = await fetchComTimeout(`https://viacep.com.br/ws/${cepLimpo}/json/`, 4000);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.erro === true || data.erro === 'true') {
        return null;
      }
      return {
        sucesso: true,
        origem: 'ViaCEP',
        cep: data.cep || cepLimpo,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || '',
        cidadeUf: (data.localidade && data.uf) ? `${data.localidade}/${data.uf}` : (data.localidade || ''),
        complemento: data.complemento || ''
      };
    } catch (e) {
      console.warn('ViaCEP indisponível ou tempo limite atingido. Acionando contingência...', e);
      return null;
    }
  }

  /**
   * Consulta o CEP na BrasilAPI (Redundância 1).
   * 
   * @param {string} cepLimpo - 8 dígitos numéricos
   * @returns {Promise<Object|null>}
   */
  async function consultarBrasilApi(cepLimpo) {
    try {
      const resp = await fetchComTimeout(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`, 4000);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data || data.type === 'service_error' || data.name === 'CepPromiseError') {
        return null;
      }
      return {
        sucesso: true,
        origem: 'BrasilAPI (redundância)',
        cep: data.cep || cepLimpo,
        logradouro: data.street || '',
        bairro: data.neighborhood || '',
        localidade: data.city || '',
        uf: data.state || '',
        cidadeUf: (data.city && data.state) ? `${data.city}/${data.state}` : (data.city || ''),
        complemento: ''
      };
    } catch (e) {
      console.warn('BrasilAPI indisponível ou tempo limite atingido. Acionando contingência secundária...', e);
      return null;
    }
  }

  /**
   * Consulta o CEP na AwesomeAPI (Redundância 2).
   * 
   * @param {string} cepLimpo - 8 dígitos numéricos
   * @returns {Promise<Object|null>}
   */
  async function consultarAwesomeApi(cepLimpo) {
    try {
      const resp = await fetchComTimeout(`https://cep.awesomeapi.com.br/json/${cepLimpo}`, 4000);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data || data.status === 404 || data.code === 'not_found') {
        return null;
      }

      // AwesomeAPI já traz address_type separado quando disponível
      let logradouroFinal = data.address_name || data.address || '';
      let tipoFinal = data.address_type || '';

      return {
        sucesso: true,
        origem: 'AwesomeAPI (redundância)',
        cep: data.cep || cepLimpo,
        tipo: tipoFinal,
        logradouro: logradouroFinal,
        bairro: data.district || '',
        localidade: data.city || '',
        uf: data.state || '',
        cidadeUf: (data.city && data.state) ? `${data.city}/${data.state}` : (data.city || ''),
        complemento: ''
      };
    } catch (e) {
      console.warn('AwesomeAPI indisponível ou tempo limite atingido.', e);
      return null;
    }
  }

  /**
   * Executa busca com contingência/redundância:
   * 1. ViaCEP
   * 2. BrasilAPI
   * 3. AwesomeAPI
   * 
   * @param {string} cep 
   * @returns {Promise<Object>}
   */
  async function buscarCepComRedundancia(cep) {
    const cepLimpo = (cep || '').replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return { sucesso: false, erro: 'CEP inválido. O CEP deve conter 8 dígitos.' };
    }

    // 1. Tenta ViaCEP (Primário)
    let resultado = await consultarViaCep(cepLimpo);
    if (resultado) return resultado;

    // 2. Redundância 1: BrasilAPI
    resultado = await consultarBrasilApi(cepLimpo);
    if (resultado) return resultado;

    // 3. Redundância 2: AwesomeAPI
    resultado = await consultarAwesomeApi(cepLimpo);
    if (resultado) return resultado;

    return {
      sucesso: false,
      erro: 'CEP não encontrado nas bases de consulta (ViaCEP e bases de contingência).'
    };
  }

  /**
   * Preenche os campos do formulário associados a um prefixo ('ext_end_' ou 'srv_end_').
   * 
   * @param {string} prefixo 
   * @param {Object} dadosCep 
   */
  function preencherCamposEndereco(prefixo, dadosCep) {
    const selectTipo = document.getElementById(`${prefixo}tipo_logradouro`);
    const inputLogr = document.getElementById(`${prefixo}logradouro`);
    const inputNum = document.getElementById(`${prefixo}numero`);
    const inputCompl = document.getElementById(`${prefixo}complemento`);
    const inputBairro = document.getElementById(`${prefixo}bairro`);
    const inputCidade = document.getElementById(`${prefixo}cidade`);

    // Separar tipo e nome da via se não vier explicitamente
    let tipoIdentificado = dadosCep.tipo || '';
    let logradouroIdentificado = dadosCep.logradouro || '';

    if (!tipoIdentificado && logradouroIdentificado) {
      const extraido = extrairTipoELogradouro(logradouroIdentificado);
      tipoIdentificado = extraido.tipo;
      logradouroIdentificado = extraido.logradouro;
    }

    // Preencher Tipo de Logradouro
    if (selectTipo && tipoIdentificado) {
      // Procurar opção compatível
      let matchEncontrado = false;
      for (let i = 0; i < selectTipo.options.length; i++) {
        if (selectTipo.options[i].value.toLowerCase() === tipoIdentificado.toLowerCase()) {
          selectTipo.selectedIndex = i;
          matchEncontrado = true;
          break;
        }
      }
      if (!matchEncontrado && tipoIdentificado) {
        // Se não houver opção idêntica, mantém o tipo no início do logradouro
        logradouroIdentificado = `${tipoIdentificado} ${logradouroIdentificado}`;
      }
    }

    // Preencher Logradouro
    if (inputLogr && logradouroIdentificado) {
      inputLogr.value = logradouroIdentificado;
    }

    // Preencher Bairro
    if (inputBairro && dadosCep.bairro) {
      inputBairro.value = dadosCep.bairro;
    }

    // Preencher Cidade/UF
    if (inputCidade && dadosCep.cidadeUf) {
      inputCidade.value = dadosCep.cidadeUf;
    }

    // Preencher Complemento se estiver vazio no form e a base tiver trazido
    if (inputCompl && dadosCep.complemento && !inputCompl.value.trim()) {
      inputCompl.value = dadosCep.complemento;
    }

    // Focar no campo Número para continuidade natural do preenchimento
    if (inputNum) {
      inputNum.focus();
    }
  }

  /**
   * Conecta a busca automática de CEP ao input especificado.
   * 
   * @param {HTMLInputElement} inputCepElement 
   * @param {string} prefixo - 'ext_end_' ou 'srv_end_'
   * @param {HTMLElement} [statusElement] 
   * @param {Function} [onPreenchido] - Callback disparado após o preenchimento dos campos
   */
  function vincularBuscaCep(inputCepElement, prefixo, statusElement, onPreenchido) {
    if (!inputCepElement) return;

    let ultimoCepBuscado = '';
    let buscando = false;

    async function executarBusca() {
      const cepAtual = inputCepElement.value.replace(/\D/g, '');

      if (cepAtual.length === 0) {
        if (statusElement) {
          statusElement.textContent = '';
          statusElement.className = 'field-feedback';
        }
        inputCepElement.classList.remove('input-valid', 'input-invalid');
        ultimoCepBuscado = '';
        return;
      }

      if (cepAtual.length < 8) {
        if (statusElement) {
          statusElement.textContent = `Preencha os 8 dígitos (${cepAtual.length}/8)`;
          statusElement.className = 'field-feedback info';
        }
        inputCepElement.classList.remove('input-valid', 'input-invalid');
        return;
      }

      if (cepAtual === ultimoCepBuscado && !buscando) {
        return;
      }

      ultimoCepBuscado = cepAtual;
      buscando = true;

      if (statusElement) {
        statusElement.textContent = 'Buscando endereço...';
        statusElement.className = 'field-feedback loading';
      }
      inputCepElement.classList.remove('input-valid', 'input-invalid');

      try {
        const res = await buscarCepComRedundancia(cepAtual);

        if (res && res.sucesso) {
          preencherCamposEndereco(prefixo, res);

          if (statusElement) {
            statusElement.textContent = `✓ Endereço localizado via ${res.origem}`;
            statusElement.className = 'field-feedback valid';
          }
          inputCepElement.classList.remove('input-invalid');
          inputCepElement.classList.add('input-valid');

          if (typeof onPreenchido === 'function') {
            onPreenchido(res);
          }
        } else {
          if (statusElement) {
            statusElement.textContent = `✕ ${res.erro || 'CEP não encontrado.'}`;
            statusElement.className = 'field-feedback invalid';
          }
          inputCepElement.classList.remove('input-valid');
          inputCepElement.classList.add('input-invalid');
        }
      } catch (err) {
        console.error('Erro na rotina de busca de CEP:', err);
        if (statusElement) {
          statusElement.textContent = '✕ Erro ao consultar o CEP. Preencha manualmente.';
          statusElement.className = 'field-feedback invalid';
        }
        inputCepElement.classList.remove('input-valid');
        inputCepElement.classList.add('input-invalid');
      } finally {
        buscando = false;
      }
    }

    inputCepElement.addEventListener('input', () => {
      const v = inputCepElement.value.replace(/\D/g, '');
      if (v.length === 8) {
        executarBusca();
      } else if (v.length < 8 && statusElement) {
        if (v.length === 0) {
          statusElement.textContent = '';
          statusElement.className = 'field-feedback';
          inputCepElement.classList.remove('input-valid', 'input-invalid');
          ultimoCepBuscado = '';
        } else {
          statusElement.textContent = `Preencha os 8 dígitos (${v.length}/8)`;
          statusElement.className = 'field-feedback info';
          inputCepElement.classList.remove('input-valid', 'input-invalid');
        }
      }
    });

    inputCepElement.addEventListener('blur', () => {
      const v = inputCepElement.value.replace(/\D/g, '');
      if (v.length === 8 && v !== ultimoCepBuscado) {
        executarBusca();
      }
    });
  }

  return {
    TIPOS_LOGRADOURO,
    extrairTipoELogradouro,
    consultarViaCep,
    consultarBrasilApi,
    consultarAwesomeApi,
    buscarCepComRedundancia,
    preencherCamposEndereco,
    vincularBuscaCep
  };
});
