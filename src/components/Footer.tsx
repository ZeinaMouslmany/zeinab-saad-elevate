import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h3 className="font-display text-xl font-semibold text-foreground">
            Zeinab Saad
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Elite Fight Do Coach
          </p>
          <p className="mt-4 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
