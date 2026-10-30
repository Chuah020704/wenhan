import { useMemo, useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { KEYBOARD_ROWS, CATEGORY_COLORS, KeyDef } from '../../data/keyboard';
import { useTheme } from '../../theme/ThemeProvider';

const UNIT = 1;
const GAP = 0.1;
const KEY_H = 0.45;
const PRESS_DEPTH = -0.16;

interface PlacedKey extends KeyDef {
  index: number;
  x: number;
  z: number;
  w: number;
}

function layoutKeys(): { keys: PlacedKey[]; width: number; depth: number } {
  const keys: PlacedKey[] = [];
  let width = 0;
  let index = 0;
  KEYBOARD_ROWS.forEach((row, r) => {
    let cursor = 0;
    row.forEach((k) => {
      const w = (k.width ?? 1) * UNIT;
      keys.push({ ...k, index: index++, x: cursor + w / 2, z: r * UNIT, w });
      cursor += w;
    });
    width = Math.max(width, cursor);
  });
  const depth = KEYBOARD_ROWS.length * UNIT;
  // centre the board on the origin
  for (const k of keys) {
    k.x -= width / 2;
    k.z -= depth / 2 - UNIT / 2;
  }
  return { keys, width, depth };
}

function makeLabelTexture(label: string, w: number, color: string): THREE.CanvasTexture {
  const scale = 128;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = scale;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const long = label.length > 8;
  let size = long ? 22 : 30;
  ctx.font = `700 ${size}px Consolas, "JetBrains Mono", "Courier New", monospace`;
  while (ctx.measureText(label).width > canvas.width - 24 && size > 10) {
    size -= 2;
    ctx.font = `700 ${size}px Consolas, "JetBrains Mono", "Courier New", monospace`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

interface KeycapProps {
  k: PlacedKey;
  dark: boolean;
  pressed: MutableRefObject<Set<number>>;
  hoveredIndex: number | null;
  onHover: (k: PlacedKey | null) => void;
  onPress: (k: PlacedKey) => void;
}

function Keycap({ k, dark, pressed, hoveredIndex, onHover, onPress }: KeycapProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const color = CATEGORY_COLORS[k.category];
  const hovered = hoveredIndex === k.index;
  const tex = useMemo(
    () => makeLabelTexture(k.label, k.w, dark ? '#f5f7ff' : '#111827'),
    [k.label, k.w, dark],
  );
  useEffect(() => () => tex.dispose(), [tex]);

  useFrame(() => {
    const g = group.current;
    const m = mat.current;
    if (!g || !m) return;
    const down = hovered || pressed.current.has(k.index);
    g.position.y = THREE.MathUtils.lerp(g.position.y, down ? PRESS_DEPTH : 0, 0.3);
    m.emissiveIntensity = THREE.MathUtils.lerp(
      m.emissiveIntensity,
      down ? 1.1 : dark ? 0.22 : 0.08,
      0.2,
    );
  });

  return (
    <group ref={group} position={[k.x, 0, k.z]}>
      <RoundedBox
        args={[k.w - GAP, KEY_H, UNIT - GAP]}
        radius={0.09}
        smoothness={4}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(k);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPress(k);
        }}
      >
        <meshStandardMaterial
          ref={mat}
          color={dark ? '#1a1e2e' : '#f1f3fa'}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.45}
          metalness={0.15}
        />
      </RoundedBox>
      <mesh position={[0, KEY_H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[k.w - GAP - 0.12, UNIT - GAP - 0.12]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

interface BoardProps {
  dark: boolean;
  onHover: (k: KeyDef | null) => void;
  onPress: (k: KeyDef) => void;
  reducedMotion: boolean;
}

function Board({ dark, onHover, onPress, reducedMotion }: BoardProps) {
  const { keys, width, depth } = useMemo(layoutKeys, []);
  const rig = useRef<THREE.Group>(null);
  const pressed = useRef(new Set<number>());
  const [hoveredKey, setHoveredKey] = useState<PlacedKey | null>(null);
  const { pointer } = useThree();
  const idle = useRef({ next: 1.2, last: -1 });
  const glowTex = useMemo(makeGlowTexture, []);
  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((state, dt) => {
    const g = rig.current;
    if (!g) return;
    // follow the mouse with a gentle tilt
    const tx = -0.12 + pointer.y * 0.08;
    const ty = pointer.x * 0.25;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, dt);

    // idle "typing" when nobody is hovering
    if (reducedMotion || hoveredKey) return;
    const t = state.clock.elapsedTime;
    if (t > idle.current.next) {
      pressed.current.clear();
      const i = Math.floor(Math.random() * keys.length);
      pressed.current.add(i);
      idle.current.last = i;
      idle.current.next = t + 0.35 + Math.random() * 0.6;
      setTimeout(() => pressed.current.delete(i), 180);
    }
  });

  const handleHover = (k: PlacedKey | null) => {
    setHoveredKey(k);
    onHover(k);
  };

  const handlePress = (k: PlacedKey) => {
    pressed.current.add(k.index);
    setTimeout(() => pressed.current.delete(k.index), 160);
    onPress(k);
  };

  const accent = hoveredKey ? CATEGORY_COLORS[hoveredKey.category] : '#a78bfa';

  return (
    <group ref={rig} rotation={[-0.12, 0, 0]} scale={0.9}>
      <Float
        speed={reducedMotion ? 0 : 1.2}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.35}
      >
        {/* case */}
        <RoundedBox
          args={[width + 0.7, 0.5, depth + 0.7]}
          radius={0.18}
          smoothness={4}
          position={[0, -0.45, 0]}
        >
          <meshStandardMaterial
            color={dark ? '#0f1322' : '#dde2f0'}
            roughness={0.6}
            metalness={0.35}
          />
        </RoundedBox>
        {/* glowing underglow strip */}
        <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width * 1.9, depth * 2.6]} />
          <meshBasicMaterial
            map={glowTex}
            color={accent}
            transparent
            opacity={dark ? 0.45 : 0.3}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {keys.map((k) => (
          <Keycap
            key={k.index}
            k={k}
            dark={dark}
            pressed={pressed}
            hoveredIndex={hoveredKey?.index ?? null}
            onHover={handleHover}
            onPress={handlePress}
          />
        ))}
        {hoveredKey && (
          <Html
            position={[hoveredKey.x, 1.1, hoveredKey.z]}
            center
            zIndexRange={[20, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="key-tooltip"
              style={{ ['--key-color' as string]: CATEGORY_COLORS[hoveredKey.category] }}
            >
              <span className="key-tooltip-cat mono">{hoveredKey.category}</span>
              <span>{hoveredKey.title}</span>
            </div>
          </Html>
        )}
      </Float>
      <ContactShadows
        position={[0, -0.75, 0]}
        opacity={dark ? 0.55 : 0.25}
        scale={22}
        blur={2.4}
        far={4}
        color={dark ? '#000' : '#334'}
      />
    </group>
  );
}

export interface KeyboardSceneProps {
  onHover?: (k: KeyDef | null) => void;
  onPress?: (k: KeyDef) => void;
}

export default function KeyboardScene({
  onHover = () => {},
  onPress = () => {},
}: KeyboardSceneProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 10, 11], fov: 44, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0.4)}
    >
      <ambientLight intensity={dark ? 0.55 : 0.9} />
      <directionalLight position={[6, 10, 4]} intensity={dark ? 1.6 : 1.3} color="#ffffff" />
      <pointLight position={[-8, 5, -4]} intensity={dark ? 40 : 14} color="#a78bfa" />
      <pointLight position={[8, 4, 6]} intensity={dark ? 34 : 12} color="#22d3ee" />
      <Board dark={dark} onHover={onHover} onPress={onPress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
