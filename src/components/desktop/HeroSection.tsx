import { motion } from "framer-motion";
import { useState } from "react";
import { Scan } from "lucide-react";
import MyceliumScene from "./MyceliumScene";
import ScanModal from "./ScanModal";

const HeroSection = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
  };

  return (
    <section className="relative min-h-screen grid grid-cols-12">
      {/* WebGL Background - Full Screen */}
      <div className="absolute inset-0 col-span-12">
        <MyceliumScene />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 col-span-12 grid grid-cols-12">
        {/* Left Content Block - 7 columns */}
        <div className="col-span-7 grid-line-r flex flex-col justify-center px-12 py-24 pt-32 bg-gradient-to-r from-background/90 via-background/70 to-transparent backdrop-blur-sm">
          {/* Meta Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-meta text-foreground/40">
              EST. 2024 — DIGITAL MYCOLOGY / CYBER MYCOLOGY
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-xl text-foreground mb-6"
          >
            Explore the Hidden
            <br />
            <span className="text-[hsl(var(--aurora-cyan))]">Mycelium Network</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-label text-foreground/50 max-w-md mb-12 leading-relaxed"
          >
            All things connected through the underground. Where chaos, connection, and creation converge.
            <br />
            <span className="text-foreground/30">CHAOS · CONNECTION · CREATION</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button 
              className="btn-pill inline-flex items-center gap-3 group"
              onClick={handleOpenScanModal}
            >
              <Scan className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>SCAN SPECIES</span>
            </button>
          </motion.div>

          {/* Coordinates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-auto pt-24"
          >
            <div className="flex gap-12 text-meta text-foreground/30">
              <div>
                <span className="block text-foreground/50 mb-1">SPECIES RECORDED</span>
                12,847
              </div>
              <div>
                <span className="block text-foreground/50 mb-1">ACTIVE EXPLORERS</span>
                3,291
              </div>
              <div>
                <span className="block text-foreground/50 mb-1">TODAY'S DISCOVERIES</span>
                47
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Visual Block - 5 columns */}
        <div className="col-span-5 relative flex items-center justify-center p-12 pt-32">
          {/* Info Panel with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-square max-w-md"
          >
            {/* Outer Frame */}
            <div className="absolute inset-0 grid-line bg-background/20 backdrop-blur-md">
              {/* Grid Overlay */}
              <div className="absolute inset-4 grid grid-cols-4 grid-rows-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="grid-line opacity-20" />
                ))}
              </div>

              {/* Corner Labels */}
              <span className="absolute top-3 left-3 text-meta text-foreground/30">
                SPECIMEN.VIEW
              </span>
              <span className="absolute bottom-3 right-3 text-meta text-foreground/30">
                LIVE.FEED
              </span>

              {/* Center Info */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-meta text-foreground/40 block mb-2">
                    REAL-TIME VISUALIZATION
                  </span>
                  <span className="text-label text-foreground/60">
                    MYCELIUM SIMULATION
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative Number */}
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-8 right-8 font-display text-[12rem] font-light italic leading-none select-none pointer-events-none"
          >
            00
          </motion.span>
        </div>
      </div>

      {/* Bottom Grid Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[hsl(var(--structural-line))] animate-grid-h z-20" />

      {/* Scan Modal */}
      <ScanModal isOpen={isScanModalOpen} onClose={handleCloseScanModal} />
    </section>
  );
};

export default HeroSection;
