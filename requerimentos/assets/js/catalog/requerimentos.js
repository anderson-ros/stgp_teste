/**
 * Catálogo e Metadados dos Requerimentos — Portal de Requerimentos STGP
 * Contém informações jurídicas, destinatários, regras de regime e de chefia imediata.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.catalog = root.PortalSTGP.catalog || {};
    root.PortalSTGP.catalog.requerimentos = factory();
    // Atalho global direto
    root.REQUERIMENTOS_CATALOGO = root.PortalSTGP.catalog.requerimentos;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const REQUERIMENTOS_CATALOGO = {
    'contagem_tempo': {
      id: 'contagem_tempo',
      titulo: 'Contagem e Averbação de Tempo de Serviço/Contribuição',
      perfil: 'servidor',
      icone: '⏱️',
      classeDoc: 'doc-contagem-tempo',
      fieldId: 'fields-contagem-tempo',
      cardTitle: '3. Detalhes da Contagem e Averbação de Tempo',
      cardSubtitle: 'Informe os dados do órgão/empresa de origem, período trabalhado e documentos comprobatórios.',
      destinatario: 'ILMO(A) SENHOR(A) SUPERVISOR(A) DA SEÇÃO TÉCNICA DE GESTÃO DE PESSOAS DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'CLT', 'Efetivo'],
      chefia: {
        obrigatoria: false,
        bloqueada: false,
        label: 'Incluir ciência / visto da chefia imediata (opcional)',
        hint: 'Se selecionado, o documento incluirá o campo formal de visto ("Ciente") da chefia imediata da lotação indicada.'
      },
      temEnderecoResidencial: false
    },

    'insalubridade': {
      id: 'insalubridade',
      titulo: 'Adicional de Insalubridade (Celetista - CLT)',
      perfil: 'servidor',
      icone: '☣️',
      classeDoc: 'doc-insalubridade',
      fieldId: 'fields-insalubridade',
      cardTitle: '3. Detalhes do Adicional de Insalubridade',
      cardSubtitle: 'Informe o motivo, data de início de exercício na atividade/local e ambiente de trabalho.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) TÉCNICO(A) ADMINISTRATIVO(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['CLT'],
      regimeObrigatorio: 'CLT',
      regimeHintId: 'regime-hint-insalubridade',
      chefia: {
        obrigatoria: true,
        bloqueada: true,
        label: 'É obrigatória a ciência / visto da chefia imediata neste requerimento',
        hint: 'O visto da chefia imediata é indispensável para comprovar o exercício e condições de trabalho (Portaria UNESP nº 490/2015).'
      },
      temEnderecoResidencial: false
    },

    'banco': {
      id: 'banco',
      titulo: 'Alteração de Dados Bancários',
      perfil: 'servidor',
      icone: '🏦',
      classeDoc: 'doc-banco',
      fieldId: 'fields-banco',
      cardTitle: '3. Detalhes da Alteração de Dados Bancários',
      cardSubtitle: 'Informe os dados da nova agência e conta corrente ou salário no Banco do Brasil.',
      destinatario: 'ILMO(A) SENHOR(A) SUPERVISOR(A) DA SEÇÃO TÉCNICA DE GESTÃO DE PESSOAS DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'CLT', 'Efetivo'],
      chefia: {
        obrigatoria: false,
        bloqueada: true,
        label: 'Dispensa de ciência / visto da chefia imediata',
        hint: 'Por tratar-se de dado particular/sigiloso, este requerimento não necessita de visto ou ciência da chefia imediata.'
      },
      temEnderecoResidencial: false
    },

    'isencao_ir': {
      id: 'isencao_ir',
      titulo: 'Isenção de Imposto de Renda',
      perfil: 'servidor',
      icone: '⚖️',
      classeDoc: 'doc-isencao-ir',
      fieldId: 'fields-isencao-ir',
      cardTitle: '3. Detalhes da Isenção de Imposto de Renda',
      cardSubtitle: 'Exclusivo para servidores aposentados estatutários portadores de moléstia grave.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'Efetivo'],
      regimeHintId: 'regime-hint-isencao',
      chefia: {
        obrigatoria: false,
        bloqueada: true,
        label: 'Dispensa de visto da chefia (Servidor(a) Aposentado(a))',
        hint: 'Servidor(a) aposentado(a) não possui subordinação a chefia imediata na ativa.'
      },
      temEnderecoResidencial: true
    },

    'gestante_antes': {
      id: 'gestante_antes',
      titulo: 'Licença Gestante/Maternidade (Antes do nascimento)',
      perfil: 'servidor',
      icone: '🤰',
      classeDoc: 'doc-gestante',
      fieldId: 'fields-gestante-antes',
      cardTitle: '3. Detalhes da Licença Gestante/Maternidade (Antes do nascimento)',
      cardSubtitle: 'Informe a data de início do afastamento e a data prevista do parto (DPP).',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'CLT', 'Efetivo'],
      chefia: {
        obrigatoria: true,
        bloqueada: false,
        label: 'É obrigatória a ciência / visto da chefia imediata neste requerimento',
        hint: 'Se selecionado, o documento incluirá o campo formal de visto ("Ciente") da chefia imediata da lotação indicada.'
      },
      temEnderecoResidencial: false
    },

    'gestante_apos': {
      id: 'gestante_apos',
      titulo: 'Licença Gestante/Maternidade (Após o nascimento)',
      perfil: 'servidor',
      icone: '👶',
      classeDoc: 'doc-gestante',
      fieldId: 'fields-gestante-apos',
      cardTitle: '3. Detalhes da Licença Gestante/Maternidade (Após o nascimento)',
      cardSubtitle: 'Informe a data do nascimento e o nome da criança.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'CLT', 'Efetivo'],
      chefia: {
        obrigatoria: true,
        bloqueada: false,
        label: 'É obrigatória a ciência / visto da chefia imediata neste requerimento',
        hint: 'Se selecionado, o documento incluirá o campo formal de visto ("Ciente") da chefia imediata da lotação indicada.'
      },
      temEnderecoResidencial: false
    },

    'saude': {
      id: 'saude',
      titulo: 'Licença para Tratamento de Saúde (Celetista - CLT)',
      perfil: 'servidor',
      icone: '🩺',
      classeDoc: 'doc-saude',
      fieldId: 'fields-saude',
      cardTitle: '3. Detalhes da Licença para Tratamento de Saúde',
      cardSubtitle: 'Informe a quantidade de dias e a data de início do afastamento.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['CLT'],
      regimeObrigatorio: 'CLT',
      regimeHintId: 'regime-hint-insalubridade',
      chefia: {
        obrigatoria: true,
        bloqueada: true,
        label: 'É obrigatória a ciência / visto da chefia imediata neste requerimento',
        hint: 'O visto da chefia imediata é obrigatório para servidores celetistas (Ofício Circular nº 31/2008 - PRAd).'
      },
      temEnderecoResidencial: false
    },

    'auxilio_funeral': {
      id: 'auxilio_funeral',
      titulo: 'Auxílio Funeral',
      perfil: 'externo',
      icone: '🕊️',
      classeDoc: 'doc-auxilio-funeral',
      fieldId: 'fields-auxilio-funeral',
      cardTitle: '3. Detalhes do Requerimento de Auxílio Funeral',
      cardSubtitle: 'Informe os dados do servidor falecido, forma de recebimento e documentos comprobatórios.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'Efetivo'],
      chefia: {
        obrigatoria: false,
        bloqueada: true,
        label: 'Dispensa de visto de chefia (Público Externo / Terceiros)',
        hint: 'Requerimento protocolado por familiar ou terceiro não envolve chefia funcional.'
      },
      temEnderecoResidencial: true
    },

    'licenca_premio_beneficiario': {
      id: 'licenca_premio_beneficiario',
      titulo: 'Indenização de Licença-Prêmio de Beneficiários',
      perfil: 'externo',
      icone: '📜',
      classeDoc: 'doc-lp-beneficiario',
      fieldId: 'fields-lp-beneficiario',
      cardTitle: '3. Detalhes da Indenização de Licença-Prêmio de Beneficiários',
      cardSubtitle: 'Informe os dados do(a) ex-servidor(a) falecido(a) e os blocos de licença-prêmio da Área de Gestão de Pessoas.',
      destinatario: 'ILMO(A) SENHOR(A) DIRETOR(A) DA DIVISÃO TÉCNICA ADMINISTRATIVA DA FACULDADE DE CIÊNCIAS E TECNOLOGIA DA UNESP - CÂMPUS DE PRESIDENTE PRUDENTE',
      regimesPermitidos: ['Autárquico', 'CLT', 'Efetivo'],
      chefia: {
        obrigatoria: false,
        bloqueada: true,
        label: 'Dispensa de visto de chefia (Público Externo / Beneficiários)',
        hint: 'Requerimento protocolado por beneficiário(a) de ex-servidor não envolve chefia funcional.'
      },
      temEnderecoResidencial: false
    }
  };

  return REQUERIMENTOS_CATALOGO;
});
