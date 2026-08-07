/** True when a due date carries a specific time of day rather than the
 * local-midnight default a date-only due date is stored as. */
export function hasExplicitTime(date: Date) {
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}
