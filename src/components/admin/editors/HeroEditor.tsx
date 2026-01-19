import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { HeroContent } from "@/types/content";
import { heroEditorApi } from "@/services/admin/heroeditorApi";

const HeroEditor = () => {
  const [form, setForm] = useState<HeroContent>({
    tagline: "",
    headline: "",
    subtitle: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    backgroundImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await heroEditorApi.getHero();
        setForm(data);
      } catch (error) {
        console.error("Failed to fetch Hero:", error);
        toast({
          title: "Error",
          description: "Failed to load Hero content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  const handleSave = async () => {
    try {
      await heroEditorApi.updateHero(form);
      toast({
        title: "Hero section updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save Hero:", error);
      toast({
        title: "Error",
        description: "Failed to save Hero content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await heroEditorApi.uploadImage(file);
      setForm({ ...form, backgroundImageUrl: imageUrl });
      toast({
        title: "Image uploaded!",
        description: "Your image has been uploaded to Cloudinary.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, backgroundImageUrl: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading Hero content...</p>
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

        {/* Background Image Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Background Image
            </label>
            
            {/* Upload Method Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={uploadMethod === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("url")}
              >
                <Image className="w-4 h-4 mr-2" />
                Enter URL
              </Button>
              <Button
                type="button"
                variant={uploadMethod === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("file")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            {/* URL Input Method */}
            {uploadMethod === "url" && (
              <div className="space-y-2">
                <Input
                  value={form.backgroundImageUrl}
                  onChange={(e) => setForm({ ...form, backgroundImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to an image. Leave empty to use the default background image.
                </p>
              </div>
            )}

            {/* File Upload Method */}
            {uploadMethod === "file" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="hero-image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="hero-image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image File
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image from your computer (max 10MB). It will be uploaded to Cloudinary.
                </p>
              </div>
            )}

            {/* Image Preview */}
            {form.backgroundImageUrl && (
              <div className="mt-4 relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.backgroundImageUrl}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Current background image preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroEditor;
