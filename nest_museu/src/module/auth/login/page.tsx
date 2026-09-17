'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
// Se você tiver um ícone de login, pode importar do lucide-react ou react-icons
// import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  }

  return (
    // Fundo bege do sistema
    <div className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4">
      {/* Card de Login */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Cabeçalho do Form */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#3B704D]">Museu Digital</h1>
          <p className="mt-2 text-sm text-gray-500">
            Acesse sua conta para continuar
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo E-mail */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#3A2F25]">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-800 focus:border-[#3B704D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B704D] transition-colors"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#3A2F25]">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-800 focus:border-[#3B704D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B704D] transition-colors"
              placeholder="••••••••"
              required
            />
            <div className="mt-1 flex justify-end">
              <a href="#" className="text-xs text-[#3B704D] hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          {/* Botão de Entrar (Com a cor marrom escuro do menu lateral) */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3A2F25] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2A211A]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <a
            href="/cadastro"
            className="font-bold text-[#3B704D] hover:underline"
          >
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
