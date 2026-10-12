/**
 * Catálogo Oficial de Funções por Categoria do Servidor — FCT UNESP
 * Portal de Requerimentos STGP
 * Fonte: Plano de Carreiras UNESP / Base Oficial Unificada de Cargos e Funções
 * Categorias: Técnico-administrativo (66 funções), Docente (7 funções), Pesquisador (4 funções)
 * Total: 77 funções oficiais (incluindo funções temporárias: Professor Substituto, Professor Colaborador e Técnico Administrativo Substituto)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.catalog = root.PortalSTGP.catalog || {};
    root.PortalSTGP.catalog.funcoes = factory();
    // Atalho global direto
    root.FUNCOES_POR_CATEGORIA = root.PortalSTGP.catalog.funcoes;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CARGOS_TECNICOS = [
    'Administrador',
    'Advogado',
    'Agente de Vigilância e Recepção',
    'Analista de Informática I',
    'Analista de Informática II',
    'Arquiteto',
    'Assistente Administrativo II',
    'Assistente de Informática II',
    'Assistente de Suporte Acadêmico II',
    'Assistente de Suporte Acadêmico III',
    'Assistente de Suporte Acadêmico IV',
    'Assistente de Telefonia',
    'Assistente Operacional II',
    'Assistente Operacional III',
    'Assistente Social',
    'Assistente Técnico Administrativo I',
    'Assistente Técnico Administrativo II',
    'Auxiliar Agropecuário',
    'Auxiliar em Saúde Bucal',
    'Bibliotecário',
    'Biólogo',
    'Biomédico',
    'Cirurgião Dentista',
    'Contador',
    'Discotecário Programador',
    'Economista',
    'Enfermeiro',
    'Engenheiro',
    'Engenheiro Agrônomo',
    'Farmacêutico',
    'Físico',
    'Fisioterapeuta',
    'Fonoaudiólogo',
    'Historiógrafo',
    'Jornalista',
    'Locutor',
    'Médico',
    'Médico Sanitarista',
    'Médico Veterinário',
    'Meteorologista',
    'Motorista',
    'Nutricionista',
    'Oficial de Serviços Gráficos',
    'Oficial em Aparelhos de Precisão',
    'Operador de Forno Incinerador',
    'Operador de Máquinas',
    'Operador de Rádio',
    'Pedagogo',
    'Produtor',
    'Psicólogo',
    'Químico',
    'Regente de Coral',
    'Relações Públicas',
    'Revisor',
    'Salva Vidas',
    'Técnico Administrativo Substituto',
    'Técnico Agropecuário',
    'Técnico de Contabilidade',
    'Técnico de Necropsia',
    'Técnico em Eletrônica',
    'Técnico em Radiologia',
    'Técnico em Segurança do Trabalho',
    'Tecnólogo',
    'Terapeuta Ocupacional',
    'Topógrafo',
    'Zootecnista'
  ];

  const CARGOS_DOCENTES = [
    'Auxiliar de Ensino',
    'Professor Assistente',
    'Professor Assistente Doutor',
    'Professor Associado',
    'Professor Colaborador',
    'Professor Substituto',
    'Professor Titular'
  ];

  const CARGOS_PESQUISADORES = [
    'Pesquisador I',
    'Pesquisador II',
    'Pesquisador III',
    'Pesquisador IV'
  ];

  const FUNCOES_POR_CATEGORIA = {
    'Docente': CARGOS_DOCENTES,
    'docente': CARGOS_DOCENTES,
    'Pesquisador': CARGOS_PESQUISADORES,
    'pesquisador': CARGOS_PESQUISADORES,
    'Técnico Administrativo': CARGOS_TECNICOS,
    'Técnico-administrativo': CARGOS_TECNICOS,
    'Técnico-Administrativo': CARGOS_TECNICOS,
    'tecnico': CARGOS_TECNICOS
  };

  return FUNCOES_POR_CATEGORIA;
});
