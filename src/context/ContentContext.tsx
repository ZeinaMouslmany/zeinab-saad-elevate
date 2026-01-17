import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteContent } from "@/types/content";

const defaultContent: SiteContent = {
  hero: {
    headline: "Zeinab Saad",
    tagline: "Elite Fight Do Coach",
    subtitle: "Unleash your power through Fight Do training. Transform your body, strengthen your mind, and discover the fighter within.",
    primaryButtonText: "Start Your Journey",
    secondaryButtonText: "Learn More",
    backgroundImageUrl: "",
  },
  about: {
    name: "Zeinab Saad",
    tagline: "About the Coach",
    bio: [
      "As a certified Fight Do coach, I specialize in empowering individuals through high-energy martial arts-inspired fitness. My passion lies in helping you discover your inner strength while building physical power.",
      "Beyond Fight Do, I offer comprehensive strength and weight training programs tailored to your goals. Whether you're looking to build muscle, increase endurance, or transform your physique—I'm here to guide your journey.",
      "Through workshops and group sessions, I've had the privilege of coaching hundreds of clients, from beginners to advanced athletes. My approach combines technical precision with motivational coaching to unlock your full potential.",
    ],
    stats: {
      clientsTrained: "500+",
      yearsExperience: "8+",
      workshops: "50+",
    },
    profileImageUrl: "",
  },
  services: [
    {
      id: "1",
      icon: "Swords",
      title: "Fight Do Coaching",
      description: "High-energy martial arts-inspired fitness combining kickboxing, Muay Thai, and combat moves. Perfect for burning calories, building strength, and releasing stress through powerful movements.",
      features: ["Personal Training", "Group Classes", "Technique Mastery"],
      enabled: true,
    },
    {
      id: "2",
      icon: "Dumbbell",
      title: "Strength Training",
      description: "Customized weight training programs designed to build lean muscle, increase power, and sculpt your physique. From beginners to advanced lifters—tailored to your goals.",
      features: ["Custom Programs", "Progressive Overload", "Body Transformation"],
      enabled: true,
    },
    {
      id: "3",
      icon: "Users",
      title: "Workshops & Groups",
      description: "Dynamic group sessions and specialized workshops that bring the energy of Fight Do to teams and communities. Perfect for corporate events, fitness groups, and special occasions.",
      features: ["Team Building", "Corporate Events", "Specialized Sessions"],
      enabled: true,
    },
  ],
  experiences: [
    { id: "1", year: "2016", title: "The Beginning", description: "Started my fitness journey, discovering a passion for martial arts and high-intensity training that would shape my career." },
    { id: "2", year: "2018", title: "Fight Do Certification", description: "Obtained official Fight Do coaching certification, becoming one of the first certified coaches in the region." },
    { id: "3", year: "2020", title: "Strength Coach Certification", description: "Expanded expertise with advanced strength and conditioning certifications, adding weight training to my coaching repertoire." },
    { id: "4", year: "2022", title: "Workshop Leader", description: "Launched a series of successful workshops, training hundreds of participants and building a strong community of fitness enthusiasts." },
    { id: "5", year: "2024", title: "Elite Coach Status", description: "Recognized as an elite-level coach, continuing to inspire and transform lives through Fight Do and strength training." },
  ],
  videos: [
    { id: "1", title: "Fight Do Basics", thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop", videoUrl: "", duration: "3:45" },
    { id: "2", title: "Kickboxing Combos", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop", videoUrl: "", duration: "5:20" },
    { id: "3", title: "Strength Circuit", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", videoUrl: "", duration: "4:15" },
    { id: "4", title: "Group Workshop", thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop", videoUrl: "", duration: "6:30" },
  ],
  contact: {
    instagramUrl: "https://www.instagram.com/zeinabsaad24",
    instagramHandle: "@zeinabsaad24",
    phone: "+96170722446",
    phoneDisplay: "+961 70 722 446",
    quote: '"The only bad workout is the one that didn\'t happen."',
    showInstagram: true,
    showPhone: true,
  },
  cta: {
    headline: "Ready to Transform?",
    subtitle: "Take the first step towards your fitness goals. Join the Fight Do movement and discover what you're truly capable of.",
    buttonText: "Start Your Fight Do Journey",
  },
};

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  updateSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = "zeinab-saad-content";

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultContent, ...JSON.parse(stored) };
      } catch {
        return defaultContent;
      }
    }
    return defaultContent;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
  };

  const updateSection = <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => {
    setContent((prev) => ({ ...prev, [section]: data }));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateSection }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
