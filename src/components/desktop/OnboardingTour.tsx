
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

interface Step {
    title: string;
    titleCn: string;
    desc: string;
    descCn: string;
}

const steps: Step[] = [
    {
        title: "Welcome to MycoNexus",
        titleCn: "欢迎来到 MycoNexus",
        desc: "Your digital gateway to the fungal kingdom. Explore, identify, and contribute to the global network.",
        descCn: "您通往真菌王国的数字门户。探索、识别并为全球网络做出贡献。",
    },
    {
        title: "Archive Database",
        titleCn: "物种档案库",
        desc: "Access our comprehensive database of 12,000+ species containing detailed anatomy, ecology, and identification data.",
        descCn: "访问我们需要 12,000 多种物种的综合数据库，其中包含详细的解剖学、生态学和识别数据。",
    },
    {
        title: "Global Live Map",
        titleCn: "全球实时地图",
        desc: "Visualize real-time fungal distribution, heatmaps, and user discoveries across the globe.",
        descCn: "可视化全球范围内的实时真菌分布、热力图和用户发现。",
    },
    {
        title: "Interactive Laboratory",
        titleCn: "交互式实验室",
        desc: "Run simulations on mycelium growth, identify unknown specimens with AI, and test your knowledge.",
        descCn: "运行菌丝体生长模拟，使用 AI 识别未知样本，并测试您的知识。",
    },
    {
        title: "Recipes & Culinary",
        titleCn: "食谱与烹饪",
        desc: "Discover safe consumption guides and gourmet recipes for edible species.",
        descCn: "发现食用菌种的安全食用指南和美食食谱。",
    },
    {
        title: "Community News",
        titleCn: "社区新闻",
        desc: "Stay updated with the latest mycological discoveries and ecological alerts from around the world.",
        descCn: "随时掌握来自世界各地的最新真菌学发现和生态预警。",
    },
];

const OnboardingTour = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check local storage to see if tour has been completed
        const hasSeenTour = localStorage.getItem("myco_onboarding_completed");
        if (!hasSeenTour) {
            // Delay slightly for dramatic effect
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem("myco_onboarding_completed", "true");
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                >
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--aurora-cyan)/0.05)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative p-8">
                        {/* Header / Progress */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-1">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentStep
                                            ? "w-8 bg-[hsl(var(--aurora-cyan))]"
                                            : idx < currentStep
                                                ? "w-2 bg-[hsl(var(--aurora-cyan)/0.3)]"
                                                : "w-2 bg-white/10"
                                            }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleComplete}
                                className="text-xs text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest font-medium"
                            >
                                SKIP
                            </button>
                        </div>

                        {/* Content Swapper */}
                        <div className="min-h-[220px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-4xl font-display mb-2 text-foreground tracking-tight">
                                        {steps[currentStep].title}
                                    </h2>
                                    <h3 className="text-base font-display mb-8 text-foreground/40 font-normal tracking-wide">
                                        {steps[currentStep].titleCn}
                                    </h3>

                                    <div className="space-y-6">
                                        <p className="text-lg text-foreground/90 leading-relaxed font-light">
                                            {steps[currentStep].desc}
                                        </p>
                                        <div className="h-px w-8 bg-white/10" />
                                        <p className="text-xs text-foreground/50 leading-relaxed font-light tracking-wide">
                                            {steps[currentStep].descCn}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer / Controls */}
                        <div className="mt-8 flex items-center justify-end">
                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-3 px-8 py-3 bg-[hsl(var(--aurora-cyan)/0.1)] hover:bg-[hsl(var(--aurora-cyan)/0.2)] text-[hsl(var(--aurora-cyan))] rounded-none transition-all duration-300 border border-[hsl(var(--aurora-cyan)/0.2)]"
                            >
                                <span className="text-sm font-medium tracking-[0.2em] uppercase">
                                    {currentStep === steps.length - 1 ? "Start" : "Next"}
                                </span>
                                {currentStep === steps.length - 1 ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OnboardingTour;
