export type TimeRange = {
  start: number | null;
  end: number | null;
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

export type AlignerExport = {
  version: 1;
  updatedAt: string;
  source: {
    video: string;
    audio: string;
  };
  cues: Array<{
    id: string;
    name: string;
    chapter: number;
    chapterLabel: string;
    preview: TimeRange;
    explanation: TimeRange;
    notes: string;
  }>;
};

export const ALIGNER_STORAGE_KEY = "1take.show-cuts.aligner.v1";
export const ALIGNER_MEDIA = {
  video: "/editors/timestamp-aligner/media/video.mp4",
  audio: "/editors/timestamp-aligner/media/audio.mp4",
} as const;

const RAW_CUES = [
  ["00:00", "Reverse Delay"],
  ["01:07", "Formant Glide"],
  ["02:32", "Call & Response"],
  ["03:44", "Haunting Vocal"],
  ["04:54", "Demon Time"],
  ["06:04", "Reverse Reverb"],
  ["07:05", "Reverse Reverb +"],
  ["08:31", "Delay Transition"],
  ["10:24", "Vocal Synth"],
  ["11:23", "Vocal Rapture"],
  ["12:26", "Impactful Vocals"],
  ["14:01", "Gap Filler"],
  ["16:01", "Pretty Vocals"],
  ["17:36", "Pretty Slap"],
  ["18:28", "Stretch & Stutter"],
  ["19:47", "Gated Fun"],
  ["20:43", "Ambient Pad"],
  ["22:06", "Distant Voicemail"],
  ["22:58", "Trippy Delays"],
  ["24:23", "Movements"],
  ["25:38", "Buggin’ Out"],
  ["26:35", "Transition Riser"],
  ["28:04", "Melody Tails"],
  ["29:18", "Gated Effects"],
  ["30:38", "Shifted Slap"],
  ["31:35", "Distorted Adlibs"],
  ["32:47", "Dark Reverb"],
  ["33:46", "Dark Ambience"],
  ["34:47", "Flanger Delays"],
  ["35:42", "Megaphone"],
  ["36:32", "Build Up"],
  ["38:05", "Throw"],
  ["39:14", "Vocal Samples"],
  ["40:58", "Distorted Room"],
  ["41:57", "Sidechain Stutter"],
] as const;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseClock(label: string) {
  const [minutes, seconds] = label.split(":").map(Number);
  return minutes * 60 + seconds;
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

export function emptyMarks(): CueMarks {
  return {
    preview: { start: null, end: null },
    explanation: { start: null, end: null },
    notes: "",
  };
}

export function isRangeComplete(range: TimeRange) {
  return range.start !== null && range.end !== null && range.end > range.start;
}

export const showCutCues: ShowCutCue[] = RAW_CUES.map(([chapterLabel, name]) => ({
  id: slugify(name),
  name,
  chapterLabel,
  chapter: parseClock(chapterLabel),
}));

export function chapterEnd(index: number, duration = Number.POSITIVE_INFINITY) {
  const next = showCutCues[index + 1];
  return next ? next.chapter : duration;
}

export function cueAtTime(time: number) {
  for (let i = showCutCues.length - 1; i >= 0; i -= 1) {
    if (time >= showCutCues[i].chapter) return i;
  }
  return 0;
}

export function defaultMarksMap() {
  return Object.fromEntries(showCutCues.map((cue) => [cue.id, emptyMarks()]));
}
