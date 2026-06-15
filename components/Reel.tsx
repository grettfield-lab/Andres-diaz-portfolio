'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'

export default function Reel() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <section className="py-24 md:py-32 px-6 md:px-10" aria-label="Director's Reel">
      <div className="max-w-[1400px] mx-auto">

        {/* Label row */}
        <div className="flex items-baseline justify-between mb-8 md:mb-10">
          <p className="font-mono text-[13px] tracking-[0.22em] uppercase text-muted">
            Director&#39;s Reel
          </p>
          <p className="font-mono text-[13px] tracking-[0.1em] text-muted/50">2024</p>
        </div>

        {/* Video container */}
        <div
          className="relative w-full overflow-hidden group cursor-pointer"
          style={{ aspectRatio: '16/9' }}
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          aria-label="Play reel"
          onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
        >
          {/* Poster image — replace src with actual reel poster */}
          <Image
            src="https://picsum.photos/seed/diaz-reel-poster/1400/787"
            alt="Reel poster"
            fill
            className={`object-cover transition-transform duration-700 ease-out ${playing ? 'scale-105' : 'group-hover:scale-[1.02]'}`}
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
          />

          {/* Dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg/40 pointer-events-none" />

          {/* Play button */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Outer ring pulse */}
                <div className="absolute w-24 h-24 rounded-full border border-white/20 animate-ping opacity-30" />
                {/* Button */}
                <div className="w-20 h-20 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:border-white/70 group-hover:bg-black/50">
                  <Play
                    size={28}
                    strokeWidth={1.5}
                    className="text-white ml-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Video element — replace src with actual reel URL */}
          {playing && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              {/* Replace with actual video source */}
              <source src="" type="video/mp4" />
            </video>
          )}

          {/* Bottom label */}
          {!playing && (
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
              <span
                className="font-display font-black text-white leading-none"
                style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
              >
                REEL
              </span>
              <span className="font-mono text-[13px] tracking-[0.15em] uppercase text-white/50">
                Play ↗
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
