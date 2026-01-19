import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Experience } from "@/types/content";
import { experiencesApi } from "@/services/admin/experiencesApi";

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    try {
      const data = await experiencesApi.getAllExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      toast({
        title: "Error",
        description: "Failed to load experiences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSave = async () => {
    try {
      const savedExperiences = await experiencesApi.updateExperiences(experiences);
      setExperiences(savedExperiences);
      toast({
        title: "Experience timeline updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save experiences:', error);
      toast({
        title: "Error",
        description: "Failed to save experiences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      title: "New Milestone",
      description: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    setExperiences(experiences.map((e, i) => (i === index ? { ...e, ...updates } : e)));
  };

  const removeExperience = async (index: number) => {
    try {
      const experienceToDelete = experiences[index];
      if (experienceToDelete.id) {
        await experiencesApi.deleteExperience(experienceToDelete.id);
      }
      setExperiences(experiences.filter((_, i) => i !== index));
      toast({
        title: "Experience deleted",
        description: "The experience has been removed successfully.",
      });
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const newExps = [...experiences];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < experiences.length) {
      [newExps[index], newExps[newIndex]] = [newExps[newIndex], newExps[index]];
      setExperiences(newExps);
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
            Experience & Journey
          </h2>
          <p className="text-muted-foreground">
            Manage your timeline milestones
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addExperience} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
          <Button onClick={handleSave} variant="hero">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={exp.id || `new-${index}`}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1 text-muted-foreground">
                <button
                  onClick={() => moveExperience(index, "up")}
                  disabled={index === 0}
                  className="p-1 hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <GripVertical className="w-5 h-5 cursor-move" />
                <button
                  onClick={() => moveExperience(index, "down")}
                  disabled={index === experiences.length - 1}
                  className="p-1 hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(index, { title: e.target.value })}
                    placeholder="Milestone title"
                    className="bg-background flex-1 font-medium"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, { description: e.target.value })}
                  placeholder="Describe this milestone..."
                  rows={2}
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="bg-card rounded-xl p-12 border border-border text-center">
            <p className="text-muted-foreground">No milestones yet. Add your first one!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExperienceEditor;
