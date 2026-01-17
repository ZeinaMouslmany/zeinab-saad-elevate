import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ExperienceSection from "@/components/ExperienceSection";
import VideoGallerySection from "@/components/VideoGallerySection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ExperienceSection />
      <VideoGallerySection />
      <CTASection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
