/**
 * Catálogo Oficial de Cargos e Funções por Categoria (UNESP)
 * Fonte: Plano de Carreiras UNESP / Base Oficial Unificada de Cargos e Funções
 * Categorias: Técnico-administrativo (66 funções), Docente (7 funções), Pesquisador (4 funções)
 * Total: 77 funções oficiais (incluindo funções temporárias: Professor Substituto, Professor Colaborador e Técnico Administrativo Substituto)
 */

const CATALOGO_CARGOS_FUNCOES = {
  tecnico: {
    categoriaNome: 'Técnico-administrativo',
    cargos: [
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
    ]
  },
  docente: {
    categoriaNome: 'Docente',
    cargos: [
      'Auxiliar de Ensino',
      'Professor Assistente',
      'Professor Assistente Doutor',
      'Professor Associado',
      'Professor Colaborador',
      'Professor Substituto',
      'Professor Titular'
    ]
  },
  pesquisador: {
    categoriaNome: 'Pesquisador',
    cargos: [
      'Pesquisador I',
      'Pesquisador II',
      'Pesquisador III',
      'Pesquisador IV'
    ]
  }
};

// Aliases para interoperabilidade ampla entre módulos e projetos
if (typeof window !== 'undefined') {
  window.CATALOGO_CARGOS_FUNCOES = CATALOGO_CARGOS_FUNCOES;
  window.FUNCOES_POR_CATEGORIA = {
    'Docente': CATALOGO_CARGOS_FUNCOES.docente.cargos,
    'docente': CATALOGO_CARGOS_FUNCOES.docente.cargos,
    'Pesquisador': CATALOGO_CARGOS_FUNCOES.pesquisador.cargos,
    'pesquisador': CATALOGO_CARGOS_FUNCOES.pesquisador.cargos,
    'Técnico Administrativo': CATALOGO_CARGOS_FUNCOES.tecnico.cargos,
    'Técnico-administrativo': CATALOGO_CARGOS_FUNCOES.tecnico.cargos,
    'Técnico-Administrativo': CATALOGO_CARGOS_FUNCOES.tecnico.cargos,
    'tecnico': CATALOGO_CARGOS_FUNCOES.tecnico.cargos
  };
}
