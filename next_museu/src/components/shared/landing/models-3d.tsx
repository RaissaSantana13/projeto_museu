'use client';

import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';

const SUPABASE_CDN_URL =
  'https://bpilpivecdbczmkkfdzo.supabase.co/storage/v1/object/public/modelos';

function GLTFModel({
  url,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  return (
    <primitive
      object={scene}
      dispose={null}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
}

interface ModelViewerProps {
  fileName: string;
  title?: string;
  description?: string;
  cameraDistance?: number;
  scale?: number;
  rotation?: [number, number, number];
}

export function ModelViewer({
  fileName,
  title = 'Exploração Interativa 3D',
  description = 'Clique, segure e arraste para visualizar a peça em todos os ângulos. Use o scroll para aplicar zoom.',
  cameraDistance = 3.2,
  scale = 1,
  rotation = [0, 0, 0],
}: ModelViewerProps) {
  const modelUrl = `${SUPABASE_CDN_URL}/${fileName}`;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="w-full max-w-5xl h-[500px] rounded-lg border bg-muted/10 relative overflow-hidden shadow-sm">
        {isMounted ? (
          <Canvas
            camera={{ position: [0, 0, cameraDistance], fov: 40 }}
            shadows
          >
            <ambientLight intensity={1.5} />

            <directionalLight
              position={[5, 10, 5]}
              intensity={2.5}
              castShadow
            />

            <Suspense fallback={null}>
              <Center>
                <GLTFModel url={modelUrl} scale={scale} rotation={rotation} />
              </Center>
            </Suspense>

            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              minDistance={0.5}
              maxDistance={cameraDistance * 3}
              autoRotate={true}
              autoRotateSpeed={0.4}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <p className="text-muted-foreground">A carregar ambiente 3D...</p>
          </div>
        )}
      </div>
    </div>
  );
}
