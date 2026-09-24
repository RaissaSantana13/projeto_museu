import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Mail, MapPin, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full flex justify-center bg-muted/50 border-t pt-16 pb-8">
      <div className="container px-4 md:px-6">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Coluna 1: Branding e Endereço */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="font-serif text-2xl font-bold italic tracking-tighter">
              MUSEU<span className="text-primary underline"> DE BIRIGUI</span>
            </Link>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Praça James Mellor - Centro
                  <br />
                  Birigui - SP, CEP 16200-045
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@museudebirigui.org.br</span>
              </p>
              <p className="text-xs opacity-70 mt-4">Fundação Cultural • CNPJ: 00.000.000/0001-00</p>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h5 className="font-bold text-foreground mb-6">Institucional</h5>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Transparência
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Editais
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Social */}
          <div>
            <h5 className="font-bold text-foreground mb-6">Conecte-se</h5>
            <div className="flex gap-4">
              <Link
                href="#"
                className="p-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-all"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-all"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6 italic">Siga para acompanhar nossas novas exposições.</p>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Créditos Finais */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2026 Museu Virtual de Birigui. Todos os direitos reservados.</p>
          <p className="italic">Desenvolvido para preservação da memória de Birigui.</p>
        </div>
      </div>
    </footer>
  );
}
