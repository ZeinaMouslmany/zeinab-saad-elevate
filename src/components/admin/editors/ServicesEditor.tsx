import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, Swords, Dumbbell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { servicesApi } from "@/services/admin/servicesApi";
import { toast } from "@/hooks/use-toast";
import { Service } from "@/types/content";

const iconOptions = [
  { value: "Swords" as const, label: "Swords", Icon: Swords },
  { value: "Dumbbell" as const, label: "Dumbbell", Icon: Dumbbell },
  { value: "Users" as const, label: "Users", Icon: Users },
];

const ServicesEditor = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSave = async () => {
    try {
      await servicesApi.updateServices(services);
      toast({
        title: "Services updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save services:', error);
      toast({
        title: "Error",
        description: "Failed to save services. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      icon: "Swords",
      title: "New Service",
      description: "",
      features: ["Feature 1"],
      enabled: true,
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeService = async (id: string) => {
    try {
      await servicesApi.deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      toast({
        title: "Service deleted",
        description: "The service has been removed successfully.",
      });
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFeature = (serviceId: string, index: number, value: string) => {
    setServices(services.map((s) => {
      if (s.id === serviceId) {
        const newFeatures = [...s.features];
        newFeatures[index] = value;
        return { ...s, features: newFeatures };
      }
      return s;
    }));
  };

  const addFeature = (serviceId: string) => {
    setServices(services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, features: [...s.features, "New Feature"] };
      }
      return s;
    }));
  };

  const removeFeature = (serviceId: string, index: number) => {
    setServices(services.map((s) => {
      if (s.id === serviceId && s.features.length > 1) {
        return { ...s, features: s.features.filter((_, i) => i !== index) };
      }
      return s;
    }));
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
            Services
          </h2>
          <p className="text-muted-foreground">
            Manage your service offerings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addService} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          <Button onClick={handleSave} variant="hero">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="text-muted-foreground cursor-move">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {iconOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateService(service.id, { icon: opt.value })}
                          className={`p-2 rounded-lg transition-colors ${
                            service.icon === opt.value
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <opt.Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Enabled</span>
                      <Switch
                        checked={service.enabled}
                        onCheckedChange={(checked) => updateService(service.id, { enabled: checked })}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Input
                  value={service.title}
                  onChange={(e) => updateService(service.id, { title: e.target.value })}
                  placeholder="Service title"
                  className="bg-background font-medium"
                />

                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, { description: e.target.value })}
                  placeholder="Service description"
                  rows={2}
                  className="bg-background"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Features</label>
                    <Button size="sm" variant="ghost" onClick={() => addFeature(service.id)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex gap-1">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(service.id, index, e.target.value)}
                          placeholder="Feature"
                          className="bg-background text-sm"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="shrink-0"
                          onClick={() => removeFeature(service.id, index)}
                          disabled={service.features.length <= 1}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicesEditor;
