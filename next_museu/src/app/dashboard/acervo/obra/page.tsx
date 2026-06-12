'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react'; // <-- Importados para o Upload
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CadastrarObras() {
  // Estados para controlar o nome do arquivo e o preview da imagem
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formSchema = z.object({
    'text-0': z.string().optional(),
    'text-input-0': z.string().min(1, { message: 'O título é obrigatório' }),
    'text-input-5': z
      .string()
      .min(1, { message: 'O nome do artista é obrigatório' }),
    'file-input-0': z
      .string()
      .min(1, { message: 'A imagem da obra é obrigatória' }),
    'select-0': z.string().min(1, { message: 'Selecione uma categoria' }),
    'number-input-0': z.coerce.number().optional(),
    'textarea-0': z.string().min(1, { message: 'A descrição é obrigatória' }),
    'text-input-3': z.string().optional(),
    'select-1': z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'text-0': '',
      'text-input-0': '',
      'text-input-5': '',
      'file-input-0': '',
      'select-0': '',
      'number-input-0': 0,
      'textarea-0': '',
      'text-input-3': '',
      'select-1': 'excelente',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Dados do formulário:', values);
    // Aqui a sua Squad 1 fará a integração com o NestJS disparando o upload real
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
        {/* TÍTULO DA TELA */}
        <div className="col-span-12">
          <p className="leading-7">
            <span className="text-2xl font-bold tracking-tight">
              Adicionando uma Obra
            </span>
            <br />
            <span className="text-sm text-muted-foreground">
              Adicione uma nova obra de arte ou item histórico ao acervo do
              Museu.
            </span>
          </p>
          <hr className="mt-4 border-border/40" />
        </div>

        {/* INPUT: TÍTULO */}
        <Controller
          control={form.control}
          name="text-input-0"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Título</FieldLabel>
              <Input placeholder="Título da obra" type="text" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: ARTISTA */}
        <Controller
          control={form.control}
          name="text-input-5"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Artista / Autor</FieldLabel>
              <Input
                placeholder="Nome do artista ou autor"
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
          name="file-input-0"
          render={({ field: { onChange, value, ...field }, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Imagem da Obra</FieldLabel>

              <div className="w-full relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:bg-muted/40 transition-all group bg-background min-h-[160px]">
                {/* Input Invisível por cima para capturar cliques e arrastes */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setPreviewUrl(URL.createObjectURL(file));
                      onChange(file.name); // Atualiza o valor no react-hook-form
                    }
                  }}
                  {...field}
                />

                {/* Interface Visual Baseada se tem foto ou não */}
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3 z-20 text-center">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border shadow-sm"
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
                      Clique ou arraste para enviar a foto da obra
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Suporta PNG, JPG ou WEBP
                    </p>
                  </div>
                )}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* SELECT: CATEGORIA */}
        <Controller
          control={form.control}
          name="select-0"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Categoria</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pintura">Pintura / Quadro</SelectItem>
                  <SelectItem value="escultura">Escultura</SelectItem>
                  <SelectItem value="fotografia">
                    Fotografia Histórica
                  </SelectItem>
                  <SelectItem value="objeto">
                    Objeto Histórico / Arqueológico
                  </SelectItem>
                  <SelectItem value="outro">Outros</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: DIMENSÕES */}
        <Controller
          control={form.control}
          name="number-input-0"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Dimensões (em cm)
              </FieldLabel>
              <Input placeholder="Ex: 120" type="number" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* TEXTAREA: DESCRIÇÃO */}
        <Controller
          control={form.control}
          name="textarea-0"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Descrição / Contexto Histórico
              </FieldLabel>
              <Textarea
                placeholder="Conte a história, detalhes e curiosidades sobre esta peça do acervo..."
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: LOCALIZAÇÃO */}
        <Controller
          control={form.control}
          name="text-input-3"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Localização Física no Museu
              </FieldLabel>
              <Input
                placeholder="Ex: Ala Norte, Corredor B, Vitrine 4"
                type="text"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* SELECT: CONSERVAÇÃO */}
        <Controller
          control={form.control}
          name="select-1"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-6 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Estado de Conservação
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado atual da obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente">Excelente (Intacta)</SelectItem>
                  <SelectItem value="bom">Bom estado</SelectItem>
                  <SelectItem value="restauracao">
                    Necessita Restauração
                  </SelectItem>
                  <SelectItem value="danificado">Danificada</SelectItem>
                </SelectContent>
              </Select>
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
            variant="default"
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-bold"
          >
            Adicionar Obra ao Acervo
          </Button>
        </div>
      </div>
    </form>
  );
}
