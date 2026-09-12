"use client";

import { useEffect, useRef } from "react";
import {
  emptyMarks,
  formatClock,
  isRangeComplete,
  type CueMarks,
  type ShowCutCue,
  type TimeRange,
} from "@/lib/show-cuts";

export type MarkField = "preview-start" | "preview-end" | "explanation-start" | "explanation-end";

type CueSheetProps = {
  cues: ShowCutCue[];
  selectedIndex: number;
  marks: Record<string, CueMarks>;
  onSelect: (index: number, jump?: boolean) => void;
  onStamp: (field: MarkField, index?: number) => void;
  onSeekMark: (time: number) => void;
  onClear: (field: MarkField) => void;
  onNotes: (value: string) => void;
  onPlayRange: (kind: "preview" | "explanation", index?: number) => void;
  onOutputs: (kind: "preview" | "explanation", key: "video" | "audio", value: boolean) => void;
};

export function CueSheet({
  cues,
  selectedIndex,
  marks,
  onSelect,
  onStamp,
  onSeekMark,
  onClear,
  onNotes,
  onPlayRange,
  onOutputs,
}: CueSheetProps) {
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const selected = cues[selectedIndex];
  const selectedMarks = selected ? marks[selected.id] : undefined;

  useEffect(() => {
    if (!selected) return;
    rowRefs.current[selected.id]?.scrollIntoView({
      block: "nearest",
    });
  }, [selected]);

  if (!selected || !selectedMarks) {
    return (
      <div className="flex flex-1 items-center justify-center border border-white/10 px-6 py-16 text-center text-sm text-zinc-500">
        Wklej timestampy po lewej i kliknij „Zastosuj listę”.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-3">
      <div className="border border-white/10 bg-zinc-950 p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
          {String(selectedIndex + 1).padStart(2, "0")} / {cues.length} · chapter{" "}
          <button
            type="button"
            onClick={() => onSeekMark(selected.chapter)}
            className="font-mono text-zinc-300 underline-offset-2 hover:text-white hover:underline"
          >
            {selected.chapterLabel}
          </button>
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">{selected.name}</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <RangeCard
            title="Preview"
            hint="1 in · 2 out"
            range={selectedMarks.preview}
            startField="preview-start"
            endField="preview-end"
            onStamp={onStamp}
            onSeekMark={onSeekMark}
            onClear={onClear}
            onPlay={() => onPlayRange("preview")}
            onOutputs={(key, value) => onOutputs("preview", key, value)}
          />
          <RangeCard
            title="Explanation"
            hint="3 in · 4 out"
            range={selectedMarks.explanation}
            startField="explanation-start"
            endField="explanation-end"
            onStamp={onStamp}
            onSeekMark={onSeekMark}
            onClear={onClear}
            onPlay={() => onPlayRange("explanation")}
            onOutputs={(key, value) => onOutputs("explanation", key, value)}
          />
        </div>

        <label className="mt-4 block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Notatka
          </span>
          <textarea
            value={selectedMarks.notes}
            onChange={(event) => onNotes(event.target.value)}
            rows={2}
            className="mt-2 w-full resize-none border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/40"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-auto border border-white/10">
        <table className="w-full min-w-160 border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-zinc-950 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="px-2 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">Efekt</th>
              <th className="px-2 py-2 font-medium">Ch.</th>
              <th className="px-2 py-2 font-medium">Prev in</th>
              <th className="px-2 py-2 font-medium">Prev out</th>
              <th className="px-2 py-2 font-medium">Exp in</th>
              <th className="px-2 py-2 font-medium">Exp out</th>
            </tr>
          </thead>
          <tbody>
            {cues.map((cue, index) => {
              const mark = marks[cue.id] ?? emptyMarks();
              const active = index === selectedIndex;
              return (
                <tr
                  key={cue.id}
                  ref={(node) => {
                    rowRefs.current[cue.id] = node;
                  }}
                  onClick={() => onSelect(index, true)}
                  className={`cursor-pointer border-t border-white/5 transition-colors ${
                    active
                      ? "bg-white/15"
                      : "hover:bg-white/10"
                  }`}
                >
                  <td className="px-2 py-1.5 font-mono text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td
                    className={`px-2 py-1.5 ${active ? "text-white" : "text-zinc-300"}`}
                  >
                    {cue.name}
                  </td>
                  <td className="px-2 py-1.5 font-mono text-zinc-400">
                    {cue.chapterLabel}
                  </td>
                  <StampCell
                    value={mark.preview.start}
                    complete={isRangeComplete(mark.preview)}
                    onStamp={() => {
                      onSelect(index, false);
                      onStamp("preview-start", index);
                    }}
                    onSeek={onSeekMark}
                    onPlay={() => onPlayRange("preview", index)}
                  />
                  <StampCell
                    value={mark.preview.end}
                    complete={isRangeComplete(mark.preview)}
                    onStamp={() => {
                      onSelect(index, false);
                      onStamp("preview-end", index);
                    }}
                    onSeek={onSeekMark}
                  />
                  <StampCell
                    value={mark.explanation.start}
                    complete={isRangeComplete(mark.explanation)}
                    onStamp={() => {
                      onSelect(index, false);
                      onStamp("explanation-start", index);
                    }}
                    onSeek={onSeekMark}
                  />
                  <StampCell
                    value={mark.explanation.end}
                    complete={isRangeComplete(mark.explanation)}
                    onStamp={() => {
                      onSelect(index, false);
                      onStamp("explanation-end", index);
                    }}
                    onSeek={onSeekMark}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RangeCard({
  title,
  hint,
  range,
  startField,
  endField,
  onStamp,
  onSeekMark,
  onClear,
  onPlay,
  onOutputs,
}: {
  title: string;
  hint: string;
  range: TimeRange;
  startField: MarkField;
  endField: MarkField;
  onStamp: (field: MarkField) => void;
  onSeekMark: (time: number) => void;
  onClear: (field: MarkField) => void;
  onPlay: () => void;
  onOutputs: (key: "video" | "audio", value: boolean) => void;
}) {
  const complete = isRangeComplete(range);

  return (
    <div className={`border p-3 ${complete ? "border-white/30" : "border-white/10"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {title}
        </p>
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          {hint}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StampButton
          label="In"
          value={range.start}
          onStamp={() => onStamp(startField)}
          onSeek={onSeekMark}
          onClear={() => onClear(startField)}
        />
        <StampButton
          label="Out"
          value={range.end}
          onStamp={() => onStamp(endField)}
          onSeek={onSeekMark}
          onClear={() => onClear(endField)}
        />
      </div>
      <div className="mt-3 flex gap-3 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={range.video}
            onChange={(event) => onOutputs("video", event.target.checked)}
          />
          Video
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={range.audio}
            onChange={(event) => onOutputs("audio", event.target.checked)}
          />
          Audio
        </label>
      </div>
      <button
        type="button"
        onClick={onPlay}
        disabled={!complete}
        className="mt-3 w-full border border-white/15 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30"
      >
        Odtwórz zakres
      </button>
    </div>
  );
}

function StampButton({
  label,
  value,
  onStamp,
  onSeek,
  onClear,
}: {
  label: string;
  value: number | null;
  onStamp: () => void;
  onSeek: (time: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="border border-white/10 bg-black p-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <button
        type="button"
        disabled={value === null}
        onClick={() => value !== null && onSeek(value)}
        className="mt-1 font-mono text-sm text-white underline-offset-2 hover:underline disabled:cursor-default disabled:no-underline"
      >
        {formatClock(value)}
      </button>
      <div className="mt-2 flex gap-1">
        <button
          type="button"
          onClick={onStamp}
          className="flex-1 border border-white/15 py-1 text-[10px] uppercase tracking-[0.12em] hover:bg-white hover:text-black"
        >
          Set
        </button>
        <button
          type="button"
          disabled={value === null}
          onClick={() => value !== null && onSeek(value)}
          className="border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] hover:bg-white hover:text-black disabled:opacity-30"
        >
          Go
        </button>
        <button
          type="button"
          disabled={value === null}
          onClick={onClear}
          className="border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] hover:bg-white hover:text-black disabled:opacity-30"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function StampCell({
  value,
  complete,
  onStamp,
  onSeek,
  onPlay,
}: {
  value: number | null;
  complete: boolean;
  onStamp: () => void;
  onSeek: (time: number) => void;
  onPlay?: () => void;
}) {
  return (
    <td className="px-1 py-1">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (event.shiftKey) {
            onStamp();
            return;
          }
          if (onPlay && value !== null) {
            onPlay();
            return;
          }
          if (value !== null) onSeek(value);
          else onStamp();
        }}
        className={`w-full cursor-pointer px-1 py-1 text-left font-mono underline-offset-2 hover:underline ${
          value === null
            ? "text-zinc-600"
            : complete
              ? "text-white"
              : "text-zinc-300"
        }`}
        title={
          onPlay
            ? "Klik: odtwórz preview · Shift+klik: set z playhead"
            : "Klik: skok do czasu · Shift+klik: set z playhead"
        }
      >
        {formatClock(value)}
      </button>
    </td>
  );
}
