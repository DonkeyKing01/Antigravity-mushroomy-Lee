import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Filter, X, ChevronDown, Archive, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";
import { useSpeciesList, SpeciesData } from "@/hooks/useSpecies";

const edibilityOptions = [
  { value: "all", label: "All", color: "foreground/50" },
  { value: "edible", label: "Edible", color: "aurora-cyan" },
  { value: "toxic", label: "Toxic", color: "aurora-gold" },
  { value: "deadly", label: "Deadly", color: "destructive" },
  { value: "medicinal", label: "Medicinal", color: "aurora-purple" },
];

const morphologyOptions = [
  { category: "Cap Shape", options: ["Hemispherical to Flat", "Funnel", "Honeycomb", "Fan to Kidney"] },
  { category: "Odor", options: ["Mild", "Apricot", "Resinous", "Foul", "Fragrant", "Bitter"] },
  { category: "Habitat", options: ["Mixed Forest", "Pine Forest", "Broadleaf Forest", "Burnt Ground", "Decaying Wood"] },
  { category: "Spore Color", options: ["White", "Olive Brown", "Yellowish", "Brown"] },
];

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);
  const [selectedEdibility, setSelectedEdibility] = useState("all");
  const [selectedMorphology, setSelectedMorphology] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch data from Supabase
  const { data: allSpecies, isLoading, error } = useSpeciesList({
    edibility: selectedEdibility,
    search: searchQuery,
  });

  // Client-side filtering for morphology (more complex than SQL)
  const filteredSpecies = (allSpecies || []).filter((species) => {
    if (selectedMorphology.length === 0) return true;

    return selectedMorphology.some(
      filter =>
        species.cap_shape?.includes(filter) ||
        species.odor?.includes(filter) ||
        species.habitat?.some(h => h.includes(filter)) ||
        species.spore_color?.includes(filter)
    );
  });

  const totalPages = Math.ceil(filteredSpecies.length / itemsPerPage);
  const paginatedSpecies = filteredSpecies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleMorphology = (option: string) => {
    setSelectedMorphology(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Breadcrumbs & Search */}
        <section className="grid-line-b">
          <div className="max-w-[1440px] mx-auto px-8 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-meta text-foreground/40">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/60">Archive</span>
              {selectedEdibility !== "all" && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">
                    {edibilityOptions.find(o => o.value === selectedEdibility)?.label}
                  </span>
                </>
              )}
            </nav>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Semantic search: species, features, scientific names..."
                  className="w-full bg-card border border-border pl-12 pr-4 py-4 text-label text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--aurora-cyan))] transition-colors"
                />
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-6 py-4 grid-line flex items-center gap-3 text-label text-foreground/60 hover:text-foreground hover:bg-card transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Main Interface: Sidebar + Grid */}
        <section className="grid grid-cols-12">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {filterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-3 grid-line-r overflow-hidden"
              >
                <div className="p-6 space-y-8">
                  {/* Edibility Filter (Radio) */}
                  <div>
                    <h3 className="text-label text-foreground/60 mb-4 flex items-center justify-between">
                      Edibility
                      {selectedEdibility !== "all" && (
                        <button
                          onClick={() => {
                            setSelectedEdibility("all");
                            setCurrentPage(1);
                          }}
                          className="text-meta text-foreground/30 hover:text-foreground"
                        >
                          Reset
                        </button>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {edibilityOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedEdibility === option.value
                              ? `border-[hsl(var(--${option.color}))] bg-[hsl(var(--${option.color}))]`
                              : "border-foreground/30 group-hover:border-foreground/50"
                              }`}
                            onClick={() => {
                              setSelectedEdibility(option.value);
                              setCurrentPage(1);
                            }}
                          >
                            {selectedEdibility === option.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-background" />
                            )}
                          </div>
                          <span
                            className={`text-label transition-colors ${selectedEdibility === option.value
                              ? "text-foreground"
                              : "text-foreground/50 group-hover:text-foreground/70"
                              }`}
                          >
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Morphology Filter (Checkboxes) */}
                  <div>
                    <h3 className="text-label text-foreground/60 mb-4 flex items-center justify-between">
                      Morphology
                      {selectedMorphology.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedMorphology([]);
                            setCurrentPage(1);
                          }}
                          className="text-meta text-foreground/30 hover:text-foreground"
                        >
                          Clear
                        </button>
                      )}
                    </h3>
                    {morphologyOptions.map((category) => (
                      <div key={category.category} className="mb-6">
                        <h4 className="text-meta text-foreground/40 mb-2">
                          {category.category}
                        </h4>
                        <div className="space-y-2">
                          {category.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedMorphology.includes(option)
                                  ? "border-[hsl(var(--aurora-cyan))] bg-[hsl(var(--aurora-cyan))]"
                                  : "border-foreground/30 group-hover:border-foreground/50"
                                  }`}
                                onClick={() => {
                                  toggleMorphology(option);
                                  setCurrentPage(1);
                                }}
                              >
                                {selectedMorphology.includes(option) && (
                                  <svg
                                    className="w-3 h-3 text-background"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-meta text-foreground/50 group-hover:text-foreground/70 transition-colors">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Result Grid */}
          <div className={filterOpen ? "col-span-9" : "col-span-12"}>
            {/* Result Count */}
            <div className="grid-line-b px-8 py-4 flex items-center justify-between">
              {isLoading ? (
                <span className="text-label text-foreground/50">Loading...</span>
              ) : (
                <span className="text-label text-foreground/50">
                  Found <span className="text-foreground">{filteredSpecies.length}</span> Species
                </span>
              )}
              {(searchQuery || selectedEdibility !== "all" || selectedMorphology.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedEdibility("all");
                    setSelectedMorphology([]);
                    setCurrentPage(1);
                  }}
                  className="text-meta text-foreground/40 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[hsl(var(--aurora-cyan))] animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
                <span className="text-label text-foreground/50 mb-4">
                  Load failed, please refresh
                </span>
                <span className="text-meta text-foreground/30">
                  {error.message}
                </span>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredSpecies.length === 0 && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <span className="text-label text-foreground/50">
                  No matching species found
                </span>
              </div>
            )}

            {/* Species Cards Grid */}
            {!isLoading && !error && paginatedSpecies.length > 0 && (
              <div className="grid grid-cols-3 min-h-[60vh]">
                {paginatedSpecies.map((species, index) => (
                  <SpeciesCard key={species.id} species={species} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="grid-line-t px-8 py-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-meta text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-meta transition-colors ${currentPage === page
                      ? "text-foreground bg-card"
                      : "text-foreground/40 hover:text-foreground"
                      }`}
                  >
                    {String(page).padStart(2, "0")}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-meta text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="grid-line-t bg-[hsl(var(--aurora-magenta)/0.05)]">
          <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-start gap-4">
            <div className="text-[hsl(var(--aurora-magenta))]">⚠️</div>
            <div>
              <h4 className="text-label text-foreground/80 mb-2">Legal Disclaimer</h4>
              <p className="text-meta text-foreground/50 leading-relaxed max-w-3xl">
                The information provided in this archive is for learning and reference only. Identification of wild fungi requires professional knowledge and experience.
                <strong className="text-[hsl(var(--aurora-magenta))]">
                  Strictly do not consume wild fungi without professional guidance
                </strong>
                . Any consequences caused by consuming wild fungi are the sole responsibility of the individual.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

interface SpeciesCardProps {
  species: SpeciesData;
  index: number;
}

const SpeciesCard = ({ species, index }: SpeciesCardProps) => {
  const edibilityConfig = {
    edible: { color: "aurora-cyan", label: "Edible" },
    toxic: { color: "aurora-magenta", label: "Toxic" },
    deadly: { color: "destructive", label: "Deadly" },
    medicinal: { color: "aurora-purple", label: "Medicinal" },
    unknown: { color: "foreground/30", label: "Unknown" },
  };

  const config = edibilityConfig[species.edibility];
  const imageUrl = species.images?.[0]?.image_url || "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format";
  const categoryName = species.category?.name_cn || "Uncategorized";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/archive/${species.id}`}
        className="block grid-line p-6 hover:bg-card transition-colors group"
      >
        {/* Image with overlay */}
        <div className="relative aspect-square mb-4 overflow-hidden bg-card grid-line">
          <img
            src={imageUrl}
            alt={species.name_cn}
            className="absolute inset-0 w-full h-full object-cover grayscale-hover"
          />

          {/* Edibility Badge */}
          <div
            className={`absolute top-3 right-3 text-meta px-2 py-1 bg-[hsl(var(--${config.color})/0.2)] text-[hsl(var(--${config.color}))] backdrop-blur-sm`}
          >
            {config.label}
          </div>

          {/* Color Change Badge */}
          {species.color_change && (
            <div className="absolute bottom-3 left-3 text-meta px-2 py-1 bg-background/80 text-foreground/60 backdrop-blur-sm">
              {species.color_change}
            </div>
          )}

          {/* 3D Preview Indicator */}
          <div className="absolute bottom-3 right-3 w-8 h-8 grid-line bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-meta text-foreground/60">3D</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-meta text-foreground/30 block mb-1">
            {categoryName}
          </span>
          <h3 className="text-xl font-display group-hover:text-[hsl(var(--aurora-cyan))] transition-colors mb-1">
            {species.name_cn}
          </h3>
          <span className="text-label text-foreground/40 italic block mb-3">
            {species.name_scientific}
          </span>
          <p className="text-sm !normal-case text-foreground/50 line-clamp-2">
            {species.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArchivePage;
