import { Calendar } from "fullcalendar";
import dayGridPlugin from "fullcalendar/daygrid";
import listPlugin from "fullcalendar/list";
import classicThemePlugin from "fullcalendar/themes/classic";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { appConfig, calendarDefinitions, type CalendarDefinition } from "./config";
import { configuredCalendars, defaultEnabledIds, parseEnabledIds } from "./source-state";
import "fullcalendar/skeleton.css";
import "fullcalendar/themes/classic/theme.css";
import "fullcalendar/themes/classic/palette.css";
import "./styles.css";

const calendarElement = requiredElement("calendar");
const filtersElement = requiredElement("calendar-filters");
const statusElement = requiredElement("calendar-status");
const eventDialog = requiredDialog("event-dialog");
const eventDialogClose = requiredElement("event-dialog-close");
const eventDialogSource = requiredElement("event-dialog-source");
const eventDialogTitle = requiredElement("event-dialog-title");
const eventDialogDetails = requiredElement("event-dialog-details");
const eventDialogDescription = requiredElement("event-dialog-description");
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-calendar-view]")];
const definitions = configuredCalendars(calendarDefinitions);
const enabledIds = initialEnabledIds();

const calendar = new Calendar(calendarElement, {
  plugins: [dayGridPlugin, listPlugin, classicThemePlugin, googleCalendarPlugin],
  googleCalendarApiKey: appConfig.googleCalendarApiKey,
  timeZone: appConfig.timeZone,
  locale: appConfig.locale,
  initialView: "dayGridMonth",
  aspectRatio: 1.25,
  borderless: true,
  headerToolbar: {
    start: "prev",
    center: "title",
    end: "next",
  },
  titleFormat: { month: "long", year: "numeric" },
  className: "tuc-calendar",
  toolbarClass: "tuc-toolbar",
  headerToolbarClass: "tuc-header-toolbar",
  toolbarSectionClass: "tuc-toolbar-section",
  toolbarTitleClass: "tuc-toolbar-title",
  buttonClass: "tuc-button",
  tableClass: "tuc-table",
  tableHeaderClass: "tuc-table-header",
  tableBodyClass: "tuc-table-body",
  dayHeaderRowClass: "tuc-day-header-row",
  dayHeaderClass: "tuc-day-header",
  dayHeaderInnerClass: "tuc-day-header-inner",
  dayHeaderDividerClass: "tuc-day-header-divider",
  dayRowClass: "tuc-day-row",
  dayCellClass: "tuc-day-cell",
  dayCellInnerClass: "tuc-day-inner",
  dayCellTopClass: "tuc-day-top",
  dayCellTopInnerClass: "tuc-day-number",
  dayCellBottomClass: "tuc-day-bottom",
  eventClass: "tuc-event",
  eventInnerClass: "tuc-event-inner",
  eventTimeClass: "tuc-event-time",
  eventTitleClass: "tuc-event-title",
  views: {
    dayGrid: {
      eventTitleClass: "tuc-daygrid-event-title",
    },
  },
  listDaysClass: "tuc-list-days",
  listDayClass: "tuc-list-day",
  listDayHeaderClass: "tuc-list-day-header",
  listDayHeaderInnerClass: "tuc-list-day-header-inner",
  listDayBodyClass: "tuc-list-day-body",
  noEventsClass: "tuc-no-events",
  noEventsInnerClass: "tuc-no-events-inner",
  moreLinkClass: "tuc-more-link",
  dayHeaderContent({ date }) {
    return date.toLocaleDateString(appConfig.locale, { weekday: "short" }).slice(0, 2).toUpperCase();
  },
  dayMaxEvents: true,
  eventDisplay: "auto",
  fixedWeekCount: true,
  showNonCurrentDates: false,
  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
  },
  eventSources: definitions.filter(({ id }) => enabledIds.has(id)).map(toEventSource),
  eventDidMount({ el, event, view }) {
    if (view.type.startsWith("dayGrid")) el.title = event.title;
  },
  eventClick(info) {
    info.jsEvent.preventDefault();
    showEventDetails(info.event);
  },
  viewDidMount({ view }) {
    updateViewButtons(view.type);
  },
  loading(isLoading) {
    statusElement.textContent = isLoading ? "Loading events…" : "";
  },
  eventSourceFailure() {
    statusElement.textContent = "Some events could not be loaded. Please try again shortly.";
  },
});

renderFilters();
renderViewControls();

if (!appConfig.googleCalendarApiKey || definitions.length === 0) {
  statusElement.textContent = setupMessage();
}

calendar.render();

eventDialogClose.addEventListener("click", () => eventDialog.close());
eventDialog.addEventListener("click", (event) => {
  if (event.target === eventDialog) eventDialog.close();
});

function requiredElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element #${id}`);
  return element;
}

function requiredDialog(id: string): HTMLDialogElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLDialogElement)) throw new Error(`Missing required dialog #${id}`);
  return element;
}

function showEventDetails(event: ReturnType<typeof calendar.getEvents>[number]): void {
  const definition = definitions.find(({ id }) => id === event.source?.id);
  const description = descriptionText(event.extendedProps.description);
  const location = stringProperty(event.extendedProps.location);

  eventDialogSource.textContent = definition?.label ?? "Tokyo Union Church";
  eventDialogSource.style.setProperty("--source-color", definition?.color ?? "#33312e");
  eventDialogTitle.textContent = event.title;
  eventDialogDetails.replaceChildren();
  addDetail("When", formatEventDates(event.start, event.end, event.allDay));
  if (location) addDetail("Where", location);

  eventDialogDescription.textContent = description;
  eventDialogDescription.hidden = !description;
  eventDialog.showModal();
}

function addDetail(label: string, value: string): void {
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value;
  eventDialogDetails.append(term, description);
}

function formatEventDates(start: Date | null, end: Date | null, allDay: boolean): string {
  if (!start) return "Date and time unavailable";

  const options: Intl.DateTimeFormatOptions = allDay
    ? { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    : {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      };
  const formatter = new Intl.DateTimeFormat(appConfig.locale, {
    ...options,
    timeZone: appConfig.timeZone,
  });

  if (!end) return formatter.format(start);
  const displayEnd = allDay ? new Date(end.getTime() - 1) : end;
  if (displayEnd.getTime() <= start.getTime()) return formatter.format(start);
  return formatter.formatRange(start, displayEnd);
}

function stringProperty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function descriptionText(value: unknown): string {
  const description = stringProperty(value);
  if (!description) return "";

  const parsed = new DOMParser().parseFromString(description, "text/html");
  parsed.querySelectorAll("script, style").forEach((element) => element.remove());
  parsed.querySelectorAll("br").forEach((element) => element.replaceWith("\n"));
  parsed.querySelectorAll("p, div, li").forEach((element) => element.append("\n"));

  return (parsed.body.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function initialEnabledIds(): Set<string> {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseEnabledIds(params.get("calendars"), calendarDefinitions);
  if (fromUrl !== null) return fromUrl;

  try {
    const fromStorage = parseEnabledIds(
      window.localStorage.getItem(appConfig.storageKey),
      calendarDefinitions,
    );
    if (fromStorage !== null) return fromStorage;
  } catch {
    // Storage can be unavailable in privacy-restricted iframe contexts.
  }

  return defaultEnabledIds(calendarDefinitions);
}

function toEventSource(definition: CalendarDefinition) {
  return {
    id: definition.id,
    googleCalendarId: definition.googleCalendarId,
    color: definition.color,
    textColor: "#33312e",
    className: `calendar-source-${definition.id}`,
  };
}

function renderViewControls(): void {
  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      const view = button.dataset.calendarView;
      if (view) calendar.changeView(view);
    });
  }
}

function updateViewButtons(activeView: string): void {
  for (const button of viewButtons) {
    const isActive = button.dataset.calendarView === activeView;
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function renderFilters(): void {
  filtersElement.replaceChildren();

  const toggleableDefinitions = definitions.filter(({ userToggleable }) => userToggleable);
  filtersElement.hidden = toggleableDefinitions.length < 2;

  for (const definition of toggleableDefinitions) {
    const label = document.createElement("label");
    label.className = "calendar-filter";
    label.style.setProperty("--source-color", definition.color);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = enabledIds.has(definition.id);
    input.addEventListener("change", () => toggleSource(definition, input.checked));

    const text = document.createElement("span");
    text.textContent = definition.label;

    label.append(input, text);
    filtersElement.append(label);
  }
}

function toggleSource(definition: CalendarDefinition, enabled: boolean): void {
  if (enabled) {
    enabledIds.add(definition.id);
    if (!calendar.getEventSourceById(definition.id)) {
      calendar.addEventSource(toEventSource(definition));
    }
  } else {
    enabledIds.delete(definition.id);
    calendar.getEventSourceById(definition.id)?.remove();
  }

  try {
    window.localStorage.setItem(appConfig.storageKey, [...enabledIds].join(","));
  } catch {
    // The visible toggle still works for this session without storage.
  }
}

function setupMessage(): string {
  if (!appConfig.googleCalendarApiKey && definitions.length === 0) {
    return "Calendar setup required: add an API key and at least one Google Calendar ID.";
  }
  if (!appConfig.googleCalendarApiKey) return "Calendar setup required: add a Google Calendar API key.";
  return "Calendar setup required: add at least one Google Calendar ID.";
}
