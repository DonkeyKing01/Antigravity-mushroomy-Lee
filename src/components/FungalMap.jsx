import React, { useRef, useEffect, useState } from 'react';
import { Plus, Heart, Droplets, Share2, MessageCircle, X, MapPin, Send } from 'lucide-react';

const FungalMap = () => {
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [status, setStatus] = useState("Monitoring Network");
    const containerRef = useRef(null);

    // User State
    const userLocation = { x: 20, y: 40, id: 'user_self', type: 'user', size: 8 };
    const [userConnections, setUserConnections] = useState(new Set());
    const [nourishPulses, setNourishPulses] = useState([]);

    // Comments State
    const [comments, setComments] = useState({});
    const [replyMode, setReplyMode] = useState(false);
    const [replyText, setReplyText] = useState("");

    // Visuals State
    const floatingCommentsRef = useRef([]); // { x, y, text, life, maxLife, velocityY }

    // Mock Messages
    const MOCK_MESSAGES = [
        "Found a huge colony here!",
        "Is this edible?",
        "Beautiful bioluminescence.",
        "Spores spreading fast.",
        "Need identification help.",
        "Conditions optimal.",
        "Verified observation.",
        "Connecting hyphae...",
        "Amazing texture.",
        "Habitat confirmed."
    ];

    // Initial Data
    useEffect(() => {
        const initialNodes = Array.from({ length: 80 }, (_, i) => ({
            id: i,
            x: Math.random() * 90 + 5,
            y: Math.random() * 80 + 10,
            type: Math.random() > 0.8 ? 'colony' : 'spore',
            size: Math.random() * 4 + 3,
            nourishment: Math.floor(Math.random() * 10),
            author: `Observer_${Math.floor(Math.random() * 1000)}`,
            species: ['Amanita', 'Mycena', 'Cantharellus', 'Russula'][Math.floor(Math.random() * 4)],
            pulseOffset: Math.random() * Math.PI * 2,
            location: { lat: 34 + Math.random(), lng: -118 + Math.random() }
        }));
        setNodes(initialNodes);

        // Populate initial comments
        const initialComments = {};
        initialNodes.forEach(n => {
            if (Math.random() > 0.7) {
                initialComments[n.id] = [{
                    author: `User_${Math.floor(Math.random() * 100)}`,
                    text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)]
                }];
            }
        });
        setComments(initialComments);
    }, []);

    // Random Ambient Comment Spawner
    useEffect(() => {
        const interval = setInterval(() => {
            if (nodes.length === 0) return;
            // Pick random node
            const target = nodes[Math.floor(Math.random() * nodes.length)];
            // Or pick one with comments
            const nodeComments = comments[target.id];
            const text = nodeComments ? nodeComments[0].text : MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];

            spawnFloatingComment(target.x, target.y, text);
        }, 400); // New bubble every 0.4s

        return () => clearInterval(interval);
    }, [nodes, comments]);

    const spawnFloatingComment = (nx, ny, text) => {
        floatingCommentsRef.current.push({
            x: nx, // percentage
            y: ny, // percentage
            text: text,
            life: 1.0,
            maxLife: 1.0,
            velocityY: -0.02 - Math.random() * 0.03, // Float up
            offsetX: (Math.random() - 0.5) * 2 // Drift
        });
    };

    const drawBubble = (ctx, fc, x, y) => {
        ctx.font = '12px Inter, sans-serif';
        const metrics = ctx.measureText(fc.text);
        const padding = 8;
        const w = metrics.width + padding * 2;
        const h = 24;

        ctx.globalAlpha = Math.min(1, fc.life * 2); // Fade out at end

        // Background Bubble
        // Rounded Rectangle (Manual for compatibility)
        const rx = x - w / 2;
        const ry = y - h - 10;
        const radius = 12;
        ctx.beginPath();
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + w - radius, ry);
        ctx.quadraticCurveTo(rx + w, ry, rx + w, ry + radius);
        ctx.lineTo(rx + w, ry + h - radius);
        ctx.quadraticCurveTo(rx + w, ry + h, rx + w - radius, ry + h);
        ctx.lineTo(rx + radius, ry + h);
        ctx.quadraticCurveTo(rx, ry + h, rx, ry + h - radius);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
        ctx.closePath();
        ctx.fillStyle = 'rgba(10, 20, 30, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fc.text, x, y - h / 2 - 10);

        ctx.globalAlpha = 1.0;
    };

    // Helper: Draw Organic Line
    const drawOrganicLine = (ctx, x1, y1, x2, y2, time, intensity = 1, isPermanent = false) => {
        const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const segments = Math.max(5, Math.floor(dist / 20));
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const bx = x1 + (x2 - x1) * t;
            const by = y1 + (y2 - y1) * t;

            const waveScale = (isPermanent ? 3 : 5) * intensity;
            const offset = Math.sin(t * Math.PI * 4 + time * 0.005) * Math.sin(t * Math.PI) * waveScale;

            const px = bx + Math.cos(angle + Math.PI / 2) * offset;
            const py = by + Math.sin(angle + Math.PI / 2) * offset;

            ctx.lineTo(px, py);
        }
        ctx.stroke();
    };


    // Removed updatePulses - will handle pulse updates inside render loop with ref

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const render = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update pulses in-place (manual mutation for performance)
            nourishPulses.forEach(p => p.progress += 0.02);

            // 1. Draw Global Hyphae
            nodes.forEach((node, i) => {
                nodes.forEach((otherNode, j) => {
                    if (i <= j) return;
                    const x1 = (node.x / 100) * canvas.width;
                    const y1 = (node.y / 100) * canvas.height;
                    const x2 = (otherNode.x / 100) * canvas.width;
                    const y2 = (otherNode.y / 100) * canvas.height;
                    const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    if (dist < 200) {
                        ctx.strokeStyle = `rgba(184, 242, 230, ${0.05 + (node.nourishment / 200)})`;
                        ctx.lineWidth = 1 + (node.nourishment / 50);
                        drawOrganicLine(ctx, x1, y1, x2, y2, time);
                    }
                });
            });

            // 2. Draw Permanent User Connections
            userConnections.forEach(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (targetNode) {
                    const startX = (userLocation.x / 100) * canvas.width;
                    const startY = (userLocation.y / 100) * canvas.height;
                    const endX = (targetNode.x / 100) * canvas.width;
                    const endY = (targetNode.y / 100) * canvas.height;

                    ctx.strokeStyle = 'rgba(255, 204, 0, 0.3)';
                    ctx.lineWidth = 1.5;
                    drawOrganicLine(ctx, startX, startY, endX, endY, time, 1, true);
                }
            });

            // 3. Draw Active Pulses
            nourishPulses.forEach(pulse => {
                const startX = (userLocation.x / 100) * canvas.width;
                const startY = (userLocation.y / 100) * canvas.height;
                const targetX = (pulse.targetX / 100) * canvas.width;
                const targetY = (pulse.targetY / 100) * canvas.height;

                ctx.strokeStyle = `rgba(255, 204, 0, ${1 - pulse.progress + 0.2})`;
                ctx.lineWidth = 3;
                drawOrganicLine(ctx, startX, startY, targetX, targetY, time, 2);

                const dx = targetX - startX;
                const dy = targetY - startY;
                const currX = startX + dx * pulse.progress;
                const currY = startY + dy * pulse.progress;

                ctx.beginPath();
                ctx.fillStyle = '#fff';
                ctx.arc(currX, currY, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffcc00';
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            // 4. Draw Nodes
            [...nodes, userLocation].forEach(node => {
                const x = (node.x / 100) * canvas.width;
                const y = (node.y / 100) * canvas.height;
                const isUser = node.type === 'user';
                const isConnected = userConnections.has(node.id);

                const pulse = Math.sin(time * 0.002 + (node.pulseOffset || 0)) * 0.5 + 1;
                const baseSize = isUser ? 8 : node.size + (node.nourishment * 0.8);

                ctx.beginPath();
                ctx.fillStyle = isUser ? 'rgba(255, 204, 0, 0.2)'
                    : isConnected ? 'rgba(255, 204, 0, 0.1)'
                        : (node.type === 'colony' ? 'rgba(194, 77, 44, 0.2)' : 'rgba(184, 242, 230, 0.1)');
                ctx.arc(x, y, baseSize + (pulse * 5), 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = isUser ? '#ffcc00' : (node.type === 'colony' ? '#c24d2c' : '#b8f2e6');
                ctx.arc(x, y, baseSize, 0, Math.PI * 2);
                ctx.fill();

                if (isUser) {
                    ctx.fillStyle = '#ffcc00';
                    ctx.font = '10px monospace';
                    ctx.fillText('YOU', x - 10, y + 20);
                }

                if (selectedNode && selectedNode.id === node.id) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.arc(x, y, baseSize + 8, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });

            // 5. Update & Draw Floating Comments
            for (let i = floatingCommentsRef.current.length - 1; i >= 0; i--) {
                const fc = floatingCommentsRef.current[i];
                fc.y += fc.velocityY; // Move Up in percentage? No, this is tricky.
                // Convert percentage velocity to approx pixel? Or stay in percentage
                // Using percentage for position, but drawBubble needs pixels

                fc.life -= 0.005;

                if (fc.life <= 0) {
                    floatingCommentsRef.current.splice(i, 1);
                } else {
                    const bx = (fc.x / 100) * canvas.width;
                    const by = (fc.y / 100) * canvas.height;
                    drawBubble(ctx, fc, bx, by);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };
        render(0);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [nodes, selectedNode, nourishPulses, userConnections]);

    // Actions
    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Don't handle clicks in navigation area (bottom 100px)
        if (mouseY > rect.height - 100) {
            return;
        }

        const clickedNode = nodes.find(node => {
            const nx = (node.x / 100) * rect.width;
            const ny = (node.y / 100) * rect.height;
            const size = node.size + (node.nourishment * 0.5) + 15;
            const dist = Math.sqrt(Math.pow(mouseX - nx, 2) + Math.pow(mouseY - ny, 2));
            return dist < size;
        });

        if (clickedNode) {
            setSelectedNode(clickedNode);
            setReplyMode(false);
        } else {
            setSelectedNode(null);
        }
    };

    const establishConnection = (node) => {
        setNourishPulses(prev => [...prev, { targetX: node.x, targetY: node.y, progress: 0 }]);
        setUserConnections(prev => new Set(prev).add(node.id));
    };

    const handleNourish = () => {
        if (!selectedNode) return;
        establishConnection(selectedNode);
        setNodes(nodes.map(n =>
            n.id === selectedNode.id ? { ...n, nourishment: n.nourishment + 1 } : n
        ));
        setSelectedNode(prev => ({ ...prev, nourishment: prev.nourishment + 1 }));
    };

    const handleReplySubmit = () => {
        if (!replyText.trim() || !selectedNode) return;

        const newComment = { author: 'You', text: replyText };
        setComments(prev => ({
            ...prev,
            [selectedNode.id]: [...(prev[selectedNode.id] || []), newComment]
        }));

        // Spawn the comment immediately as a bubble
        spawnFloatingComment(selectedNode.x, selectedNode.y, replyText);

        setReplyText("");
        setReplyMode(false);
        establishConnection(selectedNode);
        setStatus("Response sent via hyphae channel.");
    };

    return (
        <div style={{
            position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
            background: '#0a1118',
            backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png)',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay'
        }} ref={containerRef}>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backdropFilter: 'invert(90%) hue-rotate(180deg) brightness(0.4) contrast(1.2)', pointerEvents: 'none' }}></div>
            <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', zIndex: 5, width: '100%', height: 'calc(100% - 120px)' }} />

            <div className="glass-panel" style={{ position: 'absolute', top: '2rem', left: '2rem', width: '280px', maxHeight: '60vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-ghost)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', background: 'currentColor', borderRadius: '50%', boxShadow: '0 0 10px currentColor' }}></div>
                        {status.toUpperCase()}
                    </div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Network Activity</h2>
                </div>
                <div style={{ padding: '1rem', overflowY: 'auto' }}>
                    {nodes.slice(-5).reverse().map(node => (
                        <div key={node.id} style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.8, display: 'flex', gap: '8px', cursor: 'pointer' }} onClick={() => setSelectedNode(node)}>
                            <div style={{ width: '6px', height: '6px', marginTop: '6px', borderRadius: '50%', background: node.nourishment > 5 ? '#c24d2c' : '#b8f2e6' }}></div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{node.author}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>found {node.species}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedNode && (
                <div className="glass-panel" style={{
                    position: 'absolute', top: '2rem', right: '2rem', width: '300px',
                    padding: '1.5rem', animation: 'fadeIn 0.3s', zIndex: 10
                }}>
                    <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setSelectedNode(null)}>
                        <X size={18} />
                    </button>

                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-slime)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {selectedNode.type === 'colony' ? 'Established Colony' : 'Spore Sample'}
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '0.5rem 0' }}>{selectedNode.species}</h2>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Discovered by @{selectedNode.author}<br />
                        Vitality: {selectedNode.nourishment} units
                    </p>

                    <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.5rem' }}>
                        {(comments[selectedNode.id] || []).length === 0 ? (
                            <div style={{ fontSize: '0.8rem', opacity: 0.4, fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No hyphal signals yet.</div>
                        ) : (
                            (comments[selectedNode.id] || []).map((c, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ color: 'var(--color-accent-ghost)', fontWeight: 600 }}>{c.author}</span>: {c.text}
                                </div>
                            ))
                        )}
                    </div>

                    {!replyMode ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button onClick={handleNourish} className="glass-panel" style={{ padding: '0.8rem', border: '1px solid var(--color-accent-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(184, 242, 230, 0.1)', cursor: 'pointer' }}>
                                <Droplets size={18} color="var(--color-accent-ghost)" /> Nourish
                            </button>
                            <button onClick={() => setReplyMode(true)} className="glass-panel" style={{ padding: '0.8rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                <MessageCircle size={18} /> Reply
                            </button>
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.2s' }}>
                            <textarea
                                autoFocus
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Transmit signal..."
                                style={{
                                    width: '100%', height: '60px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px', padding: '0.5rem', color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleReplySubmit} style={{ flex: 1, padding: '0.5rem', background: 'var(--color-accent-spore)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                    <Send size={14} /> Send
                                </button>
                                <button onClick={() => setReplyMode(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default FungalMap;
