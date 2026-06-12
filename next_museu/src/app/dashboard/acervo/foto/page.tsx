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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Camera, MapPin, Upload, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CadastrarFotos() {
  // Estados para controlar o nome do arquivo e o preview da imagem
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formSchema = z.object({
    'photo-title': z
      .string()
      .min(1, { message: 'O título ou legenda da foto é obrigatório' }),
    'photo-date': z.date({
      required_error: 'A data em que a foto foi tirada é obrigatória.',
    }),
    'photo-people': z.string().min(1, {
      message: "Informe quem está na foto (ou digite 'Não identificado')",
    }),
    'photo-location': z
      .string()
      .min(1, { message: 'O local onde a foto foi tirada é obrigatório' }),
    'photo-file': z
      .string()
      .min(1, { message: 'O upload da foto é obrigatório' }),
    'photo-description': z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'photo-title': '',
      'photo-date': new Date(),
      'photo-people': '',
      'photo-location': '',
      'photo-file': '',
      'photo-description': '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Dados da foto cadastrada:', values);
    // Aqui sua Squad integra com o backend NestJS enviando os dados e o arquivo
  }

  function onReset() {
    form.reset();
    form.clearErrors();
    setFileName(null);
    setPreviewUrl(null);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="space-y-8 p-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* CABEÇALHO DA TELA */}
        <div className="col-span-12">
          <p className="leading-7">
            <span className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Camera className="size-6 text-green-800" />
              Cadastro de Fotos Históricas
            </span>
            <br />
            <span className="text-sm text-muted-foreground">
              Adicione fotografias, registros visuais e retratos antigos ao
              acervo digital do Museu.
            </span>
          </p>
          <hr className="mt-4 border-border/40" />
        </div>

        {/* INPUT: TÍTULO / LEGENDA */}
        <Controller
          control={form.control}
          name="photo-title"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-8 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Título ou Legenda da Foto
              </FieldLabel>
              <Input
                placeholder="Ex: Inauguração da Estação Ferroviária de Birigui"
                type="text"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: DATA DA FOTO */}
        <Controller
          control={form.control}
          name="photo-date"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-4 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Data da Fotografia
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
                        Escolha a data
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
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

        {/* INPUT: QUEM ESTÁ NA FOTO */}
        <Controller
          control={form.control}
          name="photo-people"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold flex items-center gap-1.5">
                <Users className="size-4 text-muted-foreground" />
                Quem está na foto? (Pessoas Identificadas)
              </FieldLabel>
              <Input
                placeholder="Ex: Prefeito Nicolau da Silva, Governador e cidadãos locais"
                type="text"
                {...field}
              />
              <FieldDescription>
                Liste os nomes separados por vírgula se houver mais de um.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: ONDE FOI TIRADA */}
        <Controller
          control={form.control}
          name="photo-location"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold flex items-center gap-1.5">
                <MapPin className="size-4 text-muted-foreground" />
                Onde foi tirada? (Local do Registro)
              </FieldLabel>
              <Input
                placeholder="Ex: Praça James Mellor, Centro, Birigui - SP"
                type="text"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT CUSTOMIZADO: UPLOAD DE IMAGEM */}
        <Controller
          control={form.control}
          name="photo-file"
          render={({ field: { onChange, value, ...field }, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Arquivo da Foto</FieldLabel>

              <div className="w-full relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:bg-muted/40 transition-all group bg-background min-h-[180px]">
                {/* Input Invisível para capturar o arquivo */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setPreviewUrl(URL.createObjectURL(file));
                      onChange(file.name);
                    }
                  }}
                  {...field}
                />

                {/* Pré-visualização da imagem enviada */}
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3 z-20 text-center">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview Fotografia"
                        className="h-40 w-40 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFileName(null);
                          setPreviewUrl(null);
                          onChange('');
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow hover:scale-105 transition-transform"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <span className="text-sm font-medium max-w-xs truncate text-muted-foreground">
                      {fileName}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                    <div className="p-3 bg-muted rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <Upload className="size-6" />
                    </div>
                    <p className="text-sm font-medium">
                      Clique ou arraste para fazer o upload da fotografia
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PNG, JPG, JPEG ou WEBP
                    </p>
                  </div>
                )}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: DESCRIÇÃO / CONTEXTO ADICIONAL */}
        <Controller
          control={form.control}
          name="photo-description"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Notas Históricas / Descrição Física
              </FieldLabel>
              <Textarea
                placeholder="Descreva o estado físico da foto (ex: em preto e branco, levemente gasta nas bordas) ou detalhes históricos importantes da cena..."
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* BOTÕES DE AÇÃO */}
        <div className="col-span-12 flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-1/4"
          >
            Limpar Campos
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-bold"
          >
            Cadastrar Foto no Acervo
          </Button>
        </div>
      </div>
    </form>
  );
}
