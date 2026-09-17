import { z } from 'zod';

const EventColorSchema = z.enum(['sky', 'amber', 'violet', 'rose', 'brown', 'orange']);

export const CalendarEventSchema = z
  .object({
    idEvent: z.string().uuid('O ID do evento é inválido'),

    title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(100, 'O título é muito longo'),

    description: z.string().optional(),

    // Usando as propriedades corretas que o Zod aceita no objeto de erro
    start_date: z.coerce.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: 'Data de término inválida',
    }),

    end_date: z.coerce.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: 'Data de término inválida',
    }),

    allDay: z.boolean().default(false).optional(),

    color: EventColorSchema.optional().default('sky'),

    location: z.string().max(100, 'Localização muito longa').optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'A data de término não pode ser anterior à data de início',
    path: ['end'],
  });

export type EventResponse = z.infer<typeof CalendarEventSchema>;
