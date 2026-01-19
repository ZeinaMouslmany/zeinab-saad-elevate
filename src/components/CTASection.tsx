import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { publicCTAApi } from "@/services/ctaApi";
import { CTAContent } from "@/types/content";

const CTASection = () => {
  const [cta, setCTA] = useState<CTAContent>({
    headline: "",
    subtitle: "",
    buttonText: "",
  });

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        const data = await publicCTAApi.getCTA();
        setCTA(data);
      } catch (err) {
        console.error("Failed to fetch CTA", err);
      }
    };

    fetchCTA();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Don't render if no content
  if (!cta.headline && !cta.subtitle && !cta.buttonText) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          {cta.headline && (
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {cta.headline}
            </motion.h2>
          )}

          {cta.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-10 text-lg text-muted-foreground md:text-xl"
            >
              {cta.subtitle}
            </motion.p>
          )}

          {cta.buttonText && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button
                variant="hero"
                size="xl"
                className="animate-pulse-glow"
                onClick={scrollToContact}
              >
                {cta.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
