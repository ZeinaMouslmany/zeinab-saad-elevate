import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Play, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContent } from "@/context/ContentContext";
import { toast } from "@/hooks/use-toast";
import { Video } from "@/types/content";

const VideoEditor = () => {
  const { content, updateSection } = useContent();
  const [videos, setVideos] = useState<Video[]>(content.videos);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  useEffect(() => {
    setVideos(content.videos);
  }, [content.videos]);

  const handleSave = () => {
    updateSection("videos", videos);
    toast({
      title: "Video gallery updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      title: "New Video",
      thumbnail: "",
      videoUrl: "",
      duration: "0:00",
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const moveVideo = (index: number, direction: "up" | "down") => {
    const newVideos = [...videos];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < videos.length) {
      [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
      setVideos(newVideos);
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
            Video Gallery
          </h2>
          <p className="text-muted-foreground">
            Manage your training videos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addVideo} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
          <Button onClick={handleSave} variant="hero">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="bg-card rounded-xl p-4 border border-border"
          >
            {/* Thumbnail Preview */}
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                <button
                  onClick={() => video.videoUrl && setPreviewVideo(video.videoUrl)}
                  className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center hover:bg-primary transition-colors"
                  disabled={!video.videoUrl}
                >
                  <Play className="w-6 h-6 text-primary-foreground" />
                </button>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => moveVideo(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 rounded bg-background/80 text-foreground hover:bg-background disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveVideo(index, "down")}
                  disabled={index === videos.length - 1}
                  className="p-1.5 rounded bg-background/80 text-foreground hover:bg-background disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={video.title}
                  onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                  placeholder="Video title"
                  className="bg-background flex-1"
                />
                <Input
                  value={video.duration}
                  onChange={(e) => updateVideo(video.id, { duration: e.target.value })}
                  placeholder="0:00"
                  className="bg-background w-20"
                />
              </div>

              <Input
                value={video.thumbnail}
                onChange={(e) => updateVideo(video.id, { thumbnail: e.target.value })}
                placeholder="Thumbnail URL"
                className="bg-background text-sm"
              />

              <Input
                value={video.videoUrl}
                onChange={(e) => updateVideo(video.id, { videoUrl: e.target.value })}
                placeholder="Video URL (YouTube, Vimeo, or direct link)"
                className="bg-background text-sm"
              />

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => removeVideo(video.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Video
              </Button>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="col-span-2 bg-card rounded-xl p-12 border border-border text-center">
            <p className="text-muted-foreground">No videos yet. Add your first one!</p>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-6"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-card rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={previewVideo}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoEditor;
