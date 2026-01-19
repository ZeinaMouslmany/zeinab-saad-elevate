import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Instagram,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  MapPin,
  Globe,
} from "lucide-react";
import { publicContactApi, SocialIcon } from "@/services/contactApi";

// Icon mapping component
const getIconComponent = (icon: SocialIcon) => {
  const iconMap = {
    Instagram,
    Phone,
    Mail,
    Facebook,
    Twitter,
    LinkedIn: Linkedin,
    YouTube: Youtube,
    TikTok: MessageCircle,
    WhatsApp: MessageCircle,
    MapPin,
    Globe,
  };
  return iconMap[icon] || Globe;
};

const ContactSection = () => {
  const [contact, setContact] = useState<{
    quote: string;
    socialLinks: Array<{
      icon: SocialIcon;
      label: string;
      url: string;
      displayText: string;
    }>;
  }>({
    quote: "",
    socialLinks: [],
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await publicContactApi.getContact();
        setContact(data);
      } catch (err) {
        console.error("Failed to fetch contact", err);
      }
    };

    fetchContact();
  }, []);

  if (!contact.socialLinks.length && !contact.quote) {
    return null;
  }

  const getLinkHref = (url: string, icon: SocialIcon) => {
    if (icon === "Phone" && url && !url.startsWith("tel:")) {
      return `tel:${url}`;
    }
    if (icon === "Mail" && url && !url.startsWith("mailto:")) {
      return `mailto:${url}`;
    }
    if (icon === "WhatsApp" && url && !url.startsWith("https://")) {
      return `https://wa.me/${url.replace(/\D/g, "")}`;
    }
    return url;
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-charcoal py-24 md:py-32"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
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
          {contact.socialLinks.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">
              {contact.socialLinks.map((link, index) => {
                const IconComponent = getIconComponent(link.icon);
                const href = getLinkHref(link.url, link.icon);
                const isExternal = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");

                return (
                  <motion.a
                    key={`${link.icon}-${index}`}
                    href={href}
                    target={isExternal && link.icon !== "Phone" && link.icon !== "Mail" ? "_blank" : undefined}
                    rel={isExternal && link.icon !== "Phone" && link.icon !== "Mail" ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, delay: index * 0.15 }}
                    className="group flex items-center gap-4 rounded-xl bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <span className="mb-1 block text-sm text-muted-foreground">
                        {link.label}
                      </span>
                      <span className="font-medium text-foreground">
                        {link.displayText}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Motivational quote */}
          {contact.quote && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: contact.socialLinks.length * 0.15 + 0.2 }}
              className={`mt-12 text-center ${contact.socialLinks.length === 0 ? "" : ""}`}
            >
              <blockquote className="font-display text-2xl italic text-muted-foreground">
                {contact.quote}
              </blockquote>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
