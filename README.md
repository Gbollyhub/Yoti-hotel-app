# Yoti Hotel

A small hotel booking app: a public site for booking a room, managing a booking, and
leaving a review, plus an authenticated internal tool for the hotel staff. Built with
Next.js (App Router), Prisma, and Postgres.

## Prerequisites

- **Node 22**
- **Docker** (for Postgres via `docker-compose.yml`) — or any Postgres instance you
  point `DATABASE_URL` at instead

## Install and run

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres (runs on localhost:5433, not the default 5432 —
#    picked to avoid clashing with a Postgres you might already have running)
docker compose up -d

# 3. Copy the env file (already points at the docker-compose database)
cp .env.example .env

# 4. Apply the database schema
npx prisma migrate deploy

# 5. Seed sample data (rooms, admin accounts, demo bookings/reviews — see below)
npm run db:seed

# 6. Start the dev server
npm run dev
```

To stop and remove the database container: `docker compose down` (add `-v` to also
wipe its data volume).

## Using the app

### As a guest (public site, no login)

- **Book a room** — `/book`. Pick a date range, pick from the rooms available for
  those dates, choose 1 or 2 guests, enter your name and email, confirm. You'll get an
  8-character confirmation code (e.g. `KX3QPZ7H`) — save it.
- **Manage a booking** — `/booking/manage`. Enter your confirmation code to see the
  booking, cancel it, or toggle whether you want dinner on each night of your stay.
- **Leave a review** — on that same booking page. The rating/comment form is always
  visible once the booking hasn't been reviewed yet, but stays disabled with an
  explanatory note until the stay has actually ended.

Try it against the seeded data (below) without creating your own booking first, e.g.
open `/booking/DINNER01` or `/booking/REVIEWME` directly.

### As hotel staff (admin)

- Go to `/admin/login` (also linked, discreetly, in the public site's footer).
- Sign in with a seeded admin account (below).
- **Overview** — active booking count, dinners due today/tomorrow.
- **Bookings** — every booking, and a detail page per booking with a cancel action.
- **Dinners** — who needs dinner tonight and tomorrow, by room.
- **Reviews** — every review, filterable by date range and sortable by
  latest/best/worst.

### Seeded demo data

`npm run db:seed` (or `npx prisma db seed`) resets the database to:

**3 rooms** — Harbor Single (1 guest), Garden Double (2 guests), Rooftop Suite (2 guests).

**2 admin accounts** — `admin@yoti-hotel.com` and `manager@yoti-hotel.com`, both with
password `admin1234`.


## Business rules that weren't fully specified in the brief

Documented here, as decisions made rather than gaps:

- **Guest capacity is per room**, not a flat 1–2 for every room: the single room holds
  1 guest, the double and suite hold up to 2.
- **"Manage booking" and "Add review" share one confirmation-code flow** — the public
  brief lists them as separate features, but both need the same code lookup, so they
  live on the same `/booking/[code]` page. The review form just appears once eligible.
- **"Each day of the booking" = each night of the stay** (check-in inclusive,
  check-out exclusive). Dinner defaults to off for every night; guests toggle it on,
  and can keep changing it any time before checkout.
- **A cancelled booking is excluded entirely** — no dinner prep counted for it, and its
  dates immediately become available for others to book.
- **Reviews**: one per booking, only after the stay's checkout date has passed, and
  never for a cancelled booking.
- **Admin accounts are a single flat role** — any authenticated admin can do
  everything (matches "single permissions, everyone is admin" in the brief). There's
  no room-management UI; rooms are seed data only, since there are only 3 "for now"
  and the brief doesn't ask for it.
- **Room availability** is enforced with an application-level overlap check inside a
  database transaction at booking-creation time (re-checked right before the write, so
  two people can't double-book the same room in a race). 

## Architecture notes

- **Real REST API** under `app/api/**` (not Server Actions) — see the full list below.
  Public pages call it via `fetch`; admin pages are Server Components that call the
  same `lib/` functions directly, skipping a pointless round-trip to our own API for
  server-rendered reads. Every route returns the same `{ error: string }` shape on
  failure.
- **Auth**: hand-rolled JWT-in-a-cookie session (`lib/session.ts`), no auth library.
  The cookie is `httpOnly` and verified server-side by `middleware.ts` before any
  `/admin/**` page or `/api/admin/**` route responds.
- **No automated tests** — a deliberate scope trade-off given the time box. Verified
  manually and with ad hoc headless-browser scripts throughout development instead;
  see the git history for what was checked at each step.

### API endpoints

Public:

| Method | Path | |
| --- | --- | --- |
| GET | `/api/availability?checkIn=&checkOut=` | Rooms free for a date range |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/[code]` | Booking details |
| DELETE | `/api/bookings/[code]` | Cancel a booking |
| PATCH | `/api/bookings/[code]/dinners` | Set dinner nights |
| POST | `/api/reviews` | Add a review |

Admin (all require the session cookie — sign in via the endpoint below first):

| Method | Path | |
| --- | --- | --- |
| POST | `/api/admin/login` | Sign in, sets the session cookie |
| POST | `/api/admin/logout` | Clear the session cookie |
| GET | `/api/admin/bookings` | List every booking |
| GET | `/api/admin/bookings/[id]` | Booking details, by id |
| DELETE | `/api/admin/bookings/[id]` | Cancel a booking, by id |
| GET | `/api/admin/dinners?date=` | Dinner prep list for a date (defaults to today) |
| GET | `/api/admin/reviews?from=&to=&sort=` | Reviews, filtered and sorted (`latest`/`best`/`worst`) |

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Headless UI ·
Prisma 7 + Postgres · `jsonwebtoken` + `bcryptjs` for auth
