export function criarMensagensOperacao(ENTITY_NAME: string) {
  return {
    SALVAR: {
      ACAO: `Criar novo cadastro de ${ENTITY_NAME} no sistema.`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi criado com sucesso.`,
      ERRO: `Falha na criação do cadastro de ${ENTITY_NAME} no sistema.`,
      EXISTE: `${ENTITY_NAME} já está cadastrado no sistema.`,
    },
    ATUALIZAR: {
      ACAO: `Atualizar o cadastro de ${ENTITY_NAME} no sistema.`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi atualizado com sucesso.`,
      ERRO: `Falha na atualização do cadastro de ${ENTITY_NAME} no sistema.`,
      NAO_LOCALIZADO: `O código informado do cadastro de ${ENTITY_NAME} não foi localizado no sistema.`,
    },
    PORID: {
      ACAO: `Mostrar o cadastro de ${ENTITY_NAME} por um identificador único no sistema.`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi localizado com sucesso no sistema.`,
      ERRO: `O cadastro de ${ENTITY_NAME} não foi localizado no sistema.`,
      NAO_LOCALIZADO: `O código informado do cadastro de ${ENTITY_NAME} não foi localizado no sistema.`,
    },
    EXCLUIR: {
      ACAO: `Excluir o cadastro de ${ENTITY_NAME} por um identificador único no sistema.`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi excluído com sucesso no sistema.`,
      ERRO: `Falha na exclusão do cadastro de ${ENTITY_NAME} no sistema.`,
      NAO_LOCALIZADO: `O código informado do cadastro de ${ENTITY_NAME} não foi localizado no sistema.`,
    },
    LISTAR: {
      ACAO: `Listagem dos cadastros de ${ENTITY_NAME} existentes no sistema.`,
      SUCESSO: `A consulta dos cadastros de ${ENTITY_NAME} foi realizada com sucesso no sistema.`,
      ERRO: `Falha na consulta dos cadastros de ${ENTITY_NAME} no sistema.`,
    },
  };
}
