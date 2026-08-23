import { LoaderCircle } from "lucide-react";

export function Spinner({ label = "Ładowanie..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 py-16 text-zinc-500">
      <LoaderCircle className="h-6 w-6 animate-spin" strokeWidth={1.75} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/6 ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Skeleton className="h-[28rem] md:h-[36rem]" />
    </div>
  );
}
