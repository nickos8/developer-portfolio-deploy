# Developer Portfolio Project Memory

> Permanent project handoff, learning record, and development plan.
>
> Future assistant instruction: Read this file before suggesting the next task. After every verified development checkpoint, update the status, decisions, learning record, and next action. Never place passwords, tokens, connection URLs, `.env` values, or other secrets here.

**Last updated:** 2026-08-19  
**Repository:** `nickos8/developer-portfolio`  
**Current phase:** Projects CRUD, first public GET endpoint published  
**Next exact task:** Learn Laravel Form Request validation and design project creation without exposing an unprotected public write route.

## 1. Project purpose

Build a professional full-stack developer portfolio that demonstrates the owner's skills as an entry-level BSIT graduate, particularly:

- PHP and Laravel backend development
- React and JavaScript frontend development
- PostgreSQL relational database work
- REST API design
- CRUD operations and validation
- Git and GitHub workflow
- Manual testing and clear technical documentation

The finished application should let visitors view published portfolio projects. A later management interface should allow project records to be created, updated, reordered, published, featured, and deleted.

## 2. Technology and structure

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React with Vite | User interface and API consumption |
| Backend | Laravel 13 | Validation, business logic, API responses, and database access |
| Database | Supabase PostgreSQL 17 | Persistent project data |
| Version control | Git and GitHub | History, backup, and collaboration |

Repository layout:

```text
developer-portfolio/
├── backend/
├── frontend/
└── docs/
    └── PROJECT_MEMORY.md
```

Planned request flow:

```text
React interface
→ Laravel API route
→ ProjectController
→ validation
→ Project model
→ Supabase PostgreSQL
→ JSON response
→ React state and re-render
```

## 3. Verified completed work

### Checkpoint 1: Project initialization

Commit: `394e356` — **Initialize Laravel 13 and React portfolio project**

- Created the Laravel 13 application in `backend/`
- Created the React and Vite application in `frontend/`
- Initialized the local Git repository
- Confirmed the initial working tree was clean

### Checkpoint 2: Supabase PostgreSQL configuration

Commit: `15d0a8e` — **Configure Supabase PostgreSQL connection**

- Connected Laravel to a Supabase PostgreSQL project through the Session pooler
- Configured SSL mode as `require`
- Added configurable PostgreSQL schema support in `backend/config/database.php`
- Used a dedicated `laravel` schema
- Added safe database placeholders to `backend/.env.example`
- Kept the real `backend/.env` excluded from Git
- Ran Laravel's default migrations successfully
- Verified nine default Laravel tables inside the `laravel` schema

Verified default tables:

- `cache`
- `cache_locks`
- `failed_jobs`
- `job_batches`
- `jobs`
- `migrations`
- `password_reset_tokens`
- `sessions`
- `users`

### Checkpoint 3: Projects database layer

Commit: `2607a9f` — **Add Project model and database migration**

- Created `backend/app/Models/Project.php`
- Created and ran the `projects` table migration
- Configured mass-assignable fields
- Configured model type casts
- Verified the table in the `laravel` schema
- Verified 14 columns and the unique slug index

### Checkpoint 4: Public Projects API

Commit: `27318f1` — **Add public Projects API endpoint**

- Enabled Laravel API routing through `bootstrap/app.php`
- Added `routes/api.php`
- Installed Laravel Sanctum v4.3.3 for future authentication
- Added `GET /api/projects`
- Implemented `ProjectController@index`
- Filters records to `is_published = true`
- Orders records by `display_order`
- Verified the endpoint manually with a valid empty JSON collection
- Verified the existing automated test suite: 2 tests passed
- Published the checkpoint to GitHub

## 4. Projects table design

| Column | Type | Purpose |
|---|---|---|
| `id` | bigint | Primary identifier |
| `title` | varchar | Project name |
| `slug` | unique varchar | URL-friendly unique identifier |
| `short_description` | varchar(300) | Project-card summary |
| `description` | text | Full project explanation |
| `tech_stack` | JSON | List of technologies |
| `github_url` | nullable varchar | Repository link |
| `live_url` | nullable varchar | Deployed application link |
| `image_path` | nullable varchar | Project image location |
| `is_featured` | boolean, default false | Controls featured placement |
| `is_published` | boolean, default false | Controls public visibility |
| `display_order` | integer, default 0 | Controls ordering |
| `created_at` | nullable timestamp | Creation time |
| `updated_at` | nullable timestamp | Last update time |

Indexes:

- Primary index on `id`
- Unique index on `slug`

Model casts:

- `tech_stack` → PHP array
- `is_featured` → PHP boolean
- `is_published` → PHP boolean
- `display_order` → PHP integer

## 5. Current development status

| Area | Status |
|---|---|
| React and Vite setup | Complete |
| Laravel setup | Complete |
| Supabase connection | Complete |
| Default Laravel migrations | Complete |
| Project model | Complete |
| Projects migration | Complete |
| Projects table verification | Complete |
| ProjectController | Public `index()` complete; write actions remain |
| Request validation | Next |
| Projects API routes | Public `GET /api/projects` complete |
| API endpoint testing | Public GET manually verified |
| React API integration | Not started |
| Public projects interface | Not started |
| Project management interface | Planned |
| Deployment | Planned |

## 6. Latest verified checkpoint

The public Projects read endpoint is committed and published.

```text
GET /api/projects
→ routes/api.php
→ ProjectController@index
→ Project model
→ Supabase PostgreSQL
→ JSON collection
```

Verification completed:

- Only `GET /api/projects` is registered in the API route file
- Laravel Pint completed successfully
- `herd php artisan migrate:status` showed no pending migrations
- `curl http://127.0.0.1:8000/api/projects` returned `[]`
- `[]` means the query succeeded but found no published projects
- Existing automated suite passed: 2 tests, 2 assertions
- Commit `27318f1` is published on `origin/main`
- Local `main` was confirmed clean and synchronized immediately after the push

Environment rule:

- Use `herd php` and `herd composer` for this Laravel 13 project
- Plain PHP and Composer still point to incompatible XAMPP PHP 8.2.12

Next learning sequence:

1. Understand why write endpoints require validation and authorization.
2. Create a dedicated Form Request for project creation.
3. Define rules for every project field.
4. Implement `ProjectController@store`.
5. Decide and configure authentication before exposing the POST route.
6. Add endpoint-specific automated tests.

## 7. Development roadmap

### Phase 1: Projects backend CRUD

1. Create `ProjectController`.
2. Learn and define validation rules.
3. Implement `index` for published project lists.
4. Implement `store` for project creation.
5. Implement `show` for one project.
6. Implement `update` for editing.
7. Implement `destroy` for deletion.
8. Add API routes.
9. Test success responses and validation errors.
10. Commit the verified backend checkpoint.

### Phase 2: React project display

1. Create an API service or fetch layer.
2. Fetch project data with `useEffect`.
3. Store results in React state.
4. Build reusable project-card components.
5. Add loading, empty, and error states.
6. Display featured and published projects.
7. Test the Laravel-to-React data flow.

### Phase 3: Portfolio interface

Planned sections:

- Hero and introduction
- About
- Skills and technology stack
- Featured projects
- All projects
- Contact information
- Resume or CV link

### Phase 4: Project management

- Project form
- Create and edit operations
- Publish and feature controls
- Display ordering
- Image handling
- Authentication and route protection before exposing write operations publicly

### Phase 5: Quality and deployment

- Backend feature tests
- Frontend behavior testing
- Accessibility review
- Responsive layout testing
- Production environment setup
- Deployment
- Final professional README

## 8. Technical decisions

1. **Separate frontend and backend folders:** Makes the React client and Laravel API responsibilities clear.
2. **Supabase PostgreSQL:** Provides a hosted database while Laravel remains responsible for application logic.
3. **Dedicated `laravel` schema:** Keeps application tables separate from Supabase-managed `auth`, `storage`, and `realtime` schemas.
4. **Session pooler connection:** Provides an IPv4-compatible external database connection.
5. **Separate database environment variables:** Avoids URL-encoding problems and prevents the full connection URL from appearing in normal configuration output.
6. **JSON technology stack:** Allows each project to contain a flexible list of technologies.
7. **Unique slug:** Supports stable human-readable project URLs.
8. **Published and featured flags:** Separates public visibility from prominent placement.
9. **Display order:** Allows intentional project ordering without relying only on creation date.
10. **Private repository during development:** Protects unfinished work. Visibility can change when the portfolio is ready.

## 9. Learning record

### Confirmed concepts

- **Migration:** A version-controlled blueprint that creates or changes database structure.
- **Model:** Laravel's interface for working with records in a database table.
- **`$fillable`:** The approved list of fields Laravel may mass-assign.
- **`casts()`:** Converts stored values into useful PHP types.
- **Validation:** Checks whether submitted data follows defined correctness rules.
- **Controller:** Receives a request and coordinates validation, model operations, and responses.
- **Route:** Connects an HTTP request to a controller action.
- **JSON response:** Structured data sent from Laravel to React.
- **Local Git repository:** Version history stored on the computer.
- **GitHub remote:** Online repository connected to the local Git history.

High-yield distinction:

```text
$fillable = permission
casts() = type conversion
validation = correctness checking
```

### Concepts to reinforce later

- Validation rules and Form Requests
- HTTP verbs and REST conventions
- Controller CRUD actions
- HTTP status codes
- React loading and error states
- Authentication and authorization
- Automated backend testing

## 10. Problems solved

### Supabase password authentication failure

Cause:

- The database password did not match the Supabase database role password.
- An active `DB_URL` could override separate environment variables.

Resolution:

- Reset the database password.
- Removed the active `DB_URL`.
- Used separate host, port, database, username, password, schema, and SSL variables.
- Cleared Laravel configuration and verified the connection.

Security action:

- Previously exposed credentials were rotated.
- Real secrets remain only in the ignored local `.env`.

### Composer used incompatible XAMPP PHP

Cause:

- Plain `composer` used XAMPP PHP 8.2.12.
- Laravel 13 dependencies require PHP 8.3 or newer.
- `install:api` therefore could not install Sanctum through the plain Composer executable.

Resolution:

- Verified Herd PHP and Composer use PHP 8.4.24.
- Installed Sanctum v4.3.3 with `herd composer require laravel/sanctum`.
- Established the rule to use Herd-prefixed PHP and Composer commands for this project.

### Windows CMD parsing error with Tinker

Cause:

- Windows CMD interpreted parentheses and quoting before Artisan received the command.

Resolution:

- Used `herd php artisan db:show --database=pgsql` for the connection test.

## 11. Safe continuation checklist

At the beginning of a future session:

1. Read this entire document.
2. Run `git status`.
3. Run `git pull` if the working tree is clean.
4. Confirm the current branch.
5. Review the current and next tasks above.
6. Work on one concept and one verified checkpoint at a time.
7. Update this file after verification.
8. Commit and push code plus documentation.
9. Never commit or display `.env` or credentials.

Useful local commands:

```cmd
git status
git log --oneline --decorate -5
git pull
```

Backend commands should be run from `backend/`:

```cmd
herd php artisan migrate:status
herd php artisan db:table projects
```

## 12. Documentation update policy

Update this file whenever any of the following occurs:

- A feature begins or finishes
- A migration or model changes
- An API endpoint is verified
- A significant error is solved
- A technical decision changes
- A learning concept is confirmed or remains weak
- The exact next task changes

A task is marked **complete** only after its result is verified. Keep entries concise, factual, and free of secrets.
