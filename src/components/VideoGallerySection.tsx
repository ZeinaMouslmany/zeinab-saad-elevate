import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Fight Do Basics",
    thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Kickboxing Combos",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    duration: "5:20",
  },
  {
    id: 3,
    title: "Strength Circuit",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    duration: "4:15",
  },
  {
    id: 4,
    title: "Group Workshop",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    duration: "6:30",
  },
];

const VideoGallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-charcoal py-24 md:py-32"
      ref={ref}
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/30 blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.1 + index * 0.15,
                ease: "easeOut",
              }}
              className="group relative cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setSelectedVideo(video.id)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
                <span className="text-sm text-muted-foreground">
                  {video.duration}
                </span>
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

            {/* Video placeholder */}
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="text-center">
                <Play className="mx-auto mb-4 h-16 w-16 text-primary" />
                <p className="text-muted-foreground">
                  Video player placeholder
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Replace with actual video content
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoGallerySection;
