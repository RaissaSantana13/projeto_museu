export const IMG_SPOTLIGHT_MESSAGES = {
  'pt-BR': {
    CREATED: 'Destaque de imagem criado com sucesso.',
    NOT_FOUND: 'Destaque de imagem não encontrado.',
    UPDATED: 'Destaque de imagem atualizado com sucesso.',
    DELETED: 'Destaque de imagem removido com sucesso.',
    ERROR: 'Ocorreu um erro ao processar a requisição.'
  },
  'en': {
    CREATED: 'Image spotlight created successfully.',
    NOT_FOUND: 'Image spotlight not found.',
    UPDATED: 'Image spotlight updated successfully.',
    DELETED: 'Image spotlight deleted successfully.',
    ERROR: 'An error occurred while processing the request.'
  },
  'es': {
    CREATED: 'Destacado de imagen creado con éxito.',
    NOT_FOUND: 'Destacado de imagen no encontrado.',
    UPDATED: 'Destacado de imagen actualizado con éxito.',
    DELETED: 'Destacado de imagen eliminado con éxito.',
    ERROR: 'Ocurrió un error al procesar la solicitud.'
  }
};

// Função auxiliar para pegar a mensagem com base no idioma (padrão pt-BR)
export const getMessage = (lang: string, key: keyof typeof IMG_SPOTLIGHT_MESSAGES['pt-BR']) => {
  const language = IMG_SPOTLIGHT_MESSAGES[lang as keyof typeof IMG_SPOTLIGHT_MESSAGES] || IMG_SPOTLIGHT_MESSAGES['pt-BR'];
  return language[key];
};