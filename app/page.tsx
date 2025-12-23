import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              ✓
            </div>
            Taskly
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#testimonials" className="hover:text-foreground">
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          v1.0 is live
        </Badge>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Simplify life.{" "}
          <span className="text-primary">Master your tasks.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Taskly helps you organize, prioritize, and get things done — without
          clutter, distractions, or complexity.
        </p>

        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/register">Start for free</Link>
          </Button>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-xl border bg-muted/40">
          <Image
            src="/dashboard-preview.png"
            alt="Taskly dashboard preview"
            width={1200}
            height={700}
            className="w-full"
          />
        </div>
      </section>

      <section id="features" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Badge variant="secondary">Core Features</Badge>
            <h2 className="mt-4 text-3xl font-semibold">
              Everything you need to stay organized
            </h2>
            <p className="mt-3 text-muted-foreground">
              A focused feature set designed for productivity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Smart Task Management",
                desc: "Create, organize, and prioritize tasks with ease.",
              },
              {
                title: "Visual Organization",
                desc: "Clean layout that helps you focus on what matters.",
              },
              {
                title: "Status & Priority Tracking",
                desc: "Always know what’s urgent and what’s next.",
              },
            ].map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Badge variant="secondary">Testimonials</Badge>
            <h2 className="mt-4 text-3xl font-semibold">
              Loved by productive people
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Taskly finally made task management enjoyable.",
              "Simple, fast, and actually useful.",
              "The clean UI helps me focus every day.",
            ].map((quote, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  “{quote}”
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col gap-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Taskly. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
