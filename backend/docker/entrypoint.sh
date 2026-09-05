#!/bin/sh
set -e

# Link storage/app/public so uploaded project images are web-reachable at
# /storage/... . Safe to run on every boot: it's skipped if already linked.
if [ ! -e public/storage ]; then
  php artisan storage:link
fi

# Apply any pending migrations. Safe on every boot -- a migration that has
# already run is skipped.
php artisan migrate --force

# Keep the admin user in sync with the ADMIN_* env vars. Safe on every
# boot: it updates the one admin record by email instead of duplicating
# it. Skipped entirely if ADMIN_EMAIL isn't set yet, so a missing/blank
# admin env var never crashes the container.
if [ -n "$ADMIN_EMAIL" ]; then
  php artisan db:seed --class=AdminUserSeeder --force
fi

exec php artisan serve --host 0.0.0.0 --port "${PORT:-8000}"
