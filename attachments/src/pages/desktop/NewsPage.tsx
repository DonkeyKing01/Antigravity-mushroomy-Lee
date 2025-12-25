import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import { Newspaper, ArrowUpRight, Clock, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { newsData } from "@/data/newsData";

const NewsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNews = newsData.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16">
                <section className="grid-line-b mb-12">
                    <div className="max-w-[1440px] mx-auto grid grid-cols-12 overflow-hidden">
                        <div className="col-span-8 px-8 pb-12 pt-4 grid-line-r">
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
                                <p className="text-label text-foreground/50 leading-relaxed">
                                    Latest discoveries in mycology, community updates, and project announcements from the MycoNexus network.
                                </p>
                            </motion.div>
                        </div>
                        <div className="col-span-4 px-12 pb-12 pt-4 flex flex-col justify-end gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative group"
                            >
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-[hsl(var(--aurora-cyan))] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH NETWORK..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-card/30 border border-border/50 py-3 pl-12 pr-4 text-xs font-mono tracking-widest focus:outline-none focus:border-[hsl(var(--aurora-cyan))] focus:bg-card/50 transition-all placeholder:text-foreground/10"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-purple))] animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <span className="text-meta text-foreground/30 uppercase tracking-[0.2em]">NETWORK UPDATES TODAY</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-display text-[hsl(var(--aurora-purple))] leading-none">02</span>
                                    <span className="text-meta text-foreground/20 uppercase tracking-widest">Articles</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="max-w-[1440px] mx-auto px-8">
                    <div className="flex flex-col gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredNews.length > 0 ? (
                                filteredNews.map((news, i) => (
                                    <motion.article
                                        key={news.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
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
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-12 py-20 text-center border border-dashed border-border/50"
                                >
                                    <span className="text-meta text-foreground/20 uppercase tracking-widest font-mono">No network research matching your query.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NewsPage;
