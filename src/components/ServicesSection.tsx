import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Swords, Dumbbell, Globe } from "lucide-react";

const services = [
  {
    icon: Swords,
    title: "Fight Do Coaching",
    description:
      "High-energy martial arts-inspired fitness combining kickboxing, Muay Thai, and combat moves. Perfect for burning calories, building strength, and releasing stress through powerful movements.",
    features: ["Personal Training", "Group Classes", "Technique Mastery"],
  },
  {
    icon: Dumbbell,
    title: "Strength Training",
    description:
      "Customized weight training programs designed to build lean muscle, increase power, and sculpt your physique. From beginners to advanced lifters—tailored to your goals.",
    features: ["Custom Programs", "Progressive Overload", "Body Transformation"],
  },
  {
    icon: Globe,
    title: "Programs",
    description:
      "Flexible remote coaching that combines Fight Do energy and structured strength training. Includes progress plans, and on-demand workouts so you can train anywhere.",
    features: [ "Personalized Plans", "On-Demand Workouts"],
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-charcoal py-24 md:py-32"
      ref={ref}
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Services
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            What I Offer
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 1,
                delay: 0.2 + index * 0.2,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-xl bg-gradient-card p-8 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-4">
                <service.icon className="h-8 w-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mb-4 font-display text-2xl font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-accent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
