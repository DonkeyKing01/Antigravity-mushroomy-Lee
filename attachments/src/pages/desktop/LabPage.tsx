import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import IdentificationSection from "@/components/desktop/lab/IdentificationSection";
import SimulationSection from "@/components/desktop/lab/SimulationSection";
import KnowledgeSection from "@/components/desktop/lab/KnowledgeSection";

const LabPage = () => {
  const [activeTab, setActiveTab] = useState("simulation");

  const tabs = [
    { id: "identification", label: "IDENTIFICATION", sub: "01", desc: "Multimodal AI Analysis" },
    { id: "simulation", label: "SIMULATION", sub: "02", desc: "Growth & Parameters" },
    { id: "knowledge", label: "KNOWLEDGE", sub: "03", desc: "Daily Challenge" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 px-8 pb-8 flex flex-col max-w-[1920px] mx-auto w-full">

        {/* Header Section */}
        <section className="flex justify-between items-end mb-8 border-b border-border pb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-meta text-foreground/30 block mb-2">
              INTERACTIVE LABORATORY // MODULE {tabs.find(t => t.id === activeTab)?.sub}
            </span>
            <h1 className="text-5xl font-display uppercase">
              Myco <span className="text-[hsl(var(--aurora-cyan))]">{activeTab}</span>
            </h1>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                     relative px-6 py-3 rounded-md transition-all duration-300 flex flex-col items-start min-w-[140px]
                     ${isActive ? 'bg-[hsl(var(--aurora-cyan)/0.15)] text-foreground' : 'hover:bg-black/5 dark:hover:bg-white/5 text-foreground/40'}
                   `}
                >
                  <span className={`text-[10px] tracking-wider mb-1 ${isActive ? 'text-[hsl(var(--aurora-cyan))]' : ''}`}>
                    {tab.sub}
                  </span>
                  <span className="text-sm font-medium tracking-wide">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border border-[hsl(var(--aurora-cyan)/0.3)] rounded-md"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Content Area */}
        <div className="relative min-h-[80vh] bg-transparent dark:bg-black/20 rounded-2xl border border-border/50 dark:border-white/5 overflow-hidden backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 p-6"
            >
              {activeTab === "identification" && <IdentificationSection />}
              {activeTab === "simulation" && <SimulationSection />}
              {activeTab === "knowledge" && <KnowledgeSection />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default LabPage;
