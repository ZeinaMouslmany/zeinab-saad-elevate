import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Image, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { AboutContent } from "@/types/content";

const AboutEditor = () => {
  const { content, updateSection } = useContent();
  const [form, setForm] = useState<AboutContent>(content.about);

  useEffect(() => {
    setForm(content.about);
  }, [content.about]);

  const handleSave = () => {
    updateSection("about", form);
    toast({
      title: "About section updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const updateBio = (index: number, value: string) => {
    const newBio = [...form.bio];
    newBio[index] = value;
    setForm({ ...form, bio: newBio });
  };

  const addBioParagraph = () => {
    setForm({ ...form, bio: [...form.bio, ""] });
  };

  const removeBioParagraph = (index: number) => {
    if (form.bio.length > 1) {
      setForm({ ...form, bio: form.bio.filter((_, i) => i !== index) });
    }
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
            About Section
          </h2>
          <p className="text-muted-foreground">
            Edit your bio and profile information
          </p>
        </div>
        <Button onClick={handleSave} variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 bg-card rounded-xl p-6 border border-border">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Section Tagline
            </label>
            <Input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g., About the Coach"
              className="bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profile Image URL
          </label>
          <div className="flex gap-2">
            <Input
              value={form.profileImageUrl}
              onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
              placeholder="https://example.com/profile.jpg"
              className="bg-background flex-1"
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <Image className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to use the default profile image
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Bio Paragraphs
            </label>
            <Button size="sm" variant="outline" onClick={addBioParagraph}>
              <Plus className="w-4 h-4 mr-1" />
              Add Paragraph
            </Button>
          </div>
          <div className="space-y-3">
            {form.bio.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateBio(index, e.target.value)}
                  placeholder={`Bio paragraph ${index + 1}`}
                  rows={3}
                  className="bg-background flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => removeBioParagraph(index)}
                  disabled={form.bio.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-4">
            Statistics
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Clients Trained
              </label>
              <Input
                value={form.stats.clientsTrained}
                onChange={(e) => setForm({ ...form, stats: { ...form.stats, clientsTrained: e.target.value } })}
                placeholder="e.g., 500+"
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Years Experience
              </label>
              <Input
                value={form.stats.yearsExperience}
                onChange={(e) => setForm({ ...form, stats: { ...form.stats, yearsExperience: e.target.value } })}
                placeholder="e.g., 8+"
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Workshops
              </label>
              <Input
                value={form.stats.workshops}
                onChange={(e) => setForm({ ...form, stats: { ...form.stats, workshops: e.target.value } })}
                placeholder="e.g., 50+"
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutEditor;
