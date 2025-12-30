import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import MyceliumParticles from "./MyceliumParticles";

const MyceliumScene = () => {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition(new THREE.Vector2(x, y));
  };

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />

          {/* Ambient aurora glow */}
          {/* Warm, organic lighting */}
          <ambientLight intensity={0.2} color="#8B4513" />
          <pointLight position={[5, 10, 5]} intensity={0.8} color="#CD853F" />
          <pointLight position={[-5, 5, 5]} intensity={0.6} color="#D2691E" />
          <pointLight position={[0, -5, 8]} intensity={0.4} color="#A0522D" />

          {/* Mycelium particle network */}
          <group position={[0, -2.5, 0]} scale={1.4}>
            <MyceliumParticles count={6000} mousePosition={mousePosition} />
          </group>

          {/* Interactive controls (optional, can be removed for production) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MyceliumScene;
