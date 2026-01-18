'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoId: string; // YouTube video ID
  title?: string;
  thumbnail?: string;
  autoplay?: boolean;
  className?: string;
}

export default function VideoPlayer({
  videoId,
  title,
  thumbnail,
  autoplay = false,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video rounded-2xl overflow-hidden bg-slate-900 ${className}`}
    >
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-pointer group"
            onClick={handlePlay}
          >
            {/* Thumbnail */}
            <img
              src={thumbnail || defaultThumbnail}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>

            {/* Title */}
            {title && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-semibold text-lg">{title}</h3>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title || 'Video player'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Video modal for inline playback
interface VideoModalProps {
  videoId: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ videoId, title, isOpen, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="relative w-full max-w-5xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Video player */}
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={title || 'Video player'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Title */}
              {title && (
                <p className="text-white text-center mt-4 text-lg font-medium">{title}</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Video card for listings
interface VideoCardProps {
  videoId: string;
  title: string;
  description?: string;
  duration?: string;
  category?: string;
  onClick?: () => void;
}

export function VideoCard({
  videoId,
  title,
  description,
  duration,
  category,
  onClick,
}: VideoCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-primary-200 hover:shadow-soft-lg transition-all cursor-pointer group"
      whileHover={{ y: -4 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100">
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {category && (
          <span className="text-xs text-primary-600 font-medium">{category}</span>
        )}
        <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
