import { redirect } from 'next/navigation';

export default function DocumentosPage() {
  redirect('/acervo?tipo=documento');
}
