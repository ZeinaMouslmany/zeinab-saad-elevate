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
  id: string;
  year: string;
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

export interface ContactContent {
  instagramUrl: string;
  instagramHandle: string;
  phone: string;
  phoneDisplay: string;
  quote: string;
  showInstagram: boolean;
  showPhone: boolean;
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
