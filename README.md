# Solar Client Portal — Dashboard Scaffold

React (JS, not TS) + Vite + Tailwind + shadcn-style components + Redux Toolkit + i18next (EN/UR, RTL-ready).

## Folder structure

```
src/
├── api/                        # fetch/axios service functions (empty, wire up later)
├── app/
│   └── store.js                # Redux store — combines all feature slices
├── assets/                     # images, icons
├── components/
│   ├── ui/                     # shadcn primitives (button, card, input, select, ...)
│   ├── common/                 # cross-feature reusable pieces
│   │   ├── PageHeader.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FormField.jsx
│   │   └── Spinner.jsx
│   ├── layout/                 # app shell: sidebar, topbar, nav, menus
│   ├── forms/
│   │   └── SolarRequestForm/   # the multi-step request form
│   │       ├── SolarRequestForm.jsx      # container: stepper + nav buttons
│   │       ├── FormStepper.jsx           # progress UI
│   │       ├── form-steps.config.js      # ⭐ single source of truth for step order
│   │       └── steps/
│   │           ├── SelectCompaniesStep.jsx
│   │           ├── PropertyDetailsStep.jsx
│   │           ├── ConsumptionStep.jsx
│   │           ├── PreferencesStep.jsx
│   │           └── ReviewStep.jsx
│   ├── companies/               # CompanyCard, CompanyGrid
│   └── quotations/              # QuotationCard, QuotationCompareTable
├── features/                    # Redux Toolkit slices, one folder per domain
│   ├── auth/authSlice.js
│   ├── companies/companiesSlice.js
│   ├── requests/requestsSlice.js   # holds the live multi-step form state
│   ├── quotations/quotationsSlice.js
│   └── ui/uiSlice.js               # sidebar/mobile-nav/theme state
├── hooks/
│   └── useLanguageDirection.js  # flips <html dir="rtl"> for Urdu
├── i18n/
│   ├── i18n.js
│   └── locales/{en,ur}/translation.json
├── layouts/
│   ├── DashboardLayout.jsx
│   └── AuthLayout.jsx
├── lib/
│   └── utils.js                 # cn() helper
├── pages/                       # route-level components only — compose from components/
│   ├── auth/LoginPage.jsx
│   ├── dashboard/DashboardHome.jsx
│   ├── companies/{CompaniesList,CompanyDetail}.jsx
│   ├── requests/{NewRequest,MyRequests}.jsx
│   ├── quotations/{QuotationsList,QuotationDetail}.jsx
│   ├── settings/SettingsPage.jsx
│   └── NotFound.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── App.jsx
├── main.jsx
└── index.css                    # ⭐ shadcn CSS variable tokens — drop your theme colors here
```

## Design decisions

- **JavaScript only** (no TypeScript) — `components.json` is set to `"tsx": false`.
- **Redux Toolkit** for state, one slice per domain (`auth`, `companies`, `requests`, `quotations`, `ui`). The multi-step form's answers live in `requests.formData`, keyed by step (`property`, `consumption`, `preferences`), so adding a field never touches unrelated steps.
- **Multi-step form is config-driven.** `form-steps.config.js` is the only place that lists steps — add/remove/reorder a step there and both the stepper UI and the form container update automatically.
- **shadcn primitives are hand-added**, not run through the CLI (no network access assumed) — `button`, `card`, `input`, `label`, `badge`, `avatar`, `dropdown-menu`, `select`, `checkbox`, `progress`, `separator`. Add more the same way (each is a self-contained file in `components/ui/`) or run `npx shadcn@latest add <name>` once you have this locally with `components.json` already configured.
- **i18n (react-i18next)** is namespaced by feature (`common`, `nav`, `dashboard`, `companies`, `requestForm`, `quotations`) in `src/i18n/locales/{en,ur}/translation.json`. `useLanguageDirection` keeps `<html lang dir>` in sync so Tailwind's logical-property utilities (`ps-`, `me-`, `text-start`, `rtl:` variants already used in Sidebar/Topbar/buttons) flip automatically for Urdu — no separate RTL stylesheet needed.
- **Theme colors**: everything routes through CSS variables in `src/index.css` (`--primary`, `--secondary`, `--sidebar-*`, `--status-*` for request/quotation states, etc.) and `tailwind.config.js` just maps to them. Send over your palette and I'll swap the HSL values in one pass — no component code needs to change.

## Not wired up yet (intentionally left as TODOs)

- `src/api/` is empty — no backend calls yet, all data currently comes from Redux state seeded as empty arrays.
- Auth is a stub (`loginSuccess` fires on any form submit) — swap for a real API call.
- No toast/notification system yet (radix `@radix-ui/react-toast` is already in `package.json`, just needs a `Toaster` component).

## Getting it running locally

```bash
npm install
npm run dev
```

## Next step

Send over the multi-step form's actual field list (per your product) and your brand theme colors — I'll fill in `index.css` and expand the step components accordingly.
