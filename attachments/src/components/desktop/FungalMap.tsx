import React, { useRef, useEffect, useState } from 'react';
import { X, Droplets, MessageCircle, Send } from 'lucide-react';
import { useTheme } from 'next-themes';

export interface Node {
    id: number;
    x: number;
    y: number; // percentage 0-100
    type: 'colony' | 'spore' | 'user';
    size: number;
    nourishment: number;
    author: string;
    species: string;
    pulseOffset: number;
    location: { lat: number; lng: number };
}

interface Pulse {
    targetX: number;
    targetY: number;
    progress: number;
}

interface FloatingComment {
    x: number; // percentage
    y: number; // percentage
    text: string;
    life: number;
    maxLife: number;
    velocityY: number;
    offsetX: number;
}

interface FungalMapProps {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    selectedNode: Node | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
    comments: Record<number, { author: string; text: string }[]>;
    setComments: React.Dispatch<React.SetStateAction<Record<number, { author: string; text: string }[]>>>;
    userConnections: Set<number>;
    setUserConnections: React.Dispatch<React.SetStateAction<Set<number>>>;
    nourishPulses: Pulse[];
    setNourishPulses: React.Dispatch<React.SetStateAction<Pulse[]>>;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    replyMode: boolean;
    setReplyMode: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const FungalMap: React.FC<FungalMapProps> = ({
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    comments,
    setComments,
    userConnections,
    setUserConnections,
    nourishPulses,
    setNourishPulses,
    setStatus,
    replyMode,
    setReplyMode
}) => {
    const { resolvedTheme } = useTheme();
    // Default to dark if undefined during SSR or initial load
    const isDark = resolvedTheme !== 'light';

    const THEME_COLORS = {
        dark: {
            userFill: 'rgba(210, 160, 44, 0.2)',
            userCore: '#d2a02c',
            userConn: 'rgba(235, 179, 66, 0.3)',
            colonyFill: 'rgba(172, 83, 57, 0.2)',
            colonyCore: '#ac5339',
            sporeFill: 'rgba(77, 203, 168, 0.1)',
            sporeCore: '#4dcba8',
            hyphaeBase: '184, 242, 230', // RGB for rgba template
            pulseStroke: '235, 179, 66',
            pulseShadow: '#ebcc42',
            pulseDot: '#fff',
            bubbleFill: 'rgba(10, 20, 30, 0.8)',
            bubbleStroke: 'rgba(255, 255, 255, 0.1)',
            bubbleText: '#fff',
            mapFilter: 'invert(1) grayscale(0.8) brightness(0.8) contrast(1.1)',
            mapOpacity: '0.4',
            mapBlend: 'screen'
        },
        light: {
            userFill: 'rgba(184, 134, 11, 0.15)',
            userCore: '#b8860b',
            userConn: 'rgba(184, 134, 11, 0.4)',
            colonyFill: 'rgba(240, 230, 140, 0.4)',
            colonyCore: '#e3d26f', // Light Yellow
            sporeFill: 'rgba(240, 230, 140, 0.4)',
            sporeCore: '#e3d26f', // Light Yellow (somewhat visible)
            hyphaeBase: '60, 70, 60', // Dark grey/green (Ink)
            pulseStroke: '200, 150, 50',
            pulseShadow: '#daa520',
            pulseDot: '#332',
            bubbleFill: 'rgba(250, 250, 245, 0.9)',
            bubbleStroke: 'rgba(0, 0, 0, 0.15)',
            bubbleText: '#1a1a1a',
            mapFilter: 'grayscale(1) sepia(0.3) contrast(1.05) brightness(0.95)', // Paper map style
            mapOpacity: '0.15', // Subtle texture
            mapBlend: 'multiply' // Blend into paper background
        }
    };

    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [replyText, setReplyText] = useState("");
    const floatingCommentsRef = useRef<FloatingComment[]>([]);

    // User State (Local constant for rendering)
    const userLocation = { x: 20, y: 40, id: -1, type: 'user', size: 8, nourishment: 0, author: 'You', species: 'Observer', pulseOffset: 0, location: { lat: 0, lng: 0 } } as Node;

    // Random Ambient Comment Spawner
    useEffect(() => {
        const interval = setInterval(() => {
            if (nodes.length === 0) return;
            const target = nodes[Math.floor(Math.random() * nodes.length)];
            const nodeComments = comments[target.id];
            const text = nodeComments ? nodeComments[0].text : MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];

            spawnFloatingComment(target.x, target.y, text);
        }, 400);

        return () => clearInterval(interval);
    }, [nodes, comments]);

    const spawnFloatingComment = (nx: number, ny: number, text: string) => {
        floatingCommentsRef.current.push({
            x: nx,
            y: ny,
            text: text,
            life: 1.0,
            maxLife: 1.0,
            velocityY: -0.02 - Math.random() * 0.03,
            offsetX: (Math.random() - 0.5) * 2
        });
    };

    const drawBubble = (ctx: CanvasRenderingContext2D, fc: FloatingComment, x: number, y: number) => {
        ctx.font = '12px Inter, sans-serif';
        const metrics = ctx.measureText(fc.text);
        const padding = 8;
        const w = metrics.width + padding * 2;
        const h = 24;

        ctx.globalAlpha = Math.min(1, fc.life * 2);

        const rx = x - w / 2;
        const ry = y - h - 10;
        const radius = 12;
        ctx.beginPath();
        ctx.roundRect(rx, ry, w, h, radius);
        ctx.closePath();

        ctx.fillStyle = colors.bubbleFill;
        ctx.fill();
        ctx.strokeStyle = colors.bubbleStroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = colors.bubbleText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fc.text, x, y - h / 2 - 10);

        ctx.globalAlpha = 1.0;
    };

    const drawOrganicLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, time: number, intensity = 1, isPermanent = false) => {
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const render = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update pulses (Note: This mutates prop state directly in animation loop which expects state updates, 
            // but for performance in tight loops we might need a ref or accepted mutation. 
            // Ideally we shouldn't mutate props. 
            // For now, we'll iterate copies or assume the parent updates are enough, 
            // but the parent 'setNourishPulses' isn't called here every frame to avoid re-renders.
            // We'll rely on local mutation of the object reference for visual smoothness if needed, 
            // OR simpler: just dont animate pulse progress in state if it causes re-renders. 
            // Let's keep existing logic but apply it to the prop array objects (which works if they are mutable particles).
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
                        if (dist < 200) {
                            ctx.strokeStyle = `rgba(${colors.hyphaeBase}, ${0.05 + (node.nourishment / 200)})`;
                            ctx.lineWidth = 1 + (node.nourishment / 50);
                            drawOrganicLine(ctx, x1, y1, x2, y2, time);
                        }
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

                    ctx.strokeStyle = colors.userConn;
                    ctx.lineWidth = 1.5;
                    drawOrganicLine(ctx, startX, startY, endX, endY, time, 1, true);
                }
            });

            // 3. Draw Active Pulses
            nourishPulses.forEach(pulse => {
                if (pulse.progress > 1) return;
                const startX = (userLocation.x / 100) * canvas.width;
                const startY = (userLocation.y / 100) * canvas.height;
                const targetX = (pulse.targetX / 100) * canvas.width;
                const targetY = (pulse.targetY / 100) * canvas.height;

                ctx.strokeStyle = `rgba(${colors.pulseStroke}, ${1 - pulse.progress + 0.2})`;
                ctx.lineWidth = 3;
                drawOrganicLine(ctx, startX, startY, targetX, targetY, time, 2);

                const dx = targetX - startX;
                const dy = targetY - startY;
                const currX = startX + dx * pulse.progress;
                const currY = startY + dy * pulse.progress;

                ctx.beginPath();
                ctx.fillStyle = colors.pulseDot;
                ctx.arc(currX, currY, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors.pulseShadow;
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

                let fillStyle = '';
                if (isUser) fillStyle = colors.userFill;
                else if (isConnected) fillStyle = colors.userFill; // Use user fill for connected nodes too for clarity
                else if (node.type === 'colony') fillStyle = colors.colonyFill;
                else fillStyle = colors.sporeFill;

                ctx.beginPath();
                ctx.fillStyle = fillStyle;
                ctx.arc(x, y, baseSize + (pulse * 5), 0, Math.PI * 2);
                ctx.fill();

                let coreColor = '';
                if (isUser) coreColor = colors.userCore;
                else if (node.type === 'colony') coreColor = colors.colonyCore;
                else coreColor = colors.sporeCore;

                ctx.beginPath();
                ctx.fillStyle = coreColor;
                ctx.arc(x, y, baseSize, 0, Math.PI * 2);
                ctx.fill();

                if (isUser) {
                    ctx.fillStyle = colors.userCore;
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
                fc.y += fc.velocityY;
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
    }, [nodes, selectedNode, nourishPulses, userConnections, userLocation, colors]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (mouseY > rect.height - 100) return;

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

    const attemptNourish = () => {
        if (!selectedNode) return;
        setNourishPulses(prev => [...prev, { targetX: selectedNode.x, targetY: selectedNode.y, progress: 0 }]);
        setUserConnections(prev => {
            const next = new Set(prev);
            next.add(selectedNode.id);
            return next;
        });
        setNodes(nodes.map(n =>
            n.id === selectedNode.id ? { ...n, nourishment: n.nourishment + 1 } : n
        ));
        setSelectedNode(prev => prev ? ({ ...prev, nourishment: prev.nourishment + 1 }) : null);
    };

    const handleReplySubmit = () => {
        if (!replyText.trim() || !selectedNode) return;

        const newComment = { author: 'You', text: replyText };
        setComments(prev => ({
            ...prev,
            [selectedNode.id]: [...(prev[selectedNode.id] || []), newComment]
        }));

        spawnFloatingComment(selectedNode.x, selectedNode.y, replyText);

        setReplyText("");
        setReplyMode(false);
        attemptNourish();
        setStatus("Response sent via hyphae channel.");
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-background/20" ref={containerRef}>
            {/* Background World Map & Grid */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {/* Digital Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px),
                                        linear-gradient(to bottom, #334155 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                />

                {/* World Map with Glow Effect */}
                <div
                    className="absolute inset-0 transition-all duration-700 ease-in-out"
                    style={{
                        opacity: colors.mapOpacity,
                        mixBlendMode: colors.mapBlend as any,
                        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: colors.mapFilter
                    }}
                />
            </div>

            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair z-[5]"
            />

            {/* REMOVED: Network Status Panel - Left (Moved to MapPage Right Sidebar) */}

            {/* Node Detail Panel - Right */}
            {selectedNode && (
                <div className="absolute top-8 right-8 w-[320px] p-6 z-10 bg-card/90 backdrop-blur-md border border-[hsl(var(--aurora-cyan))] rounded-lg animate-fade-up">
                    <button
                        className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors"
                        onClick={() => setSelectedNode(null)}
                    >
                        <X size={18} />
                    </button>

                    <span className="text-xs text-[hsl(var(--aurora-gold))] uppercase tracking-widest font-mono">
                        {selectedNode.type === 'colony' ? 'Established Colony' : 'Spore Sample'}
                    </span>
                    <h2 className="text-3xl font-display text-foreground my-2">{selectedNode.species}</h2>
                    <p className="text-sm text-foreground/60 mb-4 font-mono">
                        Discovered by @{selectedNode.author}<br />
                        Vitality: {selectedNode.nourishment} units
                    </p>

                    <div className="max-h-[150px] overflow-y-auto mb-4 bg-black/20 rounded p-2 border border-white/5">
                        {(comments[selectedNode.id] || []).length === 0 ? (
                            <div className="text-xs text-foreground/40 italic text-center p-4">No hyphal signals yet.</div>
                        ) : (
                            (comments[selectedNode.id] || []).map((c, i) => (
                                <div key={i} className="text-sm mb-2 pb-2 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                                    <span className="text-[hsl(var(--aurora-cyan))] font-semibold">{c.author}</span>: <span className="text-foreground/80">{c.text}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {!replyMode ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={attemptNourish}
                                className="py-3 bg-[hsl(var(--aurora-cyan)/0.1)] border border-[hsl(var(--aurora-cyan)/0.5)] text-[hsl(var(--aurora-cyan))] flex items-center justify-center gap-2 hover:bg-[hsl(var(--aurora-cyan)/0.2)] transition-colors rounded"
                            >
                                <Droplets size={16} /> Nourish
                            </button>
                            <button
                                onClick={() => setReplyMode(true)}
                                className="py-3 bg-card border border-border text-foreground flex items-center justify-center gap-2 hover:bg-white/5 transition-colors rounded"
                            >
                                <MessageCircle size={16} /> Reply
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-up">
                            <textarea
                                autoFocus
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Transmit signal..."
                                className="w-full h-20 bg-black/20 border border-[hsl(var(--aurora-cyan)/0.5)] rounded p-3 text-sm text-foreground mb-2 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--aurora-cyan))]"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleReplySubmit}
                                    className="flex-1 py-2 bg-[hsl(var(--aurora-magenta))] text-foreground/90 border-none rounded flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    <Send size={14} /> Send
                                </button>
                                <button
                                    onClick={() => setReplyMode(false)}
                                    className="px-4 py-2 border border-border rounded text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FungalMap;
