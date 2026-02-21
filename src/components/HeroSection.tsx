import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { publicHeroApi } from "@/services/heroApi";
import { HeroContent } from "@/types/content";


const HeroSection = () => {
  const [hero, setHero] = useState<HeroContent>({
    tagline: "",
    headline: "",
    subtitle: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    backgroundImageUrl: "",
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await publicHeroApi.getHero();
        setHero(data);
      } catch (err) {
        console.error("Failed to fetch Hero", err);
      }
    };

    fetchHero();
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Use backgroundImageUrl if available, otherwise fallback to default
  const backgroundImage = hero.backgroundImageUrl ;

  return (
    <section className="relative w-full overflow-hidden md:min-h-screen">
      {/* Mobile: in-flow image + overlays (like AboutSection) */}
      <div className="relative md:hidden">
        <img
          src={backgroundImage}
          alt="Fight Do Training"
          className="w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Desktop: absolute full-bleed background */}
      <div className="hidden md:block absolute inset-0 bg-background">
        <img
          src={backgroundImage}
          alt="Fight Do Training"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Content: below image on mobile, centered overlay on md+ */}
      <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center md:absolute md:inset-0 md:justify-center md:py-0">
        {hero.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              {hero.tagline}
            </span>
          </motion.div>
        )}

        {hero.headline && (
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            {hero.headline}
          </motion.h1>
        )}

        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            {hero.subtitle}
          </motion.p>
        )}

        {(hero.primaryButtonText || hero.secondaryButtonText) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {hero.primaryButtonText && (
              <Button variant="hero" size="xl" onClick={scrollToContact}>
                {hero.primaryButtonText}
              </Button>
            )}
            {hero.secondaryButtonText && (
              <Button variant="heroOutline" size="xl" onClick={scrollToAbout}>
                {hero.secondaryButtonText}
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator (desktop only) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 cursor-pointer md:block"
        onClick={scrollToAbout}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
