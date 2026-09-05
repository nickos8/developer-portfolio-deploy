# Developer Portfolio

A full-stack developer portfolio: a public site (hero, about, skills,
projects, contact, resume link) backed by a small authenticated admin
dashboard with two tabs -- **Projects** (create, edit, delete, upload a
cover image) and **Profile** (edit your name, tagline, about text,
skills, and contact/social links). Every edit is live on the public site
immediately, no redeploy needed.

This repository is a finished, deployable duplicate of
[`nickos8/developer-portfolio`](https://github.com/nickos8/developer-portfolio),
which remains a guided learning project. Everything here is complete and
wired together; **deploying it is the only step left** -- see
[`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router |
| HTTP client | Axios |
| Backend | Laravel 13 |
| Authentication | Laravel Sanctum (first-party SPA session auth) |
| Database | PostgreSQL (Supabase) |
| Tests | PHPUnit (Laravel), isolated SQLite in-memory database |
| Deployment | One Docker image, served combined-origin (see below) |

## How it fits together

In production, Laravel serves both the JSON API and the built React app
from the **same origin** -- the React app is built into
`backend/public/app`, and `backend/routes/web.php` hands any non-API GET
request the built `index.html` so React Router can render the right page,
including on a hard refresh. This avoids any cross-origin cookie/CORS
complexity for the admin session. See `Dockerfile` and `DEPLOYMENT.md`.

Locally, the two run separately for a fast dev loop: Vite's dev server on
`:5173` and Laravel on `:8000`, talking over CORS (already configured).

## Project structure

```text
developer-portfolio-deploy/
├── Dockerfile              production image (frontend build + backend)
├── render.yaml              Render Blueprint
├── DEPLOYMENT.md            deployment walkthrough
├── backend/                 Laravel API
│   ├── app/Http/Controllers/ProjectController.php     projects CRUD + image upload
│   ├── app/Http/Controllers/SiteProfileController.php name/about/skills/contact
│   ├── app/Http/Controllers/AuthController.php        session login/logout
│   ├── routes/api.php       JSON API routes
│   ├── routes/web.php       login/logout + SPA fallback route
│   ├── docker/entrypoint.sh production boot steps (migrate, seed admin, serve)
│   └── tests/               PHPUnit feature tests
└── frontend/                 React SPA
    ├── src/data/site.js       first-run fallback content (see below)
    ├── src/pages/             HomePage (public) + AdminLoginPage/AdminDashboardPage
    ├── src/components/        Navbar, Footer, ProjectCard, ProjectForm,
    │                          AdminProjectsPanel, SiteProfileForm, ...
    └── src/context/           session/auth state, live site-profile state
```

## Personalizing the site

Your name, tagline, about text, skills, location, contact email, resume
link, and social links are all editable from **Admin → Profile**
(`/admin`, Profile tab) -- edits are saved to the database and appear on
the public site immediately, no redeploy needed.

[`frontend/src/data/site.js`](./frontend/src/data/site.js) is only the
*first-run fallback*: sensible placeholder content a brand-new deploy
shows before you've edited anything from the dashboard (and what a
visitor sees for a split second while the live profile loads). You can
edit it too if you want to change the placeholder defaults themselves,
but day-to-day personalization happens in the admin dashboard, not in
code. Replace [`frontend/public/resume.pdf`](./frontend/public/resume.pdf)
with your own resume either way -- that one's still a real file, not a
database field.

## Local development

You'll need PHP 8.3+, Composer, Node 20+, and a PostgreSQL database (a
free [Supabase](https://supabase.com) project works well).

```bash
# Backend
cd backend
cp .env.example .env
# fill in DB_*, ADMIN_*, and FRONTEND_URL=http://localhost:5173 in .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link
php artisan serve

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin/login` for the admin dashboard.

## Testing and checks

```bash
# Backend
cd backend
vendor/bin/pint --test   # code style
php artisan test         # feature tests, SQLite in-memory

# Frontend
cd frontend
npm run lint
npm run build
```

Both run automatically on every push via
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Admin dashboard

Sign in at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you
configured. `/admin` has two tabs:

- **Projects** -- create a project, edit its fields, upload or replace
  its cover image, toggle it published/featured, and delete it. Only
  published projects appear on the public site.
- **Profile** -- edit your name, role, tagline, location, contact email,
  resume link, about paragraphs, skills, and social links. This is the
  same content shown in the Hero, About, Skills, and Contact sections.

## Deploying

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full Render walkthrough.
