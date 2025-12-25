import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Award, Sparkles, Edit, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";

const ProfilePage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated || !user) {
        navigate("/");
        return null;
    }

    const joinDate = new Date(user.joinDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const stats = [
        { label: "Contributions", value: user.contributions, icon: Sparkles, color: "cyan" },
        { label: "Discoveries", value: user.discoveries, icon: Award, color: "purple" },
        { label: "Network Rank", value: "#" + Math.floor(Math.random() * 500 + 100), icon: MapPin, color: "gold" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-24 pb-32">
                <div className="max-w-5xl mx-auto px-8">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-meta text-foreground/40 hover:text-[hsl(var(--aurora-cyan))] transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        BACK TO NETWORK
                    </motion.button>

                    {/* Profile Header */}
                    <div className="grid-line mb-12">
                        <div className="p-8 bg-card">
                            <div className="flex items-start gap-8 mb-8">
                                {/* Avatar */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-32 h-32 rounded-full border-2 border-[hsl(var(--aurora-cyan))] p-1"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[hsl(var(--aurora-cyan))] flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-background" />
                                    </div>
                                </motion.div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center gap-4 mb-2">
                                            <h1 className="text-4xl font-display text-foreground">{user.username}</h1>
                                            <span className="px-3 py-1 bg-[hsl(var(--aurora-purple)/0.1)] text-[hsl(var(--aurora-purple))] text-[10px] font-mono tracking-widest uppercase rounded-full border border-[hsl(var(--aurora-purple)/0.2)]">
                                                RESEARCHER
                                            </span>
                                        </div>
                                        <p className="text-label text-foreground/50 mb-4">{user.email}</p>
                                        <div className="flex items-center gap-2 text-meta text-foreground/40">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {joinDate}</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Edit Button */}
                                <button className="px-6 py-3 border border-border hover:bg-card/50 transition-colors flex items-center gap-2 text-meta text-foreground/60 hover:text-foreground">
                                    <Edit className="w-4 h-4" />
                                    EDIT PROFILE
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="bg-background p-6 grid-line"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <stat.icon className={`w-5 h-5 text-[hsl(var(--aurora-${stat.color}))]`} />
                                        </div>
                                        <div className="text-3xl font-display text-foreground mb-1">{stat.value}</div>
                                        <div className="text-meta text-foreground/40 uppercase tracking-wider">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-meta text-foreground/30">02</span>
                            <h2 className="text-label text-foreground/60">RECENT ACTIVITY</h2>
                        </div>

                        <div className="grid-line bg-card p-8">
                            <div className="text-center py-20">
                                <Sparkles className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                                <p className="text-label text-foreground/40">No recent activity to display</p>
                                <p className="text-meta text-foreground/30 mt-2">
                                    Start contributing to the network to see your activity here
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
