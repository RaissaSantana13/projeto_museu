'use server'

export async function uploadImageAction(formData: FormData, type: string) {
  try {
    // Pegamos o arquivo do formData que veio do cliente
    const file = formData.get('file');

    if (!file) throw new Error("Nenhum arquivo enviado");

    // Criamos um novo FormData para enviar ao NestJS
    const nestFormData = new FormData();
    nestFormData.append('files', file); // 'files' é o nome esperado pelo NestJS

    const response = await fetch(`http://seu-api-nest:3000/media/upload?type=${type}`, {
      method: 'POST',
      body: nestFormData,
      // O Next.js Server Action lida com os headers de boundary automaticamente
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro no servidor NestJS');
    }

    const data = await response.json();
    
    // Retorna o array de caminhos que o seu NestJS já gera
    // data deve ser algo como: [{ originalPath: '...', thumbnailPath: '...' }]
    return { success: true, data: data[0] }; 

  } catch (error) {
    console.error("Erro na Action de Upload:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado no upload',
    };
  }
}