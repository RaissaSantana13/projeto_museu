'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // <-- ADICIONADO: Para traduzir o calendário e datas
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function DestaqueObras() {
  const formSchema = z.object({
    'text-0': z.string().optional(),
    'id-obra-input': z.coerce
      .number({
        invalid_type_error: 'Este campo precisa ser um número',
      })
      .min(1, { message: 'O ID da obra é obrigatório' }),
    'date-begin': z.date({
      required_error: 'A data de início é obrigatória.',
    }),
    'date-finish': z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'text-0': '',
      'id-obra-input': undefined, // Melhor começar vazio para o placeholder funcionar
      'date-begin': new Date(), // Default para o dia de hoje
      'date-finish': undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Dados do destaque:', values);
  }

  function onReset() {
    form.reset({
      'text-0': '',
      'id-obra-input': 0,
      'date-begin': new Date(),
      'date-finish': undefined,
    });
    form.clearErrors();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="space-y-8 p-6 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* CABEÇALHO DA TELA */}
        <div className="col-span-12">
          <p className="leading-7">
            <span className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Obras em Destaque
            </span>
            <br />
            <span className="text-sm text-muted-foreground">
              Defina quais obras do acervo receberão destaque na página
              principal e por quanto tempo.
            </span>
          </p>
          <hr className="mt-4 border-border/40" />
        </div>

        {/* INPUT: ID DA OBRA */}
        <Controller
          control={form.control}
          name="id-obra-input"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">ID da Obra</FieldLabel>
              <Input
                placeholder="Digite o número de identificação (ID) da obra"
                type="number"
                {...field}
                value={field.value || ''} // Evita o problema de renderizar '0' por padrão
              />
              <FieldDescription>
                O ID pode ser consultado na listagem geral do acervo.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* DATA DE INÍCIO */}
        <Controller
          control={form.control}
          name="date-begin"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Data de Início</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="justify-start text-left font-normal w-full"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })
                    ) : (
                      <span className="text-muted-foreground">
                        Escolha uma data
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value} // <-- CORRIGIDO: Mostra o dia selecionado na tela
                    onSelect={field.onChange}
                    initialFocus
                    locale={ptBR} // Tranduz o cabeçalho do calendário
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* DATA DE TÉRMINO */}
        <Controller
          control={form.control}
          name="date-finish"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Data de Término (Opcional)
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="justify-start text-left font-normal w-full"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })
                    ) : (
                      <span className="text-muted-foreground">
                        Deixar por tempo indeterminado
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value} // <-- CORRIGIDO: Mostra o dia selecionado na tela
                    onSelect={field.onChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
        <div className="col-span-12 flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-1/4"
          >
            Limpar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-bold"
          >
            Confirmar Destaque
          </Button>
        </div>
      </div>
    </form>
  );
}
