import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface SteamParticlesProps {
  count?: number;
  intensity?: number; // 0 to 1
}

const SteamParticles = ({ count = 500, intensity = 0 }: SteamParticlesProps) => {
  const points = useRef<THREE.Points>(null);
  const particlesRef = useRef<{
    positions: Float32Array;
    velocities: Float32Array;
    ages: Float32Array;
    maxAge: Float32Array;
  }>();

  // Keep track of intensity ref for use in animation loop without re-running effects
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const ages = new Float32Array(count);
    const maxAge = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Warm steam colors (white to light cyan/magenta)
    const steamColors = [
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xe0f7fa), // light cyan
      new THREE.Color(0xfce4ec), // light pink
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spawn particles from pot center - Initial state very small radius
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5; // Reduced base radius

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = -2; // Start below
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Upward velocity - Initial very slow
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = 0.005 + Math.random() * 0.01; // Reduced base speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      ages[i] = Math.random() * 100;
      maxAge[i] = 50 + Math.random() * 50;

      // Color
      const color = steamColors[Math.floor(Math.random() * steamColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesRef.current = { positions, velocities, ages, maxAge };
    return { positions, colors };
  }, [count]);

  useFrame(() => {
    if (!points.current || !particlesRef.current) return;

    const { positions, velocities, ages, maxAge } = particlesRef.current;
    const positionAttribute = points.current.geometry.attributes.position;
    const currentIntensity = intensityRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      ages[i]++;

      // Reset particle if too old
      if (ages[i] > maxAge[i]) {
        // Spawn particles from pot center (concentrated)
        const angle = Math.random() * Math.PI * 2;
        // Radius increases with intensity
        const radius = Math.random() * (0.4 + currentIntensity * 1.2);

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = -1.2; // Start closer to center
        positions[i3 + 2] = Math.sin(angle) * radius;

        // Increased velocity with intensity
        velocities[i3] = (Math.random() - 0.5) * (0.01 + currentIntensity * 0.03);
        velocities[i3 + 1] = 0.005 + Math.random() * 0.01 + (currentIntensity * 0.08);
        velocities[i3 + 2] = (Math.random() - 0.5) * (0.01 + currentIntensity * 0.03);

        ages[i] = 0;
        maxAge[i] = 50 + Math.random() * 50;
      }

      // Apply turbulence
      const turbulence = Math.sin(ages[i] * 0.1) * (0.002 + currentIntensity * 0.008);
      velocities[i3] += (Math.random() - 0.5) * turbulence;
      velocities[i3 + 2] += (Math.random() - 0.5) * turbulence;

      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      positionAttribute.setXYZ(i, positions[i3], positions[i3 + 1], positions[i3 + 2]);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05 + intensity * 0.25} // Scale size with intensity
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3 + intensity * 0.3} // Also prevent too faint initially? Or allow faint.
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[colors, 3]}
      />
    </Points>
  );
};

export default SteamParticles;
