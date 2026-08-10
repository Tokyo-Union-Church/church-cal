# Design QA

## Evidence

- Source visual truth: `qa/reference-squarespace-calendar.png`
- Normalized source: `qa/reference-desktop-normalized.png`
- Desktop implementation: `qa/implementation-desktop.png`
- Mobile implementation: `qa/implementation-mobile.png`
- Side-by-side comparison: `qa/comparison-desktop.png`
- Source pixels: 1954 x 1662
- Desktop implementation pixels: 1954 x 1423
- Normalized comparison pixels: 1954 x 1423 per side; the source was top-cropped without scaling to the browser capture height
- Desktop CSS viewport: 1954 x 1662 at device pixel ratio 1
- Mobile CSS viewport and capture: 390 x 844 at device pixel ratio 1
- State: August 2026, empty event data because Google Calendar IDs and API key are intentionally not configured yet

## Full-view comparison

The implementation matches the reference's dominant visual system: white canvas, centered bold serif month, isolated edge chevrons, generous vertical whitespace, two-letter uppercase weekday labels, pale gray day cells, white gutters, muted top-right date numbers, and no visible outer border. The browser DOM confirms all seven columns fit inside the viewport with no horizontal overflow.

The reference's event photography is calendar content rather than calendar chrome. No substitute imagery was invented because the eventual Google event data does not currently define image assets. Text events are styled as unboxed black time/title content to match the visible reference event treatment.

## Focused region comparison

- Toolbar: title scale, serif weight, arrow position, and whitespace were compared directly and tightened after the first capture.
- Weekday/grid transition: header capitalization, muted gray, header-to-grid spacing, cell fill, gutter thickness, and date alignment were compared directly.
- Mobile: the responsive list state keeps the same editorial title and minimal navigation, with a clean empty state.

## Required fidelity surfaces

- Fonts and typography: Georgia is a close system-safe match for the reference's editorial serif month title. Arial/Helvetica provides the neutral grotesk weekday and date treatment. Weight, letter spacing, capitalization, and hierarchy match the reference closely.
- Spacing and layout rhythm: outer padding, toolbar distribution, large title-to-weekday gap, weekday-to-grid gap, seven equal columns, six rows, and grid aspect ratio were measured and adjusted. No horizontal overflow is present.
- Colors and visual tokens: canvas `#ffffff`, cells `#f7f7f7`, ink `#33312e`, and muted text `#777674` reproduce the near-white neutral palette without dark button chrome or colored card treatments.
- Image quality and asset fidelity: no app-owned imagery is required. Reference event photos are sample content and were not replaced with placeholders or generated approximations.
- Copy and content: month, weekday abbreviations, date numbers, loading/setup states, and no-events copy are correct. Live event copy cannot be compared until calendars are configured.

## Comparison history

### Iteration 1

- P1: FullCalendar 7 hashes internal theme classes, so legacy `.fc-*` selectors did not style the rendered controls and cells.
- Fix: converted the implementation to supported FullCalendar 7 render-hook classes for toolbar, buttons, table regions, headers, cells, events, list view, more links, and empty state.
- Post-fix evidence: `qa/implementation-desktop.png` and `qa/comparison-desktop.png` show the custom design applied to the browser-rendered DOM.

### Iteration 2

- P2: the first styled capture placed the title and grid too low and rendered the title too large relative to the source.
- Fix: reduced top padding and title scale, tightened toolbar and weekday spacing, and adjusted the calendar aspect ratio to match the source's cell proportions.
- Post-fix evidence: the final normalized side-by-side comparison aligns the title hierarchy, weekday band, grid start, and cell density.

## Findings

No actionable P0, P1, or P2 visual differences remain within the requested styling scope.

## Interaction and runtime checks

- Previous/next month controls render and remain keyboard-accessible.
- Next-month interaction changed the heading from August 2026 to September 2026.
- Mobile breakpoint selects list view at 390 px.
- Calendar-source behavior remains covered by three passing unit tests.
- Final clean browser load produced no console warnings or errors.

## Follow-up polish

- P3: once real event data is connected, verify dense-event wrapping and `+more` behavior against actual TUC titles.
- P3: if event imagery becomes part of the data contract later, add it as real event content rather than decorative placeholders.

final result: passed
