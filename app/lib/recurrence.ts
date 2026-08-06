import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import type { Recurrence } from "@/generated/prisma/client";

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  DAILY: "Daily",
  WEEKDAYS: "Weekdays",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

/**
 * Next occurrence, computed from the due date that just passed (not from
 * "today") — so completing a daily task three days late still schedules
 * the next one for the day after it was *due*, not four days out.
 */
export function getNextOccurrence(dueDate: Date, recurrence: Recurrence): Date {
  switch (recurrence) {
    case "DAILY":
      return addDays(dueDate, 1);
    case "WEEKDAYS": {
      let next = addDays(dueDate, 1);
      const day = next.getDay();
      if (day === 6) next = addDays(next, 2);
      else if (day === 0) next = addDays(next, 1);
      return next;
    }
    case "WEEKLY":
      return addWeeks(dueDate, 1);
    case "MONTHLY":
      return addMonths(dueDate, 1);
    case "YEARLY":
      return addYears(dueDate, 1);
  }
}
