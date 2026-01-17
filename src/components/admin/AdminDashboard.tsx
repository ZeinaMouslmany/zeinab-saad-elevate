import { motion } from "framer-motion";
import { FileText, Users, Video, Clock, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "@/context/ContentContext";

const AdminDashboard = () => {
  const { content } = useContent();

  const stats = [
    {
      label: "Active Services",
      value: content.services.filter((s) => s.enabled).length,
      icon: FileText,
      color: "text-green-500",
    },
    {
      label: "Timeline Items",
      value: content.experiences.length,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Gallery Videos",
      value: content.videos.length,
      icon: Video,
      color: "text-purple-500",
    },
    {
      label: "Contact Methods",
      value: (content.contact.showInstagram ? 1 : 0) + (content.contact.showPhone ? 1 : 0),
      icon: Users,
      color: "text-orange-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, Zeinab
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your website content from here
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview Site
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Quick Tips
        </h2>
        <div className="space-y-3 text-muted-foreground">
          <p>• Use the sidebar to navigate between different sections</p>
          <p>• All changes are saved to your browser's local storage</p>
          <p>• Click "Save Changes" after editing any section</p>
          <p>• Use "View Site" to preview your changes in a new tab</p>
        </div>
      </div>

      {/* Current Content Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Hero Section
          </h3>
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Headline:</strong> {content.hero.headline}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            <strong className="text-foreground">Tagline:</strong> {content.hero.tagline}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Contact Info
          </h3>
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Instagram:</strong> {content.contact.instagramHandle}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            <strong className="text-foreground">Phone:</strong> {content.contact.phoneDisplay}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
