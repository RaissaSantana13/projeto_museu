import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // "standalone" gera uma pasta .next/standalone com um server.js mínimo e
  // só os node_modules realmente usados em produção — essencial para uma
  // imagem Docker pequena (sem isso, o Dockerfile teria que copiar o
  // node_modules inteiro, que é bem maior).
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Permite todos os caminhos do Unsplash
      },
    ],
  },
};

export default nextConfig;
