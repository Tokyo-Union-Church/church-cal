export interface CalendarDefinition {
  id: string;
  label: string;
  googleCalendarId: string;
  color: string;
  enabledByDefault: boolean;
  userToggleable: boolean;
}

/**
 * Public Google Calendars shown by the embed.
 *
 * Add or remove entries here. A calendar with a blank googleCalendarId is
 * ignored, which lets the project build before the final IDs are available.
 */
export const calendarDefinitions: CalendarDefinition[] = [
  {
    id: "church",
    label: "Church events",
    googleCalendarId: "",
    color: "#9a4a3a",
    enabledByDefault: true,
    userToggleable: true,
  },
  {
    id: "groups",
    label: "Groups",
    googleCalendarId: "",
    color: "#456b5b",
    enabledByDefault: true,
    userToggleable: true,
  },
  {
    id: "community",
    label: "Community",
    googleCalendarId: "",
    color: "#536d8d",
    enabledByDefault: false,
    userToggleable: true,
  },
];

export const appConfig = {
  locale: "en",
  timeZone: "Asia/Tokyo",
  googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY ?? "",
  storageKey: "tuc-calendar-sources-v1",
};
