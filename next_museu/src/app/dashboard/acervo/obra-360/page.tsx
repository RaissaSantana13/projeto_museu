'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
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
import { Box, Info, Link2, MonitorPlay, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CadastrarObra360() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Importa a biblioteca do motor 3D apenas do lado do cliente (Next.js)
  useEffect(() => {
    import('@google/model-viewer').catch(console.error);
  }, []);

  const formSchema = z
    .object({
      'threed-title': z
        .string()
        .min(1, { message: 'O título da mídia é obrigatório' }),
      'threed-type': z
        .string()
        .min(1, { message: 'Selecione o tipo de mídia' }),
      'threed-embed': z.string().optional(),
      'threed-file': z.string().optional(),
      'threed-description': z.string().optional(),
    })
    .refine((data) => data['threed-embed'] || data['threed-file'], {
      message:
        'Você precisa fornecer um link ou fazer o upload do arquivo .glb.',
      path: ['threed-file'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'threed-title': '',
      'threed-type': 'glb', // Define o GLB como padrão
      'threed-embed': '',
      'threed-file': '',
      'threed-description': '',
    },
  });

  const watchMediaType = form.watch('threed-type');
  const watchEmbedUrl = form.watch('threed-embed');

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Mídia 360° salva:', values);
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
      className="space-y-8 p-6 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-12 gap-8">
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div>
            <p className="leading-7">
              <span className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Box className="size-6 text-green-800" />
                Cadastro de Modelos 3D (.glb)
              </span>
              <br />
              <span className="text-sm text-muted-foreground">
                Faça o upload do arquivo 3D para visualizar e girar a obra em
                tempo real.
              </span>
            </p>
            <hr className="mt-4 border-border/40" />
          </div>

          <Controller
            control={form.control}
            name="threed-title"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col gap-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel className="font-semibold">
                  Título da Visualização
                </FieldLabel>
                <Input
                  placeholder="Ex: Vaso Indígena Guarani (Digitalização 3D)"
                  type="text"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="threed-type"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col gap-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel className="font-semibold">
                  Formato do Arquivo
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    if (val === 'glb') form.setValue('threed-embed', '');
                    if (val === 'embed') {
                      setPreviewUrl(null);
                      setFileName(null);
                      form.setValue('threed-file', '');
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="glb">
                      Arquivo de Modelo 3D (.glb)
                    </SelectItem>
                    <SelectItem value="embed">
                      Link de Iframe (Sketchfab, Matterport, etc)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {watchMediaType === 'embed' && (
            <Controller
              control={form.control}
              name="threed-embed"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col gap-2 animate-in fade-in"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel className="font-semibold flex items-center gap-1.5">
                    <Link2 className="size-4" /> Link de Incorporação
                    (Embed/Iframe)
                  </FieldLabel>
                  <Input
                    placeholder="Cole a URL do iframe aqui..."
                    type="text"
                    {...field}
                  />
                  <FieldDescription>
                    Cole apenas o link fonte (src) do modelo hospedado fora.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {watchMediaType === 'glb' && (
            <Controller
              control={form.control}
              name="threed-file"
              render={({
                field: { onChange, value, ...field },
                fieldState,
              }) => (
                <Field
                  className="flex flex-col gap-2 animate-in fade-in"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel className="font-semibold">
                    Upload do Arquivo 3D (.glb)
                  </FieldLabel>
                  <div className="w-full relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:bg-muted/40 transition-all bg-background min-h-[120px]">
                    <input
                      type="file"
                      accept=".glb"
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
                    <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                      <div className="p-3 bg-muted rounded-full text-muted-foreground">
                        <Upload className="size-5" />
                      </div>
                      <p className="text-sm font-medium">
                        Arraste ou clique para carregar o arquivo .glb
                      </p>
                    </div>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="threed-description"
            render={({ field, fieldState }) => (
              <Field
                className="flex flex-col gap-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel className="font-semibold">
                  Notas sobre a Digitalização
                </FieldLabel>
                <Textarea
                  placeholder="Qual equipamento foi usado? A escala está em 1:1?"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-4 pt-4">
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
              Salvar Modelo no Acervo
            </Button>
          </div>
        </div>

        {/* COLUNA DIREITA: VISOR DE PRÉ-VISUALIZAÇÃO AO VIVO */}
        <div className="col-span-12 lg:col-span-5 relative mt-6 lg:mt-0">
          <div className="sticky top-6 p-1 bg-gradient-to-b from-border/50 to-transparent rounded-2xl">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden h-[450px] flex flex-col">
              {/* Barra de Título do Visor */}
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <MonitorPlay className="size-4 text-green-800" />
                <h3 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
                  Motor de Renderização 3D
                </h3>
              </div>

              {/* Área do Player/Imagem */}
              <div className="flex-1 bg-gradient-to-tr from-gray-100 to-gray-50 dark:from-zinc-900 dark:to-zinc-800 relative flex items-center justify-center overflow-hidden">
                {/* PREVIEW 1: LINK IFRAME */}
                {watchMediaType === 'embed' && watchEmbedUrl ? (
                  <iframe
                    src={watchEmbedUrl}
                    className="w-full h-full border-0 animate-in fade-in"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                ) : watchMediaType === 'embed' && !watchEmbedUrl ? (
                  <div className="text-center p-6 text-muted-foreground flex flex-col items-center gap-2">
                    <Link2 className="size-8 opacity-20" />
                    <p className="text-sm">
                      Cole o link ao lado para carregar o modelo 3D.
                    </p>
                  </div>
                ) : null}

                {/* PREVIEW 2: MODELO 3D .GLB (UPLOAD) */}
                {watchMediaType === 'glb' && previewUrl ? (
                  <div className="w-full h-full relative animate-in fade-in cursor-grab active:cursor-grabbing">
                    {/* @ts-ignore - Evita erro de tipagem no Web Component */}
                    <model-viewer
                      src={previewUrl}
                      alt="Modelo 3D"
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                      }}
                    ></model-viewer>

                    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
                      <p className="text-black dark:text-white text-xs text-center drop-shadow-md flex justify-center items-center gap-2">
                        <Info className="size-4" /> Use o mouse para rotacionar
                        • Scroll para zoom
                      </p>
                    </div>

                    {/* Botão flutuante para remover modelo */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFileName(null);
                        setPreviewUrl(null);
                        form.setValue('threed-file', '');
                      }}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-destructive text-white rounded-full transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : watchMediaType === 'glb' && !previewUrl ? (
                  <div className="text-center p-6 text-muted-foreground flex flex-col items-center gap-2">
                    <Box className="size-10 opacity-20" />
                    <p className="text-sm font-medium">
                      Motor 3D Aguardando Arquivo
                    </p>
                    <p className="text-xs">
                      Faça o upload do .glb ao lado para renderizar o objeto.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
