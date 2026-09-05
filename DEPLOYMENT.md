# Deploying to Render

This app ships as a single Docker image: Laravel serves both the JSON API
and the built React app from one origin (see `Dockerfile` and
`backend/routes/web.php`). That means one Render web service, one URL, and
no separate CORS setup to worry about.

You already have a Supabase PostgreSQL database from local development
(see `docs/DECISIONS.md`) -- production reuses the same database unless you
create a separate one for it.

## 1. Generate an application key

Laravel needs a unique `APP_KEY`. Generate one locally (this only prints a
value, it doesn't change any file):

```bash
cd backend
php artisan key:generate --show
```

Copy the `base64:...` output -- you'll paste it into Render in step 4.

## 2. Push this repository to GitHub

Render deploys from a Git repository. If you haven't already, push this
repo to GitHub (it's already a git repository with full history).

## 3. Create the Blueprint on Render

1. Go to the [Render dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
2. Connect this GitHub repository. Render will read `render.yaml` at the
   repo root and propose one web service (`developer-portfolio`), built
   from the root `Dockerfile`.
3. If Render's blueprint editor rejects the `runtime: docker` key, change
   it to `env: docker` in `render.yaml` -- both names have been used across
   Render's blueprint versions.

## 4. Fill in the environment variables

`render.yaml` marks the values only you can provide as `sync: false`, so
Render will prompt for them when you create the service. Fill in:

| Variable | Value |
|---|---|
| `APP_KEY` | The `base64:...` value from step 1 |
| `DB_HOST` | Your Supabase Session pooler host |
| `DB_USERNAME` | Your Supabase Session pooler username |
| `DB_PASSWORD` | Your Supabase database password |
| `ADMIN_NAME` | Your name, for the seeded admin account |
| `ADMIN_EMAIL` | The email you'll log in to `/admin` with |
| `ADMIN_PASSWORD` | A strong password (8+ characters) |

Leave `APP_URL`, `FRONTEND_URL`, and `SANCTUM_STATEFUL_DOMAINS` blank for
now -- you don't know the assigned URL until after the first deploy.

## 5. First deploy, then fix the URLs

Click **Apply** to create and deploy the service. Once it's live, Render
shows you its URL, e.g. `https://developer-portfolio-xyz1.onrender.com`.

Go to the service's **Environment** tab and set:

- `APP_URL` = that full URL (e.g. `https://developer-portfolio-xyz1.onrender.com`)
- `FRONTEND_URL` = the same value as `APP_URL`
- `SANCTUM_STATEFUL_DOMAINS` = just the host, no scheme (e.g. `developer-portfolio-xyz1.onrender.com`)

Saving triggers a redeploy. After it finishes, admin login and the
session-cookie flow will work correctly (Sanctum only trusts stateful,
cookie-based requests from hosts listed there).

## 6. Verify

- Visit the service URL -- you should see the portfolio home page.
- Visit `/admin/login` and sign in with the `ADMIN_*` credentials you set.
- Create a project from the dashboard and confirm it shows up on the home
  page's Projects section.
- `GET /up` is the health check Render polls; it should return `200`.

## What happens automatically on every deploy

The container's entrypoint (`backend/docker/entrypoint.sh`) runs on every
boot:

1. Links `public/storage` to `storage/app/public` (skipped if already linked).
2. Runs `php artisan migrate --force` (skips migrations already applied).
3. Seeds/updates the one admin user from the `ADMIN_*` env vars (skipped
   entirely if `ADMIN_EMAIL` isn't set, so it never crashes the boot).
4. Starts `php artisan serve` bound to the port Render assigns.

You never need to SSH in or run a manual command for a normal deploy.

## Known limitation: uploaded images are not persistent

Render's free web services use an ephemeral filesystem -- any project
image you upload through the admin dashboard is stored on local disk
(`storage/app/public`) and is **lost on the next deploy or restart**.

For a personal portfolio with a handful of projects this is usually fine
to live with initially. When you want it fixed, either:

- Add a [Render persistent disk](https://render.com/docs/disks) mounted at
  `backend/storage/app/public` (requires a paid plan), or
- Swap the `public` filesystem disk for S3-compatible object storage (AWS
  S3, Cloudflare R2, or Supabase Storage) -- Laravel's filesystem
  abstraction (`config/filesystems.php`) already has an `s3` disk ready to
  configure; you'd point `ProjectController::uploadImage()` at it instead
  of `'public'`.

## Personalizing the site

Everything a visitor sees on the public pages -- your name, bio, skills,
contact details, resume link, and social links -- lives in one file:
`frontend/src/data/site.js`. Edit it, replace `frontend/public/resume.pdf`
with your actual resume, commit, and push; Render redeploys automatically.
