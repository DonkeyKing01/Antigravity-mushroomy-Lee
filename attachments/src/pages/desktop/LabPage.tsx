import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Play, Pause, RotateCcw } from "lucide-react";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import MyceliumLab from "@/components/desktop/MyceliumLab";

const LabPage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState(85);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <section className="grid grid-cols-12 grid-line-b">
          <div className="col-span-8 grid-line-r px-8 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-meta text-foreground/30 block mb-4">
                03 / LABORATORY
              </span>
              <h1 className="text-7xl font-display mb-4">
                INTERACTIVE <span className="text-[hsl(var(--aurora-cyan))]">LAB</span>
              </h1>
              <p className="text-label text-foreground/50 max-w-xl">
                Mycelium growth simulation, spore dispersal visualization, ecological network modeling. Explore the mysteries of the fungal world in a digital environment.
              </p>
            </motion.div>
          </div>
          <div className="col-span-4 px-8 py-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-cyan))] animate-pulse" />
              <span className="text-label text-foreground/50">Online Users</span>
            </div>
            <span className="text-5xl font-display text-[hsl(var(--aurora-purple))]">127</span>
          </div>
        </section>

        {/* Lab Interface */}
        <section className="grid grid-cols-12 min-h-[70vh]">
          {/* Control Panel - Left Sidebar */}
          <div className="col-span-3 grid-line-r p-6 z-10">
            <h3 className="text-label text-foreground/60 mb-6">Parameters</h3>

            <div className="space-y-8">
              {/* Temp Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-meta text-foreground/50">Temperature (°C)</label>
                  <span className="text-label text-[hsl(var(--aurora-gold))]">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full h-1 bg-card appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-gold))] hover:[&::-webkit-slider-thumb]:bg-[hsl(var(--aurora-magenta))] transition-colors"
                />
                <div className="text-xs mt-2 text-foreground/30">
                  {temp < 10 ? "Dormant (Too Cold)" : temp > 35 ? "Heat Stress (Critical)" : "Optimal Growth Range"}
                </div>
              </div>

              {/* Humidity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-meta text-foreground/50">Humidity (%)</label>
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
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-12 pt-8 grid-line-t">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-3 grid-line flex items-center justify-center gap-2 text-label text-foreground/50 hover:text-foreground hover:bg-card transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[hsl(var(--aurora-cyan))]" /> : <Play className="w-4 h-4 text-[hsl(var(--aurora-cyan))]" />}
              </button>

              <button
                onClick={handleReset}
                className="flex-1 py-3 grid-line flex items-center justify-center gap-2 text-label text-foreground/50 hover:text-foreground hover:bg-card transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4 text-[hsl(var(--aurora-cyan))]" />
              </button>
            </div>
          </div>

          {/* Simulation Area */}
          <div
            className="col-span-9 relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 120%, #1a2c25 0%, #050a08 60%, #000000 100%)'
            }}
          >

            {/* Digital Grids for Decoration */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-10"
              style={{
                backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px),
                                  linear-gradient(to bottom, #334155 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
              }}
            />

            <MyceliumLab
              key={resetKey}
              isPlaying={isPlaying}
              temp={temp}
              humidity={humidity}
            />

            {!isPlaying && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-foreground/50 z-20 border border-white/5">
                PAUSED
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LabPage;
