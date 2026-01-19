import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { publicAboutApi } from "@/services/aboutApi";
import { AboutContent } from "@/types/content";


const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [about, setAbout] = useState<AboutContent>({
    name: "",
    tagline: "",
    bio: [],
    stats: {
      clientsTrained: "",
      yearsExperience: "",
      workshops: "",
    },
    profileImageUrl: "",
    statsEnabled: true,
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await publicAboutApi.getAbout();
        setAbout(data);
      } catch (err) {
        console.error("Failed to fetch About", err);
      }
    };

    fetchAbout();
  }, []);

  // Use profileImageUrl if available, otherwise fallback to default
  const profileImage = about.profileImageUrl ;
  const displayName = about.name ;
  const displayTagline = about.tagline ;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-24 md:py-32"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg shadow-elegant">
              <img
                src={profileImage}
                alt={`${displayName} - Fight Do Coach`}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-lg bg-gradient-accent opacity-20" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            {displayTagline && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-primary"
              >
                {displayTagline}
              </motion.span>
            )}

            {displayName && (
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl"
              >
                {displayName}
              </motion.h2>
            )}

            {about.bio && about.bio.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="space-y-4 text-muted-foreground"
              >
                {about.bio.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}

            {/* Stats */}
            {about.statsEnabled &&
              (about.stats.clientsTrained ||
                about.stats.yearsExperience ||
                about.stats.workshops) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6"
              >
                {about.stats.clientsTrained && (
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {about.stats.clientsTrained}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Clients Trained
                    </div>
                  </div>
                )}
                {about.stats.yearsExperience && (
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {about.stats.yearsExperience}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Years Experience
                    </div>
                  </div>
                )}
                {about.stats.workshops && (
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {about.stats.workshops}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Workshops
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
