import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { CTAContent } from "@/types/content";

const CTAEditor = () => {
  const { content, updateSection } = useContent();
  const [form, setForm] = useState<CTAContent>(content.cta);

  useEffect(() => {
    setForm(content.cta);
  }, [content.cta]);

  const handleSave = () => {
    updateSection("cta", form);
    toast({
      title: "Call to Action updated!",
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
            Call to Action
          </h2>
          <p className="text-muted-foreground">
            Edit your CTA section message
          </p>
        </div>
        <Button onClick={handleSave} variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Headline
          </label>
          <Input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="e.g., Ready to Transform?"
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
            placeholder="A motivational message..."
            rows={3}
            className="bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Button Text
          </label>
          <Input
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            placeholder="e.g., Start Your Fight Do Journey"
            className="bg-background"
          />
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Preview</p>
          <div className="bg-background rounded-lg p-6 text-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              {form.headline || "Your Headline"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {form.subtitle || "Your subtitle message"}
            </p>
            <Button variant="hero" className="pointer-events-none">
              {form.buttonText || "Button Text"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CTAEditor;
