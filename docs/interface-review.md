# Quotation interface review

## Scope and coverage

Reviewed the solar company directory and quotation flow (customer, property, company selection, documents, and additional details), plus their shared inputs, selects, buttons, feedback components, and dashboard content container. This is a source-based review, not a visual audit of every dashboard screen. Dashboard summary cards, authentication, chat, and notifications are outside the review boundary.

Stack: React, Redux Toolkit, Radix primitives, Tailwind, and English/Urdu i18next. `README.md` documents semantic CSS variables in `src/index.css`, logical spacing, and config-driven steps. No AGENTS.md or additional interface convention document was found.

Applied better-interface and all six owning skills.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Select/button/input primitives, filter names, pagination, validation, upload keyboard handling, motion CSS | Source fixes applied; keyboard/screen-reader runtime checks not verified |
| Layout | Filter grids, company cards, form padding, stepper breakpoints, dashboard flex container | Responsive source fixes applied; 320px, zoom, and RTL rendering not verified |
| Writing | Loading, retry, empty states, EN/UR common strings | Retry/reset actions added; existing terminology retained |
| Typography | Input font sizes, company names, filenames, step labels | Mobile input size and wrapping corrected |
| Colors | Light/dark primary tokens, destructive tokens, muted/card and accent pairs | Measured token pairs and corrected semantic action colors |
| UI polish | Dropdown loading, company skeletons, field spacing, missing-logo fallback | Shared loading and feedback treatment implemented; visual appearance not verified |

## Findings addressed

Locations point to the resulting implementation.

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| HIGH | Colors | `src/index.css:24`, `src/components/ui/button.jsx:13` | White labels over yellow/orange gradient; primary white pair 3.42:1 | Solid semantic primary button pair 5.60:1; dark primary pair 7.39:1 | Small control labels need 4.5:1; yellow endpoint was 1.41:1 |
| HIGH | Accessibility | `src/components/solar/CompanyList.jsx:73`, `src/components/features/requests/steps/CompanySelectionStep.jsx:98` | Unnamed arrow buttons | Localized accessible names | Pagination controls must announce their purpose |
| HIGH | Accessibility | `src/index.css:121`, `src/components/common/Spinner.jsx:5` | Unconditional animation | Reduced-motion guard; spinner has a static icon and accompanying loading state | Honor reduced motion without losing state |
| HIGH | Writing | `src/components/solar/CompanyList.jsx:28`, `src/components/features/requests/steps/CompanySelectionStep.jsx:70` | Directory error had no recovery action; selection errors looked like no results | Retry action and distinct error/empty/loading states | Failures need an actionable recovery path |
| MEDIUM | Layout | `src/components/solar/CompanyFilters.jsx:49` | Narrow fixed-width filters in one flex row | Responsive shared grid | Long province names and translations get room to wrap |
| MEDIUM | UI polish | `src/components/solar/RegionFilter.jsx:21`, `src/components/ui/select.jsx:10` | Loading paragraph was a sibling in the filter row | Spinner inside the trigger; shared province API component on both screens | Loading belongs to the control it describes |
| MEDIUM | UI polish | `src/components/solar/CompanyListSkeleton.jsx:4` | Empty spinner area; step filters disappeared during fetch | Card-shaped skeletons with status label; filters remain mounted | Preserve context during loading |
| MEDIUM | Accessibility | `src/components/features/requests/SolarRequestForm.jsx:112`, `src/components/common/FormField.jsx:10` | Errors only collected in summary | Inline errors, invalid/described-by attributes, focus first invalid control | Connect errors to fields and shorten recovery |
| MEDIUM | Typography | `src/components/solar/CompanyRow.jsx:69`, `src/components/common/FileDropzone.jsx:252`, `src/components/ui/input.jsx:10` | Company/file names truncated; 14px mobile inputs | Wrapped values and 16px mobile inputs | Preserve full values and avoid input-triggered mobile zoom |
| MEDIUM | Layout | `src/components/solar/CompanyRowDetails.jsx:39` | Extra images behind a nonfunctional view-more tile | All images available in the existing wrapping grid | Remove dead disclosure and expose content |
| MEDIUM | Colors | `src/components/features/requests/FormStepper.jsx:26`, `src/components/ui/select.jsx:15` | Hardcoded white surfaces | Card/popover/accent tokens | Components follow the current theme |

## Verification

- `npm run build`: passed after all changes (existing bundle-size warning remains).
- `node scripts/check-electricity.mjs`: passed, including lookup parsing, per-city results, out-of-order responses, retry, and validation.
- Focused ESLint API check with `no-undef` and `react/jsx-no-undef`: passed. The repository-wide lint command still lacks a project configuration.
- `git diff --check`: passed.
- WCAG sRGB luminance calculations: light primary/white 5.60:1; dark primary/ink 7.39:1; muted/card 6.04:1; accent text/tint 5.13:1; light destructive/white 6.47:1. These are declared token pairs, not browser-computed translucent/hover pairs.
- **Not verified:** visual appearance, viewport/zoom reflow, Urdu rendering, keyboard walkthrough, screen-reader announcements, and all rendered contrast states. Starting the local preview was declined; no running preview was available through browser inventory.

## Verdict

Approve the inspected source corrections. This does not approve unverified rendered states or screens outside the scope above.
