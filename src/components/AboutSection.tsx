import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import coachPortrait from "@/assets/coach-portrait.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                src={coachPortrait}
                alt="Zeinab Saad - Fight Do Coach"
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
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-primary"
            >
              About the Coach
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl"
            >
              Zeinab Saad
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-4 text-muted-foreground"
            >
              <p className="text-lg leading-relaxed">
                As a certified{" "}
                <span className="font-medium text-primary">Fight Do coach</span>, I
                specialize in empowering individuals through high-energy martial
                arts-inspired fitness. My passion lies in helping you discover your
                inner strength while building physical power.
              </p>

              <p className="text-lg leading-relaxed">
                Beyond Fight Do, I offer comprehensive{" "}
                <span className="font-medium text-primary">
                  strength and weight training
                </span>{" "}
                programs tailored to your goals. Whether you're looking to build
                muscle, increase endurance, or transform your physique—I’m here to
                guide your journey.
              </p>

              <p className="text-lg leading-relaxed">
                Through workshops and group sessions, I’ve had the privilege of
                coaching hundreds of clients, from beginners to advanced athletes.
                My approach combines technical precision with motivational coaching
                to unlock your full potential.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
