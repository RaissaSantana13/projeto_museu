<div align="center">
  <h1>Museu Virtual de Birigui</h1>
  <p><strong>Front-End &amp; UI/UX</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
    <img src="https://img.shields.io/badge/WCAG-OK-success?style=for-the-badge" alt="WCAG" />
  </p>
</div>

<hr />

<h3>1. Visão Geral &amp; Renderização (Next.js + React)</h3>
<ul>
  <li><b>SSR &amp; SSG:</b> Páginas públicas e acervo (alta performance e SEO).</li>
  <li><b>CSR:</b> Filtros em tempo real e visualizador 3D interativo.</li>
</ul>

<h3>2. Identidade Visual (Design System)</h3>
<ul>
  <li><b>Tipografia:</b> Fonte <i>Inter</i> (Bold para títulos; Regular/Medium para textos e menus).</li>
  <li><b>Paleta de Cores:</b>
    <ul>
      <li><code>Primária</code> <b>Ferrugem / Terra:</b> Destaques, cabeçalho e rodapé.</li>
      <li><code>Secundária</code> <b>Amarelo Mostarda:</b> Botões de ação (CTA) e alertas.</li>
      <li><code>Fundo</code> <b>Bege Claro / Off-White:</b> Reduz fadiga visual e destaca fotos históricas.</li>
      <li><code>Apoio</code> <b>Verde Oliva Claro:</b> Tags e categorias.</li>
    </ul>
  </li>
</ul>

<h3>3. Componentes Principais</h3>
<table width="100%">
  <thead>
    <tr>
      <th align="left">Componente</th>
      <th align="left">Função</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>Header / Footer</code></td><td>Navegação fixa com busca rápida e rodapé institucional.</td></tr>
    <tr><td><code>HeroBanner</code></td><td>Destaque principal com imagem de boas-vindas.</td></tr>
    <tr><td><code>ExhibitionCard</code></td><td>Cards de exposições com variações de cores do Design System.</td></tr>
    <tr><td><code>GalleryGrid</code></td><td>Grade de fotos históricas com <i>Lazy Loading</i>.</td></tr>
    <tr><td><code>3DViewer</code></td><td>Renderizador Three.js/WebGL isolado para arquivos <code>.glb</code>.</td></tr>
  </tbody>
</table>

<h3>4. Telas &amp; Rotas</h3>
<ul>
  <li><b>Home:</b> Banner principal, exposições em cartaz e destaques do acervo.</li>
  <li><b>Pesquisa &amp; Acervo:</b> Filtros dinâmicos e <i>Skeleton Screens</i> em tom bege.</li>
  <li><b>Detalhes da Obra:</b> Rota dinâmica (<code>/acervo/[id]</code>) com zoom IIIF, PDF ou 3D e metadados.</li>
</ul>

<h3>5. Integração &amp; Acessibilidade</h3>
<ul>
  <li><b>API REST:</b> Integração assíncrona (<code>fetch/axios</code>) com backend NestJS.</li>
  <li><b>Acessibilidade (WCAG):</b> Alto contraste (texto escuro / fundo bege) e navegação por teclado.</li>
  <li><b>Mobile-First (RNF01):</b> Layout responsivo adaptado para dispositivos móveis.</li>
</ul>

<h3>6. Paleta de Cores do Projeto</h3>
<div align="center">
  <!-- Substitua o caminho abaixo pelo caminho ou URL da sua imagem -->
  <img src="ImagemReadme/WhatsApp Image 2026-08-27 at 16.09.18.jpeg" width="50%" />
</div>

<hr />
<div align="center">
  <sub>Museu Virtual de Birigui • Preservação Cultural e Tecnologia</sub>
</div>


<div align="center">
  <h1>Backend de Museu Virtual de Birigui</h1>
  <p><strong>Plataforma web para digitalização e exploração do acervo histórico e cultural do município.</strong></p>
</div>

<hr>

<h2>Visão Geral</h2>
<p>O sistema de Museu Virtual de Birigui tem como objetivo digitalizar o acervo histórico e cultural do município de forma a aumentar a acessibilidade e interação. A plataforma permite que qualquer cidadão tenha acesso às obras, documentos e jornais diretamente por uma plataforma web. O sistema é acessível via navegador, sem necessidade de instalação, e conta com funcionalidades de busca, filtragem, visualização multimídia e navegação em tour virtual.</p>

<h2>Arquitetura e Tecnologias</h2>
<ul>
  <li><strong>Frontend:</strong> React / Next.js integrado com Three.js para renderização e visualização em 3D.</li>
  <li><strong>Backend:</strong> NestJS (Node.js) responsável pelo gerenciamento de banco de dados, autenticação e API.</li>
  <li><strong>Banco de Dados:</strong> PostgreSQL.</li>
</ul>

<h2>Requisitos Funcionais (Principais)</h2>
<ul>
  <li>Visualização completa do acervo digital, incluindo imagens com zoom, objetos 3D interativos e download de documentos PDF.</li>
  <li>Busca textual por palavras-chave (com busca especializada para jornais) e filtragem avançada por características, data e formato.</li>
  <li>Navegação imersiva por salas virtuais.</li>
  <li>Controle de status físico das peças, como Exposição, Reserva Técnica e Manutenção.</li>
  <li>Acesso responsivo (desktop e mobile) com garantia de acessibilidade e suporte a leitores de tela.</li>
  <li>Sistema de segurança para acesso administrativo com senhas criptografadas.</li>
  <li>Gerenciamento de agenda de eventos, com exibição de eventos em "Destaque" automatizada por data, e inscrição de visitantes e representantes.</li>
</ul>

<h2>Regras de Negócio e Restrições</h2>
<ul>
  <li>Todo item do acervo deve, obrigatoriamente, possuir um título e uma descrição.</li>
  <li>Apenas usuários com o perfil de administrador possuem permissão para alterar o acervo.</li>
  <li>Toda mídia inserida no sistema exige uma legenda preenchida para garantir a acessibilidade.</li>
  <li>Os arquivos originais (como imagens de alta resolução e modelos 3D) serão armazenados na nuvem, sendo salva no banco de dados apenas a sua respectiva URL.</li>
  <li>Obras nunca sofrem exclusão física no banco de dados, aplicando-se apenas a exclusão lógica.</li>
</ul>

<h2>Modelagem de Dados</h2>
<p>O banco de dados (PostgreSQL) está organizado nos seguintes domínios principais:</p>
<ul>
  <li><strong>Usuários:</strong> Gerencia os dados, perfis (admin, visitante, representanter) e autenticação.</li>
  <li><strong>Acervo Central:</strong> Tabelas centrais que armazenam informações do museu, obras (pinturas, esculturas, etc.) e mídias associadas.</li>
  <li><strong>Categorização:</strong> Estruturas para navegação e tags, incluindo categorias, salas espaciais e características das obras.</li>
  <li><strong>Interação:</strong> Gerencia o engajamento do público, armazenando favoritos, comentários (avaliações) e a estrutura completa de eventos e inscrições.</li>
</ul>

<h3>6. Modelagem do banco</h3>
<div align="center">
  <!-- Substitua o caminho abaixo pelo caminho ou URL da sua imagem -->
  <img src="ImagemReadme/WhatsApp Image 2026-08-27 at 16.09.18.jpeg" width="50%" />
</div>

<!-- 
  DICA: Se você tiver a imagem exportada do seu diagrama de banco de dados, 
  descomente a tag abaixo e substitua o link pelo caminho da sua imagem no repositório.
 
-->
<!--
<div align="center">
  <h3>Diagrama ER - Banco de Dados do Museu</h3>
  <img src="link_para_sua_imagem_do_diagrama_aqui.png" alt="Diagrama ER do banco de dados estruturando tabelas de usuários, obras, mídias e interações." width="800"/>
</div>
-->




