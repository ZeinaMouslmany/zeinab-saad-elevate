import { motion } from "framer-motion";
import { FileText, Users, Video, Clock, Eye, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, DashboardResponse } from "@/services/admin/dashboardApi";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { isAuthenticated, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !token) {
        setError("Please log in to view dashboard");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, token]);

  const stats = dashboardData
    ? [
        {
          label: "Active Services",
          value: dashboardData.stats.activeServices,
          icon: FileText,
          color: "text-green-500",
        },
        {
          label: "Timeline Items",
          value: dashboardData.stats.timelineItems,
          icon: Clock,
          color: "text-blue-500",
        },
        {
          label: "Gallery Videos",
          value: dashboardData.stats.galleryVideos,
          icon: Video,
          color: "text-purple-500",
        },
        {
          label: "Contact Methods",
          value: dashboardData.stats.contactMethods,
          icon: Users,
          color: "text-orange-500",
        },
      ]
    : [];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">Failed to load dashboard</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!dashboardData) {
    return null;
  }

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
          <p>• All changes are saved to the database</p>
          <p>• Click "Save Changes" after editing any section</p>
          <p>• Use "Preview Site" to view your changes in a new tab</p>
        </div>
      </div>

      {/* Current Content Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Hero Section
          </h3>
          {dashboardData.contentOverview.hero.headline ? (
            <>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Headline:</strong> {dashboardData.contentOverview.hero.headline}
              </p>
              {dashboardData.contentOverview.hero.tagline && (
                <p className="text-muted-foreground text-sm mt-1">
                  <strong className="text-foreground">Tagline:</strong> {dashboardData.contentOverview.hero.tagline}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm italic">No hero content yet</p>
          )}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Contact Info
          </h3>
          {dashboardData.contentOverview.contact.socialLinksCount > 0 ? (
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Active Social Links:</strong> {dashboardData.contentOverview.contact.socialLinksCount}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm italic">No contact methods configured</p>
          )}
          {dashboardData.contentOverview.contact.quote && (
            <p className="text-muted-foreground text-sm mt-1">
              <strong className="text-foreground">Quote:</strong> {dashboardData.contentOverview.contact.quote.substring(0, 50)}...
            </p>
          )}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            About Section
          </h3>
          {dashboardData.contentOverview.about.name ? (
            <>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Name:</strong> {dashboardData.contentOverview.about.name}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                <strong className="text-foreground">Bio Paragraphs:</strong> {dashboardData.contentOverview.about.bioParagraphs}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm italic">No about content yet</p>
          )}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Call to Action
          </h3>
          {dashboardData.contentOverview.cta.headline ? (
            <>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Headline:</strong> {dashboardData.contentOverview.cta.headline}
              </p>
              {dashboardData.contentOverview.cta.buttonText && (
                <p className="text-muted-foreground text-sm mt-1">
                  <strong className="text-foreground">Button:</strong> {dashboardData.contentOverview.cta.buttonText}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm italic">No CTA content yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
