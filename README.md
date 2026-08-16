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

# 2. Copy the environment file
cp .env.example .env

# 3. Start Postgres
#    Postgres runs on localhost:5434 to avoid clashes with other local Postgres instances.
docker compose up -d

# 4. Check that Postgres is ready
docker compose exec db pg_isready -U hotel -d hotel

# 5. Generate the Prisma Client
npx prisma generate

# 6. Apply the database migrations
npx prisma migrate deploy

# 7. Seed the database
#    Adds sample rooms, admin accounts, demo bookings and reviews.
npm run db:seed

# 8. Start the development server
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

- **Guest capacity is per room**, The single room allows 1 guest, while the double room and suite allow up to 2.
- **"Manage booking" and "Add review" share one confirmation-code flow** — Both features require the booking confirmation code, so they use the same /booking/[code] page. The review form is shown when the booking becomes eligible for a review.
- **"Each day of the booking" = each night of the stay** 
This includes the check-in date but not the check-out date. Dinner is off by default for every night, and guests can turn it on or off at any time before checkout.
- **A cancelled booking is excluded entirely** 
They are not included in dinner preparation, and their dates become available for new bookings immediately.
- **Reviews**: A review can only be left after the guest has checked out, and cancelled bookings cannot be reviewed.
- **Only One Admin Role Exists** 
Any authenticated admin has full access
- **Room availability** 
The system checks for overlapping bookings inside a database transaction and checks again immediately before creating the booking. This helps prevent two guests from booking the same room at the same time.

## Architecture notes

- **Real REST API** under `app/api/**` (not Server Actions) — see the full list below.
  Public pages call it via `fetch`; admin pages are Server Components that call the
  same `lib/` functions directly, skipping a pointless round-trip to our own API for
  server-rendered reads. Every route returns the same `{ error: string }` shape on
  failure.
- **Auth**: hand-rolled JWT-in-a-cookie session (`lib/session.ts`), no auth library.
  The cookie is `httpOnly` and verified server-side by `middleware.ts` before any
  `/admin/**` page or `/api/admin/**` route responds.

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

## Testing

There are currently no automated tests included.

Given the time available for the project, I prioritised the core functionality and verified the application manually, including the main booking, cancellation, dinner, review, and admin workflows.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Headless UI ·
Prisma 7 + Postgres · `jsonwebtoken` + `bcryptjs` for auth
