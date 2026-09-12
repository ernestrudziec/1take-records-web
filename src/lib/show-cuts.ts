export type TimeRange = {
  start: number | null;
  end: number | null;
  video: boolean;
  audio: boolean;
};

export type CueMarks = {
  preview: TimeRange;
  explanation: TimeRange;
  notes: string;
};

export type ShowCutCue = {
  id: string;
  name: string;
  chapterLabel: string;
  chapter: number;
};

export type CutItem = {
  filename: string;
  name: string;
  start: string;
  end: string;
  video: boolean;
  audio: boolean;
};

export type CutFile = {
  cut: CutItem[];
};

export const ALIGNER_STORAGE_KEY = "1take.show-cuts.aligner.v3";
export const ALIGNER_MEDIA = {
  video: "/editors/timestamp-aligner/media/video.mp4",
  audio: "/editors/timestamp-aligner/media/audio.mp4",
} as const;

const CUE_LINE =
  /^\s*(?:\d+[\.)]\s*)?(\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?)\s+[-–—:]?\s*(.+?)\s*$/;

export function slugify(name: string, separator = "-") {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

export function filenameSlug(name: string) {
  return slugify(name, "_") || "clip";
}

export function parseClock(label: string) {
  const parts = label.split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) return Number.NaN;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? Number.NaN;
}

export function formatClock(seconds: number | null, precise = true) {
  if (seconds === null || Number.isNaN(seconds)) return "—";
  const clamped = Math.max(0, seconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  if (!precise) {
    return `${String(mins).padStart(2, "0")}:${String(Math.floor(secs)).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${secs.toFixed(2).padStart(5, "0")}`;
}

export function formatCutClock(seconds: number) {
  const clamped = Math.max(0, seconds);
  const hours = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  const whole = Math.abs(secs - Math.round(secs)) < 0.005;
  const secLabel = whole
    ? String(Math.round(secs)).padStart(2, "0")
    : secs.toFixed(2).padStart(5, "0");
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${secLabel}`;
}

export function emptyMarks(): CueMarks {
  return {
    preview: { start: null, end: null, video: false, audio: true },
    explanation: { start: null, end: null, video: true, audio: false },
    notes: "",
  };
}

export function normalizeMarks(value?: Partial<CueMarks> | null): CueMarks {
  const defaults = emptyMarks();
  return {
    preview: { ...defaults.preview, ...value?.preview },
    explanation: { ...defaults.explanation, ...value?.explanation },
    notes: value?.notes ?? "",
  };
}

export function isRangeComplete(range: TimeRange) {
  return range.start !== null && range.end !== null && range.end > range.start;
}

export function parseCueList(text: string) {
  const cues: ShowCutCue[] = [];
  const errors: string[] = [];
  const usedIds = new Map<string, number>();

  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(CUE_LINE);
    if (!match) {
      errors.push(`linia ${index + 1}: ${line}`);
      continue;
    }
    const chapterLabel = match[1];
    const name = match[2].trim();
    const chapter = parseClock(chapterLabel);
    if (Number.isNaN(chapter)) {
      errors.push(`linia ${index + 1}: zły czas ${chapterLabel}`);
      continue;
    }
    const baseId = slugify(name) || `cue-${index + 1}`;
    const seen = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, seen + 1);
    cues.push({
      id: seen === 0 ? baseId : `${baseId}-${seen + 1}`,
      name,
      chapterLabel,
      chapter,
    });
  }

  return { cues, errors };
}

export function cuesToText(cues: ShowCutCue[]) {
  return cues.map((cue) => `${cue.chapterLabel} ${cue.name}`).join("\n");
}

export function defaultMarksMap(cues: ShowCutCue[]) {
  return Object.fromEntries(cues.map((cue) => [cue.id, emptyMarks()]));
}

export function mergeMarks(
  cues: ShowCutCue[],
  previous: Record<string, CueMarks>,
) {
  return Object.fromEntries(
    cues.map((cue) => [cue.id, normalizeMarks(previous[cue.id])]),
  );
}

export type PreviewDefaults = {
  startOffset: number;
  endOffset: number;
  endAtNext: boolean;
};

export const DEFAULT_PREVIEW_DEFAULTS: PreviewDefaults = {
  startOffset: 0,
  endOffset: 8,
  endAtNext: false,
};

export function parseOffset(value: string) {
  const text = value.trim().replace(/^\+/, "");
  if (!text) return 0;
  if (text.includes(":")) return parseClock(text);
  const seconds = Number(text.replace(",", "."));
  return Number.isNaN(seconds) ? Number.NaN : seconds;
}

export function applyPreviewDefaults(
  cues: ShowCutCue[],
  previous: Record<string, CueMarks>,
  defaults: PreviewDefaults,
  mode: "empty" | "all" = "empty",
  duration = Number.POSITIVE_INFINITY,
) {
  return Object.fromEntries(
    cues.map((cue, index) => {
      const current = normalizeMarks(previous[cue.id]);
      const hasPreview = isRangeComplete(current.preview);
      if (mode === "empty" && hasPreview) {
        return [cue.id, current];
      }

      const start = Math.max(0, cue.chapter + defaults.startOffset);
      const nextChapter = cues[index + 1]?.chapter;
      let end = cue.chapter + defaults.endOffset;
      if (defaults.endAtNext && nextChapter !== undefined) {
        end = nextChapter;
      }
      end = Math.min(end, duration);
      if (end <= start) {
        end = Math.min(start + Math.max(0.25, defaults.endOffset), duration);
      }

      return [
        cue.id,
        {
          ...current,
          preview: {
            ...current.preview,
            start,
            end,
          },
        },
      ];
    }),
  );
}

export function cueAtTime(cues: ShowCutCue[], time: number) {
  for (let i = cues.length - 1; i >= 0; i -= 1) {
    if (time >= cues[i].chapter) return i;
  }
  return 0;
}

export function buildCutFile(
  cues: ShowCutCue[],
  marks: Record<string, CueMarks>,
): CutFile {
  const cut: CutItem[] = [];

  for (const cue of cues) {
    const mark = normalizeMarks(marks[cue.id]);
    if (isRangeComplete(mark.preview) && (mark.preview.video || mark.preview.audio)) {
      cut.push({
        filename: `${filenameSlug(cue.name)}_preview`,
        name: cue.name,
        start: formatCutClock(mark.preview.start ?? 0),
        end: formatCutClock(mark.preview.end ?? 0),
        video: mark.preview.video,
        audio: mark.preview.audio,
      });
    }
    if (
      isRangeComplete(mark.explanation) &&
      (mark.explanation.video || mark.explanation.audio)
    ) {
      cut.push({
        filename: `${filenameSlug(cue.name)}_tutorial`,
        name: cue.name,
        start: formatCutClock(mark.explanation.start ?? 0),
        end: formatCutClock(mark.explanation.end ?? 0),
        video: mark.explanation.video,
        audio: mark.explanation.audio,
      });
    }
  }

  return { cut };
}

function readCutTime(item: Partial<CutItem> & Record<string, unknown>) {
  const start = item.start ?? item.timeStart;
  const end = item.end ?? item.timeEnd;
  return {
    start: typeof start === "string" || typeof start === "number" ? parseClock(String(start)) : Number.NaN,
    end: typeof end === "string" || typeof end === "number" ? parseClock(String(end)) : Number.NaN,
    video: Boolean(item.video ?? item.generateVideo),
    audio: Boolean(item.audio ?? item.generateAudio),
  };
}

export function importCutFile(payload: unknown) {
  const root = payload as { cut?: unknown; cuts?: unknown; cues?: unknown };
  if (Array.isArray(root.cues)) {
    const cues = (root.cues as ShowCutCue[]).filter((cue) => cue.id && cue.name);
    const marks = Object.fromEntries(
      (root.cues as Array<ShowCutCue & CueMarks>).map((cue) => [
        cue.id,
        normalizeMarks(cue),
      ]),
    );
    return { cues, marks, cueText: cuesToText(cues) };
  }

  const items = (root.cut ?? root.cuts) as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(items)) {
    throw new Error("JSON musi mieć tablicę cut");
  }

  const cues: ShowCutCue[] = [];
  const marks: Record<string, CueMarks> = {};

  for (const item of items) {
    const name = String(item.name ?? item.title ?? "").trim();
    if (!name) continue;
    const id = slugify(name);
    if (!marks[id]) {
      const times = readCutTime(item);
      cues.push({
        id,
        name,
        chapterLabel: formatClock(Number.isNaN(times.start) ? 0 : times.start, false),
        chapter: Number.isNaN(times.start) ? 0 : times.start,
      });
      marks[id] = emptyMarks();
    }
    const filename = String(item.filename ?? item.slug ?? "");
    const times = readCutTime(item);
    const kind =
      filename.endsWith("_tutorial") || filename.endsWith("_explanation")
        ? "explanation"
        : filename.endsWith("_preview") || times.audio
          ? "preview"
          : "explanation";
    marks[id] = {
      ...marks[id],
      [kind]: {
        start: Number.isNaN(times.start) ? null : times.start,
        end: Number.isNaN(times.end) ? null : times.end,
        video: times.video,
        audio: times.audio,
      },
    };
  }

  return { cues, marks, cueText: cuesToText(cues) };
}
