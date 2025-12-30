import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Loader2 } from "lucide-react";

interface MushroomModelProps {
    modelPath: string;
}

function Model({ modelPath }: MushroomModelProps) {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={1.5} />;
}

interface MushroomModel3DProps {
    modelPath?: string;
}

const MushroomModel3D = ({ modelPath }: MushroomModel3DProps) => {
    if (!modelPath) {
        return (
            <div className="relative aspect-video bg-card grid-line flex items-center justify-center">
                <div className="text-center">
                    <span className="text-meta text-foreground/30 block">
                        3D Model Not Available
                    </span>
                    <span className="text-meta text-foreground/20 block mt-1">
                        This species does not have a 3D model yet
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-card grid-line overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true }}
            >
                <Suspense
                    fallback={
                        <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="#b8f2e6" wireframe />
                        </mesh>
                    }
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                    {/* Environment for better reflections */}
                    <Environment preset="studio" />

                    {/* 3D Model */}
                    <Model modelPath={modelPath} />

                    {/* Controls */}
                    <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={10}
                        autoRotate={false}
                    />
                </Suspense>
            </Canvas>

            {/* Loading Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-4 left-4 text-meta text-foreground/30">
                    Drag to rotate · Scroll to zoom
                </div>
            </div>
        </div>
    );
};

// Loading fallback component
export const MushroomModel3DLoading = () => (
    <div className="relative aspect-video bg-card grid-line flex items-center justify-center aurora-animated">
        <div className="text-center">
            <Loader2 className="w-12 h-12 text-foreground/10 mx-auto mb-4 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-meta text-foreground/30 block">
                3D Model Loading
            </span>
            <span className="text-meta text-foreground/20 block mt-1">
                Rotate to view gill attachments and stalk texture
            </span>
        </div>
    </div>
);

export default MushroomModel3D;
