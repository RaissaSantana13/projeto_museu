'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowUpRight, X } from 'lucide-react';
import Image from 'next/image';
import { EventRegistration } from './event-registration';
import type { ProgramacaoSession } from './programacao-data';

export function EventRegistrationDialog({
  title,
  image,
  sessions,
}: {
  title: string;
  image: string;
  sessions: readonly ProgramacaoSession[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          id="inscricao"
          className="mt-7 min-h-11 scroll-mt-24 border border-[#f7c181]/40 bg-[#a54d0b] px-5 font-semibold text-[#fff4e3] hover:bg-[#9f4d0c] focus-visible:ring-[#f7c181]"
        >
          Inscrever-se <ArrowUpRight aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-60 bg-black/70 backdrop-blur-sm"
        className="z-70 flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 sm:max-w-2xl"
      >
        <DialogHeader className="relative shrink-0 flex-row items-center gap-3 border-b border-[#a54d0b] bg-[#472713] bg-linear-to-r from-[#321c11] to-[#653310] p-4 pr-14 text-left text-[#fff4e3] sm:gap-5 sm:p-6 sm:pr-16">
          <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md border border-[#f3dfaa]/35 bg-[#321c11] sm:w-28">
            <Image
              src={image}
              alt={`Cartaz do evento ${title}`}
              fill
              sizes="(min-width: 640px) 112px, 80px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <DialogDescription className="text-xs font-medium text-[#f3dfaa] sm:text-sm">
              {title}
            </DialogDescription>
            <DialogTitle className="mt-1 font-serif text-xl font-semibold sm:text-3xl">
              Inscrição no evento
            </DialogTitle>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Fechar inscrição"
              className="absolute top-4 right-4 text-[#fff4e3] hover:bg-white/15 hover:text-white"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Escolha a sessão e preencha os dados da inscrição.
          </p>
          <EventRegistration sessions={sessions} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
