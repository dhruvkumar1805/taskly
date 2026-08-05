import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Logo className="mb-10" />
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This page isn&apos;t on the list.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Whatever you were looking for doesn&apos;t exist, or moved somewhere
        else.
      </p>
      <Button asChild className="mt-8 gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </Button>
    </div>
  );
}
