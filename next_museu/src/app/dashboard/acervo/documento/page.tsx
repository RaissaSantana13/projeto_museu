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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  FileText,
  Library,
  Search,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CadastrarDocumentos() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const formSchema = z.object({
    'doc-title': z
      .string()
      .min(1, { message: 'O título do documento é obrigatório' }),
    'doc-type': z.string().min(1, { message: 'Selecione o tipo de documento' }),
    'doc-date': z.date({
      required_error: 'A data ou ano do documento é obrigatória.',
    }),
    'doc-origin': z
      .string()
      .min(1, { message: 'Informe a origem ou fundo documental' }),
    'doc-tags': z.string().min(1, {
      message: 'Insira ao menos duas palavras-chave para busca rápida',
    }),
    'doc-summary': z
      .string()
      .min(1, { message: 'O resumo do conteúdo é essencial para a busca' }),
    'doc-file': z
      .string()
      .min(1, { message: 'O upload do documento digitalizado é obrigatório' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'doc-title': '',
      'doc-type': '',
      'doc-date': new Date(),
      'doc-origin': '',
      'doc-tags': '',
      'doc-summary': '',
      'doc-file': '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Dados do documento para indexação:', values);
    // Aqui os dados estruturados vão para o NestJS salvar no banco indexado
  }

  function onReset() {
    form.reset();
    form.clearErrors();
    setFileName(null);
    setFileType(null);
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
              <FileText className="size-6 text-green-800" />
              Cadastro e Indexação de Documentos
            </span>
            <br />
            <span className="text-sm text-muted-foreground">
              Preencha os campos detalhadamente. Os dados inseridos aqui
              alimentam a barra de pesquisa rápida do portal público.
            </span>
          </p>
          <hr className="mt-4 border-border/40" />
        </div>

        {/* INPUT: TÍTULO DO DOCUMENTO */}
        <Controller
          control={form.control}
          name="doc-title"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-8 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Título Oficial ou Nome do Documento
              </FieldLabel>
              <Input
                placeholder="Ex: Decreto Nº 143 - Criação da Primeira Escola Municipal"
                type="text"
                {...field}
              />
              <FieldDescription>
                Use nomes claros e oficiais. Facilita o cruzamento direto de
                dados.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* SELECT: TIPO DE DOCUMENTO */}
        <Controller
          control={form.control}
          name="doc-type"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-4 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">Tipo Documental</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decreto">Decreto / Lei</SelectItem>
                  <SelectItem value="carta">Carta / Correspondência</SelectItem>
                  <SelectItem value="ata">Ata de Reunião</SelectItem>
                  <SelectItem value="jornal">
                    Recorte de Jornal / Revista
                  </SelectItem>
                  <SelectItem value="certidao">
                    Certidão / Registro Civil
                  </SelectItem>
                  <SelectItem value="outro">
                    Outro documento manuscrito
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT: DATA DE EMISSÃO */}
        <Controller
          control={form.control}
          name="doc-date"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-4 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Data de Emissão / Assinatura
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

        {/* INPUT: ORIGEM / FUNDO HISTÓRICO */}
        <Controller
          control={form.control}
          name="doc-origin"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 md:col-span-8 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold flex items-center gap-1.5">
                <Library className="size-4 text-muted-foreground" />
                Origem / Fundo Documental / Doador
              </FieldLabel>
              <Input
                placeholder="Ex: Arquivo Municipal de Birigui ou Coleção Família Mellor"
                type="text"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT CRÍTICO: PALAVRAS-CHAVE (TAGS DE BUSCA RÁPIDA) */}
        <Controller
          control={form.control}
          name="doc-tags"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold flex items-center gap-1.5 text-green-800 dark:text-green-400">
                <Tag className="size-4" />
                Palavras-chave para Busca Rápida (Tags de Indexação)
              </FieldLabel>
              <Input
                placeholder="Ex: ferrovia, educação, café, imigração italiana, lei municipal"
                type="text"
                {...field}
              />
              <FieldDescription className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Search className="size-3" />
                Dica de Ouro: Digite os termos principais separados por vírgula.
                Quando o usuário digitar qualquer um deles na busca do site,
                este documento aparecerá primeiro.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT CUSTOMIZADO: UPLOAD DO DOCUMENTO DIGITALIZADO (PDF OU IMAGEM) */}
        <Controller
          control={form.control}
          name="doc-file"
          render={({ field: { onChange, value, ...field }, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Arquivo Digitalizado (PDF ou Imagem de Alta Resolução)
              </FieldLabel>

              <div className="w-full relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:bg-muted/40 transition-all group bg-background min-h-[140px]">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setFileType(file.type);
                      onChange(file.name);
                    }
                  }}
                  {...field}
                />

                {fileName ? (
                  <div className="flex items-center gap-3 z-20 bg-muted/60 px-4 py-2 rounded-lg border">
                    <FileText className="size-8 text-green-800 animate-bounce" />
                    <div className="text-left">
                      <p className="text-sm font-semibold max-w-xs truncate">
                        {fileName}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {fileType?.split('/')[1] || 'Documento'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFileName(null);
                        setFileType(null);
                        onChange('');
                      }}
                      className="ml-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow hover:scale-105 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-1 pointer-events-none">
                    <div className="p-3 bg-muted rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <Upload className="size-6" />
                    </div>
                    <p className="text-sm font-medium">
                      Clique ou arraste o arquivo do documento
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formatos recomendados: PDF (para várias páginas) ou
                      imagens em alta resolução
                    </p>
                  </div>
                )}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* INPUT CRÍTICO 2: RESUMO DO CONTEÚDO / TRANSCRIÇÃO */}
        <Controller
          control={form.control}
          name="doc-summary"
          render={({ field, fieldState }) => (
            <Field
              className="col-span-12 flex flex-col gap-2"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="font-semibold">
                Resumo do Conteúdo / Transcrição Parcial
              </FieldLabel>
              <Textarea
                placeholder="Insira um resumo do texto ou transcreva trechos importantes do documento. O motor de busca do portal lerá todas as palavras digitadas aqui dentro para encontrar o arquivo."
                className="min-h-[120px]"
                {...field}
              />
              <FieldDescription>
                Ex: Documento trata da concessão de terras na zona rural para a
                vinda dos trilhos da Noroeste do Brasil...
              </FieldDescription>
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
            Limpar Dados
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-bold"
          >
            Indexar e Salvar Documento
          </Button>
        </div>
      </div>
    </form>
  );
}
