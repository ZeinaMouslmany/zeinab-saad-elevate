import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Loader2, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Video } from "@/types/content";
import { videoEditorApi } from "@/services/admin/videoeditorApi";

const VideoEditor = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);
  const videoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoEditorApi.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch Videos:", error);
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update each video with its current data and order
      const updatePromises = videos.map(async (video, index) => {
        return videoEditorApi.updateVideo(video.id, {
          videoUrl: video.videoUrl,
          thumbnail: video.thumbnail,
          order: index,
        });
      });

      await Promise.all(updatePromises);

      toast({
        title: "Video gallery updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save Videos:", error);
      toast({
        title: "Error",
        description: "Failed to save videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addVideo = async () => {
    try {
      const newVideo = await videoEditorApi.createVideo({
        videoUrl: "",
        thumbnail: "",
        order: videos.length,
      });

      setVideos([...videos, newVideo]);
      toast({
        title: "Video added!",
        description: "Upload a video file or enter a video URL.",
      });
    } catch (error) {
      console.error("Failed to create video:", error);
      toast({
        title: "Error",
        description: "Failed to create video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVideo = async (id: string) => {
    try {
      await videoEditorApi.deleteVideo(id);
      setVideos(videos.filter((v) => v.id !== id));
      toast({
        title: "Video removed!",
        description: "Video has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const moveVideo = (index: number, direction: "up" | "down") => {
    const newVideos = [...videos];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < videos.length) {
      [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
      setVideos(newVideos);
    }
  };

  const handleVideoUpload = async (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video smaller than 100MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingVideo(videoId);
      const result = await videoEditorApi.uploadVideo(file);
      // Cloudinary automatically generates thumbnail, use it if available
      updateVideo(videoId, {
        videoUrl: result.url,
        thumbnail: result.thumbnail || "",
      });
      toast({
        title: "Video uploaded!",
        description: "Your video has been uploaded to Cloudinary. Thumbnail generated automatically.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(null);
      // Reset file input
      if (videoInputRefs.current[videoId]) {
        videoInputRefs.current[videoId]!.value = "";
      }
    }
  };

  const getVideoPreviewUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    
    // Check YouTube
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const youtubeMatch = videoUrl.match(youtubeRegExp);
    if (youtubeMatch && youtubeMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
    }

    // Check Vimeo
    const vimeoRegExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const vimeoMatch = videoUrl.match(vimeoRegExp);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    if (videoUrl.includes('youtube.com/embed') || videoUrl.includes('player.vimeo.com')) {
      return videoUrl;
    }

    return videoUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading videos...</p>
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
            Video Gallery
          </h2>
          <p className="text-muted-foreground">
            Upload videos or add video URLs. Thumbnails are generated automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addVideo} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
          <Button onClick={handleSave} variant="hero" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video, index) => {
          const previewUrl = getVideoPreviewUrl(video.videoUrl);
          
          return (
            <div
              key={video.id}
              className="bg-card rounded-xl p-4 border border-border"
            >
              {/* Video Preview */}
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                {previewUrl ? (
                  previewUrl.includes('youtube.com/embed') || previewUrl.includes('player.vimeo.com') ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
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

              {/* Video URL Input */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground">
                    Video URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={video.videoUrl}
                      onChange={(e) => updateVideo(video.id, { videoUrl: e.target.value })}
                      placeholder="YouTube, Vimeo URL, or Cloudinary URL"
                      className="bg-background text-sm flex-1"
                    />
                    <input
                      ref={(el) => (videoInputRefs.current[video.id] = el)}
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(video.id, e)}
                      className="hidden"
                      id={`video-upload-${video.id}`}
                      disabled={uploadingVideo === video.id}
                    />
                    <label htmlFor={`video-upload-${video.id}`}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={uploadingVideo === video.id}
                        asChild
                      >
                        <span>
                          {uploadingVideo === video.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <VideoIcon className="w-4 h-4" />
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter YouTube/Vimeo URL or upload video file (max 100MB). Thumbnail auto-generated.
                  </p>
                </div>

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
          );
        })}

        {videos.length === 0 && (
          <div className="col-span-2 bg-card rounded-xl p-12 border border-border text-center">
            <p className="text-muted-foreground">No videos yet. Add your first one!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoEditor;
