import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image, Plus, Trash2, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { AboutContent } from "@/types/content";
import { aboutEditorApi } from "@/services/admin/abouteditorApi";

const AboutEditor = () => {
  const [form, setForm] = useState<AboutContent>({
    name: "",
    tagline: "",
    bio: [""],
    stats: {
      clientsTrained: "",
      yearsExperience: "",
      workshops: "",
    },
    profileImageUrl: "",
    statsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const data = await aboutEditorApi.getAbout();
        // Ensure bio has at least one empty string if empty
        setForm({
          ...data,
          bio: data.bio.length > 0 ? data.bio : [""],
          statsEnabled:
            typeof data.statsEnabled === "boolean" ? data.statsEnabled : true,
        });
      } catch (error) {
        console.error("Failed to fetch About:", error);
        toast({
          title: "Error",
          description: "Failed to load About content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleSave = async () => {
    try {
      // Filter out empty bio paragraphs before saving
      const bioToSave = form.bio.filter(p => p.trim() !== "");
      await aboutEditorApi.updateAbout({
        ...form,
        bio: bioToSave.length > 0 ? bioToSave : [""],
      });
      toast({
        title: "About section updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save About:", error);
      toast({
        title: "Error",
        description: "Failed to save About content. Please try again.",
        variant: "destructive",
      });
    }
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
      const imageUrl = await aboutEditorApi.uploadImage(file);
      setForm({ ...form, profileImageUrl: imageUrl });
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
    setForm({ ...form, profileImageUrl: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading About content...</p>
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

        {/* Profile Image Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profile Image
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
                  value={form.profileImageUrl}
                  onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                  placeholder="https://example.com/profile.jpg"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to an image. Leave empty to use the default profile image.
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
                    id="about-profile-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="about-profile-upload">
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
            {form.profileImageUrl && (
              <div className="mt-4 relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.profileImageUrl}
                    alt="Profile preview"
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
                  Current profile image preview
                </p>
              </div>
            )}
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-foreground">
              Statistics
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {form.statsEnabled ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={form.statsEnabled}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    statsEnabled: checked,
                  }))
                }
                aria-label="Toggle statistics visibility on the public About section"
              />
            </div>
          </div>
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
