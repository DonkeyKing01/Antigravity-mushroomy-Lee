import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Send, Loader2 } from "lucide-react";
import { useUserProgress } from "@/contexts/UserProgressContext";

const IdentificationSection = () => {
    const [input, setInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string; image?: string }>>([
        {
            type: "ai",
            content: "Greetings, researcher. I am the Myco-Identifier. Upload an image or describe a specimen, and I shall analyze its properties."
        }
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addMycelium } = useUserProgress();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { type: "user", content: userMsg }]);
        setInput("");
        setIsAnalyzing(true);
        scrollToBottom();

        // Mock VLM processing
        setTimeout(() => {
            setIsAnalyzing(false);
            setMessages(prev => [...prev, {
                type: "ai",
                content: `Analysis complete. Based on your description "${userMsg}", this appears to be consistent with Psilocybe cubensis. Note the purple-brown spore print and bluing reaction. \n\nConfidence: 94% \nHabitat: Subtropical grasslands`
            }]);
            addMycelium(50, "Identification Reward");
            scrollToBottom();
        }, 2000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setMessages(prev => [...prev, { type: "user", content: "Identify this specimen", image: base64 }]);
                setIsAnalyzing(true);
                scrollToBottom();

                // Mock Image Analysis
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setMessages(prev => [...prev, {
                        type: "ai",
                        content: "Visual analysis complete. Distinctive pileus shape and gill structure detected. This specimen shows characteristics of Amanita muscaria (Fly Agaric). \n\n⚠️ CAUTION: Highly toxic/psychoactive.\n\nKingdom: Fungi\nPhylum: Basidiomycota"
                    }]);
                    addMycelium(100, "Visual Analysis Reward");
                    scrollToBottom();
                }, 2500);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden rounded-lg border border-border/50 dark:border-white/5 bg-transparent dark:bg-black/40 backdrop-blur-sm">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`
              max-w-[80%] rounded-2xl p-4
              ${msg.type === "user"
                                ? "bg-[hsl(var(--aurora-cyan)/0.15)] border border-[hsl(var(--aurora-cyan)/0.2)] text-foreground"
                                : "bg-transparent dark:bg-card border border-border dark:border-white/10 text-foreground/80"}
            `}>
                            {msg.image && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                                    <img src={msg.image} alt="Upload" className="max-w-full h-auto" />
                                </div>
                            )}
                            <div className="whitespace-pre-line text-sm leading-relaxed font-light">
                                {msg.content}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-card border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                            <Loader2 className="w-4 h-4 text-[hsl(var(--aurora-cyan))] animate-spin" />
                            <span className="text-xs text-foreground/50 animate-pulse">Analyzing specimen data...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 dark:border-white/5 bg-transparent dark:bg-black/20">
                <div className="relative flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-full hover:bg-white/5 text-[hsl(var(--aurora-cyan))] transition-colors border border-transparent hover:border-[hsl(var(--aurora-cyan)/0.2)]"
                        title="Upload Image"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe a mushroom or ask a question..."
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-foreground focus:outline-none focus:border-[hsl(var(--aurora-cyan)/0.5)] transition-colors placeholder:text-foreground/20"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() && !isAnalyzing}
                        className="p-3 rounded-full bg-[hsl(var(--aurora-cyan))] text-black hover:bg-[hsl(var(--aurora-green))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-foreground/20">AI Analysis may be inaccurate. Do not consume unknown fungi.</span>
                </div>
            </div>
        </div>
    );
};

export default IdentificationSection;
