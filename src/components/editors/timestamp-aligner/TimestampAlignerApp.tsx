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
  DEFAULT_CUE_TEXT,
  buildCutFile,
  cueAtTime,
  cuesToText,
  formatClock,
  importCutFile,
  isRangeComplete,
  mergeMarks,
  normalizeMarks,
  parseCueList,
  type CueMarks,
  type ShowCutCue,
  type TimeRange,
} from "@/lib/show-cuts";

const NUDGE = {
  fine: 0.1,
  coarse: 1,
} as const;

const initialParsed = parseCueList(DEFAULT_CUE_TEXT);

export function TimestampAlignerApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrls = useRef<string[]>([]);
  const loopUntil = useRef<number | null>(null);
  const selectedIndexRef = useRef(0);
  const marksRef = useRef<Record<string, CueMarks>>({});
  const cuesRef = useRef<ShowCutCue[]>([]);

  const [cueText, setCueText] = useState(DEFAULT_CUE_TEXT);
  const [cues, setCues] = useState<ShowCutCue[]>(initialParsed.cues);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [marks, setMarks] = useState<Record<string, CueMarks>>(() =>
    mergeMarks(initialParsed.cues, {}),
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoLabel, setVideoLabel] = useState("");
  const [audioLabel, setAudioLabel] = useState("");
  const [status, setStatus] = useState("Wklej timestampy albo stampuj in/out na liście.");
  const [hydrated, setHydrated] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const selected = cues[selectedIndex];
  selectedIndexRef.current = selectedIndex;
  marksRef.current = marks;
  cuesRef.current = cues;

  const stats = useMemo(() => {
    return {
      preview: cues.filter((cue) => isRangeComplete(marks[cue.id]?.preview)).length,
      explanation: cues.filter((cue) =>
        isRangeComplete(marks[cue.id]?.explanation),
      ).length,
      total: cues.length,
      cuts: buildCutFile(cues, marks).cut.length,
    };
  }, [cues, marks]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ALIGNER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          cueText?: string;
          cues?: ShowCutCue[];
          marks?: Record<string, CueMarks>;
        };
        const nextCues = parsed.cues?.length
          ? parsed.cues
          : parseCueList(parsed.cueText || DEFAULT_CUE_TEXT).cues;
        setCueText(parsed.cueText || cuesToText(nextCues));
        setCues(nextCues);
        setMarks(mergeMarks(nextCues, parsed.marks ?? {}));
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
      JSON.stringify({
        cueText,
        cues,
        marks,
        updatedAt: new Date().toISOString(),
      }),
    );
  }, [cueText, cues, marks, hydrated]);

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

  const seek = useCallback((time: number) => {
    const next = Math.max(0, time);
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video) video.currentTime = next;
    if (audio) audio.currentTime = next;
    setCurrentTime(next);
  }, []);

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
    (id: string, kind: "preview" | "explanation", key: keyof TimeRange, value: number | boolean | null) => {
      setMarks((current) => {
        const prev = normalizeMarks(current[id]);
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
      const cue = cuesRef.current[index];
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
      const list = cuesRef.current;
      if (!list.length) return;
      const next = Math.min(list.length - 1, Math.max(0, index));
      setSelectedIndex(next);
      if (jump) seek(list[next].chapter);
    },
    [seek],
  );

  function handleNotes(value: string) {
    if (!selected) return;
    setMarks((current) => ({
      ...current,
      [selected.id]: {
        ...normalizeMarks(current[selected.id]),
        notes: value,
      },
    }));
  }

  function handleOutputs(
    kind: "preview" | "explanation",
    key: "video" | "audio",
    value: boolean,
  ) {
    if (!selected) return;
    updateRange(selected.id, kind, key, value);
  }

  function applyCueText(text = cueText) {
    const parsed = parseCueList(text);
    if (!parsed.cues.length) {
      setStatus(
        parsed.errors.length
          ? `Nie udało się sparsować listy (${parsed.errors.length} błędów)`
          : "Brak timestampów do wczytania",
      );
      return;
    }
    setCueText(text);
    setCues(parsed.cues);
    setMarks((current) => mergeMarks(parsed.cues, current));
    setSelectedIndex(0);
    const extra = parsed.errors.length ? ` · pominięto ${parsed.errors.length}` : "";
    setStatus(`Wczytano ${parsed.cues.length} cueów${extra}`);
    setListOpen(false);
  }

  function rememberFile(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  }

  function downloadExport() {
    const payload = buildCutFile(cues, marks);
    if (!payload.cut.length) {
      setStatus("Brak kompletnych zakresów do eksportu");
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cut.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus(`Zapisano cut.json · ${payload.cut.length} clipów`);
  }

  async function copyExport() {
    const payload = buildCutFile(cues, marks);
    if (!payload.cut.length) {
      setStatus("Brak kompletnych zakresów do eksportu");
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setStatus(`JSON skopiowany · ${payload.cut.length} clipów`);
  }

  function importExport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = importCutFile(JSON.parse(String(reader.result)));
        setCues(parsed.cues);
        setMarks(mergeMarks(parsed.cues, parsed.marks));
        setCueText(parsed.cueText);
        setSelectedIndex(0);
        setStatus(`Wczytano ${parsed.cues.length} cueów z JSON`);
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
        const list = cuesRef.current;
        const next = list.findIndex((cue, index) => {
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

  const followIndex = cueAtTime(cues, currentTime);

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
              Wklej chaptery, zaznacz preview i explanation, eksportuj{" "}
              <span className="text-zinc-300">cut.json</span> pod auto-cut.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat label="Preview" value={`${stats.preview}/${stats.total || "—"}`} />
            <Stat label="Explanation" value={`${stats.explanation}/${stats.total || "—"}`} />
            <Stat label="Cut clips" value={String(stats.cuts)} />
            <Stat label="Playhead" value={cues[followIndex]?.name ?? "—"} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setListOpen((open) => !open)}
            className="border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
          >
            {listOpen ? "Schowaj listę" : "Wklej timestampy"}
          </button>
          <button
            type="button"
            onClick={downloadExport}
            className="border border-white bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black"
          >
            Export cut.json
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
        {listOpen && (
          <div className="mt-4 border border-white/10 bg-zinc-950 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Jedna linia: MM:SS nazwa
            </p>
            <textarea
              value={cueText}
              onChange={(event) => setCueText(event.target.value)}
              rows={10}
              className="mt-2 w-full resize-y border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white outline-none focus:border-white/40"
              placeholder={"00:00 Reverse Delay\n01:07 Formant Glide"}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyCueText()}
                className="border border-white bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black"
              >
                Zastosuj listę
              </button>
              <button
                type="button"
                onClick={() => {
                  setCueText(DEFAULT_CUE_TEXT);
                  applyCueText(DEFAULT_CUE_TEXT);
                }}
                className="border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                Przykład 35 wokali
              </button>
            </div>
          </div>
        )}
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
          cues={cues}
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
            cues={cues}
            selectedIndex={selectedIndex}
            marks={marks}
            onSelect={selectCue}
            onStamp={stamp}
            onSeekMark={seek}
            onClear={clearField}
            onNotes={handleNotes}
            onPlayRange={playRange}
            onOutputs={handleOutputs}
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
