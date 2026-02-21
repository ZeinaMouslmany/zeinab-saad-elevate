import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { publicVideoApi } from "@/services/videoApi";
import { Video } from "@/types/content";

const VideoGallerySection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | HTMLIFrameElement | null)[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await publicVideoApi.getVideos();
        setVideos(data || []);
        videoRefs.current = new Array(data?.length || 0).fill(null);
      } catch (err) {
        console.error("Failed to fetch Videos", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const previousIndex = selectedIndex;
    const newIndex = emblaApi.selectedScrollSnap();
    
    // Pause previous video
    if (previousIndex >= 0 && previousIndex < videoRefs.current.length) {
      const prevVideo = videoRefs.current[previousIndex];
      if (prevVideo instanceof HTMLVideoElement) {
        prevVideo.pause();
      }
    }
    
    setSelectedIndex(newIndex);
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    
    // Auto-play new video after a short delay for smooth transition
    setTimeout(() => {
      if (newIndex >= 0 && newIndex < videoRefs.current.length) {
        const currentVideo = videoRefs.current[newIndex];
        if (currentVideo instanceof HTMLVideoElement) {
          currentVideo.play().catch(() => {
            // Autoplay failed (browser policy), user will need to click
          });
        }
      }
    }, 300);
  }, [emblaApi, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=1&rel=0`
      : null;
  };

  // Helper function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&controls=1` : null;
  };

  // Get embed URL for video
  const getVideoEmbedUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    
    const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
    if (youtubeEmbed) return youtubeEmbed;

    const vimeoEmbed = getVimeoEmbedUrl(videoUrl);
    if (vimeoEmbed) return vimeoEmbed;

    if (videoUrl.includes('youtube.com/embed') || videoUrl.includes('player.vimeo.com')) {
      return videoUrl;
    }

    return null;
  };

  const handleVideoRef = (index: number, element: HTMLVideoElement | HTMLIFrameElement | null) => {
    videoRefs.current[index] = element;
  };

  if (!videos.length) {
    return null;
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="absolute left-0 top-1/2 z-20 -translate-x-4 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground shadow-elegant transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/80 disabled:hover:text-foreground md:-translate-x-8 md:p-4"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </button>

          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 rounded-full bg-background/80 p-3 text-foreground shadow-elegant transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/80 disabled:hover:text-foreground md:translate-x-8 md:p-4"
            aria-label="Next video"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </button>

          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {videos.map((video, index) => {
                const embedUrl = getVideoEmbedUrl(video.videoUrl);
                const isActive = index === selectedIndex;

                return (
                  <div
                    key={video.id}
                    className="flex-[0_0_100%] min-w-0 px-2 md:flex-[0_0_80%] lg:flex-[0_0_70%]"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.7,
                        scale: isActive ? 1 : 0.95
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative aspect-video w-full overflow-hidden rounded-xl bg-card shadow-elegant"
                    >
                      {video.videoUrl ? (
                        embedUrl ? (
                          // YouTube, Vimeo embed
                          <iframe
                            ref={(el) => handleVideoRef(index, el)}
                            src={isActive ? embedUrl : undefined}
                            className="h-full w-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title={`Video ${index + 1}`}
                          />
                        ) : (
                          // Direct video (Cloudinary or other)
                          <video
                            ref={(el) => handleVideoRef(index, el)}
                            src={video.videoUrl}
                            controls
                            className="h-full w-full object-cover"
                            muted={!isActive}
                            playsInline
                            onLoadedMetadata={(e) => {
                              if (isActive && e.currentTarget) {
                                e.currentTarget.play().catch(() => {
                                  // Autoplay failed, user will need to click
                                });
                              }
                            }}
                          />
                        )
                      ) : (
                        // Fallback placeholder
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <div className="text-center">
                            <p className="text-muted-foreground">No video available</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator (optional, for better UX) */}
          {videos.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoGallerySection;
