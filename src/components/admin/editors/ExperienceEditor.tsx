import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { Experience } from "@/types/content";

const ExperienceEditor = () => {
  const { content, updateSection } = useContent();
  const [experiences, setExperiences] = useState<Experience[]>(content.experiences);

  useEffect(() => {
    setExperiences(content.experiences);
  }, [content.experiences]);

  const handleSave = () => {
    updateSection("experiences", experiences);
    toast({
      title: "Experience timeline updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      title: "New Milestone",
      description: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
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
            key={exp.id}
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
                  <div className="w-24">
                    <Input
                      value={exp.year}
                      onChange={(e) => updateExperience(exp.id, { year: e.target.value })}
                      placeholder="Year"
                      className="bg-background text-center font-display text-lg font-bold text-primary"
                    />
                  </div>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    placeholder="Milestone title"
                    className="bg-background flex-1 font-medium"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
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
