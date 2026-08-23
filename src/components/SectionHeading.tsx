type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
