# ESM Limo — React Project

Multi-page React app for ESM Limo, built with Vite + React Router + Tailwind CSS.

## Pages
- `/` Overview (home)
- `/services` Services
- `/about` About Us
- `/fleet` Our Fleet (category listing)
- `/fleet/:carId` Car details + reservation form
- `/blog` Blog listing
- `/blog/:postId` Single blog post + comment form
- `/contact` Contact Us

## Structure
- `src/data/` — static mock data, shaped exactly like the future API responses.
- `src/api/` — service functions (`fleetService`, `blogService`, `bookingService`,
  `contactService`, `commentService`). Each currently returns the static data from
  `src/data/`, with the real `fetch`/`apiRequest` call already written and commented
  out — uncomment it once the backend exists and delete the static fallback.
- `src/components/common/` — shared building blocks (buttons, form fields, line-art
  illustrations, section eyebrow, rating stars, hero band).
- `src/components/<page>/` — components scoped to one page/section.
- `src/pages/` — one file per route, composed from the components above.
- `src/components/layout/` — header, footer, page wrapper.

## Getting started
```bash
npm install
npm run dev
```

## Wiring up a real API
There is no backend yet (it will be built in Laravel). The website and the
dashboard answer from built-in demo data while `VITE_API_MOCK` /
`VITE_ADMIN_MOCK` are not `"false"` (see `.env.example`).

1. Set `VITE_API_BASE_URL` in a `.env` file.
2. Set `VITE_API_MOCK=false` (website) and `VITE_ADMIN_MOCK=false` (dashboard).
3. The backend contract is in [docs/admin-api.md](docs/admin-api.md). The
   frontend does **not** match it yet; see *Frontend changes still pending* in
   that file before connecting.

## Staff dashboard (`/admin`)
- Code in `src/admin/` (its own store, routes and translations, loaded only
  when `/admin` opens). Tabs and buttons follow the permissions the backend
  gives each staff member; no roles are hardcoded.
- Runs on mock services for now (`src/admin/api/mock*.js`); in development
  the login page offers demo accounts for each role.
- The API contract for release 1 is [docs/admin-api.md](docs/admin-api.md).
  The dashboard code still follows the previous contract in places (booking
  statuses, assignment, pricing, payments, fleet fields), so it is **not ready
  to connect** until the pending frontend changes listed there are done.

## Notes
- Car and blog photography are placeholders (SVG line art / icons) to avoid
  shipping copyrighted stock photos. Drop real images into `src/assets/` and pass
  their path as `image` / `heroImage` in the data files (or from the API) to swap
  them in — the components already render `<img>` when `image` is provided.
