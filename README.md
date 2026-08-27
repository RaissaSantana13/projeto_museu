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
