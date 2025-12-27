import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Flame,
  AlertTriangle,
  Sparkles,
  Circle,
  CircleDot,
} from "lucide-react";
import Navigation from "@/components/desktop/Navigation";
import Footer from "@/components/desktop/Footer";

// Helper to get ingredient icons
const getIngredientIcon = (name: string) => {
  const lower = name.toLowerCase();
  let imgSrc = "";
  if (lower.includes("matsutake")) imgSrc = "/images/recipes/matsutake-soup/matsutake.png";
  else if (lower.includes("chanterelle")) imgSrc = "/images/recipes/matsutake-soup/chanterelle.png";
  else if (lower.includes("hen") || lower.includes("chicken")) imgSrc = "/images/recipes/matsutake-soup/hen.png";
  else if (lower.includes("ginger")) imgSrc = "/images/recipes/matsutake-soup/ginger.png";
  else if (lower.includes("water")) imgSrc = "/images/recipes/matsutake-soup/water.png";

  if (imgSrc) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/50 bg-black/20">
        <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center"><CircleDot className="w-4 h-4 text-foreground/50" /></div>;
};

// Helper to get step illustration
const getStepIllustration = (stepNumber: number) => {
  return (
    <div className="w-full aspect-video bg-black/20 rounded-lg mb-6 overflow-hidden border border-border/50 shadow-lg">
      <img
        src={`/images/recipes/matsutake-soup/step_${stepNumber}.png`}
        alt={`Step ${stepNumber}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
      />
    </div>
  );
}

// Mock AI generated recipe
const mockRecipe = {
  title: "Matsutake & Chanterelle Supreme Soup",
  difficulty: "intermediate",
  difficultyLabel: "Intermediate",
  cookingTime: 45,
  servings: 2,
  description: "A fusion of two premium edible fungi. The clear soup base locks in the mushroom aroma, revealing true flavor in simplicity.",
  ingredients: [
    { name: "Matsutake", quantity: "150g", isMain: true },
    { name: "Chanterelle", quantity: "100g", isMain: true },
    { name: "Old Hen", quantity: "Half", isMain: false },
    { name: "Ginger", quantity: "3 slices", isMain: false },
    { name: "Water", quantity: "1500ml", isMain: false },
  ],
  steps: [
    {
      number: 1,
      instruction: "Gently wipe the mud off the Matsutake surface with a damp cloth and slice. Clean the Chanterelles and tear into small pieces.",
      duration: 10,
      temperature: null,
    },
    {
      number: 2,
      instruction: "Cut the hen into pieces, blanch in cold water to remove blood foam, then rinse clean.",
      duration: 15,
      temperature: "High Heat",
    },
    {
      number: 3,
      instruction: "Boil water, add chicken and ginger, then simmer on low heat for 30 minutes until the soup turns whitish.",
      duration: 30,
      temperature: "Low Heat",
    },
    {
      number: 4,
      instruction: "Add Chanterelles and continue simmering for 15 minutes to fully release the mushroom aroma.",
      duration: 15,
      temperature: "Low Heat",
    },
    {
      number: 5,
      instruction: "Finally add Matsutake slices, boil for 3-5 minutes then turn off heat. Season with salt only.",
      duration: 5,
      temperature: "Low Heat",
    },
  ],
  safetyWarnings: [
    {
      text: "Do not overcook Matsutake, or it will lose its unique aroma and texture.",
      isCritical: false,
    },
    {
      text: "Chanterelles must be fully cooked for at least 15 minutes.",
      isCritical: true,
    },
  ],
  safetyLevel: 5,
};

const RecipeDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps(prev => [...prev, stepNumber]);
      toast.success("Step Completed!");

      // Auto-advance
      if (stepNumber < mockRecipe.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(stepNumber + 1);
        }, 1000);
      }
    }
  };

  const difficultyColors = {
    beginner: "aurora-cyan",
    intermediate: "aurora-purple",
    advanced: "aurora-magenta",
    master: "aurora-gold",
  };

  const difficultyColor = difficultyColors[mockRecipe.difficulty as keyof typeof difficultyColors];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Recipe Header */}
        <section className="grid-line-b">
          <div className="max-w-[1440px] mx-auto grid grid-cols-12 min-h-[80vh]">
            {/* Left: AI Chef Notes (Narrower) */}
            <div className="col-span-4 grid-line-r p-8 bg-card/30 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--aurora-gold))]" />
                  <span className="text-meta text-foreground/40">
                    AI CHEF NOTES
                  </span>
                </div>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-4xl font-display mb-6 leading-tight"
                >
                  {mockRecipe.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-label text-foreground/60 leading-relaxed mb-8 text-sm"
                >
                  {mockRecipe.description}
                </motion.p>

                {/* Compact Meta Info */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="px-3 py-1 bg-card border border-border rounded-full text-xs text-foreground/60 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {mockRecipe.cookingTime}m
                  </div>
                  <div className="px-3 py-1 bg-card border border-border rounded-full text-xs text-foreground/60 flex items-center gap-2">
                    <Users className="w-3 h-3" /> {mockRecipe.servings}
                  </div>
                  <div className={`px-3 py-1 border border-transparent bg-[hsl(var(--${difficultyColor})/0.1)] text-[hsl(var(--${difficultyColor}))] rounded-full text-xs`}>
                    {mockRecipe.difficultyLabel}
                  </div>
                </div>

                {/* Ingredients List with Icons */}
                <div>
                  <h3 className="text-label text-foreground/60 mb-4 uppercase tracking-wider text-xs">Ingredients</h3>
                  <div className="space-y-3">
                    {mockRecipe.ingredients.map((ing, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${ing.isMain
                          ? "bg-[hsl(var(--aurora-cyan)/0.05)] border-[hsl(var(--aurora-cyan)/0.2)]"
                          : "bg-background/50 border-transparent hover:border-border"
                          }`}
                      >
                        {getIngredientIcon(ing.name)}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground/80 block">
                            {ing.name}
                          </span>
                          {ing.isMain && <span className="text-[10px] text-[hsl(var(--aurora-cyan))] uppercase tracking-wider">Key Item</span>}
                        </div>
                        <span className="text-sm font-mono text-foreground/50">
                          {ing.quantity}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Cooking Steps (Wider) */}
            <div className="col-span-8 p-12 bg-background relative">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--aurora-cyan)/0.03)] rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                <h3 className="text-label text-foreground/60 mb-8 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  COOKING STEPS
                </h3>

                {/* Step Navigation Progress */}
                <div className="flex items-center gap-4 mb-12">
                  {mockRecipe.steps.map((_, idx) => (
                    <div key={idx} className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          width: idx < currentStep ? "100%" : idx === currentStep ? "100%" : "0%",
                          opacity: idx <= currentStep ? 1 : 0
                        }}
                        className={`h-full ${idx === currentStep ? "bg-[hsl(var(--aurora-cyan))]" : "bg-foreground/30"}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Current Step Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="mb-12"
                  >
                    <div className="p-8 bg-card border border-border rounded-2xl shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl leading-none select-none pointer-events-none">
                        {currentStep + 1}
                      </div>

                      {/* Illustration Area */}
                      {getStepIllustration(currentStep + 1)}

                      {/* Step Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="px-3 py-1 rounded-full bg-foreground/5 text-xs text-foreground/60 font-mono">
                          STEP {String(currentStep + 1).padStart(2, '0')}
                        </div>
                        {mockRecipe.steps[currentStep].temperature && (
                          <div className="flex items-center gap-1 text-xs text-[hsl(var(--aurora-gold))]">
                            <Flame className="w-3 h-3" /> {mockRecipe.steps[currentStep].temperature}
                          </div>
                        )}
                        {mockRecipe.steps[currentStep].duration && (
                          <div className="flex items-center gap-1 text-xs text-foreground/40">
                            <Clock className="w-3 h-3" /> {mockRecipe.steps[currentStep].duration} min
                          </div>
                        )}
                      </div>

                      {/* Instruction */}
                      <p className="text-xl md:text-2xl font-light text-foreground/90 leading-relaxed mb-8">
                        {mockRecipe.steps[currentStep].instruction}
                      </p>

                      {/* Complete Button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleStepComplete(currentStep)}
                        disabled={completedSteps.includes(currentStep)}
                        className={`
                            px-8 py-3 rounded-lg flex items-center gap-2 transition-all w-full justify-center md:w-auto
                            ${completedSteps.includes(currentStep)
                            ? "bg-green-500/10 text-green-500 cursor-default"
                            : "bg-[hsl(var(--aurora-cyan))] text-black hover:bg-[hsl(var(--aurora-cyan)/0.9)] shadow-[0_0_20px_hsl(var(--aurora-cyan)/0.3)]"
                          }
                        `}
                      >
                        {completedSteps.includes(currentStep) ? (
                          <><Sparkles className="w-5 h-5" /> Step Completed</>
                        ) : (
                          <><Circle className="w-5 h-5" /> Mark as Complete</>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step List Overview Context */}
                <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                  {mockRecipe.steps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`w-full text-left p-4 rounded-lg flex items-center gap-4 transition-colors ${idx === currentStep ? "bg-foreground/5" : "hover:bg-foreground/5"}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${idx === currentStep ? "bg-[hsl(var(--aurora-cyan))]" : completedSteps.includes(idx) ? "bg-foreground/30" : "bg-foreground/10"}`} />
                      <span className={`text-sm ${idx === currentStep ? "text-foreground" : "text-foreground/40"}`}>
                        {step.instruction.substring(0, 50)}...
                      </span>
                    </button>
                  ))}
                </div>

              </motion.div>
            </div>
          </div>
        </section>

        {/* Safety Guide Section */}
        <section className="grid-line-b bg-[hsl(var(--aurora-magenta)/0.05)]">
          <div className="max-w-[1440px] mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-label text-foreground/60 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[hsl(var(--aurora-magenta))]" />
                SAFETY FIRST
              </h2>

              <div className="space-y-4">
                {mockRecipe.safetyWarnings.map((warning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className={`p-6 border ${warning.isCritical
                      ? "bg-[hsl(var(--aurora-magenta)/0.1)] border-[hsl(var(--aurora-magenta)/0.5)]"
                      : "bg-card border-border"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {warning.isCritical && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--aurora-magenta))] flex items-center justify-center">
                          <span className="text-background font-mono text-xs font-bold">!</span>
                        </div>
                      )}
                      <div className="flex-1">
                        {warning.isCritical && (
                          <span className="text-meta text-[hsl(var(--aurora-magenta))] block mb-2">
                            CRITICAL
                          </span>
                        )}
                        <p className={`text-label ${warning.isCritical
                          ? "text-[hsl(var(--aurora-magenta))] font-medium"
                          : "text-foreground/70"
                          }`}>
                          {warning.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Safety Level Indicator */}
              <div className="mt-8 p-6 bg-card grid-line">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-meta text-foreground/40">Safety Level</span>
                  <span className="text-label text-foreground">
                    {mockRecipe.safetyLevel}/5
                  </span>
                </div>
                <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(mockRecipe.safetyLevel / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-[hsl(var(--aurora-cyan))] to-[hsl(var(--aurora-purple))]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Back to Recipes */}
        <section className="grid-line-t">
          <div className="max-w-[1440px] mx-auto px-8 py-8 flex items-center justify-between">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 text-label text-foreground/50 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Recipes
            </Link>
            <button className="btn-pill flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;
