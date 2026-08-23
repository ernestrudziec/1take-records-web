"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose?: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  icon,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center px-0 sm:items-center sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Zamknij"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
                aria-label="Zamknij"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
            {icon && (
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black">
                {icon}
              </div>
            )}
            <h3 className="pr-8 text-xl font-semibold text-white">{title}</h3>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
