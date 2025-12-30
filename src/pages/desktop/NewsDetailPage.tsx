import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Share2, Bookmark, Newspaper } from "lucide-react";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";

import { newsData } from "@/data/newsData";

const NewsDetailPage = () => {
    const { id } = useParams();
    const news = id ? newsData.find(n => n.id === id) : null;

    if (!news) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-display mb-4">Article Not Found</h1>
                <Link to="/news" className="btn-pill px-6 py-2">Back to News</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-24 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Breadcrumbs / Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <Link to="/news" className="group flex items-center gap-2 text-meta text-foreground/40 hover:text-[hsl(var(--aurora-cyan))] transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            BACK TO NETWORK NEWS
                        </Link>
                    </motion.div>

                    {/* Article Header */}
                    <header className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-[hsl(var(--aurora-cyan)/0.1)] text-[hsl(var(--aurora-cyan))] text-[10px] font-mono tracking-widest uppercase rounded-full border border-[hsl(var(--aurora-cyan)/0.2)]">
                                    {news.category}
                                </span>
                                <div className="flex items-center gap-2 text-meta text-foreground/30">
                                    <Clock className="w-3.5 h-3.5" />
                                    {news.date}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-display leading-[1.1] mb-8">
                                {news.title}
                            </h1>

                            <div className="flex items-center justify-between py-6 grid-line-y">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--aurora-cyan)/0.1)] flex items-center justify-center border border-border">
                                        <User className="w-5 h-5 text-[hsl(var(--aurora-cyan))]" />
                                    </div>
                                    <div>
                                        <span className="block text-meta text-foreground/40 uppercase tracking-wider leading-none mb-1">Written By</span>
                                        <span className="text-label text-foreground">{news.author}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="p-3 rounded-full border border-border hover:bg-card/50 transition-colors">
                                        <Bookmark className="w-5 h-5 text-foreground/40" />
                                    </button>
                                    <button className="p-3 rounded-full border border-border hover:bg-card/50 transition-colors">
                                        <Share2 className="w-5 h-5 text-foreground/40" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="aspect-[21/9] bg-card grid-line overflow-hidden mb-16 relative"
                    >
                        <img
                            src={news.image}
                            className="w-full h-full object-cover"
                            alt={news.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </motion.div>

                    {/* Article Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="prose prose-invert prose-emerald max-w-none text-lg leading-relaxed text-foreground/70"
                    >
                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    </motion.div>

                    {/* Footer Navigation */}
                    <footer className="mt-24 pt-12 grid-line-t">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <Newspaper className="w-8 h-8 text-[hsl(var(--aurora-cyan)/0.2)]" />
                                <span className="text-meta text-foreground/30 uppercase tracking-widest">
                                    MYCONEXUS RESEARCH JOURNAL NO. 042-X
                                </span>
                            </div>
                            <Link to="/news" className="btn-pill px-8 py-3 flex items-center gap-3">
                                <span>View More Articles</span>
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Link>
                        </div>
                    </footer>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetailPage;
