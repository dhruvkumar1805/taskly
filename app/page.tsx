import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/logo";
import { PriorityIcon } from "@/components/task-icons";
import { Command, Download, Keyboard, Repeat, Sparkles } from "lucide-react";
import LandingDemoPanel from "./landing-demo-panel";
import { HeaderClock } from "./landing-header-clock";

const FEATURES: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "Capture without friction",
    desc: `Type "landlord tomorrow 3pm !high" into the quick-add bar and Taskly splits it into a title, due date, and priority on its own. No forms, no date picker required.`,
  },
  {
    icon: <Repeat className="h-4 w-4" />,
    title: "Tasks that repeat themselves",
    desc: "Daily standups, weekly reports, monthly rent — mark a task to repeat and Taskly regenerates the next one the moment you finish this one, due date carried forward automatically.",
  },
  {
    icon: <PriorityIcon priority="HIGH" standalone={false} className="h-4 w-4 text-current" />,
    title: "Priority and status, at a glance",
    desc: "Escalating signal bars for priority, a status ring for progress — the same visual language as the wordmark itself, so a glance across your list tells you what a paragraph used to.",
  },
  {
    icon: <Command className="h-4 w-4" />,
    title: "A command palette, not a settings menu",
    desc: "Press ⌘K to jump to any task, switch views, or flip the theme — without leaving the keyboard or hunting through menus.",
  },
  {
    icon: <Keyboard className="h-4 w-4" />,
    title: "Run the whole list without a mouse",
    desc: "j / k to move, enter to open, x to mark done, e to edit, g then t or m to jump between views. Press ? any time to see the full list.",
  },
  {
    icon: <Download className="h-4 w-4" />,
    title: "Install it. Use it offline.",
    desc: "Add Taskly to your home screen like a native app. Lose signal mid-flight and you'll still see what you had open — it picks back up the moment you're back.",
  },
];

const STEPS: { step: string; copy: string }[] = [
  {
    step: "Add",
    copy: "Type a title. Everything else — priority, due date, repeat — is optional and takes one click.",
  },
  {
    step: "Work",
    copy: "Move through today's tasks with the keyboard, or let recurring tasks refill themselves as you go.",
  },
  {
    step: "Trust it",
    copy: "Overdue work stays visible until it's handled. Nothing quietly falls off the list — online or off.",
  },
];

function StepMark({ active }: { active: number }) {
  const sizes = [5, 7, 9];
  return (
    <div className="flex items-end gap-1" aria-hidden="true">
      {sizes.map((size, i) => (
        <span
          key={size}
          className={`rounded-full transition-colors duration-300 ${
            i <= active ? "bg-primary" : "bg-border"
          }`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

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
            <HeaderClock />
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

      <section className="relative overflow-hidden">
        <LogoMark
          className="pointer-events-none absolute top-0 right-0 hidden h-128 w-lg -translate-y-1/4 translate-x-1/4 text-primary/4 md:block"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-32">
          <div>
            <h1 className="animate-fade-up max-w-lg text-[clamp(2.75rem,3.2vw+2rem,5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">
              One list. Everything that matters today.
            </h1>
            <p className="animate-fade-up animation-delay-75 mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
              Taskly is where your day lives — capture fast, see what&apos;s
              actually due, close the loop. No boards to configure, no
              busywork to maintain.
            </p>

            <div className="animate-fade-up animation-delay-75 mt-9 flex items-center gap-4">
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

            <dl className="animate-fade-up animation-delay-150 mt-14 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">Shortcut</dt>
                <dd className="mt-1 text-foreground">n → new task</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Shortcut</dt>
                <dd className="mt-1 text-foreground">⌘K → command palette</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Shortcut</dt>
                <dd className="mt-1 text-foreground">g t / g m → jump views</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Shortcut</dt>
                <dd className="mt-1 text-foreground">? → all shortcuts</dd>
              </div>
            </dl>
          </div>

          <div className="animate-panel-in animation-delay-225 md:w-[calc(100%+2rem)] md:justify-self-end">
            <LandingDemoPanel />
          </div>
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
                className="group grid items-start gap-3 py-6 first:pt-0 md:grid-cols-[220px_1fr] md:gap-8"
              >
                <h3 className="flex items-center gap-2.5 font-medium">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors duration-200 ease-(--ease-out-quart) group-hover:bg-primary group-hover:text-primary-foreground">
                    {f.icon}
                  </span>
                  {f.title}
                </h3>
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
            {STEPS.map((item, i) => (
              <div key={item.step}>
                <div className="flex items-center gap-2.5">
                  <StepMark active={i} />
                  <h3 className="font-mono text-sm text-primary">{item.step}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-center text-primary-foreground md:py-28">
        <div className="mx-auto max-w-xl px-6">
          <LogoMark className="mx-auto h-8 w-8" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance">
            Your list is one account away.
          </h2>
          <p className="mt-4 text-primary-foreground/75">
            Free to start. No credit card, no onboarding tour.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="outline"
              className="border-transparent bg-background text-foreground hover:bg-background/90"
              asChild
            >
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
