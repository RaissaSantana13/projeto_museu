'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, UserRound } from 'lucide-react';
import { useState, useSyncExternalStore, type FormEvent } from 'react';
import type { ProgramacaoSession } from './programacao-data';

type RegistrationMode = 'pessoal' | 'escola';

type Confirmation = {
  day: string;
  time: string;
  mode: RegistrationMode;
  total: number;
};

const inputClass =
  'mt-1.5 min-h-11 w-full rounded-lg border border-input/75 bg-background/60 px-3 text-sm text-foreground transition-colors focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
const sessionOptionClass =
  'inline-flex min-h-10 items-center justify-center rounded-full border border-border/70 px-3.5 text-sm font-medium transition-colors hover:bg-muted peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring';
const registrationModes = [
  { value: 'pessoal', label: 'Pessoal', Icon: UserRound },
  { value: 'escola', label: 'Escola', Icon: GraduationCap },
] as const;
const schoolNameFields = [
  {
    name: 'students',
    label: 'Nomes dos alunos',
    hint: 'Um nome por linha, conforme a quantidade informada.',
  },
  {
    name: 'guardians',
    label: 'Nomes dos responsáveis',
    hint: 'Inclua pelo menos um responsável, um nome por linha.',
  },
];

const subscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;
function readNames(form: FormData, field: string) {
  return String(form.get(field) ?? '')
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function EventRegistration({
  sessions,
}: {
  sessions: readonly ProgramacaoSession[];
}) {
  const ready = useSyncExternalStore(subscribe, isClient, isServer);
  const [mode, setMode] = useState<RegistrationMode>('pessoal');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const selectedSession = sessions.find(({ day }) => day === selectedDay);

  function submitRegistration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const day = String(form.get('day') ?? '');
    const time = String(form.get('time') ?? '');
    const session = sessions.find((option) => option.day === day);

    if (!session?.times.includes(time)) {
      setError('Escolha um dia e um horário disponíveis.');
      return;
    }

    const phone = String(form.get('phone') ?? '').trim();
    const phoneDigits = phone
      .replace(/\D/g, '')
      .replace(/^55(?=\d{10,11}$)/, '');
    if (!/^[\d\s()+-]+$/.test(phone) || !/^\d{10,11}$/.test(phoneDigits)) {
      setError('Informe um telefone com DDD e 10 ou 11 dígitos.');
      return;
    }

    const cpf = String(form.get('cpf') ?? '').trim();
    if (!/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpf)) {
      setError('Informe um CPF com 11 dígitos.');
      return;
    }

    const companions = Number(form.get('companions'));
    const students = Number(form.get('classSize'));
    if (mode === 'pessoal') {
      if (!String(form.get('name') ?? '').trim()) {
        setError('Informe seu nome.');
        return;
      }
      if (!Number.isInteger(companions) || companions < 0 || companions > 3) {
        setError('A inscrição pessoal permite até 3 acompanhantes.');
        return;
      }
    } else {
      if (
        !String(form.get('school') ?? '').trim() ||
        !Number.isSafeInteger(students) ||
        students < 1
      ) {
        setError('Informe o nome da escola e a quantidade de alunos da turma.');
        return;
      }
      if (readNames(form, 'students').length !== students) {
        setError('Informe um nome por linha para cada aluno da turma.');
        return;
      }
      if (!readNames(form, 'guardians').length) {
        setError('Informe o nome de pelo menos um responsável pela turma.');
        return;
      }
    }

    setError('');
    setConfirmation({
      day,
      time,
      mode,
      total: mode === 'pessoal' ? companions + 1 : students,
    });
  }

  if (confirmation) {
    const participantLabel =
      confirmation.mode === 'escola'
        ? confirmation.total === 1
          ? 'aluno'
          : 'alunos'
        : confirmation.total === 1
          ? 'pessoa'
          : 'pessoas';

    return (
      <div className="mt-6 rounded-lg border border-border bg-background p-5">
        <div role="status">
          <p className="font-serif text-xl font-semibold">
            Resumo da inscrição
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {confirmation.mode === 'pessoal' ? 'Pessoal' : 'Escola'} ·{' '}
            {confirmation.day}, às {confirmation.time} · {confirmation.total}{' '}
            {participantLabel}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSelectedDay('');
            setConfirmation(null);
          }}
        >
          Preencher novamente
        </Button>
      </div>
    );
  }

  return (
    <form
      autoComplete="off"
      className="mt-5 space-y-6"
      onSubmit={submitRegistration}
    >
      <fieldset>
        <legend className="text-sm font-semibold">Tipo de inscrição</legend>
        <div className="mt-2 inline-grid max-w-full grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1">
          {registrationModes.map(({ value, label, Icon }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="mode"
                value={value}
                checked={mode === value}
                onChange={() => {
                  setMode(value);
                  setError('');
                }}
                className="peer sr-only"
              />
              <span className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium text-muted-foreground peer-checked:bg-card peer-checked:text-primary peer-checked:shadow-xs peer-focus-visible:outline-2 peer-focus-visible:outline-ring">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-x-4 gap-y-3 border-y border-border/65 py-4 min-[520px]:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-semibold">Dia da sessão</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {sessions.map(({ day }) => (
              <label key={day} className="cursor-pointer">
                <input
                  type="radio"
                  name="day"
                  value={day}
                  checked={selectedDay === day}
                  onChange={() => {
                    setSelectedDay(day);
                    setError('');
                  }}
                  required
                  className="peer sr-only"
                />
                <span className={sessionOptionClass}>{day}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {selectedSession ? (
          <fieldset key={selectedSession.day}>
            <legend className="text-sm font-semibold">Horário da sessão</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSession.times.map((time) => (
                <label key={time} className="cursor-pointer">
                  <input
                    type="radio"
                    name="time"
                    value={time}
                    required
                    className="peer sr-only"
                  />
                  <span className={sessionOptionClass}>{time}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="self-end pb-1 text-sm text-muted-foreground">
            Escolha um dia para ver os horários.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">
          {mode === 'escola' ? 'Dados da turma' : 'Participantes'}
        </legend>
        <div className="mt-3 grid gap-x-4 gap-y-4 min-[520px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <label key={mode} className="text-sm font-medium">
            {mode === 'escola' ? 'Nome da escola' : 'Seu nome'}
            <input
              name={mode === 'escola' ? 'school' : 'name'}
              type="text"
              required
              maxLength={mode === 'escola' ? 150 : 100}
              className={inputClass}
            />
          </label>
          {mode === 'pessoal' ? (
            <label className="text-sm font-medium">
              Número de acompanhantes
              <select
                name="companions"
                defaultValue="0"
                className={inputClass}
                aria-describedby="companions-hint"
              >
                <option value="0">Sem acompanhantes</option>
                <option value="1">1 acompanhante</option>
                <option value="2">2 acompanhantes</option>
                <option value="3">3 acompanhantes</option>
              </select>
              <span
                id="companions-hint"
                className="mt-1.5 block text-xs text-muted-foreground"
              >
                Você pode levar até 3 pessoas além de você.
              </span>
            </label>
          ) : (
            <>
              <div>
                <label
                  htmlFor="class-size"
                  className="block text-sm font-medium"
                >
                  Quantidade de alunos
                </label>
                <input
                  id="class-size"
                  name="classSize"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  required
                  aria-describedby="class-size-hint"
                  className={inputClass}
                />
                <p
                  id="class-size-hint"
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Sem contar os responsáveis.
                </p>
              </div>
              {schoolNameFields.map(({ name, label, hint }) => (
                <div key={name}>
                  <label
                    htmlFor={`${name}-names`}
                    className="text-sm font-medium"
                  >
                    {label}
                  </label>
                  <textarea
                    id={`${name}-names`}
                    name={name}
                    rows={4}
                    required
                    aria-describedby={`${name}-names-hint`}
                    className={`${inputClass} block py-2.5`}
                  />
                  <p
                    id={`${name}-names-hint`}
                    className="mt-2 text-xs text-muted-foreground"
                  >
                    {hint}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </fieldset>

      <fieldset
        aria-describedby={
          mode === 'escola' ? 'registration-contact-hint' : undefined
        }
      >
        <legend className="text-sm font-semibold">
          {mode === 'escola' ? 'Dados de um responsável' : 'Seus dados'}
        </legend>
        {mode === 'escola' && (
          <p
            id="registration-contact-hint"
            className="mt-1.5 text-xs text-muted-foreground"
          >
            Informe os dados de um responsável pela turma.
          </p>
        )}
        <div className="mt-3 grid gap-4 min-[520px]:grid-cols-2">
          <label className="text-sm font-medium min-[520px]:col-span-2">
            E-mail
            <input
              name="email"
              type="email"
              maxLength={254}
              required
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            Telefone com DDD
            <input
              name="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              maxLength={20}
              required
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            CPF
            <input
              name="cpf"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              maxLength={14}
              required
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end border-t border-border/65 pt-4">
        <Button type="submit" disabled={!ready} className="min-h-11">
          Revisar inscrição <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
