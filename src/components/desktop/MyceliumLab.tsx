import React, { useRef, useEffect } from 'react';

interface MyceliumLabProps {
    isPlaying: boolean;
    temp: number;
    humidity: number;
    light: number;
}

const MyceliumLab: React.FC<MyceliumLabProps> = ({ isPlaying, temp, humidity, light }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestIdRef = useRef<number>();

    // Refs for mutable values to avoid effect re-runs
    const paramsRef = useRef({ temp, humidity, light });

    useEffect(() => {
        paramsRef.current = { temp, humidity, light };
    }, [temp, humidity, light]);

    // Simulation State
    const hyphaeRef = useRef<Array<{
        x: number;
        y: number;
        angle: number;
        speed: number;
        life: number;
        width: number;
    }>>([]);

    const initSim = (canvas: HTMLCanvasElement) => {
        const startX = canvas.width / 2;
        const startY = canvas.height / 2;
        hyphaeRef.current = [];
        for (let i = 0; i < 8; i++) { // Increased start count
            const angle = (i / 8) * Math.PI * 2;
            hyphaeRef.current.push({
                x: startX,
                y: startY,
                angle: angle,
                speed: 2,
                life: 100,
                width: 3
            });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                // Only resize if dimensions actually changed to avoid clearing on mobile scroll etc
                if (canvas.width !== canvas.parentElement.clientWidth ||
                    canvas.height !== canvas.parentElement.clientHeight) {
                    canvas.width = canvas.parentElement.clientWidth;
                    canvas.height = canvas.parentElement.clientHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Rerender existing paths if we were tracking history, but here we just clear
                    // If we want to persist, we'd need an offscreen canvas.
                    // For now, accept clear on resize, but NOT on param change.
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (hyphaeRef.current.length === 0) {
            initSim(canvas);
        }

        const renderLoop = () => {
            if (!isPlaying) {
                requestIdRef.current = requestAnimationFrame(renderLoop);
                return;
            }

            const { temp, humidity, light } = paramsRef.current;

            // Growth Factors
            let growthRate = 1.0;

            // Temp Curve (Optimal 24)
            if (temp < 10) growthRate = 0.2;
            else if (temp > 35) growthRate = 0;
            else growthRate = 1 - Math.abs(24 - temp) / 20;

            // Humidity Factor
            if (humidity < 50) growthRate *= 0.1;
            else growthRate *= (humidity / 100);

            // Light Factor (Some mushrooms need light, but too much can dry/damage depending on species)
            // Let's say optimal is 50%. 
            // 0% -> slower (etiolation simulated by thinness?)
            // 100% -> slower (drying)
            const lightFactor = 1 - Math.abs(50 - light) / 100; // 0.5 to 1.0 range roughly
            growthRate *= (0.5 + lightFactor * 0.5);

            if (growthRate <= 0.01) {
                requestIdRef.current = requestAnimationFrame(renderLoop);
                return;
            }

            // Style based on health
            ctx.lineWidth = 1;
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgba(45, 212, 191, ${0.2 * growthRate})`; // Glow fades if dying

            // Grow
            for (let i = hyphaeRef.current.length - 1; i >= 0; i--) {
                const h = hyphaeRef.current[i];

                if (h.life <= 0) {
                    // Chance to respawn/branch from dead tip if conditions good?
                    if (Math.random() < 0.01 * growthRate && h.life > -50) {
                        // Maybe fruit body logic later
                    }
                    hyphaeRef.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(h.x, h.y);

                const currentSpeed = h.speed * growthRate;

                h.x += Math.cos(h.angle) * currentSpeed;
                h.y += Math.sin(h.angle) * currentSpeed;

                h.angle += (Math.random() - 0.5) * 0.5;

                // Branching
                if (Math.random() < 0.03 * growthRate) {
                    hyphaeRef.current.push({
                        x: h.x,
                        y: h.y,
                        angle: h.angle + (Math.random() - 0.5) * 1.5,
                        speed: h.speed * 0.9,
                        life: h.life * 0.8,
                        width: h.width * 0.8
                    });
                }

                h.life -= 0.1;

                const alpha = Math.max(0, h.life / 100);
                // Color shifts based on parameters
                // High temp -> Red tint, Low temp -> Blue tint
                // We use white base but can stroke with color

                let r = 255, g = 255, b = 255;
                if (temp > 28) { g -= (temp - 28) * 20; b -= (temp - 28) * 20; } // Redshift
                else if (temp < 18) { r -= (18 - temp) * 20; g -= (18 - temp) * 10; } // Blueshift

                ctx.strokeStyle = `rgba(${Math.max(0, r)}, ${Math.max(0, g)}, ${Math.max(0, b)}, ${alpha})`;
                ctx.lineWidth = h.width;
                ctx.lineTo(h.x, h.y);
                ctx.stroke();
            }

            requestIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
        };
        // Only restart simulation loop if isPlaying changes (start/stop)
        // Actually we want renderLoop to keep running to check isPlaying inside, 
        // or just restart it. 
        // If we remove temp/humidity from dependency array, we rely on paramsRef.
    }, []); // Run once on mount. 

    // Handle play/pause via ref or effect? 
    // The previous loop was defined INSIDE effect.
    // Let's use a separate effect for play state or just check ref.

    // We need to ensuring the loop is running.
    // The above useEffect runs ONCE.

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default MyceliumLab;
