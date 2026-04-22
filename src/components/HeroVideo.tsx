"use client";
import { useEffect, useRef } from "react";

const VIDEO_ID = "yXAmSmcDi3E";
const CLIP_SECONDS = 30;

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function HeroVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: any;

    function create() {
      if (cancelled || !ref.current) return;
      playerRef.current = new window.YT.Player(ref.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          start: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            interval = setInterval(() => {
              try {
                const t = e.target.getCurrentTime?.() ?? 0;
                if (t >= CLIP_SECONDS) e.target.seekTo(0, true);
              } catch {}
            }, 500);
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) e.target.seekTo(0, true);
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      create();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = create;
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      try { playerRef.current?.destroy?.(); } catch {}
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={ref}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full"
      />
    </div>
  );
}
