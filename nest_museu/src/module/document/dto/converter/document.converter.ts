import { plainToInstance } from 'class-transformer';
import { Document } from '../../entities/document.entity';
import { DocumentRequest } from '../request/document.request';
import { DocumentResponse } from '../response/document.response';

export class DocumentConverter {
  static toDocument(documentRequest: DocumentRequest): Document {
    const document = plainToInstance(Document, documentRequest, {
      excludeExtraneousValues: false,
    });

    // idPrint não é uma coluna direta da entity (é a relação "print"),
    // então tratamos a montagem do relacionamento manualmente.
    if (documentRequest.idPrint) {
      document.print = { idPrint: documentRequest.idPrint } as any;
    } else {
      document.print = undefined;
    }

    return document;
  }

  static toDocumentResponse(document: Document): DocumentResponse {
    const response = plainToInstance(DocumentResponse, document, {
      excludeExtraneousValues: true,
    });

    response.idPrint = document.print?.idPrint;

    return response;
  }

  static toListDocumentResponse(listaDocument: Document[]): DocumentResponse[] {
    return listaDocument.map((document) =>
      DocumentConverter.toDocumentResponse(document),
    );
  }
}
