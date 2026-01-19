import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { publicVideoApi } from "@/services/videoApi";
import { Video } from "@/types/content";

const VideoGallerySection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await publicVideoApi.getVideos();
        setVideos(data || []);
      } catch (err) {
        console.error("Failed to fetch Videos", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  // Helper function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  // Get embed URL for video
  const getVideoEmbedUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    
    // Check if it's a YouTube URL
    const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
    if (youtubeEmbed) return youtubeEmbed;

    // Check if it's a Vimeo URL
    const vimeoEmbed = getVimeoEmbedUrl(videoUrl);
    if (vimeoEmbed) return vimeoEmbed;

    // Check if it's already an embed URL
    if (videoUrl.includes('youtube.com/embed') || videoUrl.includes('player.vimeo.com')) {
      return videoUrl;
    }

    // Check if it's a Cloudinary video URL (direct video)
    if (videoUrl.includes('cloudinary.com') && videoUrl.includes('/video/')) {
      return videoUrl;
    }

    // Return null if we can't determine the embed URL
    return null;
  };

  if (!videos.length) {
    return null; // Don't render section if no videos
  }

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-charcoal py-24 md:py-32"
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/30 blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Gallery
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Training in Action
          </h2>
        </motion.div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 1.2,
                delay: 0.1 + index * 0.15,
                ease: "easeOut",
              }}
              className="group relative cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-background/50 transition-all duration-500 group-hover:bg-background/30" />
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/80 shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:bg-primary">
                  <Play className="h-7 w-7 fill-primary-foreground text-primary-foreground" />
                </div>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {video.title}
                </h3>
                {video.duration && (
                  <span className="text-sm text-muted-foreground">
                    {video.duration}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-card shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-primary"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video Player */}
            {selectedVideo.videoUrl ? (
              (() => {
                const embedUrl = getVideoEmbedUrl(selectedVideo.videoUrl);
                if (embedUrl) {
                  // YouTube, Vimeo, or Cloudinary embed
                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  );
                } else {
                  // Direct video URL (Cloudinary or other)
                  return (
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      className="w-full h-full"
                      autoPlay
                    />
                  );
                }
              })()
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="text-center">
                  <Play className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <p className="text-muted-foreground">
                    No video URL available
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoGallerySection;
