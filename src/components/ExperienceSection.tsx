import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { publicExperiencesApi } from "@/services/experiencesApi";
import { Experience } from "@/types/content";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await publicExperiencesApi.getExperiences();
        setExperiences(data || []);
      } catch (err) {
        console.error("Failed to fetch experiences", err);
        setExperiences([]);
      }
    };

    fetchExperiences();
  }, []);

  if (!experiences.length) return null;

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Journey
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Experience & Growth
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />

          {experiences
            .filter((exp) => exp.title && exp.description)
            .map((exp, index) => (
              <motion.div
                key={exp.id || exp.title || index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className={`relative mb-12 flex items-center ${
                  index % 2 === 0
                    ? "justify-end md:pr-12"
                    : "justify-start md:pl-12"
                } md:w-1/2 ${index % 2 !== 0 ? "md:ml-auto" : ""}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    index % 2 === 0
                      ? "right-0 translate-x-1/2"
                      : "left-0 -translate-x-1/2"
                  } hidden md:block`}
                >
                  <div className="h-4 w-4 rounded-full border-4 border-primary bg-background" />
                </div>

                {/* Content card */}
                <div className="group rounded-xl bg-card p-6 shadow-card transition-all duration-500 hover:shadow-glow">
                  <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                    {exp.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
