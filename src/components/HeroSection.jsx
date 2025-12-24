import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 2000 }) => {
    const points = useRef();
    const { viewport, mouse } = useThree();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spread particles across a wide area
            positions[i * 3] = (Math.random() - 0.5) * 15; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
        }
        return positions;
    }, [count]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#b8f2e6') }, // Ghost
        uColor2: { value: new THREE.Color('#c24d2c') }, // Spore
    }), []);

    useFrame((state, delta) => {
        if (points.current) {
            // Update shader uniforms
            points.current.material.uniforms.uTime.value = state.clock.elapsedTime;

            // Mouse interaction (lerp for smoothness)
            // Map normalized mouse (-1 to 1) to world space roughly
            points.current.material.uniforms.uMouse.value.lerp(
                new THREE.Vector2(mouse.x * 10, mouse.y * 10),
                0.1
            );

            // Optional: slow rotation of the whole system
            points.current.rotation.y += delta * 0.05;
        }
    });

    // Custom Shader for "Organic" Particles
    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vScale;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Simulating "Breathing" and "Flow"
        // Complex wave motion
        float wave = sin(pos.y * 0.5 + uTime) * 0.2 + cos(pos.x * 0.5 + uTime * 0.7) * 0.2;
        pos.y += wave;
        pos.x += cos(uTime * 0.3 + pos.z) * 0.1;
        
        // Mouse repulsion (simple 2D distance for effect)
        float dist = distance(pos.xy, uMouse);
        float repulsion = max(0.0, (5.0 - dist) * 0.5);
        vec2 dir = normalize(pos.xy - uMouse);
        pos.xy += dir * repulsion * 0.2;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation based on depth and slight pulsing
        gl_PointSize = (8.0 * (1.0 + sin(uTime * 2.0 + pos.x) * 0.2)) * (10.0 / -mvPosition.z);
        
        // Pass info to fragment
        vScale = gl_PointSize; 
      }
    `,
        fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      
      void main() {
        // Soft circle shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        // Soft edge (Tyndall-like glow)
        float alpha = smoothstep(0.5, 0.0, dist);
        
        // Gradient color based on alpha (center is brighter/whitish)
        vec3 finalColor = mix(uColor2, uColor1, alpha + 0.2); // Mix colors
        finalColor += vec3(0.1); // Add a bit of white glow
        
        gl_FragColor = vec4(finalColor, alpha * 0.8); // Semi-transparent
      }
    `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    }), [uniforms]);

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <primitive object={shaderMaterial} attach="material" />
        </points>
    );
};

const HeroSection = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'var(--color-bg-deep)' }}>
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
                <ParticleField />
                {/* Ambient environment */}
                <ambientLight intensity={0.2} />
            </Canvas>

            {/* Overlay Content */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                transform: 'translateY(-50%)',
                width: '35%',
                pointerEvents: 'none' // Let clicks pass through to canvas
            }}>
                <div className="glass-panel" style={{ padding: 'var(--spacing-lg)', pointerEvents: 'auto' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#fff' }}>Fungal <br />Discovery</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem' }}>
                        Explore the silent world of mycelium networks and bioluminescent organisms in a digital herbarium.
                    </p>
                    <button style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        borderRadius: '50px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        Start Exploration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
