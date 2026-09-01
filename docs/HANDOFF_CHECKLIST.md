# AI and Developer Handoff Checklist

Use this checklist whenever work resumes, pauses, changes assistants, or reaches a Git checkpoint.

## Starting a session

1. Read:
   - `AGENTS.md`
   - `docs/PROJECT_MEMORY.md`
   - `docs/LEARNING_LOG.md`
   - `docs/DECISIONS.md`
2. From the repository root, run:

```cmd
git status --short --untracked-files=all
git log --oneline --decorate -10
git branch --show-current
```

3. If GitHub access is available, compare the local branch with the remote.
4. Do not run `git pull` when local changes exist until the divergence is understood.
5. Inspect the source files involved in the next task.
6. State:
   - verified completed work
   - uncommitted work
   - failing or missing verification
   - exact next safe action

## During development

For each focused change:

1. Explain the concept and intended result.
2. Inspect existing code before editing.
3. Make the smallest coherent change.
4. Format changed PHP files:

```cmd
herd php vendor/bin/pint path/to/file.php
```

5. Syntax-check changed PHP files:

```cmd
herd php -l path/to/file.php
```

6. Run the narrow relevant test.
7. Diagnose failures from the first meaningful error.
8. Run the complete backend suite after focused tests pass:

```cmd
herd php artisan test
```

9. For frontend changes:

```cmd
npm run lint
npm run build
```

10. Inspect:

```cmd
git diff --check
git status --short --untracked-files=all
```

## Security check before staging

Confirm that none of these are included:

- `backend/.env`
- real passwords or email credentials
- database connection secrets
- session cookies or CSRF tokens
- API tokens
- `vendor/`
- `node_modules/`
- generated frontend `dist/` unless deployment explicitly requires it
- unrelated archives or temporary files

Only safe placeholders belong in `backend/.env.example`.

## Staging and committing

1. Stage exact intended files rather than broad unknown directories.
2. Run:

```cmd
git status --short
git diff --cached --check
git diff --cached --stat
```

3. Review the staged set.
4. Commit with a concise outcome-based message.
5. Run:

```cmd
git fetch origin
git status -sb
git log --oneline --decorate -5
```

6. Resolve divergence safely before pushing.
7. Push only a verified commit.

## Pausing before a commit

If work remains uncommitted, record in `docs/PROJECT_MEMORY.md`:

- every modified and untracked path
- successful checks and their results
- failing command and first meaningful error
- whether the working tree is safe
- the exact next command
- a warning not to pull if appropriate

Do not create a remote documentation commit on `main` that forces a dirty local branch to reconcile unnecessarily. Prefer a documentation branch or wait for the local checkpoint.

## Completing a checkpoint

Update:

### `docs/PROJECT_MEMORY.md`

- last verified commit
- current phase
- completed features
- test/build evidence
- current working-tree state
- exact next task

### `docs/LEARNING_LOG.md`

- concepts the user successfully explained
- corrected misconceptions
- concepts needing reinforcement

### `docs/DECISIONS.md`

- new architectural choices
- changed decisions and reasons
- known tradeoffs

Then inspect, commit, and publish the documentation.

## Changing AI assistants

Give the new assistant this instruction:

```text
Continue my developer-portfolio project.

Read AGENTS.md and every document it lists. Then inspect the current Git branch,
Git status, recent commits, relevant source files, routes, configuration, and tests.
Do not modify, pull, commit, push, migrate, or delete anything yet.

Explain the verified project state, anything that exists only as uncommitted local
work, the last verification evidence, and the exact safest next action. Follow the
Feynman teaching method and documentation rules in AGENTS.md.
```

The new assistant must not assume that GitHub contains local uncommitted work.

## Current Windows paths

```text
Repository: C:\Users\Niko\developer-portfolio
Backend:    C:\Users\Niko\developer-portfolio\backend
Frontend:   C:\Users\Niko\developer-portfolio\frontend
```

## Emergency rule

When documentation, GitHub, and the working tree disagree:

1. stop mutations
2. preserve every file
3. inspect Git status, diffs, branches, and commits
4. identify which state contains the newest work
5. explain the evidence
6. choose a recoverable reconciliation method

Never use destructive commands to make the mismatch disappear.
