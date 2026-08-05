import * as chrono from "chrono-node";
import type { Task } from "@/generated/prisma/client";

const PRIORITY_MARKERS: Record<string, Task["priority"]> = {
  h: "HIGH",
  high: "HIGH",
  m: "MEDIUM",
  med: "MEDIUM",
  medium: "MEDIUM",
  l: "LOW",
  low: "LOW",
};

export type ParsedQuickAdd = {
  title: string;
  dueDate: Date | null;
  hasTime: boolean;
  priority: Task["priority"] | null;
};

/**
 * "call the landlord tomorrow 3pm !high" -> title "call the landlord",
 * dueDate tomorrow 3pm, priority HIGH. Falls back to the plain title with
 * no date/priority when nothing matches — never throws on ordinary input.
 */
export function parseQuickAdd(input: string, referenceDate: Date = new Date()): ParsedQuickAdd {
  let text = input;
  let priority: Task["priority"] | null = null;

  const priorityMatch = /!(\w+)\b/i.exec(text);
  if (priorityMatch) {
    const marker = PRIORITY_MARKERS[priorityMatch[1].toLowerCase()];
    if (marker) {
      priority = marker;
      text = (text.slice(0, priorityMatch.index) + text.slice(priorityMatch.index + priorityMatch[0].length)).trim();
    }
  }

  let dueDate: Date | null = null;
  let hasTime = false;
  const [result] = chrono.parse(text, referenceDate);
  if (result) {
    dueDate = result.start.date();
    hasTime = result.start.isCertain("hour");
    text = (text.slice(0, result.index) + text.slice(result.index + result.text.length)).trim();
  }

  const title = text.replace(/\s{2,}/g, " ").trim();

  return { title, dueDate, hasTime, priority };
}
