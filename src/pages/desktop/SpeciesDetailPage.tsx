import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Flame,
  Network,
  Loader2,
} from "lucide-react";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import MushroomModel3D from "@/components/desktop/MushroomModel3D";
import { useSpeciesDetail } from "@/hooks/useSpecies";
import { getAssetPath } from "@/utils/assetPath";

const SpeciesDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: species, isLoading, error } = useSpeciesDetail(id!);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-12 h-12 text-[hsl(var(--aurora-cyan))] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !species) {
    return <Navigate to="/archive" replace />;
  }

  const edibilityConfig = {
    edible: { color: "aurora-cyan", label: "Edible", bgColor: "aurora-cyan/0.1" },
    toxic: { color: "aurora-magenta", label: "Toxic", bgColor: "aurora-magenta/0.1" },
    deadly: { color: "destructive", label: "Deadly", bgColor: "destructive/0.1" },
    medicinal: { color: "aurora-purple", label: "Medicinal", bgColor: "aurora-purple/0.1" },
    unknown: { color: "foreground/30", label: "Unknown", bgColor: "foreground/0.05" },
  };

  const config = (edibilityConfig as any)[species.edibility] || edibilityConfig.unknown;

  // Map species to 3D model files
  // Model files are named in Chinese, but species.name_cn uses English names
  const getModelPath = (speciesNameCn: string): string | undefined => {
    const modelMap: Record<string, string> = {
      "Fly Agaric": "models/毒蝇伞.glb",      // Amanita muscaria
      "Morel": "models/羊肚菌.glb",            // Morchella
      "Chanterelle": "models/鸡油菌.glb",      // Cantharellus cibarius
    };
    const relativePath = modelMap[speciesNameCn];
    return relativePath ? getAssetPath(relativePath) : undefined;
  };

  const modelPath = getModelPath(species.name_cn);

  // Get all images
  const images = species.images?.map((img: { image_url: string }) => img.image_url) || [
    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Breadcrumbs */}
        <section className="grid-line-b">
          <div className="max-w-[1440px] mx-auto px-8 py-4">
            <nav className="flex items-center gap-2 text-meta text-foreground/40">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/archive" className="hover:text-foreground transition-colors">
                Archive
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{species.name_cn}</span>
            </nav>
          </div>
        </section>

        {/* ID Card Section */}
        <section className="grid-line-b">
          <div className="max-w-[1440px] mx-auto grid grid-cols-12">
            {/* Left: Image Gallery */}
            <div className="col-span-5 grid-line-r p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Main Image */}
                <div className="relative aspect-square mb-4 overflow-hidden grid-line bg-card">
                  <img
                    src={images[selectedImageIndex]}
                    alt={species.name_cn}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Corner Label */}
                  <div className="absolute top-4 left-4 text-meta text-foreground/60 bg-background/80 px-2 py-1 backdrop-blur-sm">
                    SPECIMEN.{species.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square overflow-hidden grid-line transition-all ${selectedImageIndex === index
                          ? "border-[hsl(var(--aurora-cyan))] border-2"
                          : "opacity-50 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${species.name_cn} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Middle: Core Summary */}
            <div className="col-span-4 grid-line-r p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Scientific Name */}
                <span className="text-meta text-foreground/40 block mb-2">
                  {species.category?.name_cn || "Uncategorized"}
                </span>
                <h1 className="text-display-lg font-display mb-2">
                  {species.name_cn}
                </h1>
                <p className="text-label text-foreground/50 italic mb-6">
                  {species.name_scientific}
                </p>
                <p className="text-label text-foreground/40 mb-6">
                  {species.name_en}
                </p>

                {/* Edibility Badge */}
                <div
                  className={`inline-block mb-8 px-4 py-2 bg-[hsl(var(--${config.bgColor}))] border border-[hsl(var(--${config.color})/0.3)]`}
                >
                  <span className={`text-label text-[hsl(var(--${config.color}))]`}>
                    {config.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-label text-foreground/60 leading-relaxed mb-8">
                  {species.description}
                </p>

                {/* Key Features */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-meta text-foreground/30 block mb-1">
                        Cap Shape
                      </span>
                      <span className="text-label text-foreground/70">
                        {species.cap_shape}
                      </span>
                    </div>
                    <div>
                      <span className="text-meta text-foreground/30 block mb-1">
                        Odor
                      </span>
                      <span className="text-label text-foreground/70">
                        {species.odor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-meta text-foreground/30 block mb-1">
                      Season
                    </span>
                    <div className="flex gap-2">
                      {species.season.map((s) => (
                        <span
                          key={s}
                          className="text-meta px-2 py-1 bg-foreground/5 text-foreground/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-meta text-foreground/30 block mb-1">
                      Habitat
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {species.habitat.map((h) => (
                        <span
                          key={h}
                          className="text-meta px-2 py-1 bg-foreground/5 text-foreground/60"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Similar Species Comparison */}
            <div className="col-span-3 p-8 bg-card/50">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-label text-foreground/60 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--aurora-gold))]" />
                  Similar Species Warning
                </h3>

                {species.similar_species && species.similar_species.length > 0 ? (
                  <div className="space-y-4">
                    {species.similar_species.map((similar) => (
                      <div
                        key={similar.similar_species_id}
                        className="p-4 grid-line bg-background hover:bg-card transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={similar.similar_species.images?.[0]?.image_url || "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format"}
                            alt={similar.similar_species.name_cn}
                            className="w-16 h-16 object-cover grid-line"
                          />
                          <div className="flex-1">
                            <h4 className="text-label text-foreground mb-1">
                              {similar.similar_species.name_cn}
                            </h4>
                            <p className="text-meta text-[hsl(var(--aurora-magenta))]">
                              {similar.warning}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-meta text-foreground/40">
                    No similar species recorded
                  </p>
                )}

                {/* Warning Box */}
                <div className="mt-6 p-4 bg-[hsl(var(--aurora-magenta)/0.1)] border border-[hsl(var(--aurora-magenta)/0.3)]">
                  <p className="text-meta text-foreground/60 leading-relaxed">
                    Note: Distinctions between similar species can be subtle and difficult to identify by appearance alone.
                    <strong className="text-[hsl(var(--aurora-magenta))]">
                      Always seek professional advice
                    </strong>
                    .
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Anatomy Section */}
        {species.anatomy_data && (
          <section className="grid-line-b">
            <div className="max-w-[1440px] mx-auto grid grid-cols-12">
              {/* Left: 3D Model */}
              <div className="col-span-6 grid-line-r p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-label text-foreground/60 mb-6">
                    INTERACTIVE ANATOMY
                  </h2>

                  {/* 3D Model Viewer */}
                  <MushroomModel3D modelPath={modelPath} />
                </motion.div>
              </div>

              {/* Right: Scientific Parameters */}
              <div className="col-span-6 p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-label text-foreground/60 mb-6">
                    SCIENTIFIC PARAMETERS
                  </h2>

                  <div className="space-y-4">
                    {species.anatomy_data.koh_reaction && (
                      <div className="p-4 grid-line hover:bg-card transition-colors">
                        <span className="text-meta text-foreground/40 block mb-2">
                          KOH Reaction
                        </span>
                        <span className="text-label text-foreground">
                          {species.anatomy_data.koh_reaction}
                        </span>
                      </div>
                    )}

                    {species.anatomy_data.spore_print && (
                      <div className="p-4 grid-line hover:bg-card transition-colors">
                        <span className="text-meta text-foreground/40 block mb-2">
                          Spore Print
                        </span>
                        <span className="text-label text-foreground">
                          {species.anatomy_data.spore_print}
                        </span>
                      </div>
                    )}

                    {species.anatomy_data.ring_type && (
                      <div className="p-4 grid-line hover:bg-card transition-colors">
                        <span className="text-meta text-foreground/40 block mb-2">
                          Ring Type
                        </span>
                        <span className="text-label text-foreground">
                          {species.anatomy_data.ring_type}
                        </span>
                      </div>
                    )}

                    {species.anatomy_data.gill_attachment && (
                      <div className="p-4 grid-line hover:bg-card transition-colors">
                        <span className="text-meta text-foreground/40 block mb-2">
                          Gill Attachment
                        </span>
                        <span className="text-label text-foreground">
                          {species.anatomy_data.gill_attachment}
                        </span>
                      </div>
                    )}

                    <div className="p-4 grid-line hover:bg-card transition-colors">
                      <span className="text-meta text-foreground/40 block mb-2">
                        Spore Color
                      </span>
                      <span className="text-label text-foreground">
                        {species.spore_color}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Ecology & Narrative Section */}
        <section className="grid-line-b">
          <div className="max-w-[1440px] mx-auto">
            {/* Ecology Network */}
            {species.ecology_data && (
              <div className="grid grid-cols-12 grid-line-b">
                <div className="col-span-12 p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <h2 className="text-label text-foreground/60 mb-6 flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      ECOLOGICAL NETWORK
                    </h2>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-card grid-line">
                        <h3 className="text-meta text-foreground/40 mb-3">
                          Symbiotic Relationship
                        </h3>
                        <p className="text-label text-foreground/70">
                          {species.ecology_data.relationship}
                        </p>
                      </div>

                      <div className="p-6 bg-card grid-line">
                        <h3 className="text-meta text-foreground/40 mb-3">
                          Host Trees
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {species.ecology_data.host_trees.map((tree: string) => (
                            <span
                              key={tree}
                              className="text-meta px-3 py-1 bg-[hsl(var(--aurora-cyan)/0.1)] text-[hsl(var(--aurora-cyan))]"
                            >
                              {tree}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Network Visualization Placeholder */}
                    <div className="mt-6 aspect-[3/1] bg-card grid-line flex items-center justify-center">
                      <span className="text-meta text-foreground/30">
                        // Ecological Network Graph Coming Soon //
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Cooking & Safety Warning */}
            {species.cooking_notes && (
              <div className="grid grid-cols-12">
                <div className="col-span-12 p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <h2 className="text-label text-foreground/60 mb-6 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      COOKING & SAFETY
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Cooking Method */}
                      <div className="p-6 bg-card grid-line">
                        <h3 className="text-meta text-foreground/40 mb-3">
                          Cooking Method
                        </h3>
                        <p className="text-label text-foreground/70">
                          {species.cooking_notes.method}
                        </p>
                      </div>

                      {/* Safety Warning */}
                      {species.cooking_notes.warning && (
                        <div
                          className={`p-6 border ${species.edibility === "deadly" || species.edibility === "toxic"
                            ? "bg-[hsl(var(--aurora-magenta)/0.1)] border-[hsl(var(--aurora-magenta)/0.3)]"
                            : "bg-[hsl(var(--aurora-gold)/0.1)] border-[hsl(var(--aurora-gold)/0.3)]"
                            }`}
                        >
                          <h3 className="text-meta text-foreground/40 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Safety Warning
                          </h3>
                          <p
                            className={`text-label ${species.edibility === "deadly" || species.edibility === "toxic"
                              ? "text-[hsl(var(--aurora-magenta))]"
                              : "text-[hsl(var(--aurora-gold))]"
                              }`}
                          >
                            {species.cooking_notes.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Back to Archive */}
        <section className="grid-line-t">
          <div className="max-w-[1440px] mx-auto px-8 py-8 flex items-center justify-between">
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 text-label text-foreground/50 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Archive
            </Link>
            <span className="text-meta text-foreground/30">
              SPECIMEN.ID.{species.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SpeciesDetailPage;
