"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type DateTimePickerProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

const TIME_SLOTS = Array.from({ length: 29 }, (_, index) => {
  const hours = 8 + Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;
  return { hours, minutes };
});

export function DateTimePicker({ label, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(startOfMonth(value));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMonth(startOfMonth(value));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  function setDate(day: Date) {
    const next = new Date(value);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    onChange(next);
  }

  function setTime(hours: number, minutes: number) {
    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative text-left">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black px-4 py-3 text-left text-sm text-white transition-colors hover:border-white/25"
      >
        <span className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
          <span>{format(value, "d MMMM yyyy", { locale: pl })}</span>
        </span>
        <span className="flex items-center gap-2 text-zinc-400">
          <Clock className="h-4 w-4" strokeWidth={1.6} />
          {format(value, "HH:mm")}
        </span>
      </button>

      {open && (
        <div className="relative z-40 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="grid sm:grid-cols-[1fr_7.5rem]">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMonth((current) => addMonths(current, -1))}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                  aria-label="Poprzedni miesiąc"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-sm font-medium capitalize text-white">
                  {format(month, "LLLL yyyy", { locale: pl })}
                </p>
                <button
                  type="button"
                  onClick={() => setMonth((current) => addMonths(current, 1))}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                  aria-label="Następny miesiąc"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const selected = isSameDay(day, value);
                  const inMonth = isSameMonth(day, month);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setDate(day)}
                      className={`h-8 rounded-lg text-xs transition-colors ${
                        selected
                          ? "bg-white text-black"
                          : inMonth
                            ? "text-zinc-200 hover:bg-white/10"
                            : "text-zinc-700 hover:bg-white/5"
                      }`}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto border-t border-white/10 sm:border-l sm:border-t-0">
              {TIME_SLOTS.map(({ hours, minutes }) => {
                const selected =
                  value.getHours() === hours && value.getMinutes() === minutes;
                return (
                  <button
                    key={`${hours}:${minutes}`}
                    type="button"
                    onClick={() => setTime(hours, minutes)}
                    className={`flex w-full items-center justify-center px-3 py-2 text-xs transition-colors ${
                      selected
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
