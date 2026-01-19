import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CTAContent } from "@/types/content";
import { ctaApi } from "@/services/admin/ctaApi";

const CTAEditor = () => {
  const [form, setForm] = useState<CTAContent>({
    headline: "",
    subtitle: "",
    buttonText: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        setLoading(true);
        const data = await ctaApi.getCTA();
        setForm(data);
      } catch (error) {
        console.error("Failed to fetch CTA:", error);
        toast({
          title: "Error",
          description: "Failed to load CTA content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCTA();
  }, []);

  const handleSave = async () => {
    try {
      await ctaApi.updateCTA(form);
      toast({
        title: "Call to Action updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save CTA:", error);
      toast({
        title: "Error",
        description: "Failed to save CTA content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading CTA content...</p>
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
          <p className="mt-1 text-xs text-muted-foreground">
            The main heading text. You can use HTML-like formatting with &lt;span className="text-gradient"&gt; for highlighted text.
          </p>
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
          <p className="mt-1 text-xs text-muted-foreground">
            The supporting text that appears below the headline.
          </p>
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
          <p className="mt-1 text-xs text-muted-foreground">
            The text displayed on the call-to-action button.
          </p>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Preview</p>
          <div className="bg-background rounded-lg p-6 text-center">
            {form.headline ? (
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {form.headline}
              </h3>
            ) : (
              <h3 className="font-display text-2xl font-bold text-muted-foreground mb-2">
                Your Headline
              </h3>
            )}
            {form.subtitle ? (
              <p className="text-muted-foreground mb-4">
                {form.subtitle}
              </p>
            ) : (
              <p className="text-muted-foreground mb-4 italic">
                Your subtitle message
              </p>
            )}
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
