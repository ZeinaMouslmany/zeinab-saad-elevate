export interface HeroContent {
  headline: string;
  tagline: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImageUrl: string;
}

export interface AboutContent {
  name: string;
  tagline: string;
  bio: string[];
  stats: {
    clientsTrained: string;
    yearsExperience: string;
    workshops: string;
  };
  profileImageUrl: string;
  // Controls whether the statistics section is shown on the public About section
  statsEnabled: boolean;
}

export interface Service {
  id: string;
  icon: "Swords" | "Dumbbell" | "Users";
  title: string;
  description: string;
  features: string[];
  enabled: boolean;
}

export interface Experience {
  id?: string;
  title: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export type SocialIcon = 
  | 'Instagram'
  | 'Phone'
  | 'Mail'
  | 'Facebook'
  | 'Twitter'
  | 'LinkedIn'
  | 'YouTube'
  | 'TikTok'
  | 'WhatsApp'
  | 'MapPin'
  | 'Globe';

export interface SocialLink {
  icon: SocialIcon;
  label: string;
  url: string;
  displayText: string;
}

export interface ContactContent {
  quote: string;
  socialLinks: SocialLink[];
}

export interface CTAContent {
  headline: string;
  subtitle: string;
  buttonText: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: Service[];
  experiences: Experience[];
  videos: Video[];
  contact: ContactContent;
  cta: CTAContent;
}
