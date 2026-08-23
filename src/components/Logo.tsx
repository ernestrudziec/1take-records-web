import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "h-10 w-auto", priority = false }: LogoProps) {
  return (
    <Link href="/" className="inline-block transition-opacity hover:opacity-80">
      <Image
        src="/logo.png"
        alt="1take.records"
        width={320}
        height={120}
        priority={priority}
        className={className}
      />
    </Link>
  );
}
