# UNC BIDYO Website

Marketing site and booking portal for UNC BIDYO, built with React, Vite, and
Tailwind CSS, backed by Supabase and EmailJS. Deployed on Vercel.

## Stack

- **React 18** + **Vite 5** — UI and build tooling
- **Tailwind CSS 3** — styling
- **Supabase** — Postgres database, Auth (used by the admin dashboard), and a
  Deno Edge Function for transactional email
- **EmailJS** — client-side email for the public booking form
- **Vercel** — hosting/deployment

## Getting started

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own values (see [Environment variables](#environment-variables)
below).

### Development

```bash
npm run dev
```

### Build / preview a production build

```bash
npm run build
npm run preview
```

### Lint and format

```bash
npm run lint          # ESLint
npm run format        # Prettier — writes changes
npm run format:check  # Prettier — check only, no writes
```

A Husky pre-commit hook runs ESLint + Prettier on staged files automatically.

## Environment variables

All variables are `VITE_`-prefixed and are bundled into the client — do not
put anything genuinely secret here (server-side secrets belong in Supabase
Edge Function config, not this file).

| Variable                        | Description                   |
| ------------------------------- | ----------------------------- |
| `VITE_EMAILJS_SERVICE_ID`       | EmailJS service ID            |
| `VITE_EMAILJS_TEMPLATE_ID`      | EmailJS template ID           |
| `VITE_EMAILJS_PUBLIC_KEY`       | EmailJS public key            |
| `VITE_SUPABASE_URL`             | Supabase project URL          |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |

Get the EmailJS values from the [EmailJS dashboard](https://dashboard.emailjs.com)
and the Supabase values from your project's API settings.

## Project structure

```
src/
├── App.jsx                 # Root layout + manual "/admin" route switch
├── components/              # Public-site sections (Navbar, Hero, About, ...)
│   └── skeletons/            # Loading-state placeholders
├── context/                  # React context providers (modals)
├── data/                     # Static content arrays (offers, team, highlights)
├── pages/                     # Admin portal (login, dashboard)
├── utils/                     # Small helpers (image preloading)
└── supabaseClient.js          # Supabase client init

supabase/functions/send-booking-email/  # Deno Edge Function, sends booking
                                          # confirmation email via Resend
```

## Admin portal

Visiting `/admin` renders the admin login/dashboard instead of the public
site (handled manually in `App.jsx` via `window.location.pathname`, not a
router library). Access to booking data beyond the login gate is enforced by
Supabase **Row-Level Security policies** on the `booking_form` table — make
sure those are configured correctly in the Supabase dashboard, since the
client only ever uses the public anon key.

## Deployment

The site deploys to Vercel on push (see `vercel.json` for the SPA rewrite
rule). Set the environment variables above in the Vercel project settings as
well as locally.

## Contributing

- Run `npm run lint` and `npm run format:check` before opening a PR — CI will
  fail the build otherwise (see `.github/workflows/`).
- Do not commit `.env`, `node_modules/`, or `dist/` — these are gitignored;
  double-check `git status` before committing if your editor doesn't respect
  `.gitignore`.
