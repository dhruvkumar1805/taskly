import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

const FEATURES = [
  {
    title: "Capture without friction",
    desc: "Type “landlord tomorrow 3pm !high” into the quick-add bar and Taskly splits it into a title, due date, and priority on its own. No forms, no date picker required.",
  },
  {
    title: "Priority that means something",
    desc: "Three levels, one color that actually signals urgency. High-priority and overdue work share the same visual language on purpose — they're both asking for the same thing: attention now.",
  },
  {
    title: "A command palette, not a settings menu",
    desc: "Press ⌘K to jump straight to any task, switch views, or flip the theme — without leaving the keyboard or hunting through menus.",
  },
  {
    title: "Search that's actually fast",
    desc: "Hit ‘/’, type, done. Filter by status or priority without leaving the keyboard.",
  },
  {
    title: "Run the whole list without a mouse",
    desc: "j / k to move, enter to open, x to mark done, e to edit. The kind of navigation you'd expect from an inbox, not a to-do app.",
  },
];

const MOCK_TASKS = [
  { title: "Ship the Q3 billing update", tone: "urgent" as const, due: "Overdue" },
  { title: "Review design handoff", tone: "info" as const, due: "Today" },
  { title: "Sync with infra on rollout", tone: "neutral" as const, due: "Tomorrow" },
  { title: "Draft release notes", tone: "done" as const, due: "Done" },
];

const toneDot: Record<string, string> = {
  urgent: "bg-primary",
  info: "bg-info",
  neutral: "bg-muted-foreground/50",
  done: "bg-success",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-28">
        <div>
          <h1 className="max-w-lg text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            One list. Everything that matters today.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Taskly is where your day lives — capture fast, see what&apos;s
            actually due, close the loop. No boards to configure, no
            busywork to maintain.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Create your list</Link>
            </Button>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in instead
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">Shortcut</dt>
              <dd className="mt-1 text-foreground">n → new task</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Shortcut</dt>
              <dd className="mt-1 text-foreground">/ → search</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Shortcut</dt>
              <dd className="mt-1 text-foreground">⌘K → command palette</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Shortcut</dt>
              <dd className="mt-1 text-foreground">j / k → move through list</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListTodo className="h-4 w-4 text-muted-foreground" />
              Today
            </div>
            <span className="font-mono text-xs text-muted-foreground">4 tasks</span>
          </div>

          <ul>
            {MOCK_TASKS.map((task) => (
              <li
                key={task.title}
                className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0"
              >
                {task.tone === "done" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={`flex-1 truncate text-sm ${
                    task.tone === "done"
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[task.tone]}`} />
                <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {task.due}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="features" className="border-t border-border py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[280px_1fr] md:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              Built for the work, not the workspace
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Every feature exists to get a task off your list, not to keep
              you configuring the tool that holds it.
            </p>
          </div>

          <div className="divide-y divide-border border-t border-border md:border-t-0">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="grid gap-2 py-6 first:pt-0 md:grid-cols-[220px_1fr] md:gap-8"
              >
                <h3 className="font-medium">{f.title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border bg-card/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { step: "Add", copy: "Type a title. Everything else — priority, due date — is optional and takes one click." },
              { step: "Work", copy: "Move through today's tasks with the keyboard. Toggle status, mark done, keep moving." },
              { step: "Trust it", copy: "Overdue work stays visible until it's handled. Nothing quietly falls off the list." },
            ].map((item) => (
              <div key={item.step}>
                <h3 className="font-mono text-sm text-primary">{item.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 text-center md:py-28">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Your list is one account away.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Free to start. No credit card, no onboarding tour.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/register">Create your list</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Taskly.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
