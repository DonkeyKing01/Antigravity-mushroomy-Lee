import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { createPortal } from "react-dom";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const { login, register } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "login") {
            const success = login(email, password);
            if (success) {
                onClose();
                resetForm();
            } else {
                setError("Invalid credentials");
            }
        } else {
            if (!username || !email || !password) {
                setError("All fields are required");
                return;
            }
            const success = register(username, email, password);
            if (success) {
                onClose();
                resetForm();
            } else {
                setError("Registration failed");
            }
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setUsername("");
        setError("");
    };

    const switchMode = () => {
        setMode(mode === "login" ? "register" : "login");
        resetForm();
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card grid-line w-full max-w-md pointer-events-auto relative shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-foreground/40 hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="px-8 pt-8 pb-6 grid-line-b">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="w-5 h-5 text-[hsl(var(--aurora-cyan))]" />
                                    <h2 className="text-display-lg font-display">
                                        {mode === "login" ? "NETWORK LOGIN" : "JOIN NETWORK"}
                                    </h2>
                                </div>
                                <p className="text-label text-foreground/50">
                                    {mode === "login"
                                        ? "Access your mycelium network profile"
                                        : "Create your researcher profile"}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="space-y-4">
                                    {mode === "register" && (
                                        <div>
                                            <label className="text-meta text-foreground/60 mb-2 block uppercase tracking-widest">
                                                Username
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="w-full bg-background border border-border py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--aurora-cyan))] transition-colors"
                                                    placeholder="researcher_john"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-meta text-foreground/60 mb-2 block uppercase tracking-widest">
                                            Email / ID
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-background border border-border py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--aurora-cyan))] transition-colors"
                                                placeholder="Enter anything to login"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-meta text-foreground/60 mb-2 block uppercase tracking-widest">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-background border border-border py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--aurora-cyan))] transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-meta text-[hsl(var(--aurora-magenta))] bg-[hsl(var(--aurora-magenta)/0.1)] border border-[hsl(var(--aurora-magenta)/0.2)] px-4 py-2">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-[hsl(var(--aurora-cyan))] text-background py-3 font-display tracking-wider hover:bg-[hsl(var(--aurora-cyan)/0.9)] transition-colors"
                                    >
                                        {mode === "login" ? "ACCESS NETWORK" : "CREATE PROFILE"}
                                    </button>
                                </div>

                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={switchMode}
                                        className="text-meta text-foreground/40 hover:text-[hsl(var(--aurora-cyan))] transition-colors"
                                    >
                                        {mode === "login"
                                            ? "Need an account? Join the network"
                                            : "Already registered? Login here"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AuthModal;
