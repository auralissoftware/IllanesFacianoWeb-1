import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { AboutSection } from "../components/sections/AboutSection";
import { ContactSection } from "../components/sections/ContactSection";
import { HeroSection } from "../components/sections/HeroSection";
import { WhyChooseSection } from "../components/sections/WhyChooseSection";
import type { SearchAction, SearchTab } from "../lib/searchTypes";

export function HomePage() {
  const navigate = useNavigate();

  function goToCatalog(action: SearchAction) {
    navigate("/catalogo", { state: { action } });
  }

  function handleExploreAll(tab: SearchTab) {
    goToCatalog({ mode: "all", tab });
  }

  function handleSearch(action: SearchAction) {
    goToCatalog(action);
  }

  return (
    <>
      <main>
        <HeroSection
          onExploreAll={handleExploreAll}
          onSearch={handleSearch}
        />
        <AboutSection />
        <WhyChooseSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
