import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-charcoal py-24 md:py-32"
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
            Get in Touch
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Let's Connect
          </h2>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/zeinabsaad24"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="group flex items-center gap-4 rounded-xl bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20">
                <Instagram className="h-7 w-7 text-primary" />
              </div>
              <div>
                <span className="mb-1 block text-sm text-muted-foreground">
                  Instagram
                </span>
                <span className="font-medium text-foreground">
                  @zeinabsaad24
                </span>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+96170722446"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="group flex items-center gap-4 rounded-xl bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <div>
                <span className="mb-1 block text-sm text-muted-foreground">
                  Phone
                </span>
                <span className="font-medium text-foreground">
                  +961 70 722 446
                </span>
              </div>
            </motion.a>
          </div>

          {/* Motivational quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <blockquote className="font-display text-2xl italic text-muted-foreground">
              "The only bad workout is the one that didn't happen."
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
