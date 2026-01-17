import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Image, 
  User, 
  Briefcase, 
  Clock, 
  Video, 
  Phone, 
  Megaphone,
  LogOut,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hero", label: "Hero Section", icon: Image },
  { id: "about", label: "About", icon: User },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "experience", label: "Experience", icon: Clock },
  { id: "videos", label: "Video Gallery", icon: Video },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "cta", label: "Call to Action", icon: Megaphone },
];

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground">
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground">Zeinab Saad</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            whileHover={{ x: 4 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
