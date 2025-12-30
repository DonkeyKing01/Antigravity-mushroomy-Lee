import { motion } from "framer-motion";
import { Archive, Map, FlaskConical, BookOpen, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssetPath } from "@/utils/assetPath";

interface FeatureCell {
  index: string;
  title: string;
  titleEn: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  size: "large" | "medium" | "small";
  accent?: string;
  stats?: { label: string; value: string };
}

const features: FeatureCell[] = [
  {
    index: "01",
    title: "ARCHIVE",
    titleEn: "ARCHIVE",
    description: "Explore the complete database of 12,000+ species",
    icon: <Archive className="w-6 h-6" />,
    path: "/archive",
    size: "medium",
    accent: "aurora-cyan",
    stats: { label: "SPECIES", value: "12,847" },
  },
  {
    index: "02",
    title: "LIVE MAP",
    titleEn: "LIVE MAP",
    description: "Real-time visualization of global fungal distribution",
    icon: <Map className="w-6 h-6" />,
    path: "/map",
    size: "medium",
    accent: "aurora-cyan",
    stats: { label: "MARKERS", value: "28,391" },
  },
  {
    index: "03",
    title: "LABORATORY",
    titleEn: "LABORATORY",
    description: "Mycelium growth simulation and data visualization",
    icon: <FlaskConical className="w-6 h-6" />,
    path: "/lab",
    size: "large",
    accent: "aurora-cyan",
    stats: { label: "ONLINE", value: "127" },
  },
  {
    index: "04",
    title: "RECIPES",
    titleEn: "RECIPES",
    description: "Safe consumption guide and culinary inspiration",
    icon: <BookOpen className="w-6 h-6" />,
    path: "/recipes",
    size: "medium",
    accent: "aurora-cyan",
    stats: { label: "RECIPES", value: "842" },
  },
  {
    index: "05",
    title: "NEWS",
    titleEn: "NEWS",
    description: "Latest discoveries and community updates",
    icon: <Newspaper className="w-6 h-6" />,
    path: "/news",
    size: "medium",
    accent: "aurora-cyan",
    stats: { label: "ARTICLES", value: "Latest" },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cellVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const FeatureGrid = () => {
  return (
    <section className="grid-line-t">
      {/* Section Header */}
      <div className="grid grid-cols-12 grid-line-b">
        <div className="col-span-12 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-meta text-foreground/30">02</span>
            <h2 className="text-label text-foreground/60">FEATURES</h2>
          </div>
          <span className="text-meta text-foreground/30">
            SELECT DESTINATION
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px] relative bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url('${getAssetPath("/images/shortcut-bg.png")}')` }}
      >
        {/* Left Column (Archive, Map) */}
        <div className="flex flex-col border-r border-border/40">
          {/* Cell 1: Archive */}
          <motion.div variants={cellVariants} className="flex-1 border-b border-border/40">
            <FeatureCard feature={features[0]} />
          </motion.div>
          {/* Cell 2: Map */}
          <motion.div variants={cellVariants} className="flex-1">
            <FeatureCard feature={features[1]} />
          </motion.div>
        </div>

        {/* Center Column (Lab) */}
        <motion.div variants={cellVariants} className="border-r border-border/40">
          {/* Cell 3: Lab (Full Height) */}
          <FeatureCard feature={features[2]} isLarge />
        </motion.div>

        {/* Right Column (Recipes, News) */}
        <div className="flex flex-col">
          {/* Cell 4: Recipes */}
          <motion.div variants={cellVariants} className="flex-1 border-b border-border/40">
            <FeatureCard feature={features[3]} />
          </motion.div>
          {/* Cell 5: News */}
          <motion.div variants={cellVariants} className="flex-1">
            <FeatureCard feature={features[4]} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

interface FeatureCardProps {
  feature: FeatureCell;
  isLarge?: boolean;
}

const FeatureCard = ({ feature, isLarge }: FeatureCardProps) => {
  const accentColor = `hsl(var(--${feature.accent}))`;

  return (
    <Link
      to={feature.path}
      className="group relative h-full flex flex-col p-8 transition-all duration-500 bg-background/95 hover:bg-black/50"
    >
      {/* Decorative Index */}
      <span
        className="cell-number absolute top-6 right-6 transition-opacity duration-500 group-hover:opacity-100 opacity-60 text-4xl font-display"
        style={{ color: isLarge ? accentColor : 'currentColor' }}
      >
        {feature.index}
      </span>

      {/* Icon */}
      <div
        className="mb-6 transition-transform duration-500 group-hover:translate-x-1"
        style={{ color: accentColor }}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <div className="mt-auto">
        <span className="text-meta text-foreground/30 block mb-2">
          {feature.titleEn}
        </span>
        <h3 className={`font-display ${isLarge ? 'text-display-lg' : 'text-3xl'} text-foreground mb-3`}>
          {feature.title}
        </h3>

        <p className={`text-label text-foreground/40 leading-relaxed max-w-xs ${isLarge ? 'block' : 'hidden md:block'}`}>
          {feature.description}
        </p>

        {/* Stats */}
        {feature.stats && (
          <div className={`mt-8 pt-4 border-t border-border/10 ${isLarge ? 'block' : 'block'}`}>
            <span className="text-meta text-foreground/30">{feature.stats.label}</span>
            <span
              className="block text-2xl font-display mt-1"
              style={{ color: accentColor }}
            >
              {feature.stats.value}
            </span>
          </div>
        )}
      </div>

      {/* Hover Indicator */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: accentColor }}
      />
    </Link>
  );
};

export default FeatureGrid;
