import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    title: "The Beginning",
    description:
      "Started my fitness journey, discovering a passion for martial arts and high-intensity training that would shape my career.",
  },
  {
    title: "Fight Do Certification",
    description:
      "Obtained official Fight Do coaching certification, becoming one of the first certified coaches in the region.",
  },
  {
    title: "Strength Coach Certification",
    description:
      "Expanded expertise with advanced strength and conditioning certifications, adding weight training to my coaching repertoire.",
  },
  {
    title: "Workshop Leader",
    description:
      "Launched a series of successful workshops, training hundreds of participants and building a strong community of fitness enthusiasts.",
  },
  {
    title: "Elite Coach Status",
    description:
      "Recognized as an elite-level coach, continuing to inspire and transform lives through Fight Do and strength training.",
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-background py-24 md:py-32"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.2 + index * 0.15,
                ease: "easeOut",
              }}
              className={`relative mb-12 flex items-center ${
                index % 2 === 0
                  ? "justify-end md:pr-12"
                  : "justify-start md:pl-12"
              } md:w-1/2 ${index % 2 === 0 ? "" : "md:ml-auto"}`}
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
