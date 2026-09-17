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
1. Set `VITE_API_BASE_URL` in a `.env` file.
2. In each `src/api/*Service.js` file, uncomment the `apiRequest(...)` line and
   remove the static fallback import/return.
3. Components already call these service functions through `useEffect`, so no
   further changes are needed once the service functions return live data.

## Notes
- Car and blog photography are placeholders (SVG line art / icons) to avoid
  shipping copyrighted stock photos. Drop real images into `src/assets/` and pass
  their path as `image` / `heroImage` in the data files (or from the API) to swap
  them in — the components already render `<img>` when `image` is provided.
