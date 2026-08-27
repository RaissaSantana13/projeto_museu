import { plainToInstance } from 'class-transformer';
import { Print } from '../../entities/print.entity';
import { PrintRequest } from '../request/print.request';
import { PrintResponse } from '../response/print.response';

export class PrintConverter {
  static toPrint(printRequest: PrintRequest): Print {
    return plainToInstance(Print, printRequest);
  }

  static toPrintResponse(print: Print): PrintResponse {
    return plainToInstance(PrintResponse, print, {
      excludeExtraneousValues: true,
    });
  }

  static toListPrintResponse(listaPrint: Print[]): PrintResponse[] {
    return plainToInstance(PrintResponse, listaPrint, {
      excludeExtraneousValues: true,
    });
  }
}
