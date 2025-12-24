import React, { useRef, useEffect, useState } from 'react';
import { RefreshCcw, Play, Pause } from 'lucide-react';

const MyceliumLab = () => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [temp, setTemp] = useState(24);   // Optimal ~24C
    const [humidity, setHumidity] = useState(80); // Optimal ~90%
    const requestIdRef = useRef();

    // Simulation State
    const hyphaeRef = useRef([]);

    // Initialize Simulation
    const initSim = (canvas) => {
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        // Fill background initially
        ctx.fillStyle = '#151515';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        initSim(canvas);

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
            ctx.shadowColor = 'rgba(184, 242, 230, 0.2)';

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

                ctx.strokeStyle = `rgba(255, 255, 255, ${h.life / 100})`;
                ctx.lineWidth = h.width;
                ctx.lineTo(h.x, h.y);
                ctx.stroke();
            }

            if (hyphaeRef.current.length < 500) { // Limit total
                // Keep loop going
            }
        };

        const renderLoop = () => {
            update();
            requestIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => cancelAnimationFrame(requestIdRef.current);
    }, [isPlaying, temp, humidity]);

    const handleReset = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#151515';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        initSim(canvas);
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0f1210' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />

            {/* Controls */}
            <div className="glass-panel" style={{
                position: 'absolute', top: '2rem', right: '2rem', width: '300px', padding: '1.5rem',
                border: '1px solid var(--glass-highlight)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>Growth Chamber</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button onClick={handleReset} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label>Temperature</label>
                        <span>{temp}°C</span>
                    </div>
                    <input
                        type="range" min="0" max="50" value={temp}
                        onChange={(e) => setTemp(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: temp > 35 ? '#c24d2c' : '#4caf50' }}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>
                        {temp < 10 ? "Dormant (Too Cold)" : temp > 35 ? "Heat Stress (Critical)" : "Optimal Growth Range"}
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label>Humidity</label>
                        <span>{humidity}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100" value={humidity}
                        onChange={(e) => setHumidity(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#2196f3' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyceliumLab;
