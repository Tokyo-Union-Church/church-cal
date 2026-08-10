import { describe, expect, it } from "vitest";
import type { CalendarDefinition } from "./config";
import { configuredCalendars, defaultEnabledIds, parseEnabledIds } from "./source-state";

const definitions: CalendarDefinition[] = [
  {
    id: "church",
    label: "Church",
    googleCalendarId: "church@example.com",
    color: "#111111",
    enabledByDefault: true,
    userToggleable: true,
  },
  {
    id: "groups",
    label: "Groups",
    googleCalendarId: "groups@example.com",
    color: "#222222",
    enabledByDefault: false,
    userToggleable: true,
  },
  {
    id: "pending",
    label: "Pending",
    googleCalendarId: "",
    color: "#333333",
    enabledByDefault: true,
    userToggleable: true,
  },
];

describe("calendar source state", () => {
  it("ignores calendar definitions without a Google Calendar ID", () => {
    expect(configuredCalendars(definitions).map(({ id }) => id)).toEqual(["church", "groups"]);
  });

  it("derives enabled defaults from configured calendars", () => {
    expect([...defaultEnabledIds(definitions)]).toEqual(["church"]);
  });

  it("accepts only configured IDs from a serialized selection", () => {
    expect([...(parseEnabledIds("groups,pending,unknown", definitions) ?? [])]).toEqual(["groups"]);
  });
});
