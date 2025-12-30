import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface MyceliumParticlesProps {
  count?: number;
  mousePosition: THREE.Vector2;
}

const MyceliumParticles = ({ count = 3000, mousePosition }: MyceliumParticlesProps) => {
  const points = useRef<THREE.Points>(null);
  const particlesRef = useRef<{
    positions: Float32Array;
    velocities: Float32Array;
    phases: Float32Array;
    originalPositions: Float32Array;
  }>();

  // Initialize particle system
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Dark/Low-brightness orange palette (Earth/Mushroom tones)
    const organicColors = [
      new THREE.Color(0x8B4513), // SaddleBrown
      new THREE.Color(0xA0522D), // Sienna
      new THREE.Color(0xCD853F), // Peru
      new THREE.Color(0xD2691E), // Chocolate
      new THREE.Color(0x804000), // Dark Orange/Brown
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Mushroom Shape Geometry
      // We need a Cap (hemisphere) and a Stem (cylinder)

      let x, y, z;
      const isCap = Math.random() > 0.3; // 70% Cap, 30% Stem

      if (isCap) {
        // Cap: Hemisphere-like shape
        // Using spherical coordinates but limiting theta for a cap
        const radius = 3.5;
        const theta = Math.random() * Math.PI * 2; // Angle around Y axis
        const phi = Math.acos((Math.random() * 0.6) + 0.4); // 0 to 90 degrees approx, adjusted for top dome

        // Flattening the sphere to look more like a mushroom cap
        const r = radius * Math.sqrt(Math.random()); // Random distribution inside volume

        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.cos(phi) + 1.0; // Lift cap up
        z = r * Math.sin(phi) * Math.sin(theta);

        // Flatten geometry
        y = y * 0.6 + 1.5;
      } else {
        // Stem: Cylinder
        const height = 4;
        const radius = 0.8 + Math.random() * 0.4;
        const theta = Math.random() * Math.PI * 2;
        const h = Math.random() * height;

        // Tapering the stem slightly
        const currentRadius = radius * (1 - (h / height) * 0.3);

        x = currentRadius * Math.cos(theta);
        y = h - 1.5; // Shift down
        z = currentRadius * Math.sin(theta);
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Initial velocities
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      phases[i] = Math.random() * Math.PI * 2;

      // Assign organic colors
      const color = organicColors[Math.floor(Math.random() * organicColors.length)];
      // Vary brightness slightly
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i3] = color.r * brightness;
      colors[i3 + 1] = color.g * brightness;
      colors[i3 + 2] = color.b * brightness;
    }

    particlesRef.current = {
      positions,
      velocities,
      phases,
      originalPositions,
    };

    return { positions, colors };
  }, [count]);

  // Animation loop
  useFrame((state) => {
    if (!points.current || !particlesRef.current) return;

    const { positions, velocities, phases, originalPositions } = particlesRef.current;
    const time = state.clock.getElapsedTime();
    const positionAttribute = points.current.geometry.attributes.position;

    // Heartbeat/Breathing function
    // Pulse frequency: 0.8Hz (approx 75bpm)
    const pulse = Math.sin(time * 3) * 0.05 + 1; // Scale factor oscillating between 0.95 and 1.05

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // "Breathing" expansion from center
      // Calculate geometric center roughly (0, 1.5, 0) for cap, (0, 0, 0) for stem
      // Simplify: Expand outwards from Y axis
      const distFromAxis = Math.sqrt(ox * ox + oz * oz);
      const pulseFactor = pulse * (1 + distFromAxis * 0.05); // More pulse at edges of cap

      // Apply low-frequency organic noise
      const noiseX = Math.sin(time * 0.5 + phases[i]) * 0.05;
      const noiseY = Math.cos(time * 0.3 + phases[i]) * 0.05;
      const noiseZ = Math.sin(time * 0.4 + phases[i]) * 0.05;

      // Target position with pulse
      const tx = ox * pulseFactor + noiseX;
      const ty = oy + noiseY + Math.sin(time * 1 + phases[i]) * 0.05; // Vertical bobbing
      const tz = oz * pulseFactor + noiseZ;

      // Smooth interpolation to target
      positions[i3] += (tx - positions[i3]) * 0.1;
      positions[i3 + 1] += (ty - positions[i3 + 1]) * 0.1;
      positions[i3 + 2] += (tz - positions[i3 + 2]) * 0.1;

      // Reduce mouse interaction distance for stability
      const particle = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const mouseInfluence = new THREE.Vector3(
        mousePosition.x * 5,
        mousePosition.y * 5,
        0
      );

      const distance = particle.distanceTo(mouseInfluence);
      if (distance < 1.5) {
        const repulsion = (1.5 - distance) * 0.05;
        const dir = particle.sub(mouseInfluence).normalize();
        positions[i3] += dir.x * repulsion;
        positions[i3 + 1] += dir.y * repulsion;
        positions[i3 + 2] += dir.z * repulsion;
      }

      positionAttribute.setXYZ(i, positions[i3], positions[i3 + 1], positions[i3 + 2]);
    }

    positionAttribute.needsUpdate = true;

    // Slow rotation
    points.current.rotation.y = time * 0.1;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[colors, 3]}
      />
    </Points>
  );
};

export default MyceliumParticles;
