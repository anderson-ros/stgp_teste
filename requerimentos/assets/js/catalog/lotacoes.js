/**
 * Catálogo Oficial de Lotações / Departamentos da FCT UNESP
 * Portal de Requerimentos STGP
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSTGP = root.PortalSTGP || {};
    root.PortalSTGP.catalog = root.PortalSTGP.catalog || {};
    root.PortalSTGP.catalog.lotacoes = factory();
    // Atalho global direto
    root.LOTACOES_FCT = root.PortalSTGP.catalog.lotacoes;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LOTACOES_FCT = [
    'Centro de Educação Infantil',
    'Departamento de Cartografia',
    'Departamento de Educação',
    'Departamento de Educação Física',
    'Departamento de Estatística',
    'Departamento de Física',
    'Departamento de Fisioterapia',
    'Departamento de Geografia',
    'Departamento de Matemática e Computação',
    'Departamento de Planejamento, Urbanismo e Ambiente',
    'Departamento de Química e Bioquímica',
    'Diretoria Técnica de Informática',
    'Diretoria Técnica de Serviços',
    'Seção de Atividades Auxiliares',
    'Seção de Conservação e Manutenção',
    'Seção Técnica Acadêmica',
    'Seção Técnica de Apoio ao Ensino, Pesquisa e Extensão',
    'Seção Técnica de Aquisição e Tratamento da Informação',
    'Seção Técnica de Comunicações',
    'Seção Técnica de Contabilidade',
    'Seção Técnica de Finanças',
    'Seção Técnica de Gestão de Pessoas',
    'Seção Técnica de Graduação',
    'Seção Técnica de Materiais',
    'Seção Técnica de Nutrição',
    'Seção Técnica de Pós-Graduação',
    'Seção Técnica de Referência, Atendimento ao Usuário e Documentação',
    'Seção Técnica de Saúde',
    'Setor de Transporte',
    'Setor de Vigilância'
  ];

  return LOTACOES_FCT;
});
