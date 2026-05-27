import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';

/* ─── All available animations ──────────────────────────────── */
export const ANIMATIONS = {
  oscillate: (group, t) => {
    group.rotation.y = Math.sin(t * 0.7) * 0.18;
    group.rotation.x = Math.sin(t * 0.5) * 0.05;
  },
  wave: (group, t) => {
    group.rotation.y = Math.sin(t * 1.2) * 0.35;
    group.rotation.x = Math.sin(t * 0.9) * 0.18;
    group.rotation.z = Math.sin(t * 0.6) * 0.06;
  },
};

/* ─── Inner animated mesh ────────────────────────────────────── */
function AnimatedLogo({ animation = 'oscillate' }) {
  const group = useRef();
  const animFn = ANIMATIONS[animation] ?? ANIMATIONS.oscillate;

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Reset transforms each frame so animations are independent
    group.current.position.set(0, 0, 0);
    group.current.scale.set(1, 1, 1);
    animFn(group.current, clock.elapsedTime);
  });

  return (
    <group ref={group}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.05}
          height={0.3}
          curveSegments={14}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.02}
          bevelSegments={6}
          letterSpacing={0.06}
          position={[-0.5, 0, 0]}
        >
          Clap!
          <meshStandardMaterial color="#C9A96E" metalness={0.6} roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

/* ─── Exported component ─────────────────────────────────────── */
export default function Logo3D({ animation = 'wave' }) {
  return (
    <div style={{ width: 130, height: 72, cursor: 'pointer', flexShrink: 0 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[0, 0, 5]} intensity={4} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={6} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={4} color="#C9A96E" />
        <pointLight position={[0, 4, 2]} intensity={3} color="#ffffff" />
        <Suspense fallback={null}>
          <AnimatedLogo animation={animation} />
        </Suspense>
      </Canvas>
    </div>
  );
}
