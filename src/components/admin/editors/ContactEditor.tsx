import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { ContactContent } from "@/types/content";

const ContactEditor = () => {
  const { content, updateSection } = useContent();
  const [form, setForm] = useState<ContactContent>(content.contact);

  useEffect(() => {
    setForm(content.contact);
  }, [content.contact]);

  const handleSave = () => {
    updateSection("contact", form);
    toast({
      title: "Contact section updated!",
      description: "Your changes have been saved successfully.",
    });
  };

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
            Manage your contact information
          </p>
        </div>
        <Button onClick={handleSave} variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Instagram */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Instagram</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visible</span>
              <Switch
                checked={form.showInstagram}
                onCheckedChange={(checked) => setForm({ ...form, showInstagram: checked })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Profile URL</label>
              <Input
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/username"
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Display Handle</label>
              <Input
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                placeholder="@username"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Phone</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visible</span>
              <Switch
                checked={form.showPhone}
                onCheckedChange={(checked) => setForm({ ...form, showPhone: checked })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Phone Number (for link)</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+96170722446"
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Display Format</label>
              <Input
                value={form.phoneDisplay}
                onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })}
                placeholder="+961 70 722 446"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            Motivational Quote
          </label>
          <Textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Enter a motivational quote..."
            rows={2}
            className="bg-background"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ContactEditor;
