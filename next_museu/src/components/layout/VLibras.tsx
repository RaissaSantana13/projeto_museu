'use client';

import Script from 'next/script';

// Widget oficial do Governo Federal (vlibras.gov.br) — traduz o conteúdo da
// página para Língua Brasileira de Sinais. Não precisa de lógica própria,
// só carregar o script oficial e deixar a estrutura de divs que ele espera.
export default function VLibras() {
  return (
    <div {...{ vw: '' }} className="enabled">
      <div {...{ 'vw-access-button': '' }} className="active" />
      <div {...{ 'vw-plugin-wrapper': '' }}>
        <div className="vw-plugin-top-wrapper" />
      </div>

      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error — window.VLibras vem do script externo, sem tipos
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }}
      />
    </div>
  );
}
