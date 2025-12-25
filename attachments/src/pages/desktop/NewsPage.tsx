import { motion } from "framer-motion";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import { Newspaper, ArrowUpRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const NewsPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16">
                <section className="grid-line-b mb-12">
                    <div className="max-w-[1440px] mx-auto px-8 pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-meta text-foreground/30 block mb-4">
                                05 / NEWS
                            </span>
                            <h1 className="text-7xl font-display mb-6">
                                MYCO <span className="text-[hsl(var(--aurora-cyan))]">NEWS</span>
                            </h1>
                            <p className="text-label text-foreground/50 max-w-xl">
                                Latest discoveries in mycology, community updates, and project announcements from the MycoNexus network.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-[1440px] mx-auto px-8">
                    <div className="flex flex-col gap-6">
                        {[
                            {
                                id: 1,
                                title: "Bio-luminescent Mycelium Networks Discovered in Deep Caves",
                                date: "DEC 24, 2025",
                                category: "Discovery",
                                image: "https://images.unsplash.com/photo-1542156822-6924d1a71aba?w=800&auto=format&fit=crop",
                                description: "Researchers have identified a rare strain of mycelium that emits a steady cyan glow, facilitating subterranean navigation for certain cave-dwelling species.",
                                author: "Dr. Elena Moss"
                            },
                            {
                                id: 2,
                                title: "Sustainable Architecture: Building with Mushroom Bricks",
                                date: "DEC 22, 2025",
                                category: "Technology",
                                image: "https://images.unsplash.com/photo-1511497584788-8767901b1f0c?w=800&auto=format&fit=crop",
                                description: "A new startup is utilizing the structural integrity of fungal hyphae to create carbon-negative construction materials that are stronger than traditional concrete.",
                                author: "Marcus Thorne"
                            },
                            {
                                id: 3,
                                title: "AI-Driven Fungal Identification App Surpasses Human Accuracy",
                                date: "DEC 21, 2025",
                                category: "Innovation",
                                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop",
                                description: "Using deep learning models trained on millions of field samples, the MycoNexus AI can now identify over 50,000 species with 99.8% accuracy.",
                                author: "Network Core"
                            },
                            {
                                id: 4,
                                title: "Global Spore Dispersal Patterns Shift Due to Climate Change",
                                date: "DEC 19, 2025",
                                category: "Environmental",
                                image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop",
                                description: "A multi-year study reveals how changing wind currents and temperature fluctuations are pushing traditionally tropical fungal species into temperate zones.",
                                author: "Prof. Silas Vane"
                            }
                        ].map((news, i) => (
                            <motion.article
                                key={news.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-card grid-line overflow-hidden"
                            >
                                <Link to={`/news/${news.id}`} className="flex flex-col md:flex-row items-stretch hover:border-[hsl(var(--aurora-cyan))] transition-colors border border-transparent min-h-[160px]">
                                    {/* Left: Image Placeholder */}
                                    <div className="w-full md:w-[280px] flex-shrink-0 bg-background/50 flex items-center justify-center grid-line-r overflow-hidden relative">
                                        <img
                                            src={news.image}
                                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105"
                                            alt={news.title}
                                        />
                                        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-[1]" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90 z-[2]" />
                                        <Newspaper className="w-10 h-10 text-[hsl(var(--aurora-cyan))/10] absolute z-0" />
                                        {/* Link Icon Overlay */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <ArrowUpRight className="w-5 h-5 text-[hsl(var(--aurora-cyan))]" />
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-center text-left">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-[hsl(var(--aurora-cyan))/50]" />
                                                <span className="text-meta text-[hsl(var(--aurora-cyan))]">
                                                    {news.date}
                                                </span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                            <span className="text-meta text-foreground/30 uppercase tracking-widest font-mono">
                                                {news.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display mb-3 group-hover:text-[hsl(var(--aurora-cyan))] transition-colors leading-tight">
                                            {news.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-3 h-3 text-foreground/20" />
                                            <span className="text-meta text-foreground/20 uppercase">By {news.author}</span>
                                        </div>
                                        <p className="text-sm text-foreground/60 max-w-3xl line-clamp-1">
                                            {news.description}
                                        </p>
                                    </div>

                                    {/* Hover Accent Line */}
                                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[hsl(var(--aurora-cyan))] group-hover:w-full transition-all duration-500" />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NewsPage;
