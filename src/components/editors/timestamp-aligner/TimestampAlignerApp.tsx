"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CueSheet,
  type MarkField,
} from "@/components/editors/timestamp-aligner/CueSheet";
import { MediaPane } from "@/components/editors/timestamp-aligner/MediaPane";
import {
  ALIGNER_MEDIA,
  ALIGNER_STORAGE_KEY,
  cueAtTime,
  defaultMarksMap,
  emptyMarks,
  formatClock,
  isRangeComplete,
  showCutCues,
  type AlignerExport,
  type CueMarks,
  type TimeRange,
} from "@/lib/show-cuts";

const NUDGE = {
  fine: 0.1,
  coarse: 1,
} as const;

export function TimestampAlignerApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrls = useRef<string[]>([]);
  const loopUntil = useRef<number | null>(null);
  const selectedIndexRef = useRef(0);
  const marksRef = useRef<Record<string, CueMarks>>(defaultMarksMap());

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [marks, setMarks] = useState<Record<string, CueMarks>>(defaultMarksMap);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoLabel, setVideoLabel] = useState("");
  const [audioLabel, setAudioLabel] = useState("");
  const [status, setStatus] = useState("Załaduj video i audio, potem stampuj in/out.");
  const [hydrated, setHydrated] = useState(false);

  const selected = showCutCues[selectedIndex];
  selectedIndexRef.current = selectedIndex;
  marksRef.current = marks;

  const stats = useMemo(() => {
    const values = Object.values(marks);
    return {
      preview: values.filter((item) => isRangeComplete(item.preview)).length,
      explanation: values.filter((item) => isRangeComplete(item.explanation)).length,
      total: showCutCues.length,
    };
  }, [marks]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ALIGNER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { marks?: Record<string, CueMarks> };
        if (parsed.marks) {
          setMarks({ ...defaultMarksMap(), ...parsed.marks });
        }
      }
    } catch {
      // keep defaults
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      ALIGNER_STORAGE_KEY,
      JSON.stringify({ marks, updatedAt: new Date().toISOString() }),
    );
  }, [marks, hydrated]);

  useEffect(() => {
    let cancelled = false;

    async function probe(url: string) {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      } catch {
        return false;
      }
    }

    void Promise.all([probe(ALIGNER_MEDIA.video), probe(ALIGNER_MEDIA.audio)]).then(
      ([hasVideo, hasAudio]) => {
        if (cancelled) return;
        if (hasVideo) {
          setVideoUrl(ALIGNER_MEDIA.video);
          setVideoLabel("media/video.mp4");
        }
        if (hasAudio) {
          setAudioUrl(ALIGNER_MEDIA.audio);
          setAudioLabel("media/audio.mp4");
        }
        if (hasVideo || hasAudio) {
          setStatus("Wczytano pliki z katalogu media.");
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
    };
  }, []);

  const syncAudio = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (Math.abs(audio.currentTime - time) > 0.08) {
      audio.currentTime = time;
    }
  }, [audioUrl]);

  const seek = useCallback(
    (time: number) => {
      const next = Math.max(0, time);
      const video = videoRef.current;
      const audio = audioRef.current;
      if (video) video.currentTime = next;
      if (audio) audio.currentTime = next;
      setCurrentTime(next);
    },
    [],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      void audioRef.current?.play();
      setPlaying(true);
    } else {
      video.pause();
      audioRef.current?.pause();
      setPlaying(false);
      loopUntil.current = null;
    }
  }, []);

  const playFrom = useCallback(
    (time: number, until?: number | null) => {
      loopUntil.current = until ?? null;
      seek(time);
      const video = videoRef.current;
      if (!video) return;
      void video.play();
      void audioRef.current?.play();
      setPlaying(true);
    },
    [seek],
  );

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    syncAudio(video.currentTime);
    setPlaying(!video.paused);
    if (loopUntil.current !== null && video.currentTime >= loopUntil.current) {
      video.pause();
      audioRef.current?.pause();
      setPlaying(false);
      loopUntil.current = null;
    }
  }

  const updateRange = useCallback(
    (id: string, kind: "preview" | "explanation", key: keyof TimeRange, value: number | null) => {
      setMarks((current) => {
        const prev = current[id] ?? emptyMarks();
        return {
          ...current,
          [id]: {
            ...prev,
            [kind]: {
              ...prev[kind],
              [key]: value,
            },
          },
        };
      });
    },
    [],
  );

  const stamp = useCallback(
    (field: MarkField, index = selectedIndex) => {
      const cue = showCutCues[index];
      if (!cue) return;
      const time = videoRef.current?.currentTime ?? currentTime;
      const [kind, edge] = field.split("-") as ["preview" | "explanation", "start" | "end"];
      updateRange(cue.id, kind, edge, time);
      setStatus(`${cue.name} · ${kind} ${edge} → ${formatClock(time)}`);
    },
    [currentTime, selectedIndex, updateRange],
  );

  const clearField = useCallback(
    (field: MarkField) => {
      if (!selected) return;
      const [kind, edge] = field.split("-") as ["preview" | "explanation", "start" | "end"];
      updateRange(selected.id, kind, edge, null);
      setStatus(`${selected.name} · ${kind} ${edge} wyczyszczone`);
    },
    [selected, updateRange],
  );

  const playRange = useCallback(
    (kind: "preview" | "explanation") => {
      if (!selected) return;
      const range = marks[selected.id]?.[kind];
      if (!isRangeComplete(range) || range.start === null || range.end === null) return;
      setStatus(`Loop ${kind}: ${formatClock(range.start)} → ${formatClock(range.end)}`);
      playFrom(range.start, range.end);
    },
    [marks, playFrom, selected],
  );

  const selectCue = useCallback(
    (index: number, jump = true) => {
      const next = Math.min(showCutCues.length - 1, Math.max(0, index));
      setSelectedIndex(next);
      if (jump) seek(showCutCues[next].chapter);
    },
    [seek],
  );

  function handleNotes(value: string) {
    if (!selected) return;
    setMarks((current) => ({
      ...current,
      [selected.id]: {
        ...(current[selected.id] ?? emptyMarks()),
        notes: value,
      },
    }));
  }

  function rememberFile(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  }

  function buildExport(): AlignerExport {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      source: {
        video: videoLabel || ALIGNER_MEDIA.video,
        audio: audioLabel || ALIGNER_MEDIA.audio,
      },
      cues: showCutCues.map((cue) => {
        const mark = marks[cue.id] ?? emptyMarks();
        return {
          id: cue.id,
          name: cue.name,
          chapter: cue.chapter,
          chapterLabel: cue.chapterLabel,
          preview: mark.preview,
          explanation: mark.explanation,
          notes: mark.notes,
        };
      }),
    };
  }

  function downloadExport() {
    const blob = new Blob([JSON.stringify(buildExport(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "show-cuts-timestamps.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Zapisano show-cuts-timestamps.json");
  }

  async function copyExport() {
    await navigator.clipboard.writeText(JSON.stringify(buildExport(), null, 2));
    setStatus("JSON skopiowany do schowka");
  }

  function importExport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AlignerExport;
        const next = defaultMarksMap();
        for (const cue of parsed.cues ?? []) {
          next[cue.id] = {
            preview: cue.preview ?? emptyMarks().preview,
            explanation: cue.explanation ?? emptyMarks().explanation,
            notes: cue.notes ?? "",
          };
        }
        setMarks(next);
        setStatus("Wczytano znaczniki z JSON");
      } catch {
        setStatus("Nie udało się wczytać JSON");
      }
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const delta = event.shiftKey ? NUDGE.fine : NUDGE.coarse;
        const time = videoRef.current?.currentTime ?? 0;
        seek(time + (event.key === "ArrowRight" ? delta : -delta));
        return;
      }

      if (event.key === "[") {
        event.preventDefault();
        selectCue(selectedIndexRef.current - 1);
        return;
      }

      if (event.key === "]") {
        event.preventDefault();
        selectCue(selectedIndexRef.current + 1);
        return;
      }

      if (event.key === "1") stamp("preview-start", selectedIndexRef.current);
      if (event.key === "2") stamp("preview-end", selectedIndexRef.current);
      if (event.key === "3") stamp("explanation-start", selectedIndexRef.current);
      if (event.key === "4") stamp("explanation-end", selectedIndexRef.current);
      if (event.key === "p") playRange("preview");
      if (event.key === "e") playRange("explanation");
      if (event.key === "n") {
        const from = selectedIndexRef.current;
        const next = showCutCues.findIndex((cue, index) => {
          if (index <= from) return false;
          const mark = marksRef.current[cue.id];
          return !isRangeComplete(mark?.preview) || !isRangeComplete(mark?.explanation);
        });
        if (next >= 0) selectCue(next);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playRange, seek, selectCue, stamp, togglePlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    const onPlay = () => {
      void audioRef.current?.play();
      setPlaying(true);
    };
    const onPause = () => {
      audioRef.current?.pause();
      setPlaying(false);
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoUrl]);

  const followIndex = cueAtTime(currentTime);

  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Editors · show cuts
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-wide">
              Timestamp aligner
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Zaznacz preview i explanation dla 35 efektów. Znaczniki zapisują się
              lokalnie i możesz je wyeksportować pod auto-cut.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat label="Preview" value={`${stats.preview}/${stats.total}`} />
            <Stat label="Explanation" value={`${stats.explanation}/${stats.total}`} />
            <Stat
              label="Playhead"
              value={showCutCues[followIndex]?.name ?? "—"}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={downloadExport}
            className="border border-white bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => void copyExport()}
            className="border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
          >
            Copy JSON
          </button>
          <label className="cursor-pointer border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) importExport(file);
                event.target.value = "";
              }}
            />
          </label>
          <p className="text-xs text-zinc-500">{status}</p>
        </div>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-zinc-600">
          space play · ←/→ 1s · shift+strzałka 0.1s · [ ] efekt · 1/2 preview · 3/4
          explanation · p/e odtwórz zakres · n następny pusty
        </p>
      </header>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start sm:px-6">
        <MediaPane
          videoRef={videoRef}
          audioRef={audioRef}
          videoUrl={videoUrl}
          audioUrl={audioUrl}
          videoLabel={videoLabel}
          audioLabel={audioLabel}
          currentTime={currentTime}
          duration={duration}
          playing={playing}
          marks={marks}
          selectedIndex={selectedIndex}
          onSeek={seek}
          onTogglePlay={togglePlay}
          onVideoFile={(file) => {
            setVideoUrl(rememberFile(file));
            setVideoLabel(file.name);
            setStatus(`Video: ${file.name}`);
          }}
          onAudioFile={(file) => {
            setAudioUrl(rememberFile(file));
            setAudioLabel(file.name);
            setStatus(`Audio: ${file.name}`);
          }}
          onTimeUpdate={handleTimeUpdate}
          onDuration={(value) => {
            setDuration(value);
            const audio = audioRef.current;
            if (audio && videoRef.current) audio.currentTime = videoRef.current.currentTime;
          }}
        />

        <div className="flex min-h-[70vh] flex-col lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]">
          <CueSheet
            selectedIndex={selectedIndex}
            marks={marks}
            onSelect={selectCue}
            onStamp={stamp}
            onSeekMark={seek}
            onClear={clearField}
            onNotes={handleNotes}
            onPlayRange={playRange}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}
