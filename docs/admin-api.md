# ESM Limo dashboard — API contract

What the staff dashboard (`/admin`, code in `src/admin/`) expects from the
backend. Every screen already works against mock services that follow this
contract exactly (`src/admin/api/mock*.js`).

## Connecting the backend

The dashboard is ready to connect; nothing in the screens has to change.

1. Build the endpoints below (and the invitation flow, see *Auth*).
2. In `.env` set `VITE_API_BASE_URL` to the API's address and
   `VITE_ADMIN_MOCK=false`, then restart the dev server (or rebuild).
3. Every screen and the staff sign-in now call the API instead of the mocks.
   The sign-in page also stops offering the demo accounts.

How it works: each endpoint in `src/admin/api/*Api.js` is declared once with
both its `mock` call and its real `query` (the URL, method and body written
in this document); `VITE_ADMIN_MOCK` (`src/admin/api/config.js`) picks which
one runs. The sign-in, session check and sign-out
(`adminAuthService.js`) follow the same switch. To change what a request
sends, edit its `query`; to change an answer's shape, change it here, in the
mock and in the screen together.

A short checklist when connecting:

- **CORS:** the dashboard's origin must be allowed, with the `Authorization`
  header.
- **Empty filters are not sent.** `status=` never reaches the backend: a
  filter that is "off" is simply absent from the query string.
- **Errors** answer `{ "code": "..." }` (see *Errors*); the dashboard shows
  its own translated text for the codes it knows.
- **Read the signed-in user from the token**, never from the request: the
  mock needs an `actorId`, the backend does not.
- Check each permission on every request, not just in the dashboard.

## Conventions

- **Base URL:** `${VITE_API_BASE_URL}/admin` (see `src/api/apiClient.js`).
- **Format:** JSON in and out, except image uploads (multipart).
- **Auth:** every request except `POST /auth/login` sends
  `Authorization: Bearer <token>`.
- **Dates:** timestamps are ISO 8601 strings (`2026-10-12T14:30:00.000Z`);
  calendar dates are `YYYY-MM-DD`; times are `HH:mm`.
- **Bilingual text** is `{ "en": "...", "ar": "..." }`. English is required
  where the website needs the text; an empty Arabic value means "show the
  English" on the Arabic website.
- **Lists with pages** take `page` (from 1) and `pageSize`, and answer
  `{ items, total, page, pageSize, counts? }`. `counts` are the numbers for
  the screen's tabs, computed with the other filters applied.

### Errors

Any error answers with an HTTP status and a body carrying a code:

```json
{ "code": "EMAIL_TAKEN", "message": "Optional text for logs" }
```

The dashboard shows a translated message for the codes listed under each
endpoint and a generic one for anything else. Status meanings:

| Status | Meaning | Dashboard does |
| --- | --- | --- |
| 400 | Invalid input | Shows the error |
| 401 | Missing, invalid or expired token (`UNAUTHORIZED`) | Signs the user out |
| 403 | Signed in but not allowed (missing permission, or a rule below) | Shows the error |
| 404 | Not found (`NOT_FOUND`) | Shows "doesn't exist or was deleted" |
| 409 | Conflicts with current data (codes below) | Shows the error |

## Permissions

The dashboard never hardcodes roles. Each staff member has a role; each role
has a list of permission keys `"<resource>.<action>"`. The backend sends the
signed-in user's keys (login and `/auth/me`), and the dashboard only uses
them to show or hide tabs, pages and buttons. **The backend must check the
same permission on every request** and answer 403 when it's missing.

Full catalog (`GET /permissions` returns it so the Roles screen is built from it):

| Resource | Actions |
| --- | --- |
| `dashboard` | view |
| `bookings` | view, create, update, delete |
| `fleet` | view, create, update, delete |
| `messages` | view, update, delete |
| `blog` | view, create, update, delete |
| `comments` | view, update, delete |
| `content` | view, update |
| `customers` | view, update, delete |
| `staff` | view, create, update, delete |
| `roles` | view, create, update, delete |
| `settings` | view, update |

`dashboard.view` gives the Overview page; its numbers also need the
section's own view permission (e.g. booking numbers need `bookings.view`).

---

## Auth (staff)

| Method & path | Body | Answer |
| --- | --- | --- |
| `POST /auth/login` | `{ email, password }` | `{ token, user, permissions }` |
| `GET /auth/me` | — | `{ user, permissions }` |
| `POST /auth/logout` | — | `{ success: true }` (revokes the token) |

`user`: `{ id, name, email, role: { id, name } }` · `permissions`: `["bookings.view", ...]`

Login errors: `INVALID_CREDENTIALS` (401), `ACCOUNT_DISABLED` (403),
`INVITE_PENDING` (403, invited but hasn't set a password yet).
The dashboard calls `/auth/me` on every load, so a role change applies at
the next page load.

Also needed (outside the dashboard): the **invitation flow**. Inviting a
staff member emails them a one-time link to a "choose your password" page;
setting it turns their status from `invited` to `active`.

## Uploads

| Method & path | Body | Answer |
| --- | --- | --- |
| `POST /uploads` | multipart, field `file` | `{ url }` |

Images only (JPEG, PNG, WebP), up to 5 MB (the dashboard checks too).
Used by the fleet, blog, offer banner and partner logos.

## Bookings — `bookings.*`

```jsonc
{
  "id": "1042", "reference": "ESM-1042", "createdAt": "…",
  "service": "pointToPoint" | "hourly" | "airportTransfer" | "cityTour"
           | "carReservation"   // "Reserve" on a car's page
           | "quickRequest",    // the short form on the home page
  "status": "new" | "confirmed" | "completed" | "cancelled",
  "customer": { "name", "email", "phone" },
  "pickup":  { "location", "date", "time" },
  "dropOff": { "location", "date", "time" },      // any may be ""
  "car": { "id", "name" } | null, "carType": "businessClass" | …, "passengers": "3",
  "details": { … },   // per service: hours, stops[], transferType, airport,
                      // flightNumber, duration, places, bookingDuration
  "notes": ""
}
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /bookings?page&pageSize&status&service&q&from&to` | view | Newest first. `q` searches reference, name, email, phone. `from`/`to` filter the pickup date (inclusive). `counts`: `{ all, new, confirmed, completed, cancelled }` |
| `GET /bookings/stats` | view | `{ todayPickups, newRequests, nextSevenDays, receivedThisMonth, receivedLastMonth, upcoming: [booking ×6], byService: [{ service, count }] }`. "Today" is Dubai time. `receivedLastMonth` is the whole previous month (the Overview compares it with `receivedThisMonth`). `byService` covers the last 30 days |
| `GET /bookings/:id` | view | |
| `PATCH /bookings/:id` | update | `{ status }` |
| `DELETE /bookings/:id` | delete | |

## Fleet — `fleet.*`

```jsonc
// car
{ "id", "name", "categoryId", "published": true,
  "image": "url" | null, "interiorImages": ["url", …],   // up to 5
  "pricePerHour": 200, "passengers": 4, "luggage": 2, "modelYear": 2025,
  "fuel": "petrol" | "hybrid" | "electric",
  "features": ["wifi", "fuel", "model", "passengers", "luggage", "climate"],
  "description": { "en": "", "ar": "" },   // empty = the site's shared text
  "rating": 4, "reviewsCount": 50 }        // read-only
// category
{ "id", "name": { "en", "ar" }, "carCount": 4 }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /fleet/cars?category&q` | view | `{ items }` |
| `GET /fleet/cars/:id` | view | |
| `POST /fleet/cars` | create | The id (URL slug) is made from the name |
| `PATCH /fleet/cars/:id` | update | Any car fields, e.g. `{ published }` |
| `DELETE /fleet/cars/:id` | delete | |
| `GET /fleet/categories` | view | |
| `POST /fleet/categories` | create | `{ name: { en, ar } }` |
| `PATCH /fleet/categories/:id` | update | `{ name }` |
| `DELETE /fleet/categories/:id` | delete | 409 `CATEGORY_NOT_EMPTY` while it has cars |

Only `published` cars may appear on the public website.

## Messages (Contact Us) — `messages.*`

```jsonc
{ "id", "createdAt", "name", "email", "phone", "subject", "message",
  "read": false, "replied": false, "archived": false }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /messages?view&q&page&pageSize` | view | `view`: `""` (inbox = not archived), `unread`, `archived`. `counts`: `{ inbox, unread, archived }` |
| `GET /messages/stats` | view | `{ unread, latestUnread: [message ×3] }` (polled every minute) |
| `GET /messages/:id` | view | |
| `PATCH /messages/:id` | update | `{ read?, replied?, archived? }`. The dashboard sets `read: true` when a message is opened |
| `DELETE /messages/:id` | delete | |

## Blog — `blog.*`

```jsonc
{ "id": "my-post",               // URL slug, fixed once created
  "status": "published" | "draft", "publishedAt": "2026-10-12", "author": "ESM Limo",
  "image": "url" | null,          // blog card photo
  "heroImage": "url" | null,      // post header photo (card photo if empty)
  "content": {
    "en": { "title", "excerpt", "titleAccents": ["words"],
            "sections": [{ "heading", "accents": ["words"], "body" }] },
    "ar": { … same; empty fields fall back to English }
  },
  "updatedAt", "commentCount" }   // approved + pending
```

`titleAccents` / `accents` are words shown in teal. A `\n` in a title is a line break.

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /blog/posts?status&q` | view | Most recently updated first. `counts`: `{ all, published, draft }` |
| `GET /blog/posts/:id` | view | |
| `POST /blog/posts` | create | Optional `id`; otherwise made from the English title. 409 `SLUG_TAKEN` |
| `PATCH /blog/posts/:id` | update | Publishing without `publishedAt` uses today |
| `DELETE /blog/posts/:id` | delete | Deletes its comments too |

Only `published` posts may appear on the public website.

## Comments — `comments.*`

```jsonc
{ "id", "postId", "postTitle", "name", "email", "website", "comment", "createdAt",
  "status": "pending" | "approved" | "spam" }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /comments?status&q&post&page&pageSize` | view | `status` defaults to `pending`. `counts`: `{ pending, approved, spam }` |
| `GET /comments/stats` | view | `{ pending }` (polled every minute) |
| `POST /comments/bulk` | update / delete | `{ ids: [...], action: "approve" \| "pending" \| "spam" \| "delete" }` → `{ updated }`. `delete` needs `comments.delete` |

New comments from the website start as `pending`; only `approved` ones may
be shown publicly. The `website` field comes from a public form: the
backend should only store `http(s)://` addresses (the dashboard only links those).

## Customers — `customers.*`

```jsonc
{ "id", "name", "email", "phone", "photo": "url" | null, "emailVerified": true,
  "status": "active" | "blocked", "createdAt", "lastLoginAt",
  "bookings": { "total", "upcoming", "completed", "cancelled" } }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /customers?q&status&page&pageSize` | view | Newest first. `counts`: `{ all, active, blocked }` |
| `GET /customers/:id` | view | A customer's bookings are fetched with `GET /bookings?q=<email>` |
| `PATCH /customers/:id` | update | `{ status }`. Blocked accounts can't sign in to the website |
| `DELETE /customers/:id` | delete | Removes the account; their bookings stay |

## Staff — `staff.*`

```jsonc
{ "id", "name", "email", "role": { "id", "name" },
  "status": "active" | "invited" | "disabled", "createdAt", "lastLoginAt" }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /staff?q&roleId&status` | view | `{ items, counts }`. `counts`: `{ all, active, invited, disabled }`, computed with `q` and `roleId` applied but not `status` (they're the status tabs' numbers) |
| `POST /staff` | create | `{ name, email, roleId }` → creates an `invited` account and emails the invitation. 409 `EMAIL_TAKEN` |
| `PATCH /staff/:id` | update | `{ name?, roleId?, status? ("active" \| "disabled") }` |
| `POST /staff/:id/resend-invite` | update | 409 `NOT_INVITED` if already active |
| `DELETE /staff/:id` | delete | |

**Rule:** nobody may change their own role or status, or delete their own
account — 403 `CANNOT_CHANGE_SELF`. Disabled staff can't sign in, and their
existing tokens stop working.

## Roles — `roles.*`

```jsonc
{ "id", "name", "description", "system": false,
  "permissions": ["bookings.view", …], "staffCount": 2 }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /permissions` | roles.view | The catalog: `[{ resource, actions: [...] }]` |
| `GET /roles` | view | |
| `GET /roles/:id` | view | |
| `POST /roles` | create | `{ name, description, permissions }`. 409 `NAME_TAKEN` |
| `PATCH /roles/:id` | update | Same fields. 403 `SYSTEM_ROLE`, 409 `NAME_TAKEN` |
| `DELETE /roles/:id` | delete | 403 `SYSTEM_ROLE`, 409 `ROLE_IN_USE` while staff have it |

**Rules:** "Super Admin" is a `system` role with every permission; it can't
be edited or deleted. A role with `create`, `update` or `delete` on a
resource should also have `view` on it (the dashboard enforces this when
editing; the backend may too).

## Settings — `settings.*`

```jsonc
{ "contact": { "phone", "secondaryPhone", "whatsapp", "email",
               "address": { "en", "ar" }, "hours": { "en", "ar" } },
  "socials": { "instagram", "facebook", "linkedin", "twitter" },   // "" = hidden
  "notifications": { "email", "newBooking": true, "newMessage": true, "newComment": false },
  "updatedAt" }
```

| Method & path | Permission | Notes |
| --- | --- | --- |
| `GET /settings` | view | |
| `PATCH /settings` | update | Any of `contact`, `socials`, `notifications` (each sent whole) |

The backend sends the alert emails to `notifications.email` for the
switched-on events. The public website reads `contact` and `socials`.

## Site content — `content.*`

Each block is read and saved whole, by key:

| Method & path | Permission |
| --- | --- |
| `GET /content/:key` | view |
| `PUT /content/:key` | update |

| Key | Shape (all texts `{ en, ar }`) |
| --- | --- |
| `faq` | `{ items: [{ id, question, answer }] }` |
| `promo` | `{ enabled, eyebrow, heading, headingAccent, description, cta, image }` — `headingAccent` is part of `heading` shown in teal |
| `partners` | `{ items: [{ id, name, logo, url }] }` — `url` optional |
| `terms`, `privacy`, `disclaimer` | `{ title, intro, sections: [{ id, heading, body }] }` — paragraphs in `body` are separated by an empty line |

New list items arrive without an `id`; the backend assigns one. Every
answer includes `updatedAt`. The public website reads these blocks instead
of its built-in texts.
