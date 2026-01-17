import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { HeroContent } from "@/types/content";

const HeroEditor = () => {
  const { content, updateSection } = useContent();
  const [form, setForm] = useState<HeroContent>(content.hero);

  useEffect(() => {
    setForm(content.hero);
  }, [content.hero]);

  const handleSave = () => {
    updateSection("hero", form);
    toast({
      title: "Hero section updated!",
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
            Hero Section
          </h2>
          <p className="text-muted-foreground">
            Edit the main landing section of your website
          </p>
        </div>
        <Button onClick={handleSave} variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 bg-card rounded-xl p-6 border border-border">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tagline
          </label>
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="e.g., Elite Fight Do Coach"
            className="bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Headline
          </label>
          <Input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="Your name or main headline"
            className="bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subtitle
          </label>
          <Textarea
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="A brief description of what you offer"
            rows={3}
            className="bg-background"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary Button Text
            </label>
            <Input
              value={form.primaryButtonText}
              onChange={(e) => setForm({ ...form, primaryButtonText: e.target.value })}
              placeholder="e.g., Start Your Journey"
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Secondary Button Text
            </label>
            <Input
              value={form.secondaryButtonText}
              onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })}
              placeholder="e.g., Learn More"
              className="bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Background Image URL
          </label>
          <div className="flex gap-2">
            <Input
              value={form.backgroundImageUrl}
              onChange={(e) => setForm({ ...form, backgroundImageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="bg-background flex-1"
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <Image className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to use the default background image
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroEditor;
