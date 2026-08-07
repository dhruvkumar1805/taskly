import Link from "next/link";
import { Logo } from "@/components/logo";
import { StaticTaskPreview } from "@/components/static-task-preview";

export default function AuthLayout({
  title,
  subtitle,
  tagline,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  tagline: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="animate-fade-up w-full max-w-sm">
          <Link href="/" className="inline-block">
            <Logo className="mb-10" />
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>

      <div className="hidden border-l border-border bg-card/40 md:flex md:flex-col md:items-center md:justify-center md:px-16">
        <div className="w-full max-w-sm">
          <StaticTaskPreview />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground text-pretty">
            {tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
