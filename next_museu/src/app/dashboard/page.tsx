import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Image as ImageIcon, Library, Users } from 'lucide-react';
import { PageShell } from '../../components/shared/pageshell/page-shell';

export default function DashboardPage() {
  return (
    <PageShell title="Painel de Controle" description="Bem-vindo ao Sistema de Gestão do acervo histórico de Birigui.">
      <div className="flex flex-col gap-8">
        {/* Cards de Estatísticas (Tom sobre Tom) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-sidebar-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
              <Library className="h-4 w-4 text-secondary" /> {/* Ícone em Terracota */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">1.248</div>
              <p className="text-xs text-muted-foreground">+12 este mês</p>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fotos Digitalizadas</CardTitle>
              <ImageIcon className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">856</div>
              <p className="text-xs text-muted-foreground">72% do acervo</p>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">14</div>
              <p className="text-xs text-muted-foreground">Equipe da Cultura</p>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Acessos Públicos</CardTitle>
              <History className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">2.4k</div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Espaço para Atividades Recentes ou Gráficos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-serif">Últimas Inclusões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-sans">
                Aqui a Squad 1 pode integrar a lista dos últimos itens cadastrados no NestJS.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-serif">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Sincronização API:</span>
                  <span className="text-[#3A2F25] font-bold">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Banco de Dados:</span>
                  <span className="text-[#3A2F25] font-bold">Conectado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
