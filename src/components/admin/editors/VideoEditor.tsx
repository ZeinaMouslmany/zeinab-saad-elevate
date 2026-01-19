import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Play, Image, Upload, X, Loader2, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Video } from "@/types/content";
import { videoEditorApi } from "@/services/admin/videoeditorApi";

const VideoEditor = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);
  const thumbnailInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
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
          title: video.title,
          thumbnail: video.thumbnail,
          videoUrl: video.videoUrl,
          duration: video.duration,
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
        title: "New Video",
        thumbnail: "",
        videoUrl: "",
        duration: "0:00",
        order: videos.length,
      });

      setVideos([...videos, newVideo]);
      toast({
        title: "Video added!",
        description: "New video created. Fill in the details and save.",
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

  const handleThumbnailUpload = async (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadingThumbnail(videoId);
      const imageUrl = await videoEditorApi.uploadImage(file);
      updateVideo(videoId, { thumbnail: imageUrl });
      toast({
        title: "Thumbnail uploaded!",
        description: "Your thumbnail has been uploaded to Cloudinary.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingThumbnail(null);
      // Reset file input
      if (thumbnailInputRefs.current[videoId]) {
        thumbnailInputRefs.current[videoId]!.value = "";
      }
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
      updateVideo(videoId, {
        videoUrl: result.url,
        thumbnail: result.thumbnail || videos.find(v => v.id === videoId)?.thumbnail || "",
      });
      toast({
        title: "Video uploaded!",
        description: "Your video has been uploaded to Cloudinary.",
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

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const getVimeoEmbedUrl = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  const getVideoPreviewUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    
    const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
    if (youtubeEmbed) return youtubeEmbed;

    const vimeoEmbed = getVimeoEmbedUrl(videoUrl);
    if (vimeoEmbed) return vimeoEmbed;

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
            Manage your training videos
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
                  onClick={() => {
                    const previewUrl = getVideoPreviewUrl(video.videoUrl);
                    if (previewUrl) setPreviewVideo(previewUrl);
                  }}
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

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground">
                  Thumbnail
                </label>
                <div className="flex gap-2">
                  <Input
                    value={video.thumbnail}
                    onChange={(e) => updateVideo(video.id, { thumbnail: e.target.value })}
                    placeholder="Thumbnail URL or upload image"
                    className="bg-background text-sm flex-1"
                  />
                  <input
                    ref={(el) => (thumbnailInputRefs.current[video.id] = el)}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnailUpload(video.id, e)}
                    className="hidden"
                    id={`thumbnail-upload-${video.id}`}
                    disabled={uploadingThumbnail === video.id}
                  />
                  <label htmlFor={`thumbnail-upload-${video.id}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={uploadingThumbnail === video.id}
                      asChild
                    >
                      <span>
                        {uploadingThumbnail === video.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Video URL Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground">
                  Video URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={video.videoUrl}
                    onChange={(e) => updateVideo(video.id, { videoUrl: e.target.value })}
                    placeholder="YouTube, Vimeo URL, or upload video"
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
                  Enter YouTube/Vimeo URL or upload video file (max 100MB)
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
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-primary"
            >
              <X className="h-5 w-5" />
            </button>
            {previewVideo.includes('youtube.com/embed') || previewVideo.includes('player.vimeo.com') || previewVideo.includes('cloudinary.com') ? (
              <iframe
                src={previewVideo}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                src={previewVideo}
                controls
                className="w-full h-full"
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoEditor;
