import Navigation from "@/components/desktop/Navigation";
import HeroSection from "@/components/desktop/HeroSection";
import FeatureGrid from "@/components/desktop/FeatureGrid";
import CuratedContent from "@/components/desktop/CuratedContent";
import Footer from "@/components/desktop/Footer";

const DiscoveryHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureGrid />
        <CuratedContent />
      </main>
      <Footer />
    </div>
  );
};

export default DiscoveryHome;
