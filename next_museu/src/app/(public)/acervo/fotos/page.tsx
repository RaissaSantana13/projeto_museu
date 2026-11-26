import { redirect } from 'next/navigation';

export default function FotosPage() {
  redirect('/acervo?tipo=foto');
}
