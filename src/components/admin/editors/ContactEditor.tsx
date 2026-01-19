import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { contactApi } from "@/services/admin/contactApi";
import { SocialIcon } from "@/services/contactApi";

// Icon options with display names
const SOCIAL_ICON_OPTIONS: Array<{ value: SocialIcon; label: string; icon: typeof Instagram }> = [
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Phone", label: "Phone", icon: Phone },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
  { value: "YouTube", label: "YouTube", icon: Youtube },
  { value: "TikTok", label: "TikTok", icon: MessageCircle },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageCircle },
  { value: "MapPin", label: "Location", icon: MapPin },
  { value: "Globe", label: "Website", icon: Globe },
];

interface SocialLink {
  id?: string;
  icon: SocialIcon;
  label: string;
  url: string;
  displayText: string;
  order?: number;
  enabled?: boolean;
}

const ContactEditor = () => {
  const [quote, setQuote] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await contactApi.getContact();
        setQuote(data.quote || "");
        setSocialLinks(data.socialLinks || []);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
        toast({
          title: "Error",
          description: "Failed to load contact information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleSave = async () => {
    try {
      await contactApi.updateContact({
        quote,
        socialLinks: socialLinks.map((link, index) => ({
          ...link,
          order: index,
        })),
      });
      toast({
        title: "Contact section updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      icon: "Globe",
      label: "New Link",
      url: "",
      displayText: "",
      enabled: true,
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    const updated = socialLinks.map((link, i) =>
      i === index ? { ...link, ...updates } : link
    );
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const moveSocialLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...socialLinks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < socialLinks.length) {
      [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
      setSocialLinks(newLinks);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading contact information...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Contact & Social
          </h2>
          <p className="text-muted-foreground">
            Manage your contact information and social links
          </p>
        </div>
        <Button onClick={handleSave} variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Motivational Quote */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Motivational Quote
        </label>
        <Textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Enter a motivational quote..."
          rows={2}
          className="bg-background"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
          <Button onClick={addSocialLink} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {socialLinks.map((link, index) => {
          const iconOption = SOCIAL_ICON_OPTIONS.find(opt => opt.value === link.icon);
          const IconComponent = iconOption?.icon || Globe;

          return (
            <div
              key={link.id || index}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1 text-muted-foreground pt-1">
                  <button
                    onClick={() => moveSocialLink(index, "up")}
                    disabled={index === 0}
                    className="p-1 hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSocialLink(index, "down")}
                    disabled={index === socialLinks.length - 1}
                    className="p-1 hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground">
                        Social Link #{index + 1}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Visible</span>
                      <Switch
                        checked={link.enabled !== false}
                        onCheckedChange={(checked) =>
                          updateSocialLink(index, { enabled: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Icon
                      </label>
                      <Select
                        value={link.icon}
                        onValueChange={(value: SocialIcon) =>
                          updateSocialLink(index, { icon: value })
                        }
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_ICON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Label
                      </label>
                      <Input
                        value={link.label}
                        onChange={(e) =>
                          updateSocialLink(index, { label: e.target.value })
                        }
                        placeholder="e.g., Instagram, Phone, Email"
                        className="bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        URL / Link
                      </label>
                      <Input
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, { url: e.target.value })
                        }
                        placeholder="https://... or tel:+1234567890 or mailto:email@example.com"
                        className="bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Display Text
                      </label>
                      <Input
                        value={link.displayText}
                        onChange={(e) =>
                          updateSocialLink(index, { displayText: e.target.value })
                        }
                        placeholder="Text shown to visitors"
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                  className="mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {socialLinks.length === 0 && (
          <div className="bg-card rounded-xl p-12 border border-border text-center">
            <p className="text-muted-foreground mb-4">
              No social links yet. Add your first one!
            </p>
            <Button onClick={addSocialLink} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactEditor;
