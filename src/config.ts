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
    label: "Tokyo Union Church Events",
    googleCalendarId:
      "c_df7c3d64c2f86d0e1765a0eb40a02941a2ba01805909874f772d2a0c5eedda15@group.calendar.google.com",
    color: "#5BC6C9",
    enabledByDefault: true,
    userToggleable: true,
  },
  {
    id: "groups",
    label: "Tokyo Union Church Groups",
    googleCalendarId:
      "c_3c130e8c2ac9186920afc3383a911704f360f56b86a7e3e79d9432bbf4947825@group.calendar.google.com",
    color: "#96B5D9",
    enabledByDefault: true,
    userToggleable: true,
  },
];

export const appConfig = {
  locale: "en",
  timeZone: "Asia/Tokyo",
  googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY ?? "",
  storageKey: "tuc-calendar-sources-v1",
};
