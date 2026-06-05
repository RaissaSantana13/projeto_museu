'use client';

import 'pannellum/src/css/pannellum.css';
import { useEffect, useRef } from 'react';

const SUPABASE_CDN_URL =
  'https://bpilpivecdbczmkkfdzo.supabase.co/storage/v1/object/public/fotos-360';

export function Museum360() {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let viewer: any;

    const loadPannellum = async () => {
      await import('pannellum');

      const lib = (window as any).pannellum;

      if (lib && viewerRef.current) {
        viewer = lib.viewer(viewerRef.current, {
          default: {
            firstScene: 'imagem1',
            sceneFadeDuration: 1000,
            autoLoad: true,
          },

          scenes: {
            imagem1: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/Imagem1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -2,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem2',
                },
              ],
            },

            imagem2: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/Imagem2.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 71,
                  type: 'scene',
                  text: 'Corredor de Salas',
                  sceneId: 'imagem3',
                },

                {
                  pitch: 0,
                  yaw: -72,
                  type: 'scene',
                  text: 'Corredor de salas',
                  sceneId: '',
                },
                {
                  pitch: 0,
                  yaw: -180,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem1',
                },
              ],
            },

            imagem3: {
              title: 'Corredor de salas',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/ImagemCorredor1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -185,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem2',
                },

                {
                  pitch: 1,
                  yaw: -5,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem6',
                },
                {
                  pitch: 2,
                  yaw: 22,
                  type: 'scene',
                  text: 'Entrar na Sala Indígena',
                  sceneId: 'imagem5',
                },
              ],
            },

            imagem5: {
              title: 'Sala Indígena',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/ImagemSalaIndigena.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -180,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem3',
                },
              ],
            },
            imagem6: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/corredor_nicoleu-ferroviaria.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -179,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem3',
                },
                {
                  pitch: 1,
                  yaw: -30,
                  type: 'scene',
                  text: 'Entrar na Sala Dona Irma ',
                  sceneId: 'imagem8',
                },
                {
                  pitch: 2,
                  yaw: 85,
                  type: 'scene',
                  text: 'Entrar na Sala Nicolau/Ferroviária',
                  sceneId: 'imagem7',
                },
                {
                  pitch: 3,
                  yaw: 5,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem9',
                },
              ],
            },
            imagem7: {
              title: 'Sala Nicolau/Ferroviaria',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_nicolau_ferroviaria.jpg
`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 83,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem6',
                },
              ],
            },
            imagem8: {
              title: 'Sala Dona Irma',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_dona_irma1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 0,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem6',
                },
              ],
            },
            imagem9: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/corredor_renato_someimagem.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 5,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem6',
                },
                {
                  pitch: 1,
                  yaw: 188,
                  type: 'scene',
                  text: 'Entrar na Sala do Rádio',
                  sceneId: 'imagem13',
                },
                {
                  pitch: 2,
                  yaw: 90,
                  type: 'scene',
                  text: 'Entrar na Sala Renato Cordeiro',
                  sceneId: 'imagem10',
                },
                {
                  pitch: 3,
                  yaw: -95,
                  type: 'scene',
                  text: 'Entrar na Sala Som e Imagem',
                  sceneId: 'imagem11',
                },
              ],
            },
            imagem10: {
              title: 'Sala Renato Cordeiro',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_renato1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 66,
                  type: 'scene',
                  text: 'Entrar na sala do Rádio',
                  sceneId: 'imagem14',
                },
                {
                  pitch: 1,
                  yaw: -117,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem9',
                },
              ],
            },
            imagem11: {
              title: 'Sala Som e Imagem',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_someimagem1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -80,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem12',
                },
                {
                  pitch: 1,
                  yaw: -177,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem9',
                },
              ],
            },
            imagem12: {
              title: 'Sala Som e Imagem',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_someimagem2.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 100,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem11',
                },
                {
                  pitch: 1,
                  yaw: -170,
                  type: 'scene',
                  text: 'Entrar na Sala do Rádio',
                  sceneId: 'imagem13',
                },
              ],
            },
            imagem13: {
              title: 'Sala do Radio',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_radio1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 0,
                  type: 'scene',
                  text: 'Corredor',
                  sceneId: 'imagem9',
                },
                {
                  pitch: 1,
                  yaw: -90,
                  type: 'scene',
                  text: 'Entrar na Sala do Rádio',
                  sceneId: 'imagem12',
                },
                {
                  pitch: 2,
                  yaw: 120,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem14',
                },
              ],
            },
            imagem14: {
              title: 'Sala do Radio',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/sala_radio3.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -96,
                  type: 'scene',
                  text: 'Entrar na Sala Renato Cordeiro',
                  sceneId: 'imagem10',
                },
                {
                  pitch: 1,
                  yaw: -178,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem13',
                },
              ],
            },
          },
        });
      }
    };

    loadPannellum();

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <section className="w-full pt-12 bg-muted/50 flex flex-col items-center">
      <div className="container px-4 md:px-6 mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Tour Virtual 360°
        </h2>

        <p className="mt-4 text-muted-foreground">
          Explore as salas do nosso museu sem sair de casa.
        </p>
      </div>

      <div ref={viewerRef} className="w-full aspect-video bg-black" />
    </section>
  );
}
