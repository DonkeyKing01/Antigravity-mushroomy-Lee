import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, CheckCircle, XCircle, Brain, Trophy } from "lucide-react";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { toast } from "sonner";

interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const mockQuestions: Question[] = [
    {
        id: 1,
        text: "Which of the following fungi is known for its bioluminescent properties?",
        options: ["Amanita muscaria", "Omphalotus nidiformis", "Boletus edulis", "Agaricus bisporus"],
        correctIndex: 1,
        explanation: "Omphalotus nidiformis, also known as the Ghost Fungus, is well known for its bioluminescence, glowing green in the dark."
    },
    {
        id: 2,
        text: "What is the primary role of mycelium in an ecosystem?",
        options: ["Photosynthesis", "Decomposition", "Predation", "Pollination"],
        correctIndex: 1,
        explanation: "Mycelium acts as nature's recycler, breaking down organic matter and returning nutrients to the soil."
    },
    {
        id: 3,
        text: "The largest living organism on Earth is a fungus. Which species is it?",
        options: ["Armillaria ostoyae", "Fomes fomentarius", "Pleurotus ostreatus", "Ganoderma lucidum"],
        correctIndex: 0,
        explanation: "A specimen of Armillaria ostoyae (Honey Fungus) in Oregon covers over 2,385 acres and is estimated to be thousands of years old."
    }
];

const KnowledgeSection = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [streak, setStreak] = useState(0);

    const { addMycelium } = useUserProgress();
    const currentQuestion = mockQuestions[currentQuestionIndex];

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
        setIsAnswered(true);

        if (index === currentQuestion.correctIndex) {
            toast.success("Correct Answer!", { description: "+100 Mycelium" });
            addMycelium(100, "Knowledge Reward");
            setStreak(prev => prev + 1);
        } else {
            toast.error("Incorrect", { description: "Try again tomorrow!" });
            setStreak(0);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setCurrentQuestionIndex((prev) => (prev + 1) % mockQuestions.length);
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-4">
            <div className="min-h-full flex flex-col items-center justify-center py-12">
                <div className="max-w-2xl w-full space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[hsl(var(--aurora-purple)/0.1)] border border-[hsl(var(--aurora-purple)/0.2)] text-[hsl(var(--aurora-purple))] text-xs tracking-widest uppercase">
                            <Brain className="w-3 h-3" />
                            Daily Challenge
                        </div>
                        <h2 className="text-3xl font-display">Fungal Wisdom</h2>
                        <p className="text-foreground/50 text-sm">Test your knowledge and earn Mycelium to unlock rare specimens.</p>
                    </div>

                    {/* Question Card */}
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-transparent dark:bg-card/50 backdrop-blur border border-border/50 dark:border-white/10 rounded-2xl p-8 relative overflow-hidden"
                    >
                        {/* Card Decoration */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain className="w-24 h-24" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <h3 className="text-xl font-light leading-relaxed">
                                {currentQuestion.text}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.options.map((option, idx) => {
                                    let stateClass = "border-border dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5";
                                    if (isAnswered) {
                                        if (idx === currentQuestion.correctIndex) {
                                            stateClass = "bg-green-500/20 border-green-500/50 text-green-200";
                                        } else if (idx === selectedOption) {
                                            stateClass = "bg-red-500/20 border-red-500/50 text-red-200";
                                        } else {
                                            stateClass = "opacity-50";
                                        }
                                    } else if (selectedOption === idx) {
                                        stateClass = "bg-white/10 border-[hsl(var(--aurora-cyan))]";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={isAnswered}
                                            className={`
                      w-full p-4 rounded-xl text-left border transition-all duration-300
                      flex items-center justify-between
                      ${stateClass}
                    `}
                                        >
                                            <span>{option}</span>
                                            {isAnswered && idx === currentQuestion.correctIndex && (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                            {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                                                <XCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-[hsl(var(--aurora-cyan)/0.05)] border border-[hsl(var(--aurora-cyan)/0.1)] rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 bg-[hsl(var(--aurora-cyan)/0.1)] rounded-full text-[hsl(var(--aurora-cyan))]">
                                            <HelpCircle className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-[hsl(var(--aurora-cyan))] uppercase tracking-wider font-bold">Explanation</span>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>

                    {/* Next/Streak Area */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-foreground/40 text-sm">
                            <Trophy className="w-4 h-4 text-[hsl(var(--aurora-gold))]" />
                            <span>Current Streak: <span className="text-[hsl(var(--aurora-gold))]">{streak}</span></span>
                        </div>

                        {isAnswered && (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-[hsl(var(--aurora-cyan))] text-black rounded-full font-medium hover:bg-[hsl(var(--aurora-green))] transition-colors"
                            >
                                Next Question
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KnowledgeSection;
