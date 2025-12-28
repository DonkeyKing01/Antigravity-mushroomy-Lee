import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Droplets, Thermometer, Sun } from "lucide-react";
import MyceliumLab from "../MyceliumLab";
import { useUserProgress } from "@/contexts/UserProgressContext";

const speciesList = [
    { id: "psilocybe-cubensis", name: "Psilocybe Cubensis", required: 0 },
    { id: "amanita-muscaria", name: "Amanita Muscaria", required: 500 },
    { id: "hericium-erinaceus", name: "Lion's Mane", required: 1500 },
];

const SimulationSection = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [temp, setTemp] = useState(24);
    const [humidity, setHumidity] = useState(85);
    const [light, setLight] = useState(50);
    const [selectedSpecies, setSelectedSpecies] = useState(speciesList[0].id);
    const [resetKey, setResetKey] = useState(0);

    const { addMycelium, spendMycelium, unlockedSpecies, unlockSpecies } = useUserProgress();
    const growthTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Growth Reward Logic
    useEffect(() => {
        if (isPlaying) {
            growthTimerRef.current = setInterval(() => {
                // Only reward if conditions are optimal
                const isOptimal = (temp >= 20 && temp <= 28) && (humidity > 70) && (light > 20 && light < 80);
                if (isOptimal) {
                    addMycelium(10); // Small passive income
                }
            }, 5000);
        }

        return () => {
            if (growthTimerRef.current) clearInterval(growthTimerRef.current);
        };
    }, [isPlaying, temp, humidity, light, addMycelium]);

    const handleReset = () => {
        setResetKey((prev) => prev + 1);
        setIsPlaying(true);
    };

    const purchaseSpecies = (id: string, cost: number) => {
        if (spendMycelium(cost)) {
            unlockSpecies(id);
            setSelectedSpecies(id);
            handleReset();
        }
    };

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Controls */}
            <div className="md:col-span-1 space-y-8 pr-2 custom-scrollbar overflow-y-auto">

                {/* Species Selection */}
                <div className="space-y-4 rounded-xl bg-transparent dark:bg-white/5 p-4 border border-border/50 dark:border-white/10">
                    <label className="text-meta text-foreground/50">Specimen</label>
                    <div className="space-y-2">
                        {speciesList.map((s) => {
                            const isUnlocked = unlockedSpecies.includes(s.id);
                            return (
                                <div key={s.id} className="flex justify-between items-center p-2 rounded bg-transparent dark:bg-black/20 border border-border/30 dark:border-transparent text-sm shadow-none">
                                    <span className={isUnlocked ? "text-foreground" : "text-foreground/40"}>{s.name}</span>
                                    {isUnlocked ? (
                                        <button
                                            onClick={() => { setSelectedSpecies(s.id); handleReset(); }}
                                            disabled={selectedSpecies === s.id}
                                            className={`px-2 py-1 text-[10px] rounded border ${selectedSpecies === s.id ? 'bg-[hsl(var(--aurora-cyan))] text-black border-[hsl(var(--aurora-cyan))]' : 'border-white/20 hover:bg-white/10'}`}
                                        >
                                            {selectedSpecies === s.id ? "ACTIVE" : "SELECT"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => purchaseSpecies(s.id, s.required)}
                                            className="px-2 py-1 text-[10px] rounded border border-[hsl(var(--aurora-gold))] text-[hsl(var(--aurora-gold))] hover:bg-[hsl(var(--aurora-gold)/0.1)]"
                                        >
                                            UNLOCK {s.required}
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Parameters */}
                <div className="space-y-6">
                    {/* Temperature */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center gap-2 text-meta text-foreground/50">
                                <Thermometer className="w-3 h-3" /> Temp
                            </label>
                            <span className={`text-label ${temp > 28 ? 'text-red-400' : temp < 18 ? 'text-blue-400' : 'text-[hsl(var(--aurora-gold))]'}`}>{temp}°C</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={temp}
                            onChange={(e) => setTemp(parseInt(e.target.value))}
                            className="w-full h-1 bg-card appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-gold))] hover:[&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-magenta))] transition-colors"
                        />
                    </div>

                    {/* Humidity */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center gap-2 text-meta text-foreground/50">
                                <Droplets className="w-3 h-3" /> Humidity
                            </label>
                            <span className="text-label text-[hsl(var(--aurora-cyan))]">{humidity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={humidity}
                            onChange={(e) => setHumidity(parseInt(e.target.value))}
                            className="w-full h-1 bg-card appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-cyan))] hover:[&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-green))] transition-colors"
                        />
                    </div>

                    {/* Light */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center gap-2 text-meta text-foreground/50">
                                <Sun className="w-3 h-3" /> Light
                            </label>
                            <span className="text-label text-yellow-200">{light}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={light}
                            onChange={(e) => setLight(parseInt(e.target.value))}
                            className="w-full h-1 bg-card appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-200 hover:[&::-webkit-slider-thumb]:bg-yellow-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex-1 py-3 rounded border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3 rounded border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Visualizer */}
            <div className="md:col-span-3 relative rounded-xl overflow-hidden border border-border/50 dark:border-white/10 bg-transparent dark:bg-[#050a08]">
                {/* Environmental Overlays */}

                {/* Temperature Tint */}
                <div
                    className="absolute inset-0 pointer-events-none transition-colors duration-1000 z-10"
                    style={{
                        backgroundColor: temp > 30 ? `rgba(255, 50, 0, ${(temp - 30) / 100})` :
                            temp < 15 ? `rgba(0, 100, 255, ${(15 - temp) / 50})` : 'transparent'
                    }}
                />

                {/* Humidity Overlay (Droplets/Blur) */}
                {humidity > 80 && (
                    <div
                        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000"
                        style={{
                            opacity: (humidity - 80) / 20,
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
                            backdropFilter: 'blur(2px)'
                        }}
                    />
                )}

                {/* Light Overlay (Brightness) */}
                <div
                    className="absolute inset-0 pointer-events-none z-20 transition-all duration-300"
                    style={{
                        backgroundColor: `rgba(0,0,0, ${(100 - light) / 150})`, // Darken as light decreases
                    }}
                />

                {/* Grid Background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20 z-0"
                    style={{
                        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                  linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        color: 'var(--border)', // Theme-aware grid color
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                />

                <MyceliumLab
                    isPlaying={isPlaying}
                    temp={temp}
                    humidity={humidity}
                    light={light}
                    key={resetKey}
                />

                {!isPlaying && (
                    <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-foreground/50 z-30 border border-border">
                        PAUSED
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationSection;
