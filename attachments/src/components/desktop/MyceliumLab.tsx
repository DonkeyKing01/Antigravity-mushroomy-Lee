import React, { useRef, useEffect } from 'react';

interface MyceliumLabProps {
    isPlaying: boolean;
    temp: number;
    humidity: number;
}

const MyceliumLab: React.FC<MyceliumLabProps> = ({ isPlaying, temp, humidity }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestIdRef = useRef<number>();

    // Simulation State
    // Using a ref to hold state that mutates during animation frame without triggering re-renders
    const hyphaeRef = useRef<Array<{
        x: number;
        y: number;
        angle: number;
        speed: number;
        life: number;
        width: number;
    }>>([]);

    // Initialize Simulation
    const initSim = (canvas: HTMLCanvasElement) => {
        const startX = canvas.width / 2;
        const startY = canvas.height / 2;

        // Initial "Seed" branches
        hyphaeRef.current = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
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
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;

                // Re-fill background on resize
                ctx.fillStyle = '#0f121000'; // Transparent or match bg
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // If we want to reset on resize we could call initSim(canvas) here
                // But for now let's just let it be or maybe clearer to not reset
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initial clear to be sure
        // The parent container provides the background color, so we can keep canvas transparent 
        // or fill with a semi-transparent dark wash if needed for trails.
        // The original code filled with #151515. 
        // Let's assume we want trails, so we might need to handle the clearing logic in the loop.

        // Actually, the original code filled background ONCE in init, then just drew lines on top.
        // It didn't clearRect every frame. This creates permanent trails.
        // We should replicate that behavior. 
        // To support "Reset", we rely on the component being unmounted/remounted or a specific reset command.

        ctx.fillStyle = '#151515';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Initial fill

        if (hyphaeRef.current.length === 0) {
            initSim(canvas);
        }

        const update = () => {
            if (!isPlaying) return;

            // Growth Factors based on Controls
            // Temp: Optimal 24. Too cold (<10) slow, Too hot (>35) die.
            let growthRate = 1.0;
            if (temp < 10) growthRate = 0.2;
            else if (temp > 35) growthRate = 0; // Death
            else growthRate = 1 - Math.abs(24 - temp) / 20; // Curve peaking at 24

            // Humidity: Needs high humidity.
            if (humidity < 50) growthRate *= 0.1;
            else growthRate *= (humidity / 100);

            if (growthRate <= 0.01) return; // Stagnant

            ctx.lineWidth = 1;
            ctx.shadowBlur = 5;
            // Using aurora-cyan equivalent for shadow
            ctx.shadowColor = 'rgba(45, 212, 191, 0.2)';

            // Grow each hypha
            for (let i = hyphaeRef.current.length - 1; i >= 0; i--) {
                const h = hyphaeRef.current[i];

                if (h.life <= 0) {
                    hyphaeRef.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(h.x, h.y);

                // Move
                h.x += Math.cos(h.angle) * h.speed * growthRate;
                h.y += Math.sin(h.angle) * h.speed * growthRate;

                // Wiggle and Branch
                h.angle += (Math.random() - 0.5) * 0.5; // Wander

                // Branching chance
                if (Math.random() < 0.03 * growthRate) {
                    hyphaeRef.current.push({
                        x: h.x,
                        y: h.y,
                        angle: h.angle + (Math.random() - 0.5) * 1.5, // Branch out
                        speed: h.speed * 0.9,
                        life: h.life * 0.8,
                        width: h.width * 0.8
                    });
                }

                h.life -= 0.1;

                // Color mapping: 
                // Healthy (near 24C, high humidity) -> White/Cyan
                // Stressed -> darker
                const alpha = Math.max(0, h.life / 100);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = h.width;
                ctx.lineTo(h.x, h.y);
                ctx.stroke();
            }
        };

        const renderLoop = () => {
            update();
            requestIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
        };
    }, [isPlaying, temp, humidity]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{
                background: '#0a0a0b', // fallback bg
                mixBlendMode: 'screen' // Allows blending if we have a cool background
            }}
        />
    );
};

export default MyceliumLab;
