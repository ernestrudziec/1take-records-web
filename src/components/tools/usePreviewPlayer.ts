"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePreviewPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    setPlayingId(null);
  }, []);

  const toggle = useCallback(
    (id: string, src: string) => {
      if (playingId === id) {
        stop();
        return;
      }

      stop();

      const fallbackSrc = src.replace(/\.mp3$/i, ".wav");
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          setPlayingId(null);
        }
      };
      audio.onerror = () => {
        if (audioRef.current !== audio) return;
        if (fallbackSrc !== src && !audio.dataset.fallbackTried) {
          audio.dataset.fallbackTried = "1";
          audio.src = fallbackSrc;
          void audio.play().then(
            () => setPlayingId(id),
            () => {
              audioRef.current = null;
              setPlayingId(null);
            },
          );
          return;
        }
        audioRef.current = null;
        setPlayingId(null);
      };

      void audio.play().then(
        () => setPlayingId(id),
        () => {
          if (audioRef.current !== audio) return;
          if (fallbackSrc !== src) {
            audio.dataset.fallbackTried = "1";
            audio.src = fallbackSrc;
            void audio.play().then(
              () => setPlayingId(id),
              () => {
                audioRef.current = null;
                setPlayingId(null);
              },
            );
            return;
          }
          audioRef.current = null;
          setPlayingId(null);
        },
      );
    },
    [playingId, stop],
  );

  useEffect(() => stop, [stop]);

  return { playingId, toggle, stop };
}
