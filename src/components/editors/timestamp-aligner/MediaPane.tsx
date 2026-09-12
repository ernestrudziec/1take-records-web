"use client";

import { useRef } from "react";
import {
  formatClock,
  type CueMarks,
  type ShowCutCue,
} from "@/lib/show-cuts";

type MediaPaneProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoUrl: string | null;
  audioUrl: string | null;
  videoLabel: string;
  audioLabel: string;
  currentTime: number;
  duration: number;
  playing: boolean;
  cues: ShowCutCue[];
  marks: Record<string, CueMarks>;
  selectedIndex: number;
  onSeek: (time: number) => void;
  onNudge: (delta: number) => void;
  onTogglePlay: () => void;
  onVideoFile: (file: File) => void;
  onAudioFile: (file: File) => void;
  onTimeUpdate: () => void;
  onDuration: (value: number) => void;
};

export function MediaPane({
  videoRef,
  audioRef,
  videoUrl,
  audioUrl,
  videoLabel,
  audioLabel,
  currentTime,
  duration,
  playing,
  cues,
  marks,
  selectedIndex,
  onSeek,
  onNudge,
  onTogglePlay,
  onVideoFile,
  onAudioFile,
  onTimeUpdate,
  onDuration,
}: MediaPaneProps) {
  const barRef = useRef<HTMLButtonElement>(null);

  function seekFromEvent(event: React.MouseEvent<HTMLButtonElement>) {
    if (!duration || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <FileDrop
          label="Video"
          fileLabel={videoLabel}
          accept="video/mp4,.mp4"
          onFile={onVideoFile}
        />
        <FileDrop
          label="Audio"
          fileLabel={audioLabel}
          accept="video/mp4,audio/mp4,.mp4"
          onFile={onAudioFile}
        />
      </div>

      <div className="relative overflow-hidden border border-white/10 bg-black">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            muted={Boolean(audioUrl)}
            playsInline
            preload="auto"
            className="aspect-video w-full bg-black"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={(event) => onDuration(event.currentTarget.duration)}
            onClick={onTogglePlay}
          >
            <track
              kind="captions"
              src="/tools/effects/captions-empty.vtt"
              srcLang="pl"
              label="Napisy"
            />
          </video>
        ) : (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-zinc-500">
            Wrzuć video.mp4 — picker albo
            <br />
            public/editors/timestamp-aligner/media/video.mp4
          </div>
        )}
        <audio
          ref={audioRef}
          src={audioUrl ?? undefined}
          preload="auto"
          className="hidden"
        >
          <track
            kind="captions"
            src="/tools/effects/captions-empty.vtt"
            srcLang="pl"
            label="Napisy"
          />
        </audio>
      </div>

      <div className="flex items-center justify-between gap-3 font-mono text-sm">
        <span className="text-white">{formatClock(currentTime)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNudge(-1)}
            className="cursor-pointer border border-white/20 px-2.5 py-1.5 text-xs hover:bg-white hover:text-black"
          >
            −
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            className="border border-white bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => onNudge(1)}
            className="cursor-pointer border border-white/20 px-2.5 py-1.5 text-xs hover:bg-white hover:text-black"
          >
            +
          </button>
        </div>
        <span className="text-zinc-500">{formatClock(duration || null)}</span>
      </div>

      <button
        ref={barRef}
        type="button"
        aria-label="Oś czasu"
        onClick={seekFromEvent}
        className="relative h-10 w-full border border-white/10 bg-zinc-950"
      >
        {duration > 0 &&
          cues.map((cue, index) => {
            const mark = marks[cue.id];
            const preview = barRange(mark?.preview, duration);
            const explanation = barRange(mark?.explanation, duration);
            return (
              <span key={cue.id}>
                {preview && (
                  <span
                    className="absolute top-1 h-2 bg-white"
                    style={preview}
                  />
                )}
                {explanation && (
                  <span
                    className="absolute bottom-1 h-2 bg-white/35"
                    style={explanation}
                  />
                )}
                <span
                  className={`absolute inset-y-0 w-px ${
                    index === selectedIndex ? "bg-white" : "bg-white/20"
                  }`}
                  style={{ left: `${(cue.chapter / duration) * 100}%` }}
                />
              </span>
            );
          })}
        {duration > 0 && (
          <span
            className="absolute inset-y-0 z-10 w-0.5 bg-white"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        )}
      </button>
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
        Góra osi: preview · dół: explanation · kreska: chapter
      </p>
    </div>
  );
}

function barRange(
  range: { start: number | null; end: number | null } | undefined,
  duration: number,
) {
  if (!range || range.start === null) return null;
  const end = range.end ?? range.start + 0.25;
  return {
    left: `${(range.start / duration) * 100}%`,
    width: `${(Math.max(0.25, end - range.start) / duration) * 100}%`,
  };
}

function FileDrop({
  label,
  fileLabel,
  accept,
  onFile,
}: {
  label: string;
  fileLabel: string;
  accept: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      className="flex cursor-pointer flex-col border border-dashed border-white/15 bg-zinc-950 px-3 py-3 transition-colors hover:border-white/40"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <span className="mt-1 truncate text-xs text-zinc-300">
        {fileLabel || "Upuść mp4 albo kliknij"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );
}
