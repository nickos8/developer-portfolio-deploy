# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------
# Stage 1: build the React frontend
# -----------------------------------------------------------------------
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend
COPY backend/public ./backend/public
# Vite is configured (frontend/vite.config.js) to build straight into
# backend/public/app so Laravel can serve the compiled SPA.
RUN cd frontend && npm run build

# -----------------------------------------------------------------------
# Stage 2: the Laravel backend, serving both the API and the built SPA
# -----------------------------------------------------------------------
FROM php:8.3-cli-bookworm AS backend

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

COPY backend ./
COPY --from=frontend-build /app/backend/public/app ./public/app

# --no-scripts above skipped Laravel's post-install package discovery
# (it needs the full app present, which we've only just copied in), so
# run it explicitly now that it's available.
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi \
    && chmod +x docker/entrypoint.sh \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs \
    && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]
