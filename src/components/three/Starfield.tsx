import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../theme/ThemeProvider';

function Drift() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.012;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.06, 2, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.06, 2, dt);
  });
  return (
    <group ref={group}>
      <Stars radius={90} depth={60} count={3200} factor={3.2} saturation={0.6} fade speed={0.6} />
      <Stars radius={40} depth={30} count={600} factor={5} saturation={0.9} fade speed={1.2} />
    </group>
  );
}

/** Fixed full-page cosmic backdrop: nebula gradient + slowly drifting stars. */
export default function Starfield() {
  const { theme } = useTheme();
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="starfield" aria-hidden="true" data-theme-layer={theme}>
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      {theme === 'dark' && !reducedMotion && (
        <Canvas
          dpr={[1, 1.25]}
          camera={{ position: [0, 0, 1], fov: 70 }}
          gl={{ alpha: true, antialias: false }}
        >
          <Drift />
        </Canvas>
      )}
    </div>
  );
}
