import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import HeroEditor from "@/components/admin/editors/HeroEditor";
import AboutEditor from "@/components/admin/editors/AboutEditor";
import ServicesEditor from "@/components/admin/editors/ServicesEditor";
import ExperienceEditor from "@/components/admin/editors/ExperienceEditor";
import VideoEditor from "@/components/admin/editors/VideoEditor";
import ContactEditor from "@/components/admin/editors/ContactEditor";
import CTAEditor from "@/components/admin/editors/CTAEditor";

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "hero":
        return <HeroEditor />;
      case "about":
        return <AboutEditor />;
      case "services":
        return <ServicesEditor />;
      case "experience":
        return <ExperienceEditor />;
      case "videos":
        return <VideoEditor />;
      case "contact":
        return <ContactEditor />;
      case "cta":
        return <CTAEditor />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
