# ESM Limo — API contract, release 1

What the backend (Laravel) must provide for the first release: the public
website (`src/`) and the staff dashboard (`/admin`, code in `src/admin/`).

**Status: target contract.** It follows the decisions in the project's
requirements document. The dashboard and website code still follow the
*previous* version of this file in the places listed under *Frontend changes
still pending* at the end; until those are done the two will not match. The
previous version (blog, comments, site content, roles screens, mock-aligned
bookings) is in git history.

## Release 1 in one paragraph

Chauffeur-driven rides in Dubai for individual customers. A customer with a
verified email account picks a service and a time, sees the price, and sends a
**booking request**. Staff review it, confirm or reject it, assign a car (each
car has its own driver), and email the customer from a template. The customer
pays **at the ride**, cash or card; staff record what was collected. **Nothing
happens automatically** except: computing the price, and sending the email
verification code. No online payment, no automatic confirmation, no automatic
assignment, no WhatsApp.

## Notes for the Laravel developer

Suggestions, not requirements; the developer decides.

- **Auth:** Sanctum personal access tokens (`Authorization: Bearer <token>`)
  fit the dashboard and the website. Customers and staff are separate user
  types (separate tables or a `type` column) with separate token abilities.
- **Permissions:** gates or policies keyed by the permission strings below.
- **Mail:** the verification code and the staff-triggered template emails
  (queued mail). Customer language (`ar` or `en`) picks the template language.
- **Time zone:** `Asia/Dubai` for "today", the overdue-request highlight in
  the dashboard, and availability. Store timestamps in UTC, send ISO 8601.
- **Money:** AED. Store `decimal(10,2)`; the API sends numbers with up to two
  decimals. The displayed price includes VAT (rate in settings, to be
  confirmed with the accountant).
- **Distance:** point-to-point prices need a route distance from a maps
  provider (not chosen yet), computed on the server.

## Conventions

- **Base URLs:** public website `${VITE_API_BASE_URL}`; dashboard
  `${VITE_API_BASE_URL}/admin` (see `src/api/apiClient.js`).
- **Format:** JSON in and out, except image uploads (multipart).
- **Auth:** public endpoints marked *auth* and every dashboard endpoint except
  `POST /admin/auth/login` send `Authorization: Bearer <token>`.
- **Dates:** timestamps ISO 8601 (`2026-10-12T14:30:00.000Z`); calendar dates
  `YYYY-MM-DD`; times `HH:mm` (Dubai local time).
- **Bilingual text** is `{ "en": "...", "ar": "..." }`; an empty Arabic value
  means "show the English".
- **Lists with pages** take `page` (from 1) and `pageSize`, and answer
  `{ items, total, page, pageSize, counts? }`. `counts` are the numbers for the
  screen's tabs, computed with the other filters applied.
- **Empty filters are not sent**; a filter that is "off" is absent.

### Errors

Any error answers an HTTP status and `{ "code": "...", "message"?: "..." }`.
Validation errors (422) add `"fields": { "<field>": ["<code>", ...] }`; use
codes, not translated sentences (the frontends translate).

| Status | Meaning | Frontend does |
| --- | --- | --- |
| 401 | Missing, invalid or expired token (`UNAUTHORIZED`) | Signs the user out |
| 403 | Not allowed (missing permission, `ACCOUNT_BLOCKED`, `EMAIL_NOT_VERIFIED`) | Shows the error |
| 404 | `NOT_FOUND` | Shows "doesn't exist" |
| 409 | Conflicts with current data (codes per endpoint) | Shows the error |
| 422 | `VALIDATION` | Shows field errors |

## Permissions (dashboard)

Two fixed roles in release 1 (no role editor): **manager** (every permission)
and **staff** (those marked in the last column). The backend sends the
signed-in user's keys with login and `/auth/me`; the dashboard only uses them
to show or hide pages and buttons. **The backend must check the same
permission on every request.**

| Resource | Actions | Staff role gets |
| --- | --- | --- |
| `dashboard` | view | view |
| `bookings` | view, update | view, update |
| `fleet` | view, create, update, delete | view |
| `pricing` | view, update | view |
| `templates` | view, update | view |
| `customers` | view, update | view, update |
| `staff` | view, create, update, delete | — |
| `settings` | view, update | — |

`GET /admin/permissions` and role CRUD are **not** part of release 1.

---

# Public API (the website)

## Account (customers)

| Method & path | Body | Answer |
| --- | --- | --- |
| `POST /auth/signup` | `{ email, password }` | `{ success: true }`; sends a 6-digit code to the email. 409 `EMAIL_TAKEN` |
| `POST /auth/verify-email` | `{ email, code }` | `{ token, user }` (signed in). 422 `INVALID_CODE` |
| `POST /auth/resend-code` | `{ email }` | `{ success: true }` (rate limit it) |
| `POST /auth/login` | `{ email, password }` | `{ token, user }`. 401 `INVALID_CREDENTIALS`, 403 `EMAIL_NOT_VERIFIED` |
| `POST /auth/logout` | — | `{ success: true }` |
| `GET /me` *(auth)* | — | `user` |
| `PUT /me` *(auth)* | `{ name, phone, photo }` | `user` |

`user`: `{ id, email, name, phone, photo, emailVerified, status: "active" | "blocked" }`.
A **phone number is required before a booking can be sent** (collected at
sign-up or in the profile — decision pending). A **blocked** customer cannot
send bookings (403 `ACCOUNT_BLOCKED`).

## Fleet (public)

| Method & path | Answer |
| --- | --- |
| `GET /fleet` | `[{ id, name, cars: [car] }]` — categories with their **published** cars |
| `GET /fleet/:carId` | `car` (404 unless published) |

Public `car`: `{ id, name, categoryId, image, interiorImages, passengers, luggage, modelYear, fuel, features, description }`.
Plate and driver are never public. There is no price on the car any more (see
*Pricing*).

## Price quote

`POST /quotes` — computes the price the customer sees **before** sending the
request. No auth needed. Body = the same fields as a booking (below, without
the customer). Answer:

```jsonc
{ "price": { "currency": "AED", "total": 350.00,
             "breakdown": [{ "label": "Airport transfer, SUV", "amount": 350.00 }] },
  "validUntil": "2026-10-12T15:00:00.000Z" }
```

Errors: 422 `NO_PRICE` (no price defined for this route/category: the website
tells the customer to contact the company), 422 `VALIDATION`.

## Booking request

`POST /bookings` *(auth: verified, not blocked, has phone)*. Body:

```jsonc
{
  "type": "airport" | "pointToPoint" | "hourly" | "cityTour" | "intercity" | "period",
  "categoryId": "limousine",
  "passengers": 3,
  "pickup":  { "location": "Dubai Marina", "date": "2026-10-15", "time": "10:00" },
  "dropOff": { "location": "DXB Terminal 3" },
  "returnTrip": null | { "pickup": { "location", "date", "time" }, "dropOff": { "location" } },
  "details": { },          // per type, see below
  "notes": "",
  "quotedTotal": 350.00    // what the customer saw
}
```

`details` per type: `airport` → `{ direction: "toAirport"|"fromAirport", airport, flightNumber }`;
`hourly` → `{ hours, stops: ["…"] }`; `cityTour` → `{ city, hours, places }`;
`intercity` → `{ toCity }`; `period` → `{ unit: "day"|"week"|"month", count }`;
`pointToPoint` → `{}`.
**Required for every type:** `type`, `categoryId`, `passengers`, `pickup.location`,
`pickup.date`, `pickup.time`. The pick-up must be in the future.

The server **recomputes the price**. If it differs from `quotedTotal` → 409
`PRICE_CHANGED` with the new quote, and nothing is saved. Otherwise
201 `{ id, reference: "ESM-1042", status: "new", price }`. The website only
shows a "request received" screen; **no email is sent** at this point.

## Contact form

`POST /contact-messages` — unchanged from the website's current form
(`name`, `email`, `phone`, `subject`, `message`).

---

# Dashboard API (`/admin`)

## Auth (staff)

| Method & path | Body | Answer |
| --- | --- | --- |
| `POST /auth/login` | `{ email, password }` | `{ token, user, permissions }` |
| `GET /auth/me` | — | `{ user, permissions }` |
| `POST /auth/logout` | — | `{ success: true }` (revokes the token) |

`user`: `{ id, name, email, role: { id, name } }`. Login errors:
`INVALID_CREDENTIALS` (401), `ACCOUNT_DISABLED` (403), `INVITE_PENDING` (403).
The dashboard calls `/auth/me` on every load. Also needed: the **invitation
flow** (inviting staff emails a one-time link to a "choose your password"
page; setting it turns `invited` into `active`).

## Uploads

`POST /uploads` — multipart field `file` → `{ url }`. JPEG, PNG, WebP, up to
5 MB. Used by fleet images.

## Bookings — `bookings.*`

```jsonc
{
  "id": "1042", "reference": "ESM-1042", "createdAt": "…",
  "type": "airport" | "pointToPoint" | "hourly" | "cityTour" | "intercity" | "period",
  "status": "new" | "confirmed" | "assigned" | "completed" | "noShow" | "cancelled" | "rejected",
  "customer": { "id", "name", "email", "phone" },
  "category": { "id", "name" },
  "passengers": 3,
  "pickup":  { "location", "date", "time" },
  "dropOff": { "location" },
  "returnTrip": null | { "pickup": { … }, "dropOff": { … } },
  "details": { },                       // as in the public booking body
  "customerNotes": "", "internalNotes": "",
  "car": null | { "id", "name", "plate", "driver": { "name", "phone" } },
  "price": { "currency": "AED", "total": 350.00,           // original quote + adjustments
             "breakdown": [{ "label", "amount" }],
             "adjustments": [{ "id", "label", "amount", "addedBy", "createdAt" }] },
  "payment": { "status": "unpaid" | "paid", "amount": null, "method": null | "cash" | "card",
               "collectedAt": null, "collectedBy": null },
  "closing": null | { "by": "customer" | "company", "reason": "" }   // cancelled / rejected
}
```

### Status flow

`new → confirmed → assigned → completed`; `new → rejected`;
`new | confirmed | assigned → cancelled`; `assigned → noShow`.
Any other transition → 409 `INVALID_TRANSITION`. (Staff may confirm and assign
in one go: `new → assigned` through `assign` is allowed, passing through
`confirmed` implicitly.)

### Endpoints

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /bookings?page&pageSize&status&type&q&from&to` | view | Newest first. `q` searches reference, name, email, phone. `from`/`to` filter the pick-up date (inclusive). `counts`: `{ all, new, confirmed, assigned, completed, noShow, cancelled, rejected }` |
| `GET /bookings/stats` | view | `{ newRequests, overdueNew, next24h, todayPickups }`. `overdueNew` = status `new` for longer than `settings.overdueNewHours` |
| `GET /bookings/:id` | view | |
| `PATCH /bookings/:id` | update | Edit `pickup`, `dropOff`, `returnTrip`, `passengers`, `categoryId`, `details`, `internalNotes`. Re-checks conflicts on the assigned car (answers `warnings`) |
| `POST /bookings/:id/adjustments` | update | `{ label, amount }` (amount may be negative). Adds a price line; never edits the original quote |
| `POST /bookings/:id/confirm` | update | `new → confirmed` |
| `POST /bookings/:id/reject` | update | `{ reason }`. `new → rejected` |
| `POST /bookings/:id/assign` | update | `{ carId }`. `confirmed → assigned` (the car's driver is the driver). Answers the booking plus `warnings: [{ code: "CAR_CONFLICT", bookingId }]`. **Conflicts warn, they never block.** 409 `CAR_UNAVAILABLE` only if the car is in maintenance |
| `POST /bookings/:id/cancel` | update | `{ by: "customer" \| "company", reason }` |
| `POST /bookings/:id/complete` | update | `{ amount, method: "cash" \| "card" }`. `assigned → completed`, records the payment |
| `POST /bookings/:id/no-show` | update | `assigned → noShow` **and blocks the customer** (`blockReason: "no_show"`) |
| `POST /bookings/:id/email` | update | `{ templateKey }`. Sends that template to the customer, in the customer's language. 422 `UNKNOWN_TEMPLATE`. Sent only when staff ask |
| `GET /fleet/cars/:id/bookings?from&to` | view | Bookings (assigned/confirmed) of a car in a date range, for the staff to check availability |

**Conflict rule:** a car conflicts with a booking when an `assigned` or
`confirmed` booking of the same car, or a maintenance block, overlaps the
requested slot **plus a buffer** after it (`settings.bufferCityMinutes` after
city rides, `settings.bufferLongMinutes` after airport and intercity rides).
The duration of a ride is estimated from its type and details; periods block
the whole span.

## Fleet — `fleet.*`

```jsonc
// car (one per physical vehicle)
{ "id", "name", "categoryId", "published": true,
  "status": "active" | "maintenance",
  "plate": "", "modelYear": 2025, "passengers": 4, "luggage": 2,
  "fuel": "petrol" | "hybrid" | "electric",
  "image": "url" | null, "interiorImages": ["url", …],
  "features": ["wifi", …], "description": { "en": "", "ar": "" },
  "driver": { "name": "", "phone": "" } }
// category
{ "id", "name": { "en", "ar" }, "carCount": 2 }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /fleet/cars?category&q` | view | `{ items }` |
| `GET /fleet/cars/:id` | view | |
| `POST /fleet/cars` | create | Id (slug) made from the name |
| `PATCH /fleet/cars/:id` | update | Any car field, e.g. `{ status: "maintenance" }` |
| `DELETE /fleet/cars/:id` | delete | 409 `CAR_HAS_BOOKINGS` if it has upcoming assigned bookings |
| `GET /fleet/categories` | view | |
| `POST /fleet/categories` | create | `{ name: { en, ar } }` |
| `PATCH /fleet/categories/:id` | update | `{ name }` |
| `DELETE /fleet/categories/:id` | delete | 409 `CATEGORY_NOT_EMPTY` while it has cars |

Only `published` cars (and `status: "active"` ones for assignment) appear on the
website / in the assign list. The `pricePerHour` field of the previous
contract is **removed**.

## Pricing — `pricing.*`

Prices are data, edited by the manager; the numbers are **not decided yet**.

```jsonc
// per category
{ "categoryId", "openingFee", "perKm", "minimum",
  "perHour", "minHours", "perDay", "perWeek", "perMonth",
  "waitingPerMinute" }
// fixed route (airport transfers and intercity)
{ "id", "type": "airport" | "intercity", "from", "to", "categoryId", "price" }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /pricing` | view | `{ categories: [...], routes: [...] }` |
| `PUT /pricing/categories/:categoryId` | update | The whole object |
| `POST /pricing/routes`, `PATCH /pricing/routes/:id`, `DELETE /pricing/routes/:id` | update | |

**How the quote is computed (proposed):**

- `airport`, `intercity`: the fixed route price for (`from`, `to`, category);
  none defined → 422 `NO_PRICE`.
- `pointToPoint`: `max(minimum, openingFee + perKm × distanceKm)`.
- `hourly`: `perHour × max(hours, minHours)`.
- `cityTour`: `perHour × hours` (a package price may replace this: open).
- `period`: `perDay | perWeek | perMonth × count` (daily hour/km limits: open).
- `returnTrip`: the sum of both legs.
- Extras at the ride (waiting beyond the free time, extra stops, route
  changes) are **not** in the quote; staff add them as price adjustments.
- A quote is valid for `settings.quoteValidMinutes`.

## Email templates — `templates.*`

Keys: `confirmation`, `rejection`, `cancellation`, `delay`. Placeholders:
`{customerName}`, `{reference}`, `{pickupDate}`, `{pickupTime}`,
`{pickupLocation}`, `{carName}`, `{driverName}`, `{driverPhone}`, `{total}`.

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /email-templates` | view | `[{ key, subject: { en, ar }, body: { en, ar } }]` |
| `PUT /email-templates/:key` | update | `{ subject, body }` |

## Customers — `customers.*`

```jsonc
{ "id", "name", "email", "phone", "emailVerified": true,
  "status": "active" | "blocked", "blockReason": null | "no_show" | "manual",
  "createdAt", "bookings": { "total", "upcoming", "completed", "cancelled", "noShow" } }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /customers?q&status&page&pageSize` | view | `counts`: `{ all, active, blocked }` |
| `GET /customers/:id` | view | A customer's bookings: `GET /bookings?q=<email>` |
| `PATCH /customers/:id` | update | `{ status, blockReason? }`. Blocked customers cannot send bookings |

Blocking: a no-show blocks automatically (see `no-show` above); staff can
unblock. Who may unblock: open.

## Staff — `staff.*`

```jsonc
{ "id", "name", "email", "role": { "id", "name" },
  "status": "active" | "invited" | "disabled", "createdAt", "lastLoginAt" }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /staff?q&status` | view | `{ items, counts }` |
| `POST /staff` | create | `{ name, email, role: "manager" \| "staff" }` → creates an `invited` account and emails the invitation. 409 `EMAIL_TAKEN` |
| `PATCH /staff/:id` | update | `{ name?, role?, status? ("active" \| "disabled") }` |
| `POST /staff/:id/resend-invite` | update | 409 `NOT_INVITED` if already active |
| `DELETE /staff/:id` | delete | |

Nobody may change their own role or status, or delete their own account →
403 `CANNOT_CHANGE_SELF`. Disabled staff cannot sign in and their tokens stop
working.

## Settings — `settings.*`

```jsonc
{ "contact": { "phone", "secondaryPhone", "whatsapp", "email",
               "address": { "en", "ar" }, "hours": { "en", "ar" } },
  "socials": { "instagram", "facebook", "linkedin", "twitter" },
  "booking": { "bufferCityMinutes": 30, "bufferLongMinutes": 60,
               "overdueNewHours": 2, "quoteValidMinutes": 30,
               "vatPercent": 5 },
  "updatedAt" }
```

`GET /settings`, `PATCH /settings` (each group sent whole). The public website
reads `contact` and `socials` (an unauthenticated `GET /settings/public`).
The values under `booking` are **proposals** to be confirmed (buffers and the
2 hours are suggestions; `vatPercent` must be confirmed with the accountant).

---

## Not in release 1

Blog, blog comments, editable site content (FAQ, promo, partners, legal
pages), contact-message inbox, role editor, online payment, WhatsApp,
automatic confirmation or assignment, ratings, complaints, damages and fines,
reports, company accounts and monthly invoices, customer "my bookings" page.
Their previous contracts are in git history; the website and dashboard code
for them stays in the repository, unused by this release.

## Frontend changes still pending

These parts of the code follow the previous contract and will be changed to
match this file:

- **Website:** booking forms send flat, per-form fields and guests may book;
  they must call `POST /quotes`, show the price, require a verified account,
  and send the shape above to `POST /bookings`. The quick-book car dropdowns
  are hard-coded and must come from `GET /fleet`.
- **Dashboard:** booking statuses, the booking details screen (no price,
  payment, assignment or editing yet), the fleet form (`pricePerHour`, no
  plate/driver/maintenance), and new screens for pricing, email templates and
  collecting a payment. The roles screens and the blog/comments/content tabs
  are hidden for release 1.

## Open items for the backend developer

- Maps provider and how the distance is computed.
- Email provider (verification code, invitations, template emails).
- Estimated ride durations used by the conflict rule.
- Whether a missing route price returns `NO_PRICE` or falls back to a manual
  quote.
- Where the customer's phone is collected (sign-up or profile).
- Real values for every price, buffer and setting above.
