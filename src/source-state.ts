import type { CalendarDefinition } from "./config";

export function configuredCalendars(
  definitions: CalendarDefinition[],
): CalendarDefinition[] {
  return definitions.filter(({ googleCalendarId }) => googleCalendarId.trim() !== "");
}

export function defaultEnabledIds(definitions: CalendarDefinition[]): Set<string> {
  return new Set(
    configuredCalendars(definitions)
      .filter(({ enabledByDefault }) => enabledByDefault)
      .map(({ id }) => id),
  );
}

export function parseEnabledIds(
  value: string | null,
  definitions: CalendarDefinition[],
): Set<string> | null {
  if (value === null) return null;

  const validIds = new Set(configuredCalendars(definitions).map(({ id }) => id));
  return new Set(
    value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => validIds.has(id)),
  );
}
