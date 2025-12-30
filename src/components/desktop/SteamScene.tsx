import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import SteamParticles from "./SteamParticles";

interface SteamSceneProps {
  intensity?: number;
}

const SteamScene = ({ intensity = 0 }: SteamSceneProps) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={60} />
          <ambientLight intensity={0.5} />
          <SteamParticles count={300} intensity={intensity} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SteamScene;
